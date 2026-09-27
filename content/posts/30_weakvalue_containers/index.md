+++
title = "WeakSet vs WeakValueDictionary: when equality gets in the way"
date = "2026-08-26"
author = "Robert"
cover = ""
description = "A WeakSet is a great way to track live objects without leaking them, until it isn't: a real bug from our compiler at Qblox, where a WeakSet's equality-based membership check silently confused two distinct variables, and why WeakValueDictionary keyed on id() was the actual fix."
draft = true
+++

At work I ran into a small but annoying bug class: code that tracks "the things
that have already been processed" in a plain `set()`, and then has to remember
to clear that set again once it's done. In our scheduler's compiler
([qblox-scheduler](https://gitlab.com/qblox/packages/software/qblox-scheduler)),
we track intermediate `Variable` objects while compiling a quantum program, so
we don't process the same one twice. Using a `weakref.WeakSet` for this looked
like the obvious upgrade over a plain `set`: once a `Variable` is no longer
referenced by the schedule being compiled, it should also disappear from our
tracking set, with no explicit cleanup required.

That worked, until it produced a genuinely confusing bug, which turned into
[this MR](https://gitlab.com/qblox/packages/software/qblox-scheduler/-/merge_requests/353).
The root cause wasn't about garbage collection at all — it was that `in` on a
`WeakSet` checks _equality_, not _identity_, and our `Variable` class defines
equality by value rather than by object identity.

# The core idea

A normal `set` holds a _strong_ reference to everything you put in it, which
means an object stays alive for as long as it's in the set — even if nothing
else in the program still needs it. A `WeakSet` instead holds _weak_ references:
it doesn't keep its members alive on its own. As soon as the last strong
reference to an object disappears, the object is garbage collected, and it
silently vanishes from the `WeakSet` too. No manual bookkeeping required.

`weakref.WeakValueDictionary` is the dictionary version of the same idea: the
keys are held normally, but the values are weak references. Once nothing outside
the dictionary is still holding onto a value, that entry disappears from the
dictionary as well.

The subtlety is that a `WeakSet` is still a `set` underneath: membership
(`x in weak_set`) and deduplication go through `__eq__` and `__hash__`, exactly
like a regular set. Weak references only change _when entries disappear_, not
_how they're compared_. That distinction is exactly what bit us.

# Example 1: two "equal" variables that were not the same variable

Our compiler builds nested schedules, and for "near-time" outer loops it takes a
`Variable` representing, say, a frequency, and `deepcopy`s it once per loop
iteration to produce a fresh scoped copy. We used a `WeakSet` on the compiler
class to remember which frequency variables had already been converted from an
absolute frequency to one relative to the local oscillator, so we wouldn't
convert the same one twice:

```python
_frequency_domains_converted_to_lf: WeakSet[Variable] = WeakSet()
...
if var in AnalogSequencerCompiler._frequency_domains_converted_to_lf:
    continue  # already converted, skip
...
AnalogSequencerCompiler._frequency_domains_converted_to_lf.add(var)
```

`Variable` defines `__eq__` and `__hash__` based on a UUID it's assigned at
creation, so that two references to _the same_ variable compare equal.
`deepcopy` copies that UUID along with everything else, so a deep copy of a
`Variable` is a distinct object that still compares equal to the original.
Stripped down to the essentials:

```python
import uuid, copy, weakref

class Variable:
    def __init__(self):
        self.id_ = uuid.uuid4()

    def __hash__(self):
        return hash(self.id_)

    def __eq__(self, other):
        return hash(self) == hash(other)

tracker = weakref.WeakSet()
var_segment_1 = Variable()
tracker.add(var_segment_1)

var_segment_2 = copy.deepcopy(var_segment_1)
assert var_segment_1 == var_segment_2
assert id(var_segment_1) != id(var_segment_2)
assert var_segment_2 not in tracker  # <-- fails!
```

`var_segment_2` is a brand new object from a different loop iteration, that has
never been added to `tracker` — yet `var_segment_2 in tracker` returns `True`,
because the `WeakSet` finds `var_segment_1` (its value-equal twin) already
sitting in the same hash bucket. In the real compiler, this meant the second
(and every subsequent) segment of a near-time frequency sweep got skipped by the
`continue`, because its deep-copied `Variable` looked, to the set, like one that
had already been converted. The frequencies for all segments past the first were
silently left unconverted.

The fix is to stop asking the container to compare variables by value, and
instead track them by object identity explicitly, using their `id()` as the
dictionary key in a `WeakValueDictionary`:

```python
tracker = weakref.WeakValueDictionary()
var_segment_1 = Variable()
tracker[id(var_segment_1)] = var_segment_1

var_segment_2 = copy.deepcopy(var_segment_1)
assert id(var_segment_2) not in tracker
```

Now membership is a plain integer comparison on `id()`, so two
value-equal-but-distinct `Variable` copies no longer collide, while we still get
the self-cleaning behaviour of the original `WeakSet`: once nothing references
`var_segment_1` any more, its entry disappears from `tracker` on its own. This
is safe even though `id()` values get reused after an object is garbage
collected — a `WeakValueDictionary` removes the entry for an object the moment
it dies, so there's never a stale `id()` left pointing at a value that no longer
exists.

The lesson: a `WeakSet` (or `WeakValueDictionary` keyed by the object itself) is
the right tool when "already seen" genuinely means "an object equal to one I've
seen." But the moment your objects define equality by _value_ rather than by
_identity_, and you actually need to track specific instances, key on `id()`
explicitly rather than relying on the container's default equality check.

# Example 2: a cache that doesn't outlive its users

The second place this pattern shines is object caching or pooling, where you
want to reuse an existing instance if one is still alive, but you don't want the
cache itself to be the reason it stays alive. A regular dict used as a cache
will happily keep every object alive forever, which is really a memory leak
dressed up as a cache. `WeakValueDictionary` fixes that:

```python
import weakref

class Connection:
    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return f"Connection({self.name})"

_pool = weakref.WeakValueDictionary()

def get_connection(name):
    conn = _pool.get(name)
    if conn is None:
        conn = Connection(name)
        _pool[name] = conn
        print(f"created {conn}")
    else:
        print(f"reused {conn}")
    return conn

c1 = get_connection("db1")
c2 = get_connection("db1")
print(c1 is c2)          # True, same underlying object
print(list(_pool.keys()))  # ['db1']

del c1
del c2
print(list(_pool.keys()))  # []
```

```
created Connection(db1)
reused Connection(db1)
True
['db1']
[]
```

As long as someone, somewhere, is holding a reference to `Connection("db1")`,
asking for `"db1"` again returns that same instance — so it behaves exactly like
a normal cache. But once every caller has dropped their reference, `_pool`
doesn't keep it alive out of stubbornness. It disappears from the pool on its
own, and the next call to `get_connection("db1")` creates a fresh instance
instead of quietly reusing what should have been garbage.

# When to reach for these

Both examples share the same shape: a container whose job is to _observe_ a set
of live objects, not to _own_ their lifetime. Whenever the question you're
asking is "what's currently alive/active/in-use", rather than "what do I need to
keep alive", a weak container is usually the right tool — it turns a manual
bookkeeping problem into something Python's garbage collector handles for you.

One caveat worth knowing: weak references only work on objects that support
them. Plain instances of user-defined classes do (as in both examples above),
but built-in types like `int`, `str`, `tuple`, and `list` don't, since they
don't have a `__weakref__` slot by default. If you need to weakly reference
something like an integer or string, you'll need to wrap it in a small object
first.
