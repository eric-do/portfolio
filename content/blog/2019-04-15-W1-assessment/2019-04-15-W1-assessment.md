---
layout: post
title: "I bombed today's self assessment"
date: "2019-04-15"
comments: true
---
I told myself coming in that whatever the requirements were, I needed to be very cautious about misinterpreting them. Recall from my [previous post](https://eric-do.github.io/Closures/) I had made an incorrect assumption about a problem statement. This time I somehow ***overthought*** it, thinking the request might intentionally be for something unintuitive, and misinterpreted again.

The question was basically, given a tree node and a callback function, create a new tree where all values have been modified by the callback. *A new tree must be returned and the old tree must remain unchanged*.

## A thought process under fire
I had been feeling confident all last week doing our projects because everything was fun and time constraints weren't difficult. What I forgot about was how much I struggle under crunch time.

### First mistake: panic
Let's just get it out there. The root cause of everything today was that I panicked when I read the problem statement. I thought it was much harder than it actually was, heard the clicking of keys around me, and *let* my anxiety shoot through the roof. I went **fullspeed** ahead in the **wrong** direction.

### Second mistake: problem analysis
Continuing along the wrong path, I didn't stop to consider I had the wrong intepretation. 

The question was to take a reference to a tree, modify all branches it, but not change the original tree itself. 
- **My initial interpretation:** given a reference to a tree, modify all branches under the tree except the tree itself, using a callback function
- **The correct interpretation:** given a reference to a tree, return a copy of that tree where all tree branches have been modified by a callback function

So given this tree, if we call a function on node 2 to double all values:

```
       1
     /    \
    2       3
   / \      / \     
  4   5    6   7
```

I thought we were doing this:
```
       1
     /    \
    2       3
   / \      / \     
  8   10    6   7
```

But we were supposed to return this:
```
    4      
   / \    
  8   10  
```

I drew the diagram, wrote the pseudocode, and began coding. I finished the problem with my initial interpretation, checked the output, then checked the clock. It was 9:30. I breathed a sigh of relief, and reread the problem. 

Then I began to realize my interpretation could have been wrong. 

I had to return a new tree instead of modifying the old one.

### Third mistake: rushing for a fix
I hauled ass and didn't take time to pseudocode anymore.

I panicked further, redid the problem, this time trying to return a new tree. The logic became convoluted due to time and anxiety, and in the end my code had undefined values that caused the entire test to fail.

I had no choice left but to submit a pull request with broken code. My fingers were shaking from the frustration and anxiety, and I even made the wrong pull request.

This just doesn't happen to me during standard coding.

## Reflection
When I got back to my desk I was in pieces. How could it have been so hard? I sat back and rethought the problem, and realized it was so much simpler than I had thought it to be. I finished up the toy problems for the morning, then redid the problem, and finished it in about 10 minutes.

What's the lesson for next time? Well, for one thing, in a moment of panic, don't let seconds seem like hours. An extra 30 seconds of thoughtful consideration wouldn't have hurt anything.

Second, next time I either need to just take myself out of the room so I can focus, or force myself to not be moved by the progress around me.

Third, even if I realize I need to redo code, I need to do so thoughtfully. It's just a complete clusterf*** otherwise.

Monday's not off to the best start, but I have to try to keep accepting these challenges as growth. **Onwards!**