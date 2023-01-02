+++
title = "Some tips for using VS code for python development"
date = "2022-12-04"
author= "Robert"
cover = ""
description = "A small (but growing) list of useful tips when developing python in VS code."
mathjax = false
draft = true
+++


# Useful shortcuts

## Moving lines up/down

shortcut: `alt + up-arrow/down-arrow`

## Add cursors to end of lines of selected code

shortcut: `alt + shift + i`

## Add cursor directly up or down

shortcut: `ctrl + alt + up-arrow/down-arrow`


# Useful packages

## IntelliCode
Smart autocomplete. 

## Error Lens
Adds a nice inline description when something is wrong with your code.

## Black formatter
Adds black as one of the code formatters in VS Code. A nice tip: turn on the setting `format on save`.

## Code Spell Checker
A neat plug-in that checks the spelling of words in comments and doc-strings, but also checks the spelling of variable names.

## GitLens
Adds git-blame annotation, shows authors above each class definition and much more git goodness. 

## Pytest IntelliSense
Adds autocomplete for pytest fixtures.

## Rainbow CSV
A cool plug-in that highlights different columns in a `.csv` file. 

# Other

## Editable installs
Sometimes VS Code has problems with autocompletion and finding definitions of imported symbols, when they come from a package that is installed in editable mode, e.g. via `pip install -e .`. With recent versions of `setuptools` (>=0.64.0), editable installs behave a bit differently that can cause issues. There are three solutions to this:

1. Downgrade `setuptools` (i.e. `pip install setuptools<0.64`)
2. Instruct pip to use a legacy mode: `pip install -e . --config-settings editable_mode=compat`. The developers at `setuptools` do [warn](https://setuptools.pypa.io/en/latest/userguide/development_mode.html#legacy-behavior) however that this is only a temporary solution and will likely to be changed and later removed entirely in future versions of `setuptools`. 
3. Add the project to the python path. When testing out new features inside a jupyter notebook it is sufficient to add the line `sys.path.insert(1, "path-to-package")` in the top cell. `"path-to-package"` can be either an absolute path (e.g. `"/users/rsoko/dev/my-package"`) or a relative path (`"my-package"`, `"./my-package"` or even `"../my-package"`). 

