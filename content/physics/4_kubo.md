+++
title = "A derivation of the Kubo formula"
date = "2023-01-01"
author = "Robert"
mathjax = true
bibFile = "data/biblio2.json"
description = "A short derivation of linear response formulas from a Keldysh-framework."
+++

The linear response formula we used to compute the spin-density of conducting electrons can be obtained in a Keldysh-framework. We start by introducing the Green function $\mathcal{G}$ in rotated Keldysh space [see e.g. {{< cite "rammer_quantum_1986" >}}]

$$\mathcal{G}=\begin{pmatrix}G^\text{R} & G^\text{K}\\\\
0 & G^\text{A}\end{pmatrix}$$

where R, A and K denote retarded, advanced and Keldysh Green functions respectively. In this notation a perturbation to a classical field $V(\bb{x},t)$ is given by
$$\begin{multline}
    \delta\mathcal{G}(\bb{x}_1,t_1;\bb{x}_2,t_2)=\int\\!d\bb{x}_3\int\\!dt_3\\, \mathcal{G}^{(0)}(\bb{x}_1,t_1;\bb{x}_3,t_3)\\
    \\hat{V}(\bb{x}_3,t_3)\mathcal{G}^{(0)}(\bb{x}_3,t_3;\bb{x}_2,t_2)+\mathcal{O}(V^2)
    \label{chap1:eq:s2}
\end{multline}$$

with $\mathcal{G}^{(0)}$ equilibrium Green functions. The Wigner-transform of a function $F(\bb{x}_1,t_1;\bb{x}_2,t_2)$ is given by

$$\begin{multline}
    F(\bb{x}_1,t_1;\bb{x}_2,t_2)=\int\frac{d^2\bb{p}}{(2\pi\hslash)^2}\int \frac{d\varepsilon}{2\pi\hslash}\\,e^{-i\varepsilon(t_1-t_2)/\hslash}e^{i\bb{p}\cdot(\bb{x}_1-\bb{x}_2)/\hslash}F(\varepsilon,\bb{p},R,T)
   \end{multline}$$

with energy $\varepsilon$, momentum $\bb{p}$, time $T=\frac{t_1+t_2}{2}$ and position $\bb{R}=\frac{\bb{x}\_1+\bb{x}\_2}{2}$. In equilibrium the Green functions $\mathcal{G}^{(0)}$ do not depend on $\bb{R}$ and $T$, so that the momentum-frequency representation of Eq.(\ref{chap1:eq:s2}) becomes 

$$\delta\mathcal{G}(\varepsilon,\omega,\bb{p},\bb{q})= \mathcal{G}^{(0)}\_{\varepsilon\_+,\bb{p}\_+} V_{\omega,\bb{q}}\mathcal{G}^{{(0)}}\_{\varepsilon\_-,\bb{q}\_-},$$

with subscripts $\varepsilon_\pm=\varepsilon\pm\hslash\omega/2$ and $\bb{p}_\pm=\bb{p}\pm\hslash\bb{q}/2$ and $V_{\omega,\bb{q}}$ the Fourier transform of $V(\bb{R},T)$. 

The spin density $\bb{s}\_{\omega,\bb{q}}$ is given by

$$\bb{s}_{\omega,\bb{q}} = {i\hslash} \int\\!\frac{d\varepsilon}{2\pi\hslash}\int\\!\frac{d^2\bb{p}}{(2\pi\hslash)^2}\tr \left[\delta G^<({\varepsilon,\omega,\bb{p},\bb{q}},T) \bb{\sigma}\right],
$$

where,

$$\delta G^<(\varepsilon,\omega,\bb{p},\bb{q}) = 1/2 \big(\delta G^\text{K}(\varepsilon,\omega,\bb{p},\bb{q})-
    \delta G^\text{R}(\varepsilon,\omega,\bb{p},\bb{q})+\delta G^\text{A}(\varepsilon,\omega,\bb{p},\bb{q})\big),  
$$

and $\bb{\sigma}$ is a vector of spin operators. For a ferromagnet $\sigma$ are the usual Pauli-matrices acting on spin-degree of freedom, whereas for the antiferromagnet we use $\bb{\sigma}\,\Sigma_{0,z}\Lambda_{0,z}$ for the (non)-staggered spin-densities $\bb{s}^\pm$. Here $\Sigma$ and $\Lambda$ are the usual Pauli-matrices acting on sublattice and valley space degree of freedom respectively.

In equilibrium we have the fluctuation-dissipation theorem $G^\text{K}\_{\varepsilon\_\pm,\bb{p}\_\pm} = (1-2f_{\varepsilon\_\pm})(G^\text{R}\_{\varepsilon\_\pm,\bb{p}\_\pm}-G^\text{A}\_{\varepsilon\_\pm,\bb{p}\_\pm}) $ with $f\_{\varepsilon\_\pm}$ the Fermi distribution, so that the spin density now becomes

$$\begin{multline}
    \bb{s}_{\omega,\bb{q}} =   {i\hslash} \int\\!\frac{d\varepsilon}{2\pi\hslash}\int\\!\frac{d^2\bb{p}}{(2\pi\hslash)^2}\tr\langle
     -(f\_{\varepsilon\_+}-f\_{\varepsilon\_-})\bb{\sigma}G^\text{R}\_{\varepsilon\_+,\bb{p}\_+} V\_{\omega,\bb{q}}G^\text{A}\_{\varepsilon\_-,\bb{p}\_-}\\\\
     -f\_{\varepsilon_+}\bb{\sigma}G^\text{R}\_{\varepsilon_+,\bb{p}\_+} V\_{\omega,\bb{q}}G^\text{R}\_{\varepsilon\_-,\bb{p}\_-}
    +f\_{\varepsilon\_-}\bb{\sigma}G^\text{A}\_{\varepsilon\_+,\bb{p}\_+} V\_{\omega,\bb{q}}G^\text{A}\_{\varepsilon\_-,\bb{p}\_-}\rangle,
\end{multline}$$

where the angular brackets stands for impurity averaging. The latter amounts to the replacement of the Green's functions with the corresponding impurity averaged Greens functions (in Born approximation) and to the replacement of one of the spin operators with the corresponding vertex corrected operator (in the non-crossing approximation). The corrections beyond the non-crossing approximation are important for those tensor components that lack leading-order contribution {{< cite "ivan" >}}. To keep our notations more compact we ignore here the fact that the Green's functions before disorder averaging lack translational invariance, i.e. depend on both Wigner coordinates: momentum and coordinate. 

In the limit of small frequency, i.e. $\hslash\omega\ll\varepsilon$, we obtain $s_\alpha = s^\text{I}_\alpha+s^\text{II}_\alpha$,
$$\begin{align}
    s^\text{I}_\alpha & =\frac{i\omega}{2\hslash}\int\frac{d\varepsilon}{2\pi}\int \frac{d^2\bb{p}}{(2\pi)^2}\Big(-\frac{\partial f}{\partial \varepsilon}\Big)\tr\big\langle
    2\sigma_\alpha G^\text{R}_{\varepsilon_+,\bb{p}_+} V_{\omega,\bb{q}} G^\text{A}_{\varepsilon_-,\bb{p}_-}
    \nonumber\\\\
     & \hspace{3cm}-\sigma_\alpha G^\text{A}_{\varepsilon_+,\bb{p}_+} V_{\omega,\bb{q}} G^\text{A}_{\varepsilon_-,\bb{p}_-} -\sigma_\alpha G^\text{R}_{\varepsilon_+,\bb{p}_+} V_{\omega,\bb{q}} G^\text{R}_{\varepsilon_-,\bb{p}_-}\big\rangle,\\\\
    s^\text{II}_\alpha & =\frac{i}{\hslash}\int\frac{d\varepsilon}{2\pi}\int \frac{d^2\bb{p}}{(2\pi)^2} f_\varepsilon \tr \big\langle\sigma_\alpha
    G^\text{A}_{\varepsilon_+,\bb{p}_+} V_{\omega,\bb{q}} G^\text{A}_{\varepsilon_-,\bb{p}_-}-
    \sigma_\alpha G^\text{R}_{\varepsilon_+,\bb{p}_+} V_{\omega,\bb{q}} G^\text{R}_{\varepsilon_-,\bb{p}_-}\big\rangle,
\end{align}$$

where $s^{\text{I}}$ and $s^\text{II}$ are the Kubo and Středa contributions respectively. The Středa contribution is sub-leading in the powers of weak disorder strength $\alpha\ll 1$ as long as the Fermi energy lies outside the gap. Similarly, the AA and RR bubbles in the expression of $s_\alpha^\text{I}$ are sub-leading and may be neglected. Furthermore, we work in the zero temperature limit. 

The linear response to electric field and time derivative of magnetization corresponds to $V_{\bb{q},\omega} = -\hat{\bb{j}}
\cdot\bb{A}-\Delta_\text{sd} \bb{m}\cdot\bb{\sigma}$, so that we obtain

$$\begin{equation}
  \bb{s}\_{\bb{q},\omega}=\frac{1}{v^2h}\hat{K}(\bb{q},\omega)[ev(\bb{E}\_{\bb{q},\omega}\times\hat{\bb{z}})-i\omega\Delta_{\text{sd}}\bb{m}\_{\omega}],
  \label{chap1:eq:skubo}
\end{equation}$$

where the components of the tensor $\hat{K}$ are given by

$$\begin{equation}
\hat{K}\_{\alpha\beta}(\bb{q},\omega)={v^2}\int\\!\frac{d^2\bb{p}}{(2\pi)^2}\tr \langle \sigma_\alpha G^\text{R}\_{\bb{p}+ \hslash q,\varepsilon+\hslash\omega}\sigma_\beta G^\text{A}\_{\bb{p},\varepsilon}\rangle.
\label{chap1:eq:skuboB}
\end{equation}$$
