+++
title = "Don't Do RAG: When Cache-Augmented Generation is All You Need for Knowledge Tasks - Chan et al."
date = "2025-01-12"
author= "Robert"
cover = ""
description = "A better way of doing RAG? I don't think so..."
mathjax = true
draft = false
+++

The paper {{< cite chan2024dontragcacheaugmentedgeneration >}} presents a "novel" way of augmenting large language model prompts with relevant information. One way of improving a language model's accuracy and reducing hallucinations is to augment each prompt with relevant information. Because language models have a finite context length, we cannot simply pass all information (e.g. all of Wikipedia) to the model. Instead, often we would implement some sort of retrieval system to fetch relevant pieces of information and passing them to the model. 

The "novel" approach that is advertised in this paper is to realize that the context length of many models is already sufficiently large to pass all relevant information in one go. For example, right now the context length of GPT-4o is 128k tokens. That would be around 200 pages of text. 

The two immediate issues with this approach are:
1. It can be costly to pass all information with each prompt
2. Tokenizing a large amount of text can lead to increased latency

The way around this is to only pass the relevant information to the last prompt and not as part of the chat history. Furthermore, the relevant information can be preprocesed, tokenized and encoded (tokens -> token ids) before hand.

This approach is called Cache-Augmented Generation (CAG) and the authors claim that this approach is better than RAG, because it is faster and more accurate. 

In my opinion, the proposal is rather trivial and not entirely novel. Also, models tend to get confused when they recieve too much contextual information, so I'm skeptical that his approach will work in many cases. 

From a research perspective, I'm also a bit critical. Many people have tried alternatives to traditional RAG, so it would be interesting to see how this method compares to others. More importantly, usually in science you follow something similar to the scientific method. Since proving a hypothesis is impossible, but disproving is, typically you try your best to disprove your hypothesis. Failing to do so will give some merit to your original hypothesis. Testing accuracy on a single dataset seems a bit weak in my opinion. 

Lastly, analysis and discussion is rather lacking. It would be interesting to know why and in which cases CAG would outperform RAG. Does the amount of relevant information matter? Does context recall trade off with context precision? Why add information to the prompt, and not to the system prompt?

# Bibliography

{{< bibliography >}}
