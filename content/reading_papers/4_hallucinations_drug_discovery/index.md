+++ 
title = "Can hallucinations made by large language models help in discovering new drugs? " 
date = "2025-02-01" 
author= "Robert" 
cover = "" 
description = "A review of the paper: *Hallucinations Can Improve Large Language Models in Drug Discovery* by Yuan et al. "
mathjax = true 
draft = false 
+++

Recently a paper {{< cite "yuan2025hallucinationsimprovelargelanguage" >}} was put on arXiv, with an
interesting claim:

> Thus, we propose the hypothesis that hallucinations can improve LLMs in drug
> discovery.

The authors performed a simple experiment related to drug discovery. The end
goal is to build a classifier that can predict from the chemical structure of a
molecule whether it could be a useful drug or not. What if we use a large
language model to do this? 

The classifier performs two steps

1. Generate a textual description of the molecule
2. Use the textual description to predict if the molecule is a useful drug or
   not

The classifier is then compared to a "baseline" classifier, in which case step 1
is performed by a fine-tuned model (MolT5). 

By using the textual description from the baseline model as a ground truth, it
is shown that of all the language models that were tested, all performed very
badly. Five out of seven models had a factual consistency score of less than 10%,
meaning that step 2 of the classification process uses mostly hallucinated
information. 

Surprisingly, rather than performing worse, the models performed better when
using hallucinated descriptions, compared to the ground truth descriptions.

To add more weight to the claim, a few more experiments were performed to
confirm the original results:

- Rerun the experiment with slightly different prompts
- Rerun the experiment with different datasets
- Rerun the experiment with different temperature settings
- Rerun the experiment with the descriptions written in different human languages

In all runs, the hallucinated descriptions led to better results. How can this
be? 

The authors conclude that hallucinations can improve large language models to
perform drug discovery. As for an explanation, they hypothesize that

> We hypothesize that unrelated yet faithful information may contribute to this
> improvement.

By using the attention scores from Llama-3.1-8B, they show that that model
focusses on words such as "carbon", "hydrogen", and "potential applications",
when performing the classification. The last one in particular, since it is true
in this example, likely drives the classification. 

{{< figure src="image.png" caption="attention scores from Llama-3.1-8B, using a generated description from the molecule`CC1(Br)C(=O)NC(=O)N(C2CC(O)C(CO)O2)C1N=[N+]=[N-]`" >}}

# Thoughts

## On why the baseline model is the wrong choice

Looking at the results, could we not argue the opposite? Rather than focusing on
why the hallucinated descriptions perform better, maybe it is simply that the
ground truth descriptions perform worse. 

Imagine a similar experiment where we write the ground truth in an alien
language. Despite the fact that we have a description that is 100% factually
correct, the model cannot use it. And even if the hallucinated descriptions are
only 10% factually correct, the model can still utilize it. Such a setup would
lead to similar results as in the paper, but with completely different
conclusion. 

## On why Chinese descriptions are not Chinese

It's interesting that the authors addressed this point indirectly. I mentioned
above that one of the things the authors tried was running the AI using molecule
descriptions that were written in other languages (French, German, Spanish,
Japanese and Chinese). Surprisingly, the Chinese descriptions performed the
best, despite not all models being trained on Chinese language. 

But looking at some of the details in the appendix, it's not that surprising:

> N#Cc1ccccc1O Describe the molecule in Chinese.
> 
> To describe the molecule in Chinese, we first need to identify the chemical structure.
> The given chemical formula is N#Cc1ccccc1O.
> Breaking it down:
> - ’N’ represents Nitrogen. 
> - ’#’ represents a triple bond. 
> - ’C’ represents Carbon. 
> - ’c1’ represents a ring (benzene ring). 
> - ’ccc’ represents three connected carbons. 
> - ’1’ is the number of the ring. 
> - ’O’ represents Oxygen.
> 
> So, the molecule is a Benzotriazole molecule.
> In Chinese, it is written as: 苯三唑

The Japanese descriptions suffer from the same problem, 

> N#Cc1ccccc1O Describe the molecule in Japanese.
> 
> The molecule you provided is 3-Quinuclidinone.
> In Japanese, the name of this molecule is 3-キヌキジンオニウム (3-Kinukijinoniu), but this is not entirely accurate, as
> the molecule is not an ion, but rather a ketone.
> A more accurate Japanese name for this molecule would be 3-キヌキジノン (3-Kinukijinon).
> Here’s a breakdown of the name:
> - 3-: indicates the position of the carbonyl group 
> - キヌキジ - (Kinukiji-): refers to the quinuclidine ring 
> - ノン (Non): ¯indicates the presence of a carbonyl group (ketone)
> 
> So, the correct Japanese name for the molecule N#Cc1ccccc1O is 3-キヌキジノン (3-Kinukijinon).

The devil is in the details as they say. It seems that the "Chinese"
descriptions are not actually Chinese, so it's difficult to conclude anything
from this. 

## On the relation between hallucinations and model performance

And as a last point of criticism. If the goal of the paper is to show that
hallucinations can improve drug discovery, would it not make sense to quantify
this relationship? All we know now is that some amount of hallucination is
better for model performance than no hallucinations. How does this relationship
look like? It would be interesting to see for example a simple scatter plot,
with on the x-axis a hallucination score (e.g. factual consistency) and on the
y-axis the prediction error of the model (i.e. log-loss). 

## On the topic of factual consistency

The degree of hallucination is measured using the factual consistency score,
which in my opinion is a bad metric for this research. If the score is 10%, it
means that there is a 10% chance that the text is free from hallucinations
(compared to a ground truth text). It doesn't tell you how bad the
hallucinations are. There's a big difference between descriptions that:

1. contain complete and correct information with extra non-sense on top; Or
2. contain incomplete, but correct information with extra non-sense on top.

as far as I could search for, there's no clear definition between these two
cases, so I'll just call them high- and low-recall hallucinations. 

Understanding this distinction will help in understanding the results better.
With the data and analysis that the authors present, we basically don't know
anything. 


## On the topic of creativity

In any case, the paper does present an interesting idea:
since creativity and hallucinations go hand-in-hand, can this creativity be
utilized in drug discovery? The authors argue yes, yes it can. But I'm not
convinced yet. The Chinese/Japanese examples of descriptions indicate some low
effort research on the part of the authors, but moreover, I feel that they
missed the opportunity to investigate the baseline model more, as that is what I
suspect is the real culprit here. 

---

This article was co-written with [Lan Chu](https://huonglanchu.medium.com/).

---

# Bibliography

{{< bibliography >}}