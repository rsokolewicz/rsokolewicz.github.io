+++
title = "Maxwell's 20 equations"
date = "2024-05-21"
author= "Robert"
description = ""
mathjax = true
draft = true
+++

# A dynamical theory of the electromagnetic field

In 1865 Maxwell wrote rather large article *A dynamical theory of the electromagnetic field*, which extended a static theory that was developed by 

# What is an upstream branch?

In Git, an upstream branch refers to the branch in a remote repository that your local branch is associated with or tracks. It serves as a reference point for your local branch and determines where your changes will be pushed when you use the `git push` command.

When you clone a repository, Git sets up a default upstream branch for the branch you're currently on. For example, if you clone a repository and checkout the `master` branch, your local `master` branch will typically have an upstream branch called `origin/master`, where `origin` is the default name for the remote repository.

Having an upstream branch allows you to easily push and pull changes between your local branch and the corresponding branch in the remote repository. When you push your local changes using `git push`, Git knows which remote branch to update based on the upstream branch configuration.

By default, Git doesn't set an upstream branch when you create a new branch locally. You need to explicitly set the upstream branch using the `--set-upstream` option when pushing for the first time, like this:

```shell
git push --set-upstream origin your-branch
```

or using the `-u` flag

```shell
git push -u origin your-branch
```

Setting the upstream branch allows you to use `git push` without specifying the remote branch name every time, as Git will remember the association between your local branch and its upstream branch.

# How to automatically set the upstream branch

```shell
git config --global push.default simple
```

To avoid setting upstream explicitly every time you push a new branch, you can configure Git with the push.default option. This option determines the behavior when pushing branches that do not have a configured upstream branch. Here are the possible values for push.default:

- nothing: This is the default option. Git won't push any branch without an upstream branch explicitly specified.

- current: Git pushes the current branch to a branch of the same name on the remote repository, even if it doesn't have an upstream branch.

- upstream: Git pushes the current branch to its upstream branch, if it has one.

- simple: This option is recommended. Git pushes the current branch to its upstream branch if it exists. If the upstream branch doesn't exist, it will push to a branch of the same name on the remote repository, creating a new branch if necessary. However, it won't push if the upstream branch's name is different.