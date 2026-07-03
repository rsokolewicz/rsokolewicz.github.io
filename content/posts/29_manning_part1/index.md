+++
title = "Writing a book for Manning - part 1"
date = "2026-05-15"
author = "Robert"
cover = ""
description = "I'm co-authing a post-training LLMs book for Manning! In this series I'll explain the process I've went through."
draft = false
+++

At the start of the year my partner and I set a goal: we will write a book together. We both have extensive experience in data science
which narrowed down the possible areas we could contribute to. After a few weeks of brainstorming we narrowed it down even further to
three potential topics:

1. small language models
2. post-training
3. document extraction 

We then searched recently published data science books in the catalogs of O'Reilly, Manning and Packt to see what is up and coming.

The first topic was already written about a couple of times. On post-training people have written a bit about reinforcement-learning-with-human-feedback, but not much more. This was surprising because Deepseek invented GRPO which really enabled post-training to be accessible
to pretty much everyone. If you go to the tutorials of unsloth, you'll find plenty of tutorials on how to post-train smaller language models (my favorite
is [teaching-ai-to-solve-Sudoku-puzzles](https://unsloth.ai/docs/models/nemotron-3#reinforcement-learning--nemo-gym)).
The third topic also seemed available, but Lan and I didn't have enough experience on the topic that we felt comfortable writing an entire
book about. At AI-stories we had a handful of post-training small language model projects, so we picked that one.

Next step was choosing a publisher. Do we self-publish, or choose a publisher?

The biggest difference between the two is that with self-publishing you keep most of the earnings for each sold book, but that you don't get
any help with editing, marketing, selling, etc. More importantly, you won't have an editor bothering you every week for updates. We don't expect
to get rich with writing the book, and we also don't know much about the whole editing process so the choice was quickly made: let's go find a publisher.

The three big publishers, O'Reilly, Manning and Packt all publish many technical books every year. So how do we choose which one is best? After reading
many reviews, we saw many similarities: they all offer editorial guidance, strict deadlines, 10% commission, etc. The major difference that we felt was
that Packt seemingly publishes everything and has a print-on-demand service. O'Reilly, while the most famous one, often feels a bit more theoretical than
hands on. While Manning has a strong focus on publishing books that are all accompanied by code examples, and github repos.

To publish a book with Manning, you first have to write an extensive proposal. Here we had to

- outline a detailed description of the book,
- provide author bios
- the target audience,
- what we expect the reader to get out of the book,
- market research
- literature review of (potentially) competing books
- a detailed table-of-contents
  - chapter summaries, headings and subheadings
- estimated page count, number of figures and code snippets
- proposed schedule (when we do expect to finish 1/3, 2/3, 3/3 of the book)

We submitted our proposal for a book of 450 pages to Manning, and two days later we got our first response from one of the acquisition editors:
the topic sounds super interesting and relevant and that we will get a more detailed review within a week.

The first review had only one major concern: Manning books typically span 300-350 pages. We tightened the page count, removed a few concepts (e.g. decided
not to talk too much about Mixture of Experts). We also made the TOC a bit more "Manning" specific, by targeting the "in action" series. The proposal was
sent to about 20 volunteers. Each had two weeks to review and leave comments.

The response was overwhelmingly positive. Out of the 20 volunteers, about 15 wrote a review of which 14 very positive and 1 critical. The critical reviewer
admitted to being an AI-sceptic, but still provided valuable feedback.

We took a week to address all the comments, edit our proposal (everyone was asking to talk more about agents) and submit again.

Our proposal was then sent to the big boss for approval, and merely one day later we received the good news: our proposal got accepted!

Two days later we received a contract. The contract tightens the writing and editing process:

1. we are not to deviate from our proposed page count, unless agreed by the editor
1. strict deadlines for each third of the manuscript
1. financial compensation
   a. 2.000E for the meeting the first deadline (1/3 of the book available on MEAP)
   b. 2.000E for finishing the book
   c. 10% commision for each sold book (with the 4k that we already got as an advance)
   d. 25 free copies

We later heard that you can renegotiate the compensation.. oops.

In the next part I'll share more on the editing process, the tools and resources that we use and our interactions with the
developmental editor.
