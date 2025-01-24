#!/bin/sh
msg="rebuilding site $(date)"
if [ -n "$*" ]; then
	msg="$*"
fi

git pull
git add .
git reset -- public/*
git submodule update --remote --merge themes/hugo-theme-terminal/

# Check if there are changes in the submodule
cd themes/hugo-theme-terminal/
if [ -n "$(git status --porcelain)" ]; then
    git add .
    git commit -m "Update submodule: $msg"
    git push
fi
cd ../..

git add themes/hugo-theme-terminal/
git commit -m "$msg"
git push origin main
