#!/bin/sh
msg="rebuilding site $(date)"
if [ -n "$*" ]; then
	msg="$*"
fi

git pull
git add .
git reset -- public/*
git commit -m "$msg"
git push origin main

# printf "\033[0;32mDeploying updates to GitHub...\033[0m\n"

# # Build the project.
# hugo -t hugo-theme-terminal # if using a theme, replace with `hugo -t <YOURTHEME>`

# # Add changes to git.
# git add .

# # Commit changes.
# msg="rebuilding site $(date)"
# if [ -n "$*" ]; then
# 	msg="$*"
# fi
# git commit -m "$msg"

# # Push source and build repos.
# git push origin main

