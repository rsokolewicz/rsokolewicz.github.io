+++
title = "Managing git ssh-keys for multiple accounts on GitLab and GitHub"
date = "2022-12-04"
author= "Robert"
cover = ""
mathjax = false
draft = true
+++

# 
```
host github.com
  HostName github.com
  IdentityFile ~/.ssh/github
  User git

host gitlab.com
  HostName gitlab.com
  IdentityFile ~/.ssh/gitlab
  User git
```