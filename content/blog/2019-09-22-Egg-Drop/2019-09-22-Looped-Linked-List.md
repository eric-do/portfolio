---
layout: post
title: "Algo study: Egg Drop Dynamic Programming"
comments: true
date: "2019-09-22"
---

You are given **K eggs**, and you have access to a building with **N floors** from 1 to N. 

Each egg is identical in function, and if an egg breaks, you *cannot drop it again*.

You know that there exists a floor F with 0 <= F <= N such that any egg dropped at a floor higher than F will break, and any egg dropped at or below floor F will not break.

Each move, you may take an egg (if you have an unbroken one) and drop it from any floor X (with 1 <= X <= N). 

Your goal is to know with certainty what the value of F is.

What is the **minimum number of moves** that you need to know with certainty what F is, *regardless of the initial value of F*?

## Visualization
<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vSolXEyuUNClWOf_6ewQRFAxO_oEnS7XQNtbHf6tluI50Jcfzqf1P0OTnb_BeMUxR_zYm6NkF_ktbyC/embed?start=false&loop=false&delayms=10000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>