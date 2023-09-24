+++
title = "Unit testing - Classical vs. London Approaches"
date = "2023-09-24"
author= "Robert"
description = "A small post about the need for unit for unit testing in software projects, and the differences between London-style and Classical-style unit-testing."
+++

Most, if not all, software projects suffer from the same problem. When starting the project it's very easy to include new features. One feature might take one day to implement, but as the code base grows, implementing something new will take a week, a month, or half a year until it's impossible to implement something without breaking something else. Different parts of the code depend on each other and this can create a cascading effect where a small change propagates throughout the entire codebase breaking a lot of stuff. 

Unit tests are safeguards that help the developer in writing code that does not break the existing code, making it easier to make progress when working on the codebase.

{{< figure src="images/1.svg" position="center" caption="Figure 1. The time that we spend on developing and expanding the code base grows exponentially with the amount of progress already made.">}}

In the early stages of a project, it is probably easier and faster to implement new features than it is to write unit tests for them. For smaller projects implementing unit tests might even hinder the progress of the project, but in the long run, it is worthwhile. 

## What is a unit test?
Let's assume that our codebase has a `Cat` class that represents a cat that can meow and always feels hungry until it gets some food to eat. Some unit tests for this class could be something like

```python
def test_is_hungry():
    cat = Cat("funnywhiskers")
    assert cat.is_hungry is True

def test_meow():
    cat = Cat("funnywhiskers")
    assert cat.meow() == "Meow!"

def test_eat():
    cat = Cat("funnywhiskers")
    assert cat.eat() == "Yum!"
    assert cat.is_hungry() is False
    assert cat.eat() == "I'm not hungry."
```

In this example, we see that even though we have one `Cat` class, the tests are split into smaller pieces, each testing a small aspect of that class. This is where the name "unit" comes from. Furthermore, each test is small, to the point, and fast. And lastly, each test is *isolated* from each other. What isolation means exactly, we will explain shortly. 

A unit test has the following properties:
1. it verifies a piece of code.
2. it is fast.
3. it is isolated.

The requirement that a unit test is isolated is something that many people have strong opinions about, so strong even, that we broadly have two schools of thought: The London (mockist) and the Detroit (classical) school. 

## The classic view of isolation
Let us examine the classical school first. Imagine that our cat codebase has grown quite a bit and now we also have an `Owner` class that is responsible for getting the food for the cat. Again, a simple test to test this functionality would be

```python
def test_classical_eat():
    cat = Cat("funnywhiskers")
    owner = Owner("Robert")
    food = owner.get_food("fish")

    assert cat.eat(food) == "Yum! Ate fish."
    assert cat.is_hungry is False
```

There is a small issue with this test, however. We are testing whether the `.eat` method and `.is_hungry` method are working as intended, but what if we introduce a change in the codebase corresponding to the `Owner.get_food` method in such a way that `cat.eat(food) != "Yum! Ate fish."`. The test will fail, but not because anything is wrong with our cat, but because we changed the behavior elsewhere. This is the classic example of touching one part of the code and it breaks something else. This cascading effect of a bug that propagates throughout the code base and fails a lot of tests, is not necessarily wrong. If many tests fail because we made a change to `.get_food` it means that the codebase heavily depends on it and we discovered that it's quite an essential piece of code. 

The downside, however, is that when a lot of tests fail it becomes difficult to isolate where the problem exactly is. As mentioned, in this case, we're testing the eating behavior of the cat, but the problem lies in the `.get_food` method of `Owner`. And according to the Londonists, this is due to isolation.

## The London view of isolation
When testing a piece of code that depends on other parts of the codebase, the Londonists say we should replace those dependencies with dummies (also called doubles or mocks). The above test then becomes

```python
def test_london_eat(pytest_mock):
    mock_owner = pytest_mock.Mock(spec=Owner)
    mock_owner.get_food.return_value = "fake fish"
    
    cat = Cat("funnywhiskers")
    food = mock_owner.get_food("fake fish")
    assert cat.eat(food) = "Yum! Ate fake fish."
    assert cat.is_hungry is False
```

where we used the mocking capability of pytest to create a fake version of `Owner`. The line `mock_owner.get_food.return_value` sets the return value of `get_food` regardless of how `get_food` is implemented in the code base. 

## A note on dependencies
In the classical style of testing, it is still important that unit tests do not depend on each other. Certain dependencies that are shared, should still be mocked even in the classical style. For example, updating a shared database might cause issues with other tests that operate on the same database. Imagine a hundred tests that all add the same cat named *funnywhiskers* to the database. This can cause many problems while testing, either because the database requires unique cat names or maybe because there is a test that adds and removes *Funnywhiskers* from the database and asserts that no there is no *Funnywhiskers* in the database anymore. 


## Comparisons

As mentioned above, isolation in the London school attempts to isolate dependencies and as such test small "units" of code. This has a few side effects though (some positive, some negative). These tests tend to be more focussed on the implementation of code, rather than the behavior of code. In the `get_food` example, if we refactor the code so that `get_food` returns an instance of a `Food` object, and `.eat` accepts this food instance the classical test will pass, whereas the London test will fail because `get_food` is mocked in a way to return a `str` object, rather than a `Food` object. Consequently, classical tests generally protect better against code refactors. 

One benefit of London-style testing is that if you have a large code base with a lot of tests, if you introduce a bug in an important piece of code it will only cause relevant tests to fail and allow you to quickly figure out where you introduced the bug. In the classical style of unit testing, you will see many more tests that fail because of the dependency issue. If you run all the unit tests frequently however, (e.g. with every commit or even more often) you should be able to quickly figure out what went wrong anyway because you haven't made many changes yet. So in practice, this shouldn't be too big of a problem for developers.


| Aspect                 | Classical (Detroit) School           | London (Mockist) School                            |
|------------------------|-------------------------------------|----------------------------------------------------|
| **Isolation**          | Units are not isolated from each other; only the tests are isolated. | Units under test are isolated from each other.     |
| **Unit Under Test**    | A unit of behavior.                  | A unit of code, usually a class.                    |
| **Dependencies**       | Only shared dependencies are replaced with test doubles. | All dependencies except immutable ones are replaced with test doubles. |
| **Granularity**        | May not provide as fine-grained control as the London School. | Provides better granularity.                       |
| **Ease of Testing**    | Less focused on ease of testing large graphs of interconnected classes. | Makes it easier to test large graphs of interconnected classes. |
| **Debugging**          | Doesn't make it particularly easy or hard to find which functionality contains a bug. | Easier to find which functionality contains a bug.  |
| **Issues**             | Does not hide issues with code design. | May hide issues with code design due to focus on units of code rather than units of behavior. |
| **Over-Specification** | Less likely to couple tests to the system under test’s (SUT’s) implementation details. | Higher risk of over-specification; tests could become coupled to the SUT’s implementation details. |
