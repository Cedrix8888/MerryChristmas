const tree_arr = []; // tree particles
const tree_c = document.querySelector("#c");
const tree_ctx = tree_c.getContext("2d");
const tree_c_w = (tree_c.width = 4000);
const tree_c_h = (tree_c.height = 4000);
const TAU = Math.PI * 2;
const mouse_pos = { x:tree_c_w/2, y:0 };
const xTo = gsap.quickTo(mouse_pos, "x", {duration:1.5, ease:"expo"})
const yTo = gsap.quickTo(mouse_pos, "y", {duration:1.5, ease:"expo"})

const snow_arr = []; // snow particles
const snow_c = document.querySelector("#c2");
const snow_ctx = snow_c.getContext("2d");
snow_c.width = snow_c.height = 4000;

// const type_c = snow_c.cloneNode(true)
// const type_ctx = type_c.getContext("2d", {willReadFrequently:true});
// let checking = false;
// gsap.to(window, {duration:2, onComplete:()=>{checking=true}})
// type_ctx.clearRect(0, 0, cw, ch);
// type_ctx.fillStyle = "#ffffff";
// type_ctx.textAlign = "center";
// type_ctx.textBaseline = "middle";
// type_ctx.font = "240px sans-serif";
// type_ctx.fillText("Merry Christmas", cw / 2, ch / 2);

tree_c.addEventListener('pointermove', (e)=> {
  const rect = tree_c.getBoundingClientRect();
  const mouseX = e.x - rect.left;
  const mouseY = e.y - rect.top;
  const scaleX = tree_c.width / rect.width;
  const scaleY = tree_c.height / rect.height;
  const scaledMouseX = mouseX * scaleX;
  const scaledMouseY = mouseY * scaleY;
  xTo(scaledMouseX)
  yTo(scaledMouseY)
})

for (let i = 0; i < 999; i++) {
  tree_arr.push({
    i: i,
    center_x: tree_c_w/2,
    center_y: gsap.utils.mapRange(0, 999, 600, 3700, i),
    radius_move: (i<900)?gsap.utils.mapRange(0, 999, 3, 770, i):50, // path radius
    radius_dot: 4,
    prog: 0.25,
    scale_dot: 1
  });

  const time_round = 99 // tree spin duration
  tree_arr[i].t = gsap
    .timeline({ repeat: -1 })
    .to(tree_arr[i], { duration: time_round, prog: "+=1", ease: "slow(0.3, 0.4)" })
    .to(tree_arr[i], { duration: time_round / 2, scale_dot: 0.3, repeat: 1, yoyo: true, ease: "power3.inOut" }, 0)
    .seek(Math.random() * time_round);
  
  snow_arr.push({
    i: i,
    x: tree_c_w * Math.random(),
    y: -9,
    radius: 3 + 5 * Math.random(),
    alpha: .1 + .5 * Math.random()
  })
  
  snow_arr[i].t = gsap
    .to(snow_arr[i], { ease:'none', y:tree_c_h, repeat: -1 })
    .seek(Math.random()*99)
    .timeScale(snow_arr[i].radius / 150 );
}

gsap.ticker.add(render);
tree_ctx.fillStyle = snow_ctx.fillStyle = "#fff";

// background music autoplay helper (some browsers block autoplay with sound)
const bgMusic = document.getElementById('bg-music');
if (bgMusic) {
  // Try to play immediately
  bgMusic.play().catch(() => {
    // If blocked, start on first user interaction
    const startMusic = () => {
      bgMusic.play().catch(() => {});
      window.removeEventListener('pointerdown', startMusic);
      window.removeEventListener('click', startMusic);
      window.removeEventListener('keydown', startMusic);
    };
    window.addEventListener('pointerdown', startMusic, { once: true });
    window.addEventListener('click', startMusic, { once: true });
    window.addEventListener('keydown', startMusic, { once: true });
  });
}


function render() {
  tree_ctx.clearRect(0, 0, tree_c_w, tree_c_h);
  snow_ctx.clearRect(0, 0, tree_c_w, tree_c_h);
  tree_arr.forEach((c) => drawDot(c));
  snow_arr.forEach((c) => drawSnow(c));
}


function drawDot(c) {
  const angle = c.prog * TAU;
  const scale_y = 0.2; // vertical scale of path
  const x = Math.cos(angle) * c.radius_move + c.center_x;
  const y = (Math.sin(angle) * c.radius_move) * scale_y + c.center_y;
  const distance = Math.sqrt((x-mouse_pos.x)**2 + (y-mouse_pos.y)**2);

  const ms = gsap.utils.clamp(.4, 1, distance/tree_c_w);
  tree_ctx.beginPath();
  tree_ctx.arc(x, y, c.radius_dot * c.scale_dot / ms, 0, TAU);
  tree_ctx.fill();
}

function drawSnow(c) {
  const scale_y = gsap.utils.interpolate(1.3, 0.1, c.y/tree_c_h)
  snow_ctx.save();
  
  snow_ctx.beginPath();
  snow_ctx.translate(c.x, c.y);
  snow_ctx.rotate(50*c.t.progress());
  snow_ctx.arc(
    gsap.utils.interpolate(-55, 55, c.i/999),
    gsap.utils.interpolate(-25, 25, c.i/999),
    c.radius * scale_y, 0, TAU );
  snow_ctx.globalAlpha = c.alpha * scale_y;
  snow_ctx.fill();
  snow_ctx.restore();
}

// intro
gsap.from(tree_arr, {duration:1, radius_dot:0, ease:'back.out(3)', stagger:-0.0009})
gsap.from(mouse_pos, {duration:1.5, y:tree_c_h*1.2, ease:'power2.inOut'})