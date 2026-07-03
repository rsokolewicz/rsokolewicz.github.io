+++
title = "Structured outputs with OpenAI and Pydantic"
date = "2025-04-06"
author = "Robert"
cover = ""
description = "Forcing OpenAI to output a Pydantic model, and how to pass field specific instructions to the model"
draft = false
+++

The tutorials over at openAI are quite clear on how to use structured outputs. e.g. if we want a helper to perform an integral step by step, we can either use a "thinking model", or use a regular model, but force the output be a list of steps:

```python
from pydantic import BaseModel
from textwrap import dedent
from openai import OpenAI

client = OpenAI()
MODEL = "gpt-4o-mini"

integral_solver_prompt = """
    You are a calculus expert capable of solving indefinite integrals
    step-by-step. Given an integral problem, provide a detailed solution
    including each integration step and the final answer. For each step, provide
    the mathematical expression and an explanation of the rule or technique
    used.
"""


class IntegralSolution(BaseModel):
    class Step(BaseModel):
        explanation: str
        """A brief explanation of the step. Please use LaTeX for the
        mathematical expressions. use $..$ to enclose
        inline expressions and $$..$$ to enclose block expressions."""
        expression: str
        """
        A mathematical step in LaTeX.
        e.g., "$$ \int_0^1{2x + 3} dx = \int_0^1{2x} dx + \int_0^1{3} dx $$"
        """

    steps: list[Step]
    final_answer: str
    """
    e.g., "$$x^2 + 3x + C$$"
    """


def solve_integral(integral_problem: str) -> IntegralSolution:
    completion = client.beta.chat.completions.parse(
        model=MODEL,
        messages=[
            {"role": "system", "content": dedent(integral_solver_prompt)},
            {
                "role": "user",
                "content": f"Solve the following integral: {integral_problem}",
            },
        ],
        response_format=IntegralSolution,
    )
    return completion.choices[0].message.parsed
```

where we force the output to be a Pydantic model. Then, when  asking

```python
solve_integral("int[x^2 * sin(2x)dx] from 0 to 1")
```

> We will use integration by parts to solve the integral. The formula for integration by parts is ( \int u , dv = uv - \int v , du ). We choose ( u = x^2 ) and ( dv = \sin(2x) , dx ).
>
> u = x^2, , dv = \sin(2x) , dx.
>
> Next, we compute ( du ) and ( v ). The derivative of ( u ) gives us ( du = 2x , dx ). To find ( v ), we integrate ( dv ): ( v = -\frac{1}{2} \cos(2x) ).
>
> Now we apply the integration by parts formula: ( \int x^2 \sin(2x) , dx = uv - \int v , du ). Therefore, we have: ( -\frac{1}{2} x^2 \cos(2x) \Big|_0^1 + \frac{1}{2} \int 2x \cos(2x) , dx ).
>
> Next, we first evaluate the boundary term: Evaluate ( -\frac{1}{2} x^2 \cos(2x) ) at the limits (0) to (1): When ( x = 1 ): -\frac{1}{2} \cdot 1^2 \cdot \cos(2) ), and when ( x = 0 ): -0. Thus we have: -\frac{1}{2} \cos(2).
>
> Now we compute the remaining integral ( \int x \cos(2x) , dx ) using integration by parts again. Let ( u = x ) and ( dv = \cos(2x) , dx ). Then, we find ( du = dx ) and ( v = \frac{1}{2} \sin(2x) ).
>
> u = x, , dv = \cos(2x) , dx.
> du = 2x , dx, , v = -\frac{1}{2} \cos(2x).
>
> Now we apply the integration by parts formula: ( \int x^2 \sin(2x) , dx = uv - \int v , du ). Therefore, we have: ( -\frac{1}{2} x^2 \cos(2x) \Big|_0^1 + \frac{1}{2} \int 2x \cos(2x) , dx ).
>
> Next, we first evaluate the boundary term: Evaluate ( -\frac{1}{2} x^2 \cos(2x) ) at the limits (0) to (1): When ( x = 1 ): -\frac{1}{2} \cdot 1^2 \cdot \cos(2) ), and when ( x = 0 ): -0. Thus we have: -\frac{1}{2} \cos(2).
>
>
>
> Now we apply the integration by parts formula: ( \int x^2 \sin(2x) , dx = uv - \int v , du ). Therefore, we have: ( -\frac{1}{2} x^2 \cos(2x) \Big|_0^1 + \frac{1}{2} \int 2x \cos(2x) , dx ).
> 
> -\frac{1}{2} x^2 \cos(2x) \Big|_0^1 + \int x \cos(2x) , dx.
> 
> 
> Next, we first evaluate the boundary term: Evaluate ( -\frac{1}{2} x^2 \cos(2x) ) at the limits (0) to (1): When ( x = 1 ): -\frac{1}{2} \cdot 1^2 \cdot \cos(2) ), and when ( x = 0 ): -0. Thus we have: -\frac{1}{2} \cos(2).
> 
> -\frac{1}{2} [1^2 \cos(2) - 0] = -\frac{1}{2} \cos(2).
> 
> 
> Now we compute the remaining integral ( \int x \cos(2x) , dx ) using integration by parts again. Let ( u = x ) and ( dv = \cos(2x) , dx ). Then, we find ( du = dx ) and ( v = \frac{1}{2} \sin(2x) ).
> 
> u = x, , dv = \cos(2x) , dx.
> 
> 
> Using integration by parts, we get: ( \int x \cos(2x) , dx = \frac{1}{2} x \sin(2x) \Big|_0^1 - \frac{1}{2} \int \sin(2x) , dx. ) Now we have to compute ( \int \sin(2x) , dx = -\frac{1}{2} \cos(2x) ).
> 
> = \frac{1}{2} x \sin(2x) \Big|_0^1 - \frac{1}{4} \cos(2x).
> 
> 
> Evaluate ( \frac{1}{2} x \sin(2x) ) from 0 to 1: When ( x = 1 ): ( \frac{1}{2} \cdot 1 \cdot \sin(2) ), when ( x = 0 ): 0. Thus we have: ( \frac{1}{2} \sin(2) + \frac{1}{4} \cos(2) ).
> 
> = \frac{1}{2} \sin(2).
> 
> 
> Now assemblng everything, we have: Total integral = ( -\frac{1}{2} \cos(2) + \left( \frac{1}{2} \sin(2) - \frac{1}{4} \cos(2) \right) ).
> 
> = -\frac{1}{2} \cos(2) + \frac{1}{2} \sin(2) - \frac{1}{4} \cos(2) = \frac{1}{2} \sin(2) - \frac{3}{4} \cos(2).
> 
> 
> Finally, we find the definite integral from 0 to 1, which gives us the answer as a function of sine and cosine values at x=2.
> 
> Final result = \frac{1}{2} \sin(2) - \frac{3}{4} \cos(2).
> 
> 
> \frac{1}{2} \sin(2) - \frac{3}{4} \cos(2)

Apart from the fact that the answer is wrong (and somehow gpt-4o-mini miss-spelled the word "assemblng" lol), it ignored the instruction to use LaTeX!

turns out, that under the hood openAI creates a json schema from the Pydantic model, but the docstrings of each field are not included. big ugh. Luckily, we can use the `Field` class together with descriptions to pass the relevant instructions to the model:

```python
class IntegralSolution(BaseModel):
    class Step(BaseModel):
        explanation: str = Field(
            description="""
            A brief explanation of the step. Please use LaTeX for the
            mathematical expressions. use $..$ to enclose
            inline expressions and $$..$$ to enclose block expressions."""
        )
        expression: str = Field(
            description="""
            A mathematical step in LaTeX.
            e.g., "$$ \int_0^1{2x + 3} dx = \int_0^1{2x} dx + \int_0^1{3} dx $$"
        """
        )

    steps: list[Step]
    final_answer: str = Field(
        description="""
        e.g., "$$x^2 + 3x + C$$"
        """
    )
```

and when trying it out one more time:

```python
output = solve_integral("int[x^2 * sin(2x)dx] from 0 to 1")
```

> We need to solve the integral $$\int_0^1 x^2 \sin(2x) \, dx$$. To do this, we will use integration by parts, which is suitable for products of functions like $x^2$ and $\sin(2x)$. The formula for integration by parts is given by $$\int u \, dv = uv - \int v \, du.$$
>
> We choose our $u$ and $dv$ for integration by parts. Let $$u = x^2$$, then $$du = 2x \, dx$$. For $$dv = \sin(2x) \, dx$$, we integrate to find $$v$$. The integral of $\sin(2x)$ is $$v = -\frac{1}{2} \cos(2x)$$.
>
> Now we apply the integration by parts formula that was stated earlier. We will calculate $$uv$$ at the bounds of the integral and substitute it back into our equation.
>
> Evaluating the first part, we find the boundary values: when $x=1$, $$-\frac{1}{2} \cdot 1^2 \cdot \cos(2) = -\frac{1}{2} \cos(2)$$ and when $x=0$, it becomes $0$. Therefore, the evaluation gives us: $$-\frac{1}{2} \cos(2) - 0 = -\frac{1}{2} \cos(2).$$
>
> Now we need to compute the remaining integral: $$\int_0^1 x \cos(2x) \, dx$$. We apply integration by parts again. Let $$u = x$$ (hence $$du = dx$$) and $$dv = \cos(2x) \, dx$$ (thus $$v = \frac{1}{2} \sin(2x)$$).
>
> Evaluating the boundary terms $$\left[ \frac{1}{2} x \sin(2x) \right]_0^1$$, we have when $x=1$, it equals $$\frac{1}{2} \sin(2)$$ and when $x=0$, it equals $0$. Thus we have: $$\frac{1}{2} \sin(2)$$.
>
> Now we need to compute the integral $$-\int_0^1 \frac{1}{2} \sin(2x) \, dx$$. The integral of $\sin(2x)$ is $$-\frac{1}{2} \cos(2x)$$ hence: $$-\frac{1}{2} \left[-\frac{1}{2} \cos(2x) \right]_0^1 = -\frac{1}{4}[\cos(2) - 1].$$
>
> Now combining all parts, from integration by parts, we have: $$I = -\frac{1}{2} \cos(2) + \frac{1}{2} \sin(2) + \frac{1}{4}[	ext{1} - \cos(2)].$$ This simplifies to: $$-\frac{1}{2} \cos(2) + \frac{1}{2} \sin(2) + \frac{1}{4} - \frac{1}{4} \cos(2)$$.
>
> Thus we have our final answer for the integral $$\int_0^1 x^2 \sin(2x) \, dx$$.
>
> $$I = -\frac{3}{4} \cos(2) + \frac{1}{2} \sin(2) + \frac{1}{4}$$

much better! In the last step it messed up with the minus signs, $-\frac{1}{2} \left[-\frac{1}{2} \cos(2x) \right]_0^1$ where $-\times-=+$ not $-$, and apart from the oververbose explanation, it's good :)