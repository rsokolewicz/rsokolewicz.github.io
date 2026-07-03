const triangle = document.querySelector('#reuleaux-triangle');
const container = document.querySelector('#container');

triangle.setAttribute('transform', `rotate(0)`);
container.setAttribute('transform', `translate(${200 + 24.115} 200)`);

const tl = anime({
  targets: { beta: 0, theta: 0 },
  theta: [0, 6 * Math.PI],
  beta: [0, -360],
  easing: 'linear',
  duration: 8000,
  loop: true,
  // autoplay: false,
  update: (anim) => {
    const t = anim.animations[0].animatable.target.theta;
    const b = anim.animations[0].animatable.target.beta;
    const a = 24.115;
    const n = 2.36185;
    const x = Math.pow( Math.abs( Math.cos( t ) ), 2 / n ) * a * Math.sign( Math.cos( t ) );
    const y = Math.pow( Math.abs( Math.sin( t ) ), 2 / n ) * a * Math.sign( Math.sin( t ) );
    triangle.setAttribute('transform', `rotate(${b})`);
    container.setAttribute('transform', `translate(${200 + x} ${200 + y})`);
  }
});
tl.play();
