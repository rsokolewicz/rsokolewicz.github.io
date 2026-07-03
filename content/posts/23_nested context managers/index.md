+++
title = "Nesting context managers"
date = "2024-12-28"
author = "Robert"
cover = ""
description = "Nesting context managers..."
draft = false
+++

The other day I used `tempfile` to create two temporary files inside a temporary directory. I've used python for so long that I never realized that since python 3.8 we can write the following much shorter:

```python
# the old way
import tempfile

with TemporaryDirectory() as temp_dir:
    with NamedTemporaryFile(suffix=".pdf") as temp_pdf_file:
      with NamedTemporaryFile(suffix=".zip") as temp_zip_file:
        ...
```

```python
# the new way
with (
    TemporaryDirectory() as temp_dir,
    NamedTemporaryFile(suffix=".pdf") as temp_pdf_file,
    NamedTemporaryFile(suffix=".zip") as temp_zip_file,
):
    ...
```
and this works for all context managers, not just `tempfile`. 

In this example, unfortunately `temp_dir` won't be created until the with block actually enters, so if we want to create the temporary files in the same directory, we will need to do it like this:

```python
with TemporaryDirectory() as temp_dir:
    with (
        NamedTemporaryFile(suffix=".pdf", dir=temp_dir) as temp_pdf_file,
        NamedTemporaryFile(suffix=".zip", dir=temp_dir) as temp_zip_file,
    ):
        ...
```

