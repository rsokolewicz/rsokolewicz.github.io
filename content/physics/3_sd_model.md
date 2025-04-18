+++
title = "The $s$--$d$-model"
date = "2023-01-01"
author = "Robert"
mathjax = true
bibFile = "data/biblio2.json"
description = "The spin-density of conducting electrons in a magnetic medium can be obtained from the the `$s$`--`$d$` model. Using the spin-density of these electrons we obtain equations describing the motion and relaxation of magnetic moments."
+++
The spin-density of conducting electrons in a magnetic medium can be obtained from the the `$s$`--`$d$` model. Using the spin-density of these electrons we obtain equations describing the motion and relaxation of magnetic moments.

Our model consists of two parts. The first part are the conducting electrons whose Hamiltonian is given by a tight-binding model. These conducting electrons can scatter of impurities in the material leading to having a finite momentum life-time. At the same time the spin of the electrons are coupled to its momentum through spin-orbit interactions, making it possible to transfer this angular momentum to the crystal lattice. The second part is the (anti)ferromagnet which we describe using a Heisenberg model in a classical limit, meaning we replace the spin-operators with vectors. In order to transfer angular momentum between localized and conduction electrons, we therefore need to introduce a parameter that couples the spin and magnetic moment locally. This allows us to directly relate the relaxation of the momentum of conduction electrons to the relaxation of angular momentum of the localized electrons. This momentum relaxation is at the heart of quantum transport theory. 

Our model has much in comparison with the `$s$`--`$d$` model {{< cite "vonsovsky1946exchange;zener1951interaction;kasuya1956theory;yosida1957magnetic;sdmodel" >}}, used for example in the Kondo effect {{< cite "10.1143/PTP.32.37" >}}, where localized `$d$` electrons are coupled to conduction `$s$` electrons through exchange interaction. In the literature therefore our model is often called `$s$`--`$d$`, or `$s$`--`$d$`-like, and the parameter that couples the spins of localized and itinerant electrons is called an `$s$`--`$d$`-like exchange interaction. A related model that is called the `$t$`--`$J$` model is used in the context of high-temperature superconductivity {{< cite "anderson_resonating_1987;zhang_effective_1988" >}}.

## Classical equations of motion on magnetization
The Hamiltonian describing the localized and conduction electrons is given by

<div>$$\begin{equation}
    \hat{H}
        = \sum_{\{i,j\}\in\text{n.n.}}\,\Big(\frac{J_{\text{ex}}}{n}\hat{\bb{S}}_i\cdot\hat{\bb{S}}_j - \frac{K}{2n}\left(\hat{{S}}_{z,i}\right)^2
        \Big)-\sum_i \big(\gamma\hbar\bb{H}_\text{ext}\cdot\hat{\bb{S}}_i-J_\text{sd}\hat{\bb{S}}_i\cdot\hat{c}_i^\dagger\bb{\sigma}\hat{c}_i\big)+H_\text{tb},
    \label{intro:eq:Hm}
\end{equation}$$</div>

with the Heisenberg exchange energy `$J_{\text{ex}}$`, magnetocrystalline anisotropy constant `$K$`, `$s$`--`$d$`-like exchange energy `$J_{\text{sd}}$`, creation operators for conduction electrons `$\hat{c}^\dagger_l$`, spin operators for localized spins `$\hat{\bb{S}}_i = (\hat{{S}}_{x,i}, \hat{{S}}_{y,i}, \hat{{S}}_{z,i})$`, Pauli-matrices `$\bb{\sigma}=(\sigma_x,\sigma_y,\sigma_z)$`, external magnetic field `$\bb{H}_\text{ext}$` and a tight-binding Hamiltonian for conducting electrons `$H_\text{tb}$`. The first sum is taken over nearest neighbor sites. The gyromagnetic ratio `$\gamma$` of the localized electrons is defined as `$\gamma=\mu_s/(\hbar S)$`, with magnetic moment `$\mu_s$`. Note that the constant `$K$` is inserted in the equation above phenomenologically, but can be computed as done in {{< cite "sokolewicz2020spintronics" 111 >}} for a honeycomb antiferromagnet.

To describe the full dynamics of the system we assume that the expectation value of of the localized electrons' spins move on a much larger time-scale than the spin-polarization of the conducting electrons. This allows us to decouple the system in two parts. We first derive equations of motion for the localized spins in a classical, mean-field approach by using only the expectation value of conducting electrons spin-polarization. Second, the spin-polarization of the conducting electrons is computed microscopically using linear response theory in response to electric currents and time-derivative of magnetizations, where the localized spins enter as classical fields. 

We can obtain a mean-field form of the Hamiltonian Eq.(\ref{intro:eq:Hm}) by making the replacement

<div>$$\begin{equation}
    \sum_{\{ij\}\in\text{n.n.}} \hat{\bb{S}}_i\cdot\hat{\bb{S}}_j\rightarrow n\langle\bb{S}_j\rangle\cdot\sum_i \bb{S}_i
    \label{eq:meanfield}
\end{equation}$$</div>

with `$n \langle \bb{S}_j\rangle$` the effective field produced by the `$n$` nearest neighbors felt by `$\bb{S}_i$`, where `$\bb{S}_i$` is the classical expectation value of `$\hat{\bb{S}}_i$`.  When `$J_\text{ex}<0$`, the spins favor parallel alignment and the energy can be written as

<div>$$\begin{equation}
    E = \sum_{i} \Big(\hbar\gamma \hat{\bb{S}}_i\cdot \bb{H}_{\text{ext}}
    - \frac{K}{2}(\hat{S}_{z,i})^2
    -J_{\text{sd}}\mathcal{A}\big(\bb{S}_i\cdot\bb{s}\big)
        \Big)
        \label{intro:eq:E1}
\end{equation}$$</div>

where we made the replacement

<div>$$\begin{align}
    \hat{\bb{S}}_i\cdot\hat{c}_i^\dagger\bb{\sigma}\hat{c}_i \rightarrow \bb{S}_i\cdot\bb{s}, \quad \bb{s} = \mathcal{A}^{-1}\langle \hat{c}^\dagger \bb{\sigma}\hat{c}\rangle,
\end{align}$$</div>

with spin-density polarization `$\bb{s}$` and unit cell area `$\mathcal{A}$`. This replacement follows from the assumption that the dynamics of `$\bb{S}$` is much slower than `$\bb{s}$`. With this assumption we are allowed to take the statistical average of `$\hat{c}_i^\dagger\bb{\sigma}\hat{c}_i$`, while `$\bb{S}_i$` is taken as a constant.

In the case when `$J_\text{ex}>0$` the spins favor antiparallel alignment and the energy can be written as

<div>$$\begin{equation}
    E = \sum_{i} \Big(J_{\text{ex}}\bb{S}^\text{A}_i\cdot\bb{S}^\text{B}_i 
    - \frac{K}{2}((\hat{S}_{z,i}^\text{A})^2+(\hat{S}_{z,i}^\text{B})^2)
    -J_{\text{sd}}\mathcal{A}\big(\bb{S}^\text{A}_i\cdot\bb{s}^\text{A}+\bb{S}^\text{B}_i\cdot\bb{s}^\text{B}\big)
        \Big)
        \label{intro:eq:E2}
\end{equation}$$</div>

where we introduced the spin polarization density `$\bb{s}^\text{A(B)} = \mathcal{A}^{-1}\langle \hat{c}^\dagger \bb{\sigma}\hat{c}\rangle$` (with unit cell area `$\mathcal{A}$`). 

The equations of motion is given by `$\partial_t \bb{S}_i = \{E,\bb{S}_i\}_p$`, where `$\{\cdots\}_p$` is the Poisson bracket. For angular momenta we simply have `$\{\hbar \bb{S}_i,\hbar \bb{S}_j\}_p=\hbar \bb{S}_i\times\bb{S}_j$`. 

As is common practice, the magnetization in the ferromagnet is expressed in terms of a unit vector `$\bb{m} = -\bb{S}/|\bb{S}|$` and for an antiferromagnet we introduce the magnetization `$\bb{m}$` and staggered magnetization (also called the Néel vector) `$\bb{n}$` as

<div>$$\begin{align}
 	\bb{m} & =-1/2(\bb{S}^\text{A}+\bb{S}^\text{B})/|\bb{S}|\\
    \bb{n} & =-1/2(\bb{S}^\text{A}-\bb{S}^\text{B})/|\bb{S}|.
\end{align}$$</div>

With these considerations we find the following equations of motion of magnetization for a ferromagnet

<div>$$\begin{equation}
	\hbar \partial_t \bb{m} = \bb{m}\times\big(-\gamma\,\bb{H}_\text{ext}+KS \,\bb{m_z} + \Delta_{\text{sd}}\,\bb{s}\big)
\end{equation}$$</div>

and the following for an antiferromagnet

<div>$$\begin{align}
\hbar \partial_t \bb{n} = &  -2SJ_\text{ex}\, \bb{n}\!\times\!\bb{m} \notag\\
     &  + KS \big(\bb{m}\!\times\!\bb{n}_\perp+\bb{n}\times\bb{m}_\perp\big) 
	+ \Delta_\text{sd} \big(\bb{m}\times\bb{s}^-+\bb{n}\times\bb{s}^+) -\gamma\bb{n}\times\bb{H}_\text{ext},\label{eq:sd:mag}\\
\hbar \partial_t \bb{m} = & KS  \big(\bb{n}\!\times\!\bb{n}_\perp+\bb{m}\times\bb{m}_\perp\big) 
	+ \Delta_\text{sd} \big(\bb{m}\times\bb{s}^++\bb{n}\times\bb{s}^-)-\gamma \bb{m}\times\bb{H}_\text{ext}.
	\label{eq:sd:neel}
\end{align}$$</div>

Here we introduced the notation `$\Delta_\text{sd} = J_\text{sd}\mathcal{A}$`. 

Note that the mean-field approximation in Eq.(\ref{eq:meanfield}) is not necessary to obtain Eqs.(\ref{eq:sd:mag}, \ref{eq:sd:neel}). The same equations of motion can be obtained by first using Heisenberg's equations of motion `$i \hbar\partial_t \hat{S}_\alpha = [H,\hat{S}_\alpha]$` (where `$\alpha=x,y,z$`) and the commutation relations for spin-operators `$[\hat{S}_x, \hat{S}_y]=i\hat{S}_z$` on Eq.(\ref{intro:eq:Hm}), and then taking the classical limit `$\hat{\bb{S}}\rightarrow \bb{S}$`. 

Note that the minus in front of the definitions of `$\bb{n}$` and `$\bb{m}$` are there because the magnetic moment of electrons are directed in opposite direction of their spin angular moment. Furthermore, although we use the same notation `$\bb{m}$` for the magnetization in a ferro and anti-ferromagnet, it is only a unit-vector in the former case and not the latter. 

## Spin-torques in ferro- and antiferromagnets
The dynamics of the magnetization vector in ferromagnets and antiferromagnets are determined by spin-torques. In order to compute a spin-torque, all we need to do is compute the spin-density of the conducting electrons, which is done using linear response theory (see the next section).  

These torques can be divided into two groups: field-like and damping-like. For antiferromagnets each group can be further subdivided into two: staggered and non-staggered. In a two-dimensional ferromagnet with spin-orbit of Rashba type, the equations of motion are often written phenomenologically as

<div>$$\begin{equation}
    \partial_t \bb{m} = c_1 \bb{m}\times (\hat{\bb{z}}\times\bb{j}) + c_2 \bb{m}\times\big(\bb{m}\times (\hat{\bb{z}}\times{j})\big) + \alpha \bb{m}\times \partial_t \bb{m},
    \label{eq:sd:ferro}
\end{equation}$$</div>

where the terms proportional to `$c_1$` and `$c_2$` are torques that are induced by injecting an electric current `$\bb{j}$` and the term proportional to `$\alpha$` describes the rate of dissipation of angular momentum and is called Gilbert damping. Gilbert damping is discussed in more detail in the next Section. The field-like and damping-like torques can be identified as those that are respectively even and odd under time-reversal (i.e. changing the signs of `$\bb{m}$`, `$\bb{j}$` and `$t$`). Note that the spin of the conducting electrons must be odd in time-reversal, so that applying time-reversal on both the magnetic subsystem and the tight-binding model, one will find that the coefficients `$c_1$` and `$c_3$` are even, while `$c_2$` must be odd under total time-reversal. Note that by symmetry we must have that `$c_1$` and `$\alpha$` are even in scattering time, while `$c_2$` is odd in scattering time. In the literature dealing with microscopic theory there is a substantial lack of damping-like torques. The reason is that is it not easy to make `$c_2$` odd in scattering time. Since the current density `$\bb{j}$` is already linear in scattering time, one either needs to go beyond linear response or find less trivial mechanisms for the relaxation of angular momentum. For example in {{< cite "Sumit2019" >}} we show that a damping-like torque appears when the Fermi surface becomes anisotropic. 

Distinguishing between field-like and damping-like torques helps us understand more the dynamics of `$\bb{n}$`. For example, if the damping-like torques are absent one will only observe a simple precession of the magnetization vector around `$\hat{\bb{z}}\times\bb{j}$`. Damping-like torques allow for the dissipation of angular momentum so that over time the magnetization vector will be parallel to `$\hat{\bb{z}}\times\bb{j}$`. The dynamics induced by both field-like and damping-like torques are illustrated in [Figure 1]({{< ref "#fig1" >}}). Note that we can change the sign of the damping-like torque by changing the direction of the electric current. If this current-induced damping-like torque overcomes the Gilbert damping one can even reverse the magnetization direction. In such a way one can construct a magnetic memory that stores a "0" or a "1" corresponding to two magnetization directions. This type of switching is illustrated in [Figure 2]({{< ref "#fig2" >}}). The switching rate is determined by the strength of the damping-like torque which is proportional to Rashba spin-orbit coupling and by the strength of magneto-crystalline anisotropy. It is then no surprise that putting a magnetic layer on top of a heavy metal will enhance its magnetic switching abilities. 

In an antiferromagnet we are more interested in the dynamics of the staggered magnetization `$\bb{n}$`. A phenomenological equation such as Eq.(\ref{eq:sd:ferro}) can quickly contain ten terms for a antiferromagnet and the dynamics therefore is far more complicated. However, few points can still be made. As can be seen in Eq.(\ref{eq:sd:neel}), in the absence of conducting electrons and external field, a finite magnetization `$\bb{m}$` is enough to induce a precession of `$\bb{n}$`, typically already in the THz regime (as opposed to the much slower GHz dynamics found in ferromagnets), as the dynamics is driven by the exchange interaction `$J_\text{ex}$`. In order to produce a switching of the Néel vector direction one can use both a field-like torque produced by a staggered spin-polarization and an anti-damping torque produced by a staggered spin-polarization {{< cite "fjaerbu_electrically_2017;cheng_terahertz_2016;khymyn_antiferromagnetic_2017" >}}.

### {#fig1}
{{< figure src="/images/llg.svg" position="center" caption="Figure 1. Precession of magnetization due to field-like torques (a) and relaxation due to damping-like torques (b).">}}

### {#fig2}
{{< figure src="/images/switch_ferro (2).svg" caption="Figure 2. Switching behavior for a Rashba ferromagnet, subject to alternating current pulses. Gray areas correspond to a constant current flowing in the direction of `$\pm\hat{x}$`, where the sign alternates between each successive box. In the white area the current is switched off. The graph corresponds to numerically solving Eq.(\ref{eq:sd:ferro}) with values `$c_1=0.2$`, `$j=|\bb{j}|=1$` and `$\alpha=0.1$`. In the top panel we choose a value of `$c_2=0.25$` corresponding to a current overcoming the Gilbert damping making switching possible. In the bottom panel we choose a value of `$c_2=0.05$` which corresponds to the opposite case: an insufficiently strong current and therefore no switching. A magneto-crystalline anisotropy term `$-K \bb{n}\times\bb{n_y}$` with `$K=1$` was included in Eq.(\ref{eq:sd:ferro}).">}}
<!-- \begin{figure}
    \centering
    \includegraphics[width=0.95\textwidth]{gfx/switch_ferro}
    \caption{Switching behavior for a Rashba ferromagnet, subject to alternating current pulses. Gray areas correspond to a constant current flowing in the direction of `$\pm\hat{x}$`, where the sign alternates between each successive box. In the white area the current is switched off. The graph corresponds to numerically solving Eq.(\ref{eq:sd:ferro}) with values `$c_1=0.2$`, `$j=|\bb{j}|=1$` and `$\alpha=0.1$`. In the top panel we choose a value of `$c_2=0.25$` corresponding to a current overcoming the Gilbert damping making switching possible. In the bottom panel we choose a value of `$c_2=0.05$` which corresponds to the opposite case: an insufficiently strong current and therefore no switching. A magneto-crystalline anisotropy term `$-K \bb{n}\times\bb{n_y}$` with `$K=1$` was included in Eq.(\ref{eq:sd:ferro}).} 
    \label{fig:switching_ferro}
\end{figure} -->

## The relation between Gilbert Damping and spin-life time of conducting spins
Gilbert damping describes the relaxation of localized-spins. In the `$s$`--`$d$` model this angular momentum is transferred to the lattice through conducting electrons. We make therefore two statements. (i) Gilbert damping should be proportional to the ratio of spin-lifetime and momentum-lifetime of the conducting electrons. And (ii) Gilbert damping should be proportional to the electric conductivity (at least for low temperatures). With these two statements in mind, we find the following proportionality for Gilbert damping

<div>$$\begin{equation}
	\alpha \propto \sigma \times \Delta_{\text{sd}} \frac{\tau_s}{\tau} \propto \Delta_{\text{sd}}\tau_s,
\end{equation}$$</div>

with conductivity `$\sigma$`, and spin and momentum lifetime of conducting electrons `$\tau_s$` and `$\tau$` respectively. On the right-hand side of above equation we used that the conductivity is proportional to the metal parameter `$\varepsilon\tau$`.  

The relaxation of the spin of the conducting electrons can be phenomenologically described by the effect of a randomly fluctuating field that the electrons experience. When electrons move through an asymmetric potential, they experience a momentum-dependent magnetic field that leads to the spin-splitting of the conduction band. In a disordered system, every time the electron scatters it changes its direction and consequently the magnetic field they experience changes its direction as well. 

In the presence of the spin-orbit field, the spin of the electron will precess around the direction of that field with a certain frequency `$\Omega_s$`. We can then distinguish two cases: (i) `$\Omega_s \tau < 1$` where between each scattering event the spin does not have enough time to deviate from its initial spin direction in a significant manner, and (ii) `$\Omega_s\tau>1$` where the electron spin can precess freely between each collision. We will soon see that both cases lead to a different spin-relaxation

<div>$$\begin{equation}
	1/\tau_s \sim \begin{cases}
    	\langle \Omega^2_s\tau\rangle & \quad\text{for  } \Omega_s\tau < 1\\
        1/\tau  &\quad \text{for  }  \Omega_s\tau>1,
    \end{cases}
\end{equation}$$</div>

where `$\langle\cdots\rangle$` denotes momentum averaging. 

Both cases can be understood as follows. In a time-scale set by `$\Omega_s$` we find that in the first case the electron experiences many scattering events. Due to the random motion involved, the electrons experience as if moving through a randomly changing magnetic field and as such lose their spin-orientation in a diffusive manner. Each scattering event gives a contribution of `$(\Omega_s\tau)^2$` to the total mean squared precession deviation, and the spin-life time may be defined as the time needed for the squared precession deviation to be of the order of unity, i.e. `$1\tau_s\sim \Omega_s^2\tau$` {{< cite "dyakonov_spintronics_2004;dyakonov_spin_2017" >}}. 

Furthermore, because the electrons are confined in two-dimensions the random spin-orbit field is always directed in-plane, which leads to a decrease in the in-plane spin-relaxation rate by a factor of two compared to the out-of-plane spin-relaxation rate as demonstrated first in Ref. {{< cite "DYAKONOV1986" >}} (see Refs. {{< cite "aronov_spin_1983;averkiev_spin_2002;burkov_theory_2004;dyakonov_spin_2017" >}} as well).  The reason is that the perpendicular-to-the-plane component is influenced by two components of the randomly changing magnetic field, i.e. `$x$` and `$y$`, whereas the parallel-to-the-plane components only by one component, i.e. `$x$` is influenced by `$y$` and vice-versa.  

In the second case on the other hand, the spin can freely rotate around the magnetic field between each collision and this orientation is only lost on the same time scale as momentum is lost, i.e. on the time scale of `$\tau$` {{< cite "aronov_spin_1983;dyakonov_spintronics_2004" >}}, leading to `$1/\tau_s \sim 1/\tau$`.

In general when the change in spin-direction is modelled as arising \emph{between} collisions it is referred to as Dyakonov-Perel-relaxation {{< cite "dyakonov1972spin;DYAKONOV1986" >}}, while if it is modelled as arising \emph{during} collisions it is referred to as Elliot-Yafet {{< cite "elliott_theory_1954;yafet_g_1963" >}}. It should be noted that Elliot-Yafet generally leads to a spin-relaxation of the form `$1/\tau_s\sim1/\tau$` just as the Dyakonov-Perel case for `$\Omega_s\tau>1$`. 

## Antiferromagnetic resonance
One of the characteristics of an antiferromagnet is that its antiferromagnetic resonance frequency (i.e. when subjected to an oscillating external magnetic field) is proportional to `$\sqrt{K}$`, as given by the formula:

<div>$$\begin{equation}
    \omega = \gamma_0 H_\text{ext} \pm \sqrt{K(J_\text{ex}+K)}
\end{equation}$$</div>

as first derived by Kittel {{< cite "PhysRev.82.565;PhysRev.85.329" >}}. The original derivation made use of quadruple contributions to `$H_\text{M}$`, but for two dimensional systems, a Hamiltonian such as in Eq.(\ref{intro:eq:Hm}) is sufficient as we will demonstrate. In this section we do not consider `$\Delta_\text{sd}$`. In order to find the resonant frequencies in the system that is subjected to an oscillating field in the `$z$` direction: `$\bb{H}_\text{ext} = H_0 \cos \omega t\,\hat{\bb{z}}$`, we first linearize the equations of motion by expanding `$\bb{n}$` close to `$\hat{\bb{z}}$` and assume `$\bb{m}$` to be small. To be more explicit

<div>$$\begin{equation}
	\bb{n} \rightarrow \hat{\bb{z}} + \delta \bb{n}_\parallel,\quad \bb{m} \rightarrow \delta \bb{m}_\parallel.
\end{equation}$$</div>

Note that to first order the staggered and non-staggered magnetizations are still orthogonal to each-other: `$\bb{n}\cdot\bb{m}=1+\mathcal{O}(\delta n^2+\delta m^2)$`. Components such as `$\delta n_x \delta m_y$` can be then disregarded and we assume `$\bb{n}$` and `$\bb{m}$` to be proportional to `$\exp i \omega t$`. A nice basis to work in is `$\{{n}_+,{m}_+,{n}_-,{m}_- \}$`, (where `${n}_\pm = \delta n_x\pm i \delta n_y$` and `${m}_\pm = \delta m_x\pm i \delta m_y$`) so that one finds the following matrix equation:

<div>$$\begin{equation}
    \begin{pmatrix}
    \omega_0  &  -(J_\text{ex}+K)  &  0  &  0 \\
    -K  &  \omega_0  &  0  &  0 \\
    0  &  0  &  -\omega_0  &  J_\text{ex}+K \\
    0  &  0  &  K  &  -\omega_0
    \end{pmatrix}
    \begin{pmatrix}
    \delta l_{+}\\
    \delta m_{+}\\
    \delta l_{+}\\
    \delta m_{-}
    \end{pmatrix}
    =\omega 
    \begin{pmatrix}
    \delta l_{+}\\
    \delta m_{+}\\
    \delta l_{+}\\
    \delta m_{-}
    \end{pmatrix}
\end{equation}$$</div>

and four corresponding frequencies `$\omega_{\eta',\eta''}$`  

<div>$$\begin{align}
    \omega_{\eta',\eta{''}} = \eta' \gamma_0 H_\text{ext} +\eta'' \sqrt{K(J_\text{ex}+K)}, \quad \eta',\eta{''}=\pm1
\end{align}$$</div>

which remarkably exists even in absence of an external magnetic field. The constant `$K$` can be derived directly for a particular model from the Grand potential describing the conducting electrons. The Grand potential is given by

<div>$$\begin{equation}
    \Omega = - \sum_{\varsigma}\frac{1}{\beta} \int \mathrm{d}\varepsilon\,g(\varepsilon) \nu_\varsigma(\varepsilon),
    \label{b1}
\end{equation}$$</div>

where the density of states `$\nu_\varsigma$` and the function `$g(\varepsilon)$` are given by

<div>$$\begin{align}
    \nu_\varsigma(\varepsilon) =  &  \frac{1}{\pi} \tr \int \frac{\mathrm{d}^2p}{(2\pi\hbar)^2}\,\im G^\text{R}_{\varsigma,\bb{p}}\\
    g(\varepsilon) =  &  \log \big(1+\exp[\beta(\mu-\varepsilon)]\big).
\end{align}$$</div>


Here `$\beta$` is the inverse temperature, `$\mu$` is the chemical potential, and `$\varsigma$` denotes the band index. By evaluating the integral and expanding around the energy minimum in powers of magnetization, one can obtain the anisotropy constant `$K$`. An example of how this is done can be found in {{< cite "sokolewicz2020spintronics" 111 >}}.

## Obtaining out-of-equilibrium spin-polarizations
The spin-polarizations of the conducting electrons that appear in the equations of motion for the ferromagnet Eq.(\ref{eq:sd:mag}) and for the antiferromagnet Eqs.(\ref{eq:sd:neel}) are obtained in linear response to current and time-derivatives of magnetizations.

We can write the linear response of a spin-polarization `$s_\alpha$` to a perturbation `$H'$` as

<div>$$\begin{equation}
	s_\alpha = v^2\mathcal{A}\int\!\frac{d^2\bb{p}}{(2\pi\hbar)^2}\tr \langle \hat{s}_\alpha G^\text{R}_{\bb{p}} \frac{\partial H'}{\partial t} G^\text{A}_{\bb{p}}\rangle,
\label{sd:eq:kubo2}
\end{equation}$$</div>

with momentum `$\bb{p}$`, Fermi-velocity `$v$`, unit cell area `$\mathcal{A}$`, retarded (advanced) Green's functions `$G^\text{R(A)}_{\bb{p}}$` and operator trace `$\tr$`. The angular brackets `$\langle\dots\rangle$` denote averaging over disorder samples. Eq.(\ref{sd:eq:kubo2}) is called the Kubo formula that we derive from a Keldysh framework in {{< titleref "4_kubo.md" >}} and is often at the basis of linear response theory. It is in fact one expression of the more general fluctuation-dissipation theorem {{< cite "Kubo_1966" >}}. This theorem equates the response of a system to an external force or perturbation to the fluctuations of the system in absence of that force or perturbation. In other words, the left hand side of Eq.(\ref{sd:eq:kubo2}) denotes an out-of-equilibrium quantity which is related to a correlator on the right hand side that is evaluated in equilibrium. 

The perturbations, or forces, that we consider are (i) electric fields that drive electrons and (ii) changes in magnetization direction. By expressing the electric field in terms of current through the conductivity tensor (which is again obtained through a Kubo formula), we obtain the out-of-equilibrium spin-polarization produced by an electric current. This in turn defines the current-induced spin-orbit torque. The second response, describes how the electrons' spin respond to a change in the electronic spectrum (by varying the magnetization direction) and gives rise to spin-renormalizations and Gilbert damping. 

As mentioned before we model the relaxation of both spin and orbital angular momentum of conduction electrons through the scattering of impurities. For convenience we choose a white-noise Gaussian disorder potential

<div>$$\begin{equation}
    \label{disorder}
\langle V(\bb{r})\rangle =0,\quad \langle V(\bb{r}) V(\bb{r}') \rangle = \frac{\hbar}{\pi\nu\tau}\,\delta(\bb{r}-\bb{r}'),
\end{equation}$$</div>

where the angular brackets `$\langle\cdots\rangle$` stand for the averaging over an ensemble of disordered systems, `$\nu$` stands for the total density of states at the Fermi level and `$\tau$` is the mean scattering time of the conducting electrons. In this Thesis we use a dimensionless parameter `$\alpha$`

<div>$$\begin{equation}
     2 \pi\alpha (\hbar v)^2 = \frac{\hbar}{\pi\nu\tau}
\end{equation}$$</div>

that parametrizes the amount of disorder in the system. In low concentration of impurities, which we refer to as the clean metal limit, we have `$\alpha\rightarrow0$`. 

In order to incorporate the effect of disorder, two important steps must be performed. Firstly, we replace the clean Green functions in the linear response formula, with disordered ones. Secondly we replace one of the vertices with one that is corrected with disorder-averaging.

In order to replace the bare Green function with a disordered one, one needs to include a self-energy. This self-energy gives rise to the finite momentum-life-time of the electron and restores translational invariance.  In low concentration of impurities (i.e. `$\alpha\rightarrow0$`) and neglecting contributions from rare-scattering events (such as multiple scattering off the same impurity), one can use the Born approximation

<div>$$\begin{equation}
    \im \Sigma^\text{R(A)} = 2\pi\alpha \im \int \frac{\mathrm{d}\bb{p}}{(2\pi\hbar)^2}\,G^\text{0 R(A)}_{\vec{p},\varepsilon}.
    \label{sd:eq:sigma}
\end{equation}$$</div>

By inserting the self energy into a bare Green function we get the disorder-averaged Green's function

<div>$$\begin{equation}
	G^\text{R(A)}_{\bb{p}} = \frac{1}{\varepsilon-H_{\bb{p}}-\Sigma^\text{R(A)}}.
\end{equation}$$</div>

The self-energy determines the poles of the Green's function in the complex energy plane and are equal to the roots of `$\det[\varepsilon-H-\Sigma^\text{R(A)}]$`. For a given momentum the real part of each pole correspond to a point on a different Fermi surface, while the imaginary part defines the decay of the momentum eigenstates. In other words, the imaginary part gives rise to a finite momentum lifetime. This can be seen by taking the Fourier-transform from energy domain to the time domain where the imaginary part of the pole leads to an exponential decay in time for the Retarded Green's function. To give an explicit example, take the Fourier transform with respect to energy of a Green's function belonging to a single particle and single orbital 

<div>$$\begin{equation}
	G^\text{R}(t) = \int\\!\frac{\mathrm{d}\varepsilon}{2\pi\hbar} \exp(-i \varepsilon t)\times\underbrace{\frac{1}{\varepsilon-\varepsilon_1+i\varepsilon_2}}_{G^\text{R}(\varepsilon)} = -i\Theta(t)\exp(-i\varepsilon_1t)\exp(-\varepsilon_2 t), 
\end{equation}$$</div>

where `$\Theta$` is the Heaviside step function and `$\varepsilon_{1,2}$` are the real and imaginary parts of the the complex energy pole. The temporal Green function decays in time one a time scale set by `$\varepsilon_2$`. The momentum life-time is defined as `$\tau = 1/2\varepsilon_2$` and is equal to the transport time in the Born approximation for isotropic scattering that we consider {{< cite "rammer_quantum_1986" >}}. The transport-time reflects the time needed to randomize the direction of an electron due to impurity scatterings. Note that in Eq.(\ref{sd:eq:sigma}) we generally do not explicitly consider the real part of the self-energy as the shift in spectrum can be absorbed into the definition of model parameters. For brevity, we use the same symbols for terms such as Fermi energy and `$s$`--`$d$` energy before and after the Born approximation, but one needs to keep in mind that in the latter case they correspond to renormalized quantities. 

For the second step in disorder averaging, we need to replace one of the vertex functions with one that is corrected for disorder in the ladder approximation (as illustrated in [Figure 3b]({{< ref "#fig3" >}}). We call this new vertex function the vertex-corrected function. 
By denoting `$\hat{s}^{\text{vc}}$` as the vertex-corrected function of `$\hat{s}$` and `$\hat{s}^{(i)}$` as the function containing `$i$` disorder-lines, the ladder approximation is given by:

<div>$$\begin{align}
    \hat{s}^\text{vc}
       & =           
        \hat{s}+\hat{s}^{(1)}+\hat{s}^{(2)}+\cdots,
        \label{sd:eq:ladder}
\end{align}$$</div>

where `$\hat{s}^{(i)}$` is given by:

<div>$$\begin{align}
    \hat{\chi}^\text{i} = 2\pi\alpha\int\frac{\mathrm{d}^2\bb{p}}{(2\pi\hbar)^2} G_{\bb{p}}^\text{R}\hat{s}^{(i-1)}G_{\bb{p}}^\text{A}
    \label{eq:onedisorderline}
\end{align}$$</div>

### {#fig3}
{{< figure src="/images/bubble1.svg" position="center" caption="Figure 3. Diagrammatic illustration. a) Disorder-averaged polarization bubble. b) Ladder-approximation." >}}
<!-- \begin{figure}
    \centering
    \includegraphics{gfx/bubble1.pdf}
    \caption{Diagrammatic illustration. a) Disorder-averaged polarization bubble. b) Ladder-approximation. }
    \label{sd:fig:diagrams}
\end{figure} -->
This vertex-correction is important as a single scattering event already modifies the spin-polarization. For example in {{< cite "sokolewicz2019spin1" >}} we show that vertex-corrections lead to an unusual and novel torque that we call a diffusive spin-orbit torque. Another example is found in {{< cite "baglai2020giant" >}} where disorder averaging can lead to an increase in Gilbert Damping by many orders of magnitude. 

The infinite sum of Eq.(\ref{sd:eq:ladder}) can actually be recast into a geometrical sum involving matrices. By choosing an appropriate operator basis, `$\{\hat{B}_i\}$`, where `$i=1,2,\dots,n^2$` with `$n\times n$` the dimension of the operator space, the vector of vertex corrected basis elements `$\bb{B}^\text{vc}\equiv(\hat{B}_1^\text{vc},\dots,\hat{B}_{{n^2}}^\text{vc})$` can written as

<div>$$\begin{equation}
	\bb{B}^\text{vc} = \bb{B}+\mathcal{F}\bb{B}+\mathcal{F}^2\bb{B}+\mathcal{F}^3+\cdots = \frac{1}{1-\mathcal{F}}\bb{B}.
\end{equation}$$</div>

By choosing a basis that satisfies the normalization condition `$\tr\bb{B}_i\bb{B}_j=n\delta_{ij}$` we find that the response matrix `$\mathcal{F}$` has the following form

<div>$$\begin{equation}
	\mathcal{F}_{ij} = \frac{2\pi\alpha}{n} \int\!\frac{d^2\bb{p}}{(2\pi\hbar)^2}\tr \hat{B}_i G^\text{R}_{\bb{p}} \hat{B}_j G^\text{A}_{\bb{p}}.
\end{equation}$$</div>

For a Dirac ferromagnet, the operators that we consider only depend on spin-degrees of freedom and therefore the response-matrix has dimension `$(2\times2)^2=4\times4$`. The Dirac antiferromagnets, however have spin, sublattice and valley degrees of freedom, leading to response-matrices of dimension `$(2^3\times2^3)^2=64\times64$`. Inverting such a matrix analytically can be a daunting task, but can be simplified dramatically by choosing an appropriate basis and working in certain limits. 

Note that the inversion of `$1-\mathcal{F}$` can only be performed if none of the eigenvalues of `$\mathcal{F}$` is equal to `$1$`. It appears however that this is never the case, as the self energy expressed in the basis `$\{\hat{B}_i\}$` is an eigen function of `$\mathcal{F}$` with eigenvalue `$1$`

<div>$$\begin{equation}
	2\pi\alpha\int\!\frac{\mathrm{d}\bb{p}}{(2\pi\hbar)^2} G^\text{R}_{\bb{p}}\Sigma^\text{R(A)}G^\text{A}_{\bb{p}} = \Sigma^\text{R(A)}.
\end{equation}$$</div>

By computing the response tensor at finite frequency `$\omega$` and momentum `$\bb{q}$`, we find that each singularity found in `$(1-\mathcal{F})^{-1}$` is proportional to the Diffuson `$D_0(\omega,\bb{q})$` given by

<div>$$\begin{equation}
    D_0(\omega,\bb{q}) = \frac{1}{-i\omega+D q^2},
\end{equation}$$</div>

that has a diffusion pole at `$\omega = -i D q^2$`, where `$D$` is the diffusion constant. Note that the Diffuson in general appears in the density-density response function and describes diffusion, i.e. Brownian motion {{< cite "rammer_quantum_1986" >}}. The singularity that appears when the limits `$\omega\rightarrow0$` and `$\bb{q}\rightarrow\bb{0}$` are taken, however, plays no role in the dynamics of magnetizations in most cases. For a Rashba ferromagnet {{< cite "ado_microscopic_2017" >}} for example, the singularity appears in the spin-density only in the direction of the magnetization and due to the vector product involved, does not contribute to any spin torque. In other words, none of the spin-torques have a singular dependency on `$\omega$` and `$\bb{q}$`. However, in {{< cite "sokolewicz2019spin1" >}} we show that for a Dirac ferromagnet, spin-torques do contains a diffusion pole and are therefore singular in the limits `$\omega\rightarrow0$` and `$\bb{q}\rightarrow\bb{0}$`.

For the Dirac antiferromagnet that is discussed in {{< cite "baglai2020giant" >}}, we again find that the spin-densities contain diffusion poles, but they do not play a role on the equations of motion of the average and staggered magnetizations `$\bb{m}$` and `$\bb{n}$`. It remains an open question what systems, apart from the Dirac ferromagnet, diffusion poles could play an important role. 

## Bibliography
{{< bibliography cited >}}