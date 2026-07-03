+++
title = "[6.5/10] Matt Parker's Humble Pi"
score = "6.5/10"
cover_image = "9780141989143.jpg"
date = "2023-02-26"
author = "Robert"
description = ""
extra_css = "1_humble_pi.css"
extra_js = "1_humble_pi.js"
+++

Matt Parker some of us know from his appearances on the YouTube channel [numberphile](https://www.youtube.com/user/numberphile) and on his personal YouTube channel [standupmaths](https://www.youtube.com/user/standupmaths). Matt created a collection of funny situations and unexpected mistakes in the real world, that originate from math mistakes. It is a fun read to spend a few evenings, but unfortunately for me most of the problems I already knew. 

Some highlights:

1. The oldest known maths error was found on an old Sumerian clay tablet that was made between 3000 and 3400 BC. Someone named Kushim was in charge of tracking stock levels in a warehouse containing ingredients to make beer. There are 18 tablets signed by Kushim that involves counting how much barley there is, and in one of the tablets he made a mistake of adding things up.

2. In 2011 the book *the making of a fly* was for sale on Amazon for over 23 million USD. There were two sellers selling the book, and apparently their listing price was determined automatically using an algorithm. One seller set their price to be for example 1.5% higher then the second lowest price, while the second seller set the price to be 0.9% cheaper then the second lowest price. As time went on, the algorithms were increasing the price bit by bit until it was noticed that the listing price increased from about 10 USD to 23 USD. 

3. In 1983, Air Canada flight 143 ran out of fuel mid flight because the ground crew used pounds instead of kilograms to measure the total amount of fuel. After safely landing and refuelling... the exact same thing happened. 

4. In 1968 after the space shuttle Challenger exploded, a special commission was formed to investigate the root cause. One of the commission members was Richard Feynman, and it was discovered that the rubber rings that connected different sections of the booster rockets did not produce a tight seal. This was in part of lack of elasticity in low temperatures (and the shuttle was launched on a particularly cold day), but also because the booster rocket sections were not perfectly circular. The way the engineers determined how circular each section was, was by measuring the diameter across three angles and ensure that they are equal. However, a circle isn't the only shape with constant diameter, and hence the approach of the engineers failed. Consider for example the Reuleaux triangle which has a constant diameter across all angles:

<div class="flex flex-wrap justify-center items-center vh-100"> 
  <div>
    <svg
      viewBox="0 0 400 400"
      class="db w5 h5 center"
      fill="none"
      stroke-linejoin="round"
      stroke-linecap="round"
      stroke-width="4">
      <g transform="translate(200 200)">
        <path 
          id="square"
          stroke="#0f0" 
          d="M -155.885 -155.885 h 311.77 v 311.77 h -311.77 z" 
        />
      </g>
      <circle cx="200" cy="200" r="4" stroke="#ccc" stroke-width="4" />
      <g id="container">
        <circle cx="0" cy="0" r="4" stroke="#f0f" stroke-width="4" />
        <path
          id="reuleaux-triangle"
          stroke="#333"
          d="M 90 155.88457268119896 
             A 311.77 311.77 0 0 1 -180 0
             A 311.77 311.77 0 0 1 90 -155.885
             A 311.77 311.77 0 0 1 90 155.885
             Z"
        />
      </g>
    </svg>
  </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>

the width of the triangle in the above animation is just the size of the outer box (400 pixels in this case). 