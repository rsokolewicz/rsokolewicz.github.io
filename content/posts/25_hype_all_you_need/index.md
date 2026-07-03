+++
title = "Is hype all you need?"
date = "2025-01-25"
author = "Robert"
cover = ""
description = ""
draft = false
+++

The last decade saw a few AI scientific breakthroughs that enabled the whole AI development to boom. For example, realizing that AI thrives on large amounts of data and GPUs (see e.g. {{< cite "vaswani2017attention" >}}). Large language models had the problem for a long time that they were difficult to train, because (1) they couldn't be trained properly on GPUs, and they suffered from something called catastrophic forgetting. But then in 2017, the *Attention is All you Need* paper {{< cite "vaswani2017attention" >}} solved these two problems and within a few years we saw the development of chatGPT and similar large language models. 

The *Attention is all you need* paper sits with over 100,000 citations which is a lot{{< footnote "back in 2014, Nature released a [top 100 cited papers of all time list](https://www.nature.com/news/the-top-100-papers-1.16224), with only three papers with more than 100k citations" >}}.

I noticed recently that more and more computer science papers have similar titles, while the ones that I opened were not particularly groundbreaking. It's even worse on LinkedIn, where some of these articles are shared as if they are the next big thing, while they are really not. The titles are crafted to grab attention and make us readers feel like we are missing out on the "next wave" in AI research. That made me wonder, if there's really a trend going on and whether it is more hype than anything else. 


So I wanted to do some statistical analysis on recent research papers to see if there really is a trend of using the phrase "is all you need" in the title, and if it makes the paper more likely to be cited. 

My first approach was to go to Google Scholar and search for "is all you need", but that gave me over 100,000 results, without the ability to download all the results. A quick search led me to the [Semantic Scholar](https://www.semanticscholar.org/) website, which is a database of over 200 million research papers that is constantly being updated. They also have a simple API that allows you to get all the data you need. 

Before showing the code, let's show the results first:

{{< figure src="image.svg" >}}

In chronological order, we have the first three papers:

1. A little flexibility is all you need: on the asymptotic value of flexible capacity in parallel queuing systems {{< cite "bassamboo2012little" >}}
2. When virtual contact is all you need: Subtle reminders of Facebook preempt social-contact restoration after exclusion {{< cite "https://doi.org/10.1002/ejsp.2035" >}}
3. Attention is all you need {{< cite "vaswani2017attention" >}}

after which the trend skyrockets. The *Attention is all you need* paper has over 100,000 citations, which is significantly higher than the other papers. 

Next I was interested in the number of citations for each paper. Unfortunately, the distribution is very skewed, so it's a bit difficult to visualize. Combining a simple jitter plot together with a quantile plot, we have

{{< figure src="image4.svg" >}}

so we see for example that about 75% of the papers have at least 1 citation, and 25% have at least 10 citations. 

Maybe a bar chart is a bit clearer:

{{< figure src="image2.svg" >}}

So only a third of the papers have 5 or more citations, which is not a great start for being "all you need". We should realize however that:

1. It takes time to get noticed and the majority of papers were published less than a year ago. 
2. The number of citations is not always a good indicator of the quality of the paper.

What I wanted to try next is compare the number of citations to the "average" number of citations for an arbitrary paper in the same year. But unfortunately, with the public API I can only perform query searches and the returned results are ranked by relevance. This will introduce a strong bias towards higher cited papers, so that the analysis will fail. 

I could request an API key that will allow me to download the metadata of the entire 200 million paper database, so maybe I will do that another time :)

---

This article was co-written with Lan Chu and a version was also published on [the AI stories website](https://ai-stories.io/blog/hype-in-ai-research/).

# Code

```python
import requests
from tqdm import tqdm
import time


def search_semantic_scholar(query: str, year: int, field_of_study: str) -> list:
    """
    Search Semantic Scholar API for papers in a specific year and field
    """
    base_url = "https://api.semanticscholar.org/graph/v1/paper/search"
    all_papers = []
    offset = 0
    limit = 100

    with tqdm(desc=f"Fetching papers for {year}", unit="batch") as pbar:
        while True:
            params = {
                "query": query,
                "fields": "title,publicationDate,citationCount,url,year",
                "limit": limit,
                "offset": offset,
                "year": str(year),
                "fieldsOfStudy": field_of_study,
            }
            while True:
                response = requests.get(base_url, params=params)

                if response.status_code == 429:
                    time.sleep(10)
                    continue

                if response.status_code != 200:
                    break

                break

            if response.status_code != 200:
                break

            data = response.json()
            batch_papers = data.get("data", [])

            all_papers.extend(batch_papers)
            pbar.update(len(batch_papers))
            pbar.set_description(f"Year {year}: {len(all_papers)} papers")

            if len(batch_papers) < limit:
                break

            offset += limit
    return all_papers


query = '"is all you need"'
field_of_study = "Computer Science"

years = range(2010, 2026)
papers = [
    search_semantic_scholar(query, year, field_of_study) for year in years
]
```

There are a few limitations that we needed to work around:

1. Each request returns at most 100 papers, but we can pass the "offset" parameter, to get the next batch of papers.
2. A maximum of 1000 papers can be returned from a unique query. So I searched per year for a specific field of study (computer science), and then combined the results.
3. The public API has a rate limit of 1000 requests per second (shared globally with other users), so occasionally you'll be hit with the 429 HTTP error code ("Too Many Requests"). So I added a 10 second wait together with a while loop to keep retrying until success. 
4. Some of results had missing publication dates (about 100), so I removed them. 

The whole thing runs for about a minute. 

# Bibliography

{{< bibliography >}}