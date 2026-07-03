+++
title = "Auto activating conda environments when moving between projects"
date = "2024-09-15"
author = "Robert"
cover = ""
description = "A simple script to automatically activate conda environments when moving between projects"
draft = false
+++

# Auto activating conda environments when moving between projects

I have the bad habit of forgetting to switch conda environments when moving between projects, and I always end up corrupting them. Although multiple people have requested this feature with the conda developers team, they never implemented some sort of auto activation. 

Fortunately, this is easy to implement yourself. I'm using fish shell, but this should be easy to adapt to other shells if you do a quick search (e.g. there a few suggestions [here](https://github.com/conda/conda/issues/5179) using `bash` or something called `autoenv`). 

Basically, add this to `~/.config/fish/config.fish`:

```bash
function check_and_activate_conda
    if test -e ".condaenv"
        set env_name (cat .condaenv | string trim)
        if test -n "$env_name"
            if not string match -q -- "*$env_name*" $CONDA_DEFAULT_ENV
                conda activate $env_name
            end
        end
    end
end

function auto_activate_conda --on-variable PWD
    check_and_activate_conda
end

if status is-interactive
    check_and_activate_conda
end
```

This will run the function `check_and_activate_conda` every time you initiate a shell or when you change directory. Now all that you need to do is add a file `.condaenv` to the root of your project with the name of the conda environment you want to activate.

Unfortunately, I can't add this to some work-related projects because I don't want to add it to the public `.gitignore`, nor do I want to remember to not `git add` it with every commit. So I added a bit of logic to the script above:

```bash
    else if string match -q "$qblox_path*" $current_path
        if test "$CONDA_DEFAULT_ENV" = "base" -o -z "$CONDA_DEFAULT_ENV"
            conda activate dev
        end
```

this will activate the `dev` environment whenever I work on a Qblox project. 