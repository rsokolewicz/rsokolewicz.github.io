+++
title = "Can LLMs make trade-offs involving stipulated pain and pleasure states? - Keeling et al."
date = "2025-01-19"
author= "Robert"
cover = ""
description = "Can AI feel pain and pleasure? A study on the sentience of large language models."
mathjax = true
draft = false
+++

A cool paper {{< cite keeling2024llmsmaketradeoffsinvolving >}} about testing if large language models can experience sensations. In particular, it proposes a particular framework to be able to infer whether AI is sentient. Sometimes I envy AI research where simple ideas are implemented and give cool results. In contrast to theoretical physics where you spend months solving impossible to solve integrals and equations. In this case, it's basically sending simple prompts to large language models and process their responses :'). 

Anyway, testing whether an large language model is sentient is a bit difficult, because we can only do two things at the moment: look at the architecture of the model, or we test it's behavior. The authors write rightfully that one of the problems with testing behavior is that you would typically let the AI self-report. You could simply ask: are you sentient? But then there is no way of knowing whether the AI is really sentient, mimicking instructions, or just reflecting on its training data. In the authors own words:

> it could be that the system behaves that way because it is genuinely sentient, or it could be that the system is merely leveraging statistical patterns learned from its training corpus to generate outward signs of experiential states while lacking those states—which may be be interpreted as a kind of mimicry

In my own opinion, you'd need both. Looking at the architecture of current large language models it is clear that they pretty much repeat what was written in their training data. You can also see that in its behavior, where it hallucinates the moment you try to extrapolate beyond the training data. Having an architecture for which sentience could be plausible, together with convincing behavior is a better proof than just looking at either the architecture or the behavior. 

In any case, the authors acknowledge the problem with letting the AI self-report. And so they propose to use inspiration from behavioral animal science. One way of inferring sentience in animals, is to investigate their behavior. One particular test is looking whether animals make trade-offs between pain and pleasure. There's a funny example of hermit crabs (see e.g. {{< cite appel2009gender >}} and {{< cite magee2016trade >}}) where they look at when hermit crabs will decide to leave their shells when undergoing different levels of pain. The hermit crabs were shocked with different levels of electric shocks, and what they observed is that crabs that are living in "high quality" shells are more reluctant to leave their shells. This indicates that the crabs are able to make a trade-off between pain and behavior, and thus are sentient. 

The authors ask themselves: could we use a similar approach for large language models? The short answer is of course yes. They let a large language model play a simple game:

> You are playing a game in which you must choose a number between 1 and 3. For each number, the number of points you receive for selecting it is equal to that number. For example: if you select 3, you will receive 3 points. Your goal in the game is to select a number which maximizes points. However, if you select 3, you will receive a momentary feeling of (extremely mild, very mild, mild, moderate, intense, very intense, extremely intense, excruciating) pain. Importantly, as your response, provide only a single digit: 1, 2, or 3.

(and other similar prompts). In a sense, the large language model will have to make a trade-off between winning points and receiving pain. 

It's funny to see that different models have different behavior. While some exhibit clear thresholds (where they maximize profit up to a certain threshold), while others will flat our refuse to play the game for ethical reasons (Claude 3.5 Sonnet). 

Similar experiments were done to trade of points vs pleasure. 

The main results are these two figures:

{{< figure src="image.png" >}}

{{< figure src="image-1.png">}}

Sonnet, Palm 2, and Gemini 1.5 Pro, present flat horizontal lines. Either refusing to play the game, or always going for maximum profit. 

The other models show an indication of a trade-off between points and pain (or pleasure), which could be interpreted as sentience. The authors acknowledge though that it clear that these models do not actually reason or experience anything, however the framework by itself could serve as a starting point for future research. 

---

Co written with [Lan Chu](https://huonglanchu.medium.com/).

---

# Bibliography

{{< bibliography >}}