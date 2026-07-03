import pytest


def fibonacci_recursive(n):
    if n <= 1:
        return n
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)


def fibonacci_iterative(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b


def test_fibonacci_recursive(benchmark):
    """Benchmark the fibonacci function."""
    result = benchmark(fibonacci_recursive, 30)
    assert result == 832040


def test_fibonacci_iterative(benchmark):
    """Benchmark the fibonacci function."""
    result = benchmark(fibonacci_iterative, 30)
    assert result == 832040
