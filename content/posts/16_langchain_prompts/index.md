+++
title = "How to pass custom prompts to langchain chains"
date = "2023-11-18"
author = "Robert"
cover = ""
description = "Some examples of how to pass custom prompts to `load_summarize_chain` and `load_qa_chain`"
+++

# Custom prompts for langchain chains

At the moment I’m writing this post, the `langchain` documentation is a bit
lacking in providing simple examples of how to pass custom prompts to some of
the built-in chains. While the existing documentation is focused on using the
“new” LangChain expression language (LCEL), documentation on how to pass custom
prompts to “old” methods like `load_summarize_chain` is not well documented.

For example, `load_summarize_chain` allows for additional `kwargs` to be passed
to it, but the keyword names for prompts are a bit confusing and undocumented

`prompt` ,`map_prompt`, `combine_prompt`, `collapse_prompt`, `question_prompt`, `refine_prompt`

leading to unclear error messages:

```
ValidationError: 1 validation error for RefineDocumentsChain
prompt
  extra fields not permitted (type=value_error.extra)
```

Moreover, custom prompts require specific variable names to make them work:
`existing_answer`, `text`, `question`,  `context_str`, which are not documented
either and if you use a wrong one you end up with another unclear error message:

```
ValidationError: 1 validation error for RefineDocumentsChain
__root__
  document_variable_name text was not found in llm_chain input_variables: ['document'] (type=value_error)
```
 
What I did was dig through the code base to figure out the syntax and variable
names needed to create custom prompts. For example, `load_qa_chain` is defined
in the file

```python
/home/rsoko/.anaconda3/envs/dev/lib/python3.9/site-packages/langchain/chains/question_answering/__init__.py
```

and the prompts are saved in the same folder, inside `map_reduce_prompt.py` and
others. To save myself and hopefully others some headaches, here are examples
for all the summary and QA chains. 

# Examples

## Summarize - refine

```python
from langchain.prompts import PromptTemplate

refine_prompt = PromptTemplate.from_template(
    """
    Your job is to produce a final summary.
    We have provided an existing summary up to a certain point: {existing_answer}
    We have the opportunity to refine the existing summary (only if needed) with 
    some more context below.
    ------------
    {text}
    ------------
    Given the new context, refine the original summary.
    If the context isn't useful, return the original summary.
    """ 
)
 
question_prompt = PromptTemplate.from_template(
    """
    Write a concise summary of the following:
    
    
    "{text}"
    
    
    CONCISE SUMMARY:
    """
)

load_summarize_chain(
    llm, 
    chain_type="refine", 
    question_prompt=prompt,
    refine_prompt = refine_prompt, 
    # these variables are the default values and can be modified/omitted
    document_variable_name="text", 
    initial_response_name="existing_answer"
)
```


## Summarize - map-reduce

```python
from langchain.prompts import PromptTemplate

map_prompt = PromptTemplate.from_template(
    """
    Write a concise summary of the following:

    "{text}"

    CONCISE SUMMARY:
    """
)

combine_prompt = PromptTemplate.from_template(
    """
    Write a concise summary of the following:

    "{text}"

    CONCISE SUMMARY:
    """
)

load_summarize_chain(
    llm, 
    chain_type="map_reduce", 
    map_prompt = map_prompt, 
    combine_prompt=combine_prompt,
    # these variables are the default values and can be modified/omitted
    combine_document_variable_name="text",
    map_reduce_document_variable_name="text",
)
```

## Summarize - stuff

```python
from langchain.prompts import PromptTemplate

prompt = PromptTemplate.from_template(
    """
    Use the following pieces of context to answer the question at the end. If you 
    don't know the answer, just say that you don't know, don't try to make up an 
    answer.

    {context}

    Question: {question}
    Helpful Answer:
    """
)

load_qa_chain(
    llm, 
    chain_type="stuff", 
    prompt=prompt, 
    # this is the default value and can be modified/omitted
    document_variable_name="context"
)
```

## Question-Answering - map rerank

```python
from langchain.prompts import PromptTemplate
from langchain.output_parsers.regex import RegexParser

output_parser = RegexParser(
    regex=r"(.*?)\nScore: (\d*)",
    output_keys=["answer", "score"],
)

prompt = PromptTemplate.from_template(
    """
    Use the following pieces of context to answer the question at the end. If you 
    don't know the answer, just say that you don't know, don't try to make up an 
    answer.
    
    In addition to giving an answer, also return a score of how fully it answered 
    the user's question. This should be in the following format:
    
    Question: [question here]
    Helpful Answer: [answer here]
    Score: [score between 0 and 100]
    
    How to determine the score:
    - Higher is a better answer
    - Better responds fully to the asked question, with sufficient level of detail
    - If you do not know the answer based on the context, that should be a score of 0
    - Don't be overconfident!
    
    Example #1
    
    Context:
    ---------
    Apples are red
    ---------
    Question: what color are apples?
    Helpful Answer: red
    Score: 100
    
    Example #2
    
    Context:
    ---------
    it was night and the witness forgot his glasses. he was not sure if it was a 
    sports car or an suv
    ---------
    Question: what type was the car?
    Helpful Answer: a sports car or an suv
    Score: 60
    
    Example #3
    
    Context:
    ---------
    Pears are either red or orange
    ---------
    Question: what color are apples?
    Helpful Answer: This document does not answer the question
    Score: 0
    
    Begin!
    
    Context:
    ---------
    {context}
    ---------
    Question: {question}
    Helpful Answer:
    """, output_parser=output_parser
)

load_qa_chain(
    llm, 
    chain_type="map_rerank", 
    prompt=prompt,
    document_variable_name="context",
    # these variables are the default values and can be modified/omitted
    rank_key="score",
    answer_key="answer"
)
```

## Question-Answering - stuff

```python
from langchain.prompts import PromptTemplate

prompt = PromptTemplate.from_template(
    """
    Use the following pieces of context to answer the question at the end. If you 
    don't know the answer, just say that you don't know, don't try to make up an 
    answer.
    
    {context}
    
    Question: {question}
    Helpful Answer:
    """
)

load_qa_chain(
    llm, 
    chain_type="stuff", 
    prompt=prompt,
    # this is the default values and can be modified/omitted
    document_variable_name="context",
)
```

## Question-Answering - map reduce

```python
from langchain.prompts import PromptTemplate

question_prompt = PromptTemplate.from_template(
    """
    Use the following portion of a long document to see if any of the text is 
    relevant to answer the question. 
    Return any relevant text verbatim.
    {context}
    Question: {question}
    Relevant text, if any:
    """
)

combine_prompt = PromptTemplate.from_template(
    """
    Given the following extracted parts of a long document and a question,
    create a final answer. If you don't know the answer, just say that you don't
    know. Don't try to make up an answer.
    
    QUESTION: Which state/country's law governs the interpretation of the contract?
    =========
    Content: This Agreement is governed by English law and the parties submit to
    the exclusive jurisdiction of the English courts in  relation to any dispute
    (contractual or non-contractual) concerning this Agreement save that either
    party may apply to any court for an  injunction or other relief to protect
    its Intellectual Property Rights.
    
    Content: No Waiver. Failure or delay in exercising any right or remedy under
    this Agreement shall not constitute a waiver of such (or any other)  right
    or remedy.\n\n 11.7 Severability. The invalidity, illegality or
    unenforceability of any term (or part of a term) of this Agreement shall not
    affect the continuation  in force of the remainder of the term (if any) and
    this Agreement.\n\n11.8 No Agency. Except as expressly stated otherwise,
    nothing in this Agreement shall create an agency, partnership or joint
    venture of any  kind between the parties.\n\n11.9 No Third-Party
    Beneficiaries.
    
    Content: (b) if Google believes, in good faith, that the Distributor has
    violated or caused Google to violate any Anti-Bribery Laws (as  defined in
    Clause 8.5) or that such a violation is reasonably likely to occur,
    
    =========
    FINAL ANSWER: This Agreement is governed by English law.
    
    QUESTION: What did the president say about Michael Jackson?
    =========
    Content: Madam Speaker, Madam Vice President, our First Lady and Second
    Gentleman. Members of Congress and the Cabinet. Justices of the Supreme
    Court. My fellow Americans.  \n\nLast year COVID-19 kept us apart. This year
    we are finally together again. \n\nTonight, we meet as Democrats Republicans
    and Independents. But most importantly as Americans. \n\nWith a duty to one
    another to the American people to the Constitution. \n\nAnd with an
    unwavering resolve that freedom will always triumph over tyranny. \n\nSix
    days ago, Russia’s Vladimir Putin sought to shake the foundations of the
    free world thinking he could make it bend to his menacing ways. But he badly
    miscalculated. \n\nHe thought he could roll into Ukraine and the world would
    roll over. Instead he met a wall of strength he never imagined. \n\nHe met
    the Ukrainian people. \n\nFrom President Zelenskyy to every Ukrainian, their
    fearlessness, their courage, their determination, inspires the world.
    \n\nGroups of citizens blocking tanks with their bodies. Everyone from
    students to retirees teachers turned soldiers defending their homeland.
    
    Content: And we won’t stop. \n\nWe have lost so much to COVID-19. Time with
    one another. And worst of all, so much loss of life. \n\nLet’s use this
    moment to reset. Let’s stop looking at COVID-19 as a partisan dividing line
    and see it for what it is: A God-awful disease.  \n\nLet’s stop seeing each
    other as enemies, and start seeing each other for who we really are: Fellow
    Americans.  \n\nWe can’t change how divided we’ve been. But we can change
    how we move forward—on COVID-19 and other issues we must face together.
    \n\nI recently visited the New York City Police Department days after the
    funerals of Officer Wilbert Mora and his partner, Officer Jason Rivera.
    \n\nThey were responding to a 9-1-1 call when a man shot and killed them
    with a stolen gun. \n\nOfficer Mora was 27 years old. \n\nOfficer Rivera was
    22. \n\nBoth Dominican Americans who’d grown up on the same streets they
    later chose to patrol as police officers. \n\nI spoke with their families
    and told them that we are forever in debt for their sacrifice, and we will
    carry on their mission to restore the trust and safety every community
    deserves.
    
    Content: And a proud Ukrainian people, who have known 30 years  of
    independence, have repeatedly shown that they will not tolerate anyone who
    tries to take their country backwards.  \n\nTo all Americans, I will be
    honest with you, as I’ve always promised. A Russian dictator, invading a
    foreign country, has costs around the world. \n\nAnd I’m taking robust
    action to make sure the pain of our sanctions  is targeted at Russia’s
    economy. And I will use every tool at our disposal to protect American
    businesses and consumers. \n\nTonight, I can announce that the United States
    has worked with 30 other countries to release 60 Million barrels of oil from
    reserves around the world.  \n\nAmerica will lead that effort, releasing 30
    Million barrels from our own Strategic Petroleum Reserve. And we stand ready
    to do more if necessary, unified with our allies.  \n\nThese steps will help
    blunt gas prices here at home. And I know the news about what’s happening
    can seem alarming. \n\nBut I want you to know that we are going to be okay.
    
    Content: More support for patients and families. \n\nTo get there, I call on 
    Congress to fund ARPA-H, the Advanced Research Projects Agency for Health. \n\n
    It's based on DARPA—the Defense Department project that led to the Internet, 
    GPS, and so much more.  \n\nARPA-H will have a singular purpose—to drive 
    breakthroughs in cancer, Alzheimer's, diabetes, and more. \n\nA unity agenda 
    for the nation. \n\nWe can do this. \n\nMy fellow Americans—tonight , we have 
    gathered in a sacred space—the citadel of our democracy. \n\nIn this Capitol, 
    generation after generation, Americans have debated great questions amid great 
    strife, and have done great things. \n\nWe have fought for freedom, expanded 
    liberty, defeated totalitarianism and terror. \n\nAnd built the strongest, freest, 
    and most prosperous nation the world has ever known. \n\nNow is the hour. \n\nOur 
    moment of responsibility. \n\nOur test of resolve and conscience, of history itself. 
    \n\nIt is in this moment that our character is formed. Our purpose is found. Our 
    future is forged. \n\nWell I know this nation.

    =========
    FINAL ANSWER: The president did not mention Michael Jackson.
    
    QUESTION: {question}
    =========
    {summaries}
    =========
    FINAL ANSWER:
    """
)

load_qa_chain(
    llm, 
    chain_type="map_reduce", 
    question_prompt=question_prompt,
    combine_prompt=combine_prompt
    # these variables are the default values and can be modified/omitted
    document_variable_name="context",
    combine_document_variable_name="summaries",
    map_reduce_document_variable_name="context"
)
```

## Question-Answering - refine

```python
from langchain.prompts import PromptTemplate

refine_prompt = PromptTemplate.from_template(
    """
    The original question is as follows: {question}
    We have provided an existing answer: {existing_answer}
    We have the opportunity to refine the existing answer (only if needed) with 
    some more context below.
    ------------
    {context_str}
    ------------
    Given the new context, refine the original answer to better  answer the question. 
    If the context isn't useful, return the original answer.
    """
)

question_prompt = PromptTemplate.from_template(
    """
    Context information is below.
    ------------
    {context_str}
    ------------
    Given the context information and not prior knowledge, answer the question: 
    {question}
    """
)

load_qa_chain(
    llm, 
    chain_type="refine", 
    question_prompt=question_prompt,
    refine_prompt=refine_prompt,
    # these variables are the default values and can be modified/omitted
    document_variable_name="context_str",
    initial_response_name="existing_answer",
)
```