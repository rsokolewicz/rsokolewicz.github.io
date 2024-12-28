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