+++
title = "Fourier transforms are cool"
date = "2022-12-04"
author= "Robert"
cover = ""
mathjax = true
draft = true
+++

The Fourier transform of a function `$f(x)$` is denoted as `$
\hat{f}(k)$` and is given by

<div>$$
\hat{f}(k) = \frac{1}{2\pi} \int_{-\infty}^{+\infty}\!\mathrm{d}x\, f(x) \exp(i k x) 
$$</div>

it also has an inverse:

<div>$$
f(x) = \int_{-\infty}^{+\infty}\!\mathrm{d}k\, \hat{f}(k) \exp(-i k x) 
$$</div>

and we can plug one in the other:

<div>$$\begin{align}
f(x) &= \int_{-\infty}^{+\infty}\!\mathrm{d}k\, \hat{f}(k) \exp(-i k x) \\
     &= \frac{1}{2\pi}\int_{-\infty}^{+\infty}\int_{-\infty}^{+\infty}\!\mathrm{d}k\mathrm{d}x'\, f(x') \exp(i k x') \exp(-i k x)\\
     &= \int_{-\infty}^{+\infty}\!\mathrm{d}x'\,\delta(x-x') f(x')\\
     &= f(x)
\end{align}$$</div>

where we used that

<div>$$
\frac{1}{2\pi}\int_{-\infty}^{+\infty}\!\mathrm{d}k \exp(i k (x'-x)) = \delta(x'- x)
$$</div>

Similarly, 

<div>$$\begin{align}
\hat{f}(k) &= \int_{-\infty}^{+\infty}\!\mathrm{d}x\, f(x) \exp(i k x) \\
     &= \frac{1}{2\pi}\int_{-\infty}^{+\infty}\int_{-\infty}^{+\infty}\!\mathrm{d}x\mathrm{d}k'\, \hat{f}(k') \exp(i k x) \exp(-i k' x)\\
     &= \int_{-\infty}^{+\infty}\!\mathrm{d}k'\,\delta(k-k') f(k')\\
     &= \hat{f}(k)
\end{align}$$</div>

<div>$$
\frac{1}{2\pi}\int_{-\infty}^{+\infty}\!\mathrm{d}x \exp(i x (k'-k)) = \delta(k'- k)
$$</div>

It is a great tool to solve differential equations, but also to extract periodic properties of functions. Imagine we have the function

<div>$$
f(x) = A \sin 2\pi x/3 + B \cos 2\pi x/5
$$</div>

then the Fourier transform, `$\hat{f}(k)$` is given by

<div>$$
\hat{f}(k) = \frac{A}{2i} \big(\delta(k-2\pi/3) - \delta(k+2\pi/3)\big) + \frac{B}{2}\big(\delta(k-2\pi/5) + \delta(k+2\pi/5)\big)
$$</div>

<div>$$\begin{equation}
\frac{1}{2\pi} \int_{-\infty}^{+\infty}\!\mathrm{d}k\, \delta(k-k_0) \exp(-i k x) = \frac{1}{2\pi}\exp(-i k_0 x)
\end{equation}$$</div>

<div>$$\begin{equation}
\frac{1}{2\pi} \int_{-\infty}^{+\infty}\!\mathrm{d}x\, \exp(i k_0 x) \exp(i k x) = \int_{-\infty}^{+\infty}\!\mathrm{d}k\, \delta(k-k_0) \exp(i k x) = 
\end{equation}$$</div>
