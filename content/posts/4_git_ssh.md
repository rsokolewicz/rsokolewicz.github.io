+++
title = "Managing git ssh-keys for multiple accounts on GitLab and GitHub"
date = "2022-12-04"
author= "Robert"
description = "If you only have one account for every git repository provider, for example, one for `www.github.com` and one for `www.gitlab.com`, you will need to add the following to your ssh-config file..."
mathjax = false
draft = false
+++

# Table of Contents

1. [Single SSH Key Setup for GitHub](#single-ssh-key-setup-for-github)
2. [Multiple Accounts per Provider](#multiple-accounts-per-provider)
3. [SSH Configuration File Overview](#ssh-configuration-file-overview)

---

# Single SSH Key Setup for GitHub

## Step 1: Generate SSH Key

First, generate a new SSH key pair:

```bash
ssh-keygen -t ed25519
```

When prompted, you can:
- Press Enter to accept the default file location (`~/.ssh/id_ed25519`)
- Enter a passphrase (recommended for security) or leave empty for no passphrase

## Step 2: Add SSH Key to SSH Agent

Add your private key to the SSH agent:

```bash
ssh-add ~/.ssh/id_ed25519
```

## Step 3: Add Public Key to Git Provider

Copy your public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

Then copy the public key and add it to the corresponding git provider.

e.g. for GitHub:
1. Go to GitHub.com → Settings → SSH and GPG keys
2. Click "New SSH key"
3. Paste your public key and give it a descriptive title
4. Click "Add SSH key"

## Step 4: Test Your Connection

Verify everything works:

```bash
ssh -T git@github.com
```

You should see: `Hi username! You've successfully authenticated...`

## Step 5: Configure Git (Optional)

If you haven't already, configure your Git identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```

---


# Multiple git accounts

Create an SSH config file at `~/.ssh/config`:

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

where the `IdentityFile` is the path to the private key, generated earlier. The path is what you entered when prompted by `ssh-keygen`.


This configuration tells SSH which key to use for each service automatically.

---

# Multiple Accounts per Provider

If you have multiple accounts on the same provider (e.g., one personal and one work account on GitLab), you need:


```
host gitlab-private
  HostName gitlab.com
  IdentityFile ~/.ssh/gitlab_private
  User git

host gitlab-work
  HostName gitlab.com
  IdentityFile ~/.ssh/gitlab_work
  User git
```

## Generate Separate Keys

Generate different keys for each account:

```bash
ssh-keygen -t ed25519 -C "personal@example.com" -f ~/.ssh/gitlab_private
ssh-keygen -t ed25519 -C "work@example.com" -f ~/.ssh/gitlab_work
```

## Configure Repository Remotes

When setting up repositories, use the host alias in the remote URL:

```bash
git remote set-url origin git@gitlab-private:username/repo.git
```

The key part is `git@gitlab-private:` - this maps to the `host gitlab-private` entry in your SSH config, ensuring the correct key is used for authentication.

## Key Points

- The host alias (e.g., `gitlab-private`) can be any name you choose
- The format is always `git@host-alias:username/repo.git`
- Each account needs its own SSH key pair
- Add each public key to the corresponding account on the git provider 
