+++
title = "profiling time and memory using pytest"
date = "2025-01-24"
author = "Robert"
cover = ""
description = "I was reading about a new benchmarking framework for quantum control software called [Benchpress](https://github.com/qiskit/benchpress). Looking through the code, it seems to be built upon the `benchmark` plugin for `pytest`. If you want to quickly benchmark your code, it's quite easy to do with `pytest-benchmark`..."
draft = false
+++

I was reading about a new benchmarking framework for quantum control software called [Benchpress](https://github.com/qiskit/benchpress). Looking through the code, it seems to be built upon the `benchmark` plugin for `pytest`. If you want to quickly benchmark your code, it's quite easy to do with `pytest-benchmark`.

## Running benchmark
If you know a bit about pytest, it's actually very easy to add some benchmarking to your tests by just using the `benchmark` fixture. Suppose we have these two functions:

```python
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
```


that we would like to test and benchmark. We can do this by just adding a `benchmark` fixture to our test function:

```python
import pytest

def test_fibonacci_recursive(benchmark):
    result = benchmark(fibonacci_recursive, 30)
    assert result == 832040

def test_fibonacci_iterative(benchmark):
    result = benchmark(fibonacci_iterative, 30)
    assert result == 832040
```

Then after installing the `pytest-benchmark` package, we can run our tests with the `pytest --benchmark-enable` flag.

```bash
pytest --benchmark-enable tests/
```

This will run the tests and print out the results in a nice table.


```

---------------------------------------------------------------------------------------------------------------- benchmark: 2 tests ---------------------------------------------------------------------------------------------------------------
Name (time in ns)                        Min                        Max                       Mean                    StdDev                     Median                       IQR            Outliers             OPS            Rounds  Iterations
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
test_fibonacci_iterative            387.8466 (1.0)           7,455.1521 (1.0)             435.0220 (1.0)             33.3827 (1.0)             435.9217 (1.0)              6.4655 (1.0)    4121;31660  2,298,734.2926 (1.0)      181819          13
test_fibonacci_recursive     60,989,416.0298 (>1000.0)  65,767,124.9937 (>1000.0)  63,742,859.3145 (>1000.0)  1,336,402.2177 (>1000.0)  63,621,042.0053 (>1000.0)  1,510,000.5257 (>1000.0)       5;0         15.6880 (0.00)         16           1
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Legend:
  Outliers: 1 Standard Deviation from Mean; 1.5 IQR (InterQuartile Range) from 1st Quartile and 3rd Quartile.
  OPS: Operations Per Second, computed as 1 / Mean
============================================================================================= 2 passed in 3.33s =============================================================================================

```

(the enable flag will keep it enabled forever, until you disable it with `--benchmark-disable`)

Surprisingly, the recursive version is about 15,000 times slower than the iterative version. This is because the recursive version has to call the function itself, which in python is more expensive than looping and adding two numbers (today I learned... lol). 

## Comparing results

With `pytest-benchmark`, you can compare results to previous runs by using the `--benchmark-save` and `--benchmark-compare` flags. 

```bash
# run and save results
pytest --benchmark-save=baseline tests/

# make changes, run and compare
pytest --benchmark-compare=baseline tests/
```

which is convenient if you want to compare the effects of some refactor work:

```
------------------------------------------------------------------------------------------------------------------------ benchmark: 4 tests ------------------------------------------------------------------------------------------------------------------------
Name (time in ns)                                       Min                        Max                       Mean                    StdDev                     Median                       IQR              Outliers             OPS            Rounds  Iterations
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
test_fibonacci_iterative (NOW)                     392.3293 (1.0)           6,972.2494 (1.91)            435.3606 (1.0)             31.0298 (1.03)            437.4985 (1.0)              6.9995 (1.0)      8191;37003  2,296,946.3097 (1.0)      198334          12
test_fibonacci_iterative (0002_baselin)            395.8315 (1.01)          3,645.8320 (1.0)             440.7425 (1.01)            30.2541 (1.0)             441.0006 (1.01)             6.9995 (1.0)     11175;30137  2,268,898.7304 (0.99)     196697          12
test_fibonacci_recursive (NOW)              62,625,999.9699 (>1000.0)  67,687,292.0012 (>1000.0)  65,359,044.3762 (>1000.0)  1,253,637.0277 (>1000.0)  65,587,125.0201 (>1000.0)  1,420,166.4890 (>1000.0)         4;0         15.3001 (0.00)         16           1
test_fibonacci_recursive (0002_baselin)     63,488,584.0118 (>1000.0)  66,528,582.9455 (>1000.0)  65,248,984.4360 (>1000.0)    910,938.2318 (>1000.0)  65,386,229.0201 (>1000.0)  1,530,999.4924 (>1000.0)         5;0         15.3259 (0.00)         16           1
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Legend:
  Outliers: 1 Standard Deviation from Mean; 1.5 IQR (InterQuartile Range) from 1st Quartile and 3rd Quartile.
  OPS: Operations Per Second, computed as 1 / Mean
============================================================================================= 2 passed in 3.38s =============================================================================================

```

So seemingly, I made the iterative version slower. oops. 

## Visualizing results

I don't recommend this, but there's a `--benchmark-histogram` flag to create a very simple histogram of the results and save that as an svg:


{{< figure src="/posts/24_pytest_benchmark/hist.svg.svg" width="90%" opacity="0.8">}}

which is nice for a quick look at the results, but frankly: it's ugly :D 

Alternatively, you can use matplotlib to make a much nicer plot:

```python
import json
import matplotlib.pyplot as plt


def compare_benchmarks(
    baseline_file: str, refactor_file: str
) -> tuple[plt.Figure, plt.Axes]:
    with open(baseline_file, "r") as f:
        baseline_data = json.load(f)

    with open(refactor_file, "r") as f:
        refactor_data = json.load(f)

    baseline_dict = {b["name"]: b["stats"]["mean"] for b in baseline_data["benchmarks"]}
    refactor_dict = {b["name"]: b["stats"]["mean"] for b in refactor_data["benchmarks"]}

    all_names = sorted(set(baseline_dict.keys()) | set(refactor_dict.keys()))

    means_baseline = [baseline_dict.get(name, 0) for name in all_names]
    means_refactor = [0.2 * refactor_dict.get(name, 0) for name in all_names]

    y = range(len(all_names))
    width = 0.35

    fig, ax = plt.subplots(figsize=(10, max(8, len(all_names) * 0.3)))
    ax.barh([i - width / 2 for i in y], means_baseline, width, label="Baseline")
    ax.barh([i + width / 2 for i in y], means_refactor, width, label="Refactor")

    ax.set_xscale("log")
    ax.set_xlabel("Mean Time (seconds) - Log Scale")
    ax.set_yticks(y)
    ax.set_yticklabels(all_names)
    ax.legend()

    ax.grid(True, which="both", ls="-", alpha=0.2)

    plt.tight_layout()
    return fig, ax


plt.style.use("dark_background")

fig, ax = compare_benchmarks(
    ".benchmarks/Darwin-CPython-3.11-64bit/0001_baseline.json",
    ".benchmarks/Darwin-CPython-3.11-64bit/0003_refactor.json",
)

plt.show()
```
{{< figure src="/posts/24_pytest_benchmark/image-1.png" width="90%" >}}

because the results are saved in a json file inside the .benchmarks folder. 

### memory profiling

One last thing I want to mention is that there is a similar plugin called `pytest-memray` that can be used to do memory profiling. 

```bash
pytest --memray tests/
```
```
=============================================================================================== MEMRAY REPORT ===============================================================================================
Allocation results for rsokolewicz.github.io/content/posts/24_pytest_benchmark/benchpress.py::test_fibonacci_iterative at the high watermark

         📦 Total memory allocated: 6.4MiB
         📏 Total allocations: 2
         📊 Histogram of allocation sizes: |█ |
         🥇 Biggest allocating functions:
                - fibonacci_iterative:/Users/rsoko/Documents/private/rsokolewicz.github.io/content/posts/24_pytest_benchmark/benchpress.py:15 -> 5.0MiB
                - update:/Users/rsoko/miniforge3/envs/dev/lib/python3.11/site-packages/pytest_benchmark/stats.py:45 -> 1.4MiB


Allocation results for rsokolewicz.github.io/content/posts/24_pytest_benchmark/benchpress.py::test_fibonacci_recursive at the high watermark

         📦 Total memory allocated: 3.5KiB
         📏 Total allocations: 4
         📊 Histogram of allocation sizes: |█  ▄|
         🥇 Biggest allocating functions:
                - _raw:/Users/rsoko/miniforge3/envs/dev/lib/python3.11/site-packages/pytest_benchmark/fixture.py:180 -> 1.2KiB
                - __call__:/Users/rsoko/miniforge3/envs/dev/lib/python3.11/site-packages/pytest_benchmark/fixture.py:156 -> 1.1KiB
                - _calibrate_timer:/Users/rsoko/miniforge3/envs/dev/lib/python3.11/site-packages/pytest_benchmark/fixture.py:318 -> 586.0B
```

---

This post was co-written with [Lan Chu](https://huonglanchu.medium.com/). 