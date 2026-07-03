+++
title = "Using git bisect to find a bug"
date = "2024-10-16"
author = "Robert"
cover = ""
description = "Oops, you broke something but don't know when? Use git bisect!"
draft = false
+++

# Bisecting the `git bisect` command

Imagine implementing a feature, while not running any unit tests for a couple of commits. And oops, there's a failing test. Or worse, a user discovers a breaking change but you don't know which commit introduced it. 

With `git bisect` you can do a quick binary search through your git history to find the commit that introduced the bug. Pretty cool! I find the interface a bit confusing, so here it is. It's basically a bunch of commands:

```bash
git bisect start
git bisect bad <commit_hash>
git bisect good <commit_hash>
git run <command>
git bisect reset
```

instead of git hashes or tags you can also specify the number of commits from the current state. So if you know that 20 commits ago everything worked, you can do `git bisect good HEAD~20` and `git bisect bad HEAD` to start the search. With `git run <command>`, you can specify any command that should return with a non-zero exit code if the current commit is bad. This can be a pytest, e.g.

```bash
git bisect run pytest tests/test_foo.py::test_bar
```

or any script that you want to run:

```bash
git bisect run ./run_tests.sh
```

or even 

```bash
git bisect run python foo.py
```

alternatively, you can also manually inspect/run each commit during the bisection and mark if their good or bad using `git bisect good` and `git bisect bad`. 

If you run `git bisect run` it might output a lot of noise that you don't care about. e.g. with ptyest you'll end up with:

```bash
git bisect run pytest tests/test_foo.py::test_bar
running pytest tests/test_foo.py::test_bar
============================= test session starts ==============================
platform linux -- Python 3.12.10, pytest-8.3.3
rootdir: /home/user/project
collected 1 item

tests/test_foo.py F                                                     [100%]

================================== FAILURES ===================================
__________________________________ test_bar __________________________________

    def test_bar():
>       assert foo.bar() == 42
E       AssertionError: assert 41 == 42
E        +  where 41 = <function bar at 0x7f9b1c3e6f70>()
E        +    where <function bar at 0x7f9b1c3e6f70> = foo.bar

tests/test_foo.py:8: AssertionError
=========================== short test summary info ===========================
FAILED tests/test_foo.py::test_bar - AssertionError: assert 41 == 42
============================== 1 failed in 0.03s ==============================
Bisecting: 4 revisions left to test after this (roughly 2 steps)
[41dd4aa10cf685f0671659283980eefb3d9c5468] Update foo.py
running pytest tests/test_foo.py::test_bar
============================= test session starts ==============================
platform linux -- Python 3.12.10, pytest-8.3.3
rootdir: /home/user/project
collected 1 item

tests/test_foo.py F                                                     [100%]

================================== FAILURES ===================================
__________________________________ test_bar __________________________________

    def test_bar():
>       assert foo.bar() == 42
E       AssertionError: assert 41 == 42
E        +  where 41 = <function bar at 0x7f9b1c3e6f70>()
E        +    where <function bar at 0x7f9b1c3e6f70> = foo.bar

tests/test_foo.py:8: AssertionError
=========================== short test summary info ===========================
FAILED tests/test_foo.py::test_bar - AssertionError: assert 41 == 42
============================== 1 failed in 0.03s ==============================
Bisecting: 2 revisions left to test after this (roughly 1 step)
[c6ece2440925057a362da7ad41cb689c09e6503b] Refactor foo.py
running pytest tests/test_foo.py::test_bar
============================= test session starts ==============================
platform linux -- Python 3.12.10, pytest-8.3.3
rootdir: /home/user/project
collected 1 item

tests/test_foo.py .                                                     [100%]

============================== 1 passed in 0.01s ==============================
Bisecting: 0 revisions left to test after this (roughly 1 step)
[5f5248584dc4c435a89c708998b2b17115aa36e5] Minor changes to foo.py
running pytest tests/test_foo.py::test_bar
============================= test session starts ==============================
platform linux -- Python 3.12.10, pytest-8.3.3
rootdir: /home/user/project
collected 1 item

tests/test_foo.py F                                                     [100%]

================================== FAILURES ===================================
__________________________________ test_bar __________________________________

    def test_bar():
>       assert foo.bar() == 42
E       AssertionError: assert 41 == 42
E        +  where 41 = <function bar at 0x7f9b1c3e6f70>()
E        +    where <function bar at 0x7f9b1c3e6f70> = foo.bar

tests/test_foo.py:8: AssertionError
=========================== short test summary info ===========================
FAILED tests/test_foo.py::test_bar - AssertionError: assert 41 == 42
============================== 1 failed in 0.03s ==============================
5f5248584dc4c435a89c708998b2b17115aa36e5 is the first bad commit
commit 5f5248584dc4c435a89c708998b2b17115aa36e5
Author: John Doe <john.doe@example.com>
Date:   Mon Jul 10 19:21:31 2023 +0200

    Minor changes to foo.py

 foo.py | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
bisect run success
```

To suppress all this noise you can redirect the output to /dev/null and grep from the log:

```bash
git bisect run pytest tests/test_foo.py::test_bar > /dev/null 2>&1
git bisect log | grep "first bad commit"
```







