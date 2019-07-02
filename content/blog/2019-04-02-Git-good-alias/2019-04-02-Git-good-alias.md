---
layout: post
date: "2019-04-02"
title: "Git Gud: Aliases"
comments: true
---
Common git commands can be shorted via aliases. 

Aliases are updated in your .gitconfig file, which is stored in your $HOME directory. To find your home directory:

```
Erics-MacBook:_posts ericdo$ echo $HOME
```

Then add to the file:
```
[alias]
  co = checkout
  ci = commit
  st = status
  br = branch
  hist = log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short
  type = cat-file -t
  dump = cat-file -p
```