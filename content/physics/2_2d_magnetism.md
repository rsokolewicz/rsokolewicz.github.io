+++
title = "Magnetism in two dimensions"
date = "2022-12-31"
author = "Robert"
mathjax = true
bibFile = "data/biblio2.json"
description = "In recent years a promising opportunity appeared that can push spintronic devices to a two-dimensional limit. Eliminating one dimension has the practical benefit of reducing the size and energy consumption of spintronic devices."
+++

# Magnetism in two-dimensional materials
In recent years a promising opportunity appeared that can push spintronic devices to a two-dimensional limit. Eliminating one dimension has the practical benefit of reducing the size and energy consumption of spintronic devices. Two-dimensional materials can in addition be tuned by gates and dopants. Two dimensional magnetism on the other hand has favorable properties such as larger magnetic domains, larger magnetic moment per atom and in general large directional magneto-crystalline anisotropy {{< cite "sethulakshmi_magnetism_2019;zhang_van_2019" >}}.

It is important to stress that this anisotropy is important not because it is beneficial for storing magnetic data, but because without it the magnetic order (ferromagnetic or antiferromagnetic) cannot exist. This is an important consequence of the Mermin-Wagner theorem {{< cite "mermin_absence_1966">}}, that states that in a truly isotropic two-dimensional system a long-range magnetic order (ferromagnetic or antiferromagnetic) cannot exist at any finite temperature: any, whatever small, thermal excitation gives rise to large magnonic fluctuations strong enough to destroy any magnetic ordering. A magneto-crystalline anisotropy however circumvents this theorem as it opens up a magnonic excitation gap, giving rise to finite Curie/Néel temperatures below which a ferromagnetic/antiferromagnetic ordering exists. 

The first two-dimensional crystal, graphene {{< cite "katsnelson_graphene_2007;guinea_energy_2010;katsnelson_graphene_2013">}}, was first discovered in 2004 {{< cite "novoselov_electric_2004;novoselov_two-dimensional_2005">}}. A popular technique to produce a single layer of graphene is by exfoliating graphite. Here the different layers in graphite are held together by weak van-der-Waals forces. The same technique has led to the discovery of a multitude of new two-dimensional materials. Collectively, these materials are called van-der-Waals materials. These materials are often grouped in four distinct groups {{< cite "sethulakshmi_magnetism_2019;tsymbal_spintronics_2019;liu_chapter_2020">}}:

1. graphene based
2. 2D chalcogenides {{< cite "yang_long-lived_2015;chhowalla_chemistry_2013;wang_electronics_2012-1;ugeda_characterization_2016;zhang_direct_2013;ma_evidence_2012;butler_progress_2013;zeng_valley_2012;xiao_coupled_2012;mak_atomically_2010;radisavljevic_single-layer_2011">}}
3. 2D halides {{< cite "leng_molecularly_2018;dou_atomically_2015;sachs_ferromagnetic_2013;zhang_two-dimensional_2019;spanopoulos_uniaxial_2019">}}
4. 2D oxides {{< cite "ad4f81a986ab409fba05d562d4799cbc;wang_electrolytic_2018;yao_ferrimagnetism_2020;yang_formation_2019;kalantar-zadeh_two_2016">}}.

The first category consists of materials that are a derivative of graphene --- such as fluorated graphene {{< cite "feng_two-dimensional_2016;nair_fluorographene_2010">}} --- and materials that have a similar hexagonal crystal structure -- such as hexagonal boron nitride {{< cite "zhang_two_2017">}}. The group of 2D chalcogenides consists of crystals containing at least one chalgenide atom (e.g. S, Se, Te). A commonly studied subgroup are the transition metal dichalcogenides (TMDs), whose crystal formula is given by MX`$_2$`. Here M is a transition metal (e.g. Mo, W) and X is a chalcogenide. The third group, 2D halides, contain crystals following a similar formula as the TMDs, e.g. MX`$_2$` and MX`$_3$`, but with X being a halogen (e.g. Cl, Br, I). The magnetic moments in most of these crystals are strongly located on the metal atoms in a honeycomb array {{< cite "chittari_carrier-_2020">}}. The last group of 2D oxides ranges from simple crystals (e.g. ZnO) to more complex (e.g. Na`$_2$`Co`$_2$`TeO`$_6$`). Some examples of crystals in the last three groups are presented in [Table 1]({{< ref "#table1" >}}).

# {#table1}
&nbsp;  | Ferromagnetic | antiferromagnetic 
--|---------------|-------------------------
(ii) *2D chalgenides* | MoS`$_2$`, MoSe`$_2$`, VSe`$_2$`, MnSe`$_2$`, Fe`$_3$`GeTe`$_2$`, Cr`$_2$`Ge`$_2$`Te`$_2$`, Cr`$_2$`Si`$_2$`Te`$_6$`,CrGeTe`$_3$` | FePS`$_3$`, FePSe`$_3$`, MnPS`$_3$`,  MnPSe`$_3$`, NiPS`$_3$`, NiPSe`$_3$`, AgVP`$_2$`S`$_6$`, AgVP`$_2$`Se`$_6$`,  CrSe`$_2$`, CrTe`$_3$`, CrSiTe`$_3$`
(iii) *2D halides* | CrI`$_3$` (single layer), CrBr`$_3$`, CoBr`$_3$` GdI`$_2$`, K`$_2$`CuF`$_4$` | CrI`$_3$` (bi-layer), FeCl`$_2$`, CoCl`$_2$`,  NiCl`$_2$`, VCl`$_2$`, CrCl`$_3$`, FeCl`$_3$`,  FeBr`$_2$`,   MnBr`$_2$`, CoBr`$_2$`, VBr`$_2$`,  FeBr`$_3$`, FeI`$_2$`, VI`$_2$`, CrOCl,  CrOBr, CrSBr
(iv) *2D oxides* | ZnO, MnO`$_2$`, `$\delta$`-FeOOH  |  Na`$_2$`Co`$_2$`TeO`$_6$`, Ni(OH)`$_2$`

{{< caption >}}
Table 1. Brief overview of various experimentally realized (anti)ferromagnetic van-der-Waals crystals {{< cite "sethulakshmi_magnetism_2019;tsymbal_spintronics_2019;liu_chapter_2020">}}. The group of graphene based materials are non-magnetic and not shown in this Table.
{{< /caption >}}



The groups of two-dimensional chalgonides and halides are currently a popular topic of investigation as they provide access to many physical properties not found in other two-dimensional materials. The electronic properties, e.g. bandgap, of these crystals are highly tunable to doping, strain, and chemical composition. Furthermore, a large variety of magnetic phases are also found among these materials (see [Figure 1]({{< ref "#magnetic_phases" >}})).

## {#magnetic_phases}
{{< figure src="/images/phases.svg" caption="Figure 1. Four magnetic phases commonly found among van-der-Waals magnets.">}}

Apart from the crystals in [Table 1]({{< ref "#table1" >}}), there is also a large amount of two-dimensional crystals that are neither ferro- or antiferromagnetic. The possibility to induce (anti)ferromagnetism in such a crystal is attractive as it gives access to even a wider range of material parameters. In general one can undertake three ways: 

1. doping and defects {{< cite "gonzalez-herrero_atomic-scale_2016;han_perspectives_2016;ugeda_missing_2010;han_graphene_2014;boukhvalov_sp-electron_2011;boukhvalov_hydrogen_2008;nair_dual_2013">}}; 
2. magnetic proximity {{< cite "gonzalez-herrero_atomic-scale_2016;han_perspectives_2016;ugeda_missing_2010;han_graphene_2014">}}; 
3. strain engineering {{< cite "shen_strain_2016;chittari_carrier-_2020" >}}.

The first is by chemically doping the crystal with `$d$` or `$f$` elements (e.g. Mn, Eu, Cr) or by introducing defects. For example, by doping GaAs with Mn atoms, exchange is introduced between local and delocalized spins giving rise to ferromagnetism {{<  cite "dietl_dilute_2014">}}. Selectively introducing defects on only one sublattice in graphene can also induce weak ferromagnetism -- a consequence of Lieb's theorem {{< cite "lieb_two_1989;lieb_two_1989-1">}}. The second approach is by bringing the crystal in vicinity with a (anti)ferromagnetic material. For example one can deposit graphene on top of an insulating ferromagnet such as YIG or EuS to create ferromagnetic graphene {{< cite "wang_proximity-induced_2015;leutenantsmeyer_proximity_2016">}}. The third approach makes use of the fact that electronic properties change by means of strain. A compressive strain of `$\sim1\\%$` in FeSiS`$_3$` is predicted {{< cite "chittari_carrier-_2020">}} to transition it from a ferromagnetic ground state to a antiferromagnetic ground state. 

Other properties such as spin-orbit coupling {{< cite "soumyanarayanan_emergent_2016;liu_spin-torque_2011">}} and magnetocrystalline anisotropy {{< cite "soumyanarayanan_emergent_2016;dieny_perpendicular_2017">}} can be tuned or induced as well by placing a magnetic layer on top of a heavy metal layer such as Pt, Ta or W {{< cite "hellman_interface-induced_2017">}}. As an example, recently strong current induced spin-orbit torques were measured in a bilayer consisting of Fe`$_3$`GeTe`$_2$` and Pt {{< cite "wang_current-driven_2019">}}. 

## Dirac ferro- and antiferromagnets
In my PhD Thesis I investigated the role of conducting electrons in assisting in the manipulation and relaxation of magnetic moments in ferro- and antiferromagnets. Specifically, we study two-dimensional ferro- and antiferromagnets where the conducting electrons have a linear energy dispersion. Such electrons are called Dirac fermions and the system as a whole is referred to as either a Dirac ferro- or antiferromagnet. 

Dirac fermions were first found in graphene {{< cite "novoselov_electric_2004;novoselov_two-dimensional_2005-1;novoselov_two-dimensional_2005">}} and soon after in topological insulators {{< cite "hasan_colloquium_2010;konig_quantum_2008;qi_quantum_2009;cayssol_introduction_2013" >}}. The Dirac ferromagnet that I studied in {{< cite "sokolewicz2019spin1" >}} is inspired by a bilayer consisting of a topological insulator and a ferromagnetic insulator. The model can be directly used to describe for example a bilayer consisting of Bi`$_2$`Te`$_3$` or Bi`$_2$`Se`$_3$` and YIG or EuS. 

In my PhD work a particular antiferromagnet is studied on a honeycomb lattice. Although most of the antiferromagnets presented in [Table 1]({{< ref "#table1" >}}) have a honeycomb lattice, the majority are unfortunately non-metallic, or are not in the Néel antiferromagnetic phase (illustrated in [Figure 1b]({{< ref "#magnetic_phases" >}})). Recent DFT calculations {{< cite "chittari_carrier-_2020">}} predict however a metallic Néel antiferromagnetic phase for the following monolayer transition metal trichalgenides: FeSiSe`$_3$`, FeSiTe`$_3$`, VGeTe`$_3$`, MnGeS`$_3$`, FeGeSe`$_3$`, FeGeTe`$_3$`, NiGeSe`$_3$`, MnSnS`$_3$`, MnSnS`$_3$`, MnSnSe`$_3$`, FeSnSe`$_3$`, NiSnS`$_3$`. Experimental realizations of one of these materials could serve as a testing place for our model. 

Furthermore, not every hexagonal metallic Néel antiferromagnet can accurately be described with a simple Dirac Hamiltonian. The closest experimentally realized material would be CuMnAs that has a square lattice, but can host Dirac electrons. The results from my PhD work {{< cite "baglai2020giant;sokolewicz2019spin;sokolewicz2020spintronics" >}} can at least qualitatively describe the current induced phenomena found in CuMnAs.

Other Dirac antiferromagnets exist as well (e.g. TaCoTe`$_2$` {{< cite "wang_antiferromagnetic_2017">}}, Zr`$_2$`Si {{< cite "shao_zr2si_2018">}}
, BaFe`$_2$`As`$_2$` and SrFe`$_2$`As`$_2$` {{< cite "chen_two-dimensional_2017">}}, EuCd`$_2$`As`$_2$` {{< cite "ma_emergence_2020">}}, MnBi`$_2$`Te`$_4$` {{< cite "swatek_gapless_2020">}}), but they suffer from symmetry protected gapless states and low exchange energies between localized and conducting electrons. As such, they are unideal when it comes to manipulating the antiferromagnetic order. 

The ideal Dirac antiferromagnet would be an antiferromagnetic version of graphene. Though currently non-existent, it has recently been predicted that antiferromagnetism can be induced in graphene by bringing it in proximity with MnPSe`$_3$` {{< cite "hogl_quantum_2020" >}} or by bringing it in double proximity between a layer of Cr`$_2$`Ge`$_2$`Te`$_6$` and WS`$_2$` {{< cite "zollner_purely_2019" >}}.

## Bibliography
{{< bibliography cited >}}