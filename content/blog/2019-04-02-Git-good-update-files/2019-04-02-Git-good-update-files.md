---
layout: post
title: "Git Gud: Updating Files"
date: "2019-04-02"
comments: true
published: false
---
The general flow for updating files (not including pulling/merging) is:
1. Update file(s) locally, save
2. Add file(s) to be commited. <br />Note: it's common you'll update multiple files but only want to commit a subset, so it's best to get in the habit of manually adding each file to be committed.
3. Commit changes
4. Push changes to your repo

So normally after you make a local update to the file and do a **git status**, the terminal will show something like:
```
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   2020-04-02-Git-good.md
```
You'll want to then run steps 2-4 above. Git output has been removed for brevity.

```
Erics-MacBook:_posts ericdo$ git add 2020-04-02-Git-good.md
Erics-MacBook:_posts ericdo$ git commit -m "Added instructions on how to update files"
Erics-MacBook:_posts ericdo$ git push origin master
```