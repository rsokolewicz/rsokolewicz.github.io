+++
title = "Mocking context managers with pytest"
date = "2023-06-01"
author= "Robert"
description = "Mocking functions and methods for unit testing is not so hard, but mocking context managers can be tricky, as sometimes you will need to mock the `__enter__()` method as well..."
mathjax = false
draft = false
+++


In software testing, it is often necessary to mock external dependencies, such as API calls, to isolate the code under test and simulate specific behaviors. `pytest`, a popular testing framework in Python, provides powerful mocking capabilities through its `pytest-mock` plugin. Mocking functions and methods is not so hard, but mocking context managers can be tricky, as sometimes you will need to mock the `__enter__()` as well. 

# Example 1
Suppose we have

```python
def fetch_data():
    response = requests.get("https://api.example.com/data")
    return response.json()
```

which issues an HTTP GET request to https://api.example.com/data and returns whatever the response is in a json format.

A unit test for this function could look like

```python
def test_fetch_data():
    with mock.patch("requests.get") as mock_get:
        # Set up the desired behavior for the mocked function
        mock_get.return_value.json.return_value = {"message": "Mocked data"}

        # Call the function under test
        result = fetch_data()

        # Assert the expected behavior
        assert result == {"message": "Mocked data"}
        mock_get.assert_called_once_with("https://api.example.com/data")
        mock_get.return_value.json.assert_called_once()
```

where we mock the `requests.get` function directly. In the `fetch_data` function we are returning `response.json()` that we would also like to mock with some dummy return data. By chaining `mock_get.return_value` together with `json.return_value` we can assign the return value of `response.json()`.

One benefit of mockers is that is easy to assert how a method was called, and even how often it was called. In this case, we used

```python
# Assert the expected behavior
assert result == {"message": "Mocked data"}
mock_get.assert_called_once_with("https://api.example.com/data")
mock_get.return_value.json.assert_called_once()
```

Things become a little tricky in the next example

# Example 2
`requests.get()` returns a `Request` object that is a context manager. So often in code we will see the following example instead.

```python
def fetch_data():
    with requests.get("https://api.example.com/data") as response:
        return response.json()
```

and running the above test on this function instead, will give us a nice warning:

```python
            # Assert the expected behavior
>           assert result == {"message": "Mocked data"}
E           AssertionError: assert <MagicMock name='get().__enter__().json()' id='140616315269184'> == {'message': 'Mocked data'}
E             Full diff:
E             - {'message': 'Mocked data'}
E             + <MagicMock name='get().__enter__().json()' id='140616315269184'>
```

The error already gives us a hint that we need to mock `__enter__` as well. Whereas before `response` was the actual `Response` object, now it corresponds to whatever `Response.__enter__` returns. 

and so, the modified test will look like

```python
def test_fetch_data():
    with mock.patch("requests.get") as mock_get:
        mock_response = mock.Mock()
        mock_response.json.return_value = {"message": "Mocked data"}

        mock_get.return_value.__enter__.return_value = mock_response

        # Call the function under test
        result = fetch_data()

        # Assert the expected behavior
        assert result == {"message": "Mocked data"}
        mock_get.assert_called_once_with("https://api.example.com/data")
        mock_response.json.assert_called_once()
```

with two small modifications:

- We also create a mock response object `mock_response` using `mock.Mock()` to simulate the behavior of the response.
- We then set up the desired behavior of the context manager by assigning mock_response to `mock_get.return_value.__enter__.return_value`. This ensures that when the context manager is entered, our `mock_response` object is used.