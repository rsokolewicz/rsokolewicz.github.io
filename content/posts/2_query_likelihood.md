+++
title = "The Query Likelihood Model"
date = "2022-04-18"
author = "Robert"
cover = ""
description = "One of the central ideas behind language modeling is that when a user tries to produce a good search query, he or she will come up with terms that are likely to appear in a relevant document. In other words, a relevant document is one that..."
mathjax = true
+++

# Language Models 

One of the central ideas behind language modeling is that when a user tries to produce a good search query, he or she will come up with terms that are likely to appear in a relevant document. In other words, a relevant document is one that is likely to contain the query terms. What makes language modeling different from other probabilistic models, is that it creates a language model for each document from which probabilities are generated that correspond to the likelihood that a query can be found in that document. This probability is given by $P(q|M_d)$.  

The definition of a language model is a function that produces probabilities for a word or collection of words (e.g. a (part of a) sentence) given a vocabulary. Let us look at an example of a model that produces probabilities for single words: 

|s |cat | dog | likes | fish |
|--|----|----|-------|-------|
| $P(s)$ | 0.3 | 0.1 | 0.2 | 0.2 |

The probability for the sentence "cat likes fish" is $0.3\times0.2\times0.2 = 0.012$, whereas the probability for the sentence "dog likes cat" is $0.1\times0.2\times0.3 = 0.006$. This means that the term "cat likes fish" is more likely to appear in the document than "dog likes cat". If we want to compare different documents with the same search query, we produce the probability for each document separately. Remember that each document has its own language model with different probabilities.  

Another way of interpreting these probabilities is asking how likely it is that this model generates the sentence "cat likes fish" or "dog likes cat". (Technically speaking you should also include probabilities how likely it is that a sentence continues or stops after each word). These sentences don't have to exist in the document, nor do they have to make sense. In this language model for example, the sentences "cat likes fish" and "cat fish fish" have the same probability, in other words they are equally likely to be generated.  

The language model from the example above is called a unigram language model, it is a model that estimates each term independently and ignores the context. One language model that does include context is the bigram language model. This model includes conditional probabilities for terms given that they are preceded by another term. The probability for "cat likes fish" would be given by 

$$ P(\text{cat}) \times P(\text{likes}|\text{cat}) \times P(\text{fish}|\text{likes}). $$

This of course requires all conditional probabilities to exist.  

More complex models exist, but they are less likely to be used. Each document creates a new language model, but the training data within one document is often not sufficiently large enough to accurately train a more complex model. This is reminiscent of the bias-variance trade-off. Complex models have high variance and are prone to overfitting on smaller training data.  

# The Query Likelihood Model 

When ranking documents by how relevant they are to a query, we are interested in the conditional probability $P(d|q)$. In the query likelihood model, this probability is so-called rank-equivalent to $P(q|d)$, so that we only need to use the probabilities discussed above. To see why they are rank-equivalent let us look at Bayes Rule: 

$$ P(d|q) = P(q|d) P(d) / P(q) $$

Since $P(q)$ has the same value for each document, it will not affect the ranking at all. $P(d)$ on the other hand is treated as being uniform for simplicity and so will not affect the ranking either (in more complicated models $P(d)$ could be made dependent on the length of the document for example). And so, the probability $P(d|q)$ is equivalent to $P(q|d)$. In other words, in the query likelihood model the following two statements are *rank-equivalent* 

- The likelihood that document d is relevant to query q. 

- The probability that query q is generated by the language of document d.  

When a user creates a query, he or she already has an idea of how a relevant document could look like. The terms used in the query are more likely to appear in relevant documents than in non-relevant documents.  

One way of estimating the probability $P(q|d)$ for a unigram model is using the maximum likelihood estimation 

 $$ P(Q|M_d) = \Pi_{t\in q} P_{\text{mle}}(T|M_d) = \Pi_{t\in q}\frac{\text{tf}_{t,d}}{L_d}$$

Where $\text{tf}_{t,d}$ is the term frequency of term $t$ in document $d$ and $L_d$ is the size of document $d$. In other words, calculate the fraction of how often each query word appears in document $d$ compared to all words in that document, and then multiply all those fractions with each other.  

There are two small problems with the formula above. First, if one the terms in the query does not appear in a document, the entire probability $P(q|d)$ will be zero. In other words, the only way to get a non-zero probability is if each term in the query appears in the document. The second problem is that the probability of the terms that appear less frequently in the document are likely to be overestimated.  

The solution to these problems is to introduce smoothing. Smoothing will help by creating non-zero probabilities for terms that do not appear in the document, and by creating effective weights to frequent terms. Different smoothing techniques exist such as Jelinek-Mercer smoothing, that uses a linear combination of document-specific and collection-specific maximum likelihood estimations 

$$ P(T|d) = \lambda P_\text{mle} (t|M_d) +(1-\lambda)P_\text{mle}(t|M_c) $$

where $0<\lambda<1$ is a hyperparameter that can be finetuned and $M_c$ is a language model created on the entire document collection. Another popular smoothing technique is Dirichlet smoothing 

$$ P(t|d) = \frac{\text{tf}_{t,d}+\alpha P(t|M_c)}{L_d + \alpha} $$

(parts of this article also appear in this [Medium post](https://medium.com/towards-data-science/understanding-term-based-retrieval-methods-in-information-retrieval-2be5eb3dde9f) about term-based retrieval methods in information retrieval I wrote with my gf)