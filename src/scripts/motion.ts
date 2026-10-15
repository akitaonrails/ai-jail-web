// The one orchestrated moment on the site: the home scroll scene.
//   data-scene="5"   a tall section with a sticky stage; gets data-step="0..4" from the scroll position and CSS
//                    does the rest. Without this script, or under prefers-reduced-motion, the stage shows its
//                    final state and the captions stack as a list.
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const scenes = [...document.querySelectorAll<HTMLElement>('[data-scene]')];

function update() {
  const vh = innerHeight;
  for (const el of scenes) {
    const steps = Number(el.dataset.scene) || 1;
    const r = el.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
    el.dataset.step = String(Math.min(steps - 1, Math.floor(progress * steps)));
    const bar = el.querySelector<HTMLElement>('[data-scene-progress]');
    if (bar) bar.style.transform = `scaleX(${progress})`;
  }
}

let ticking = false;
const onSceneScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); } };
function start() {
  if (!scenes.length) return;
  scenes.forEach((el) => (el.dataset.step = '0'));
  update();
  addEventListener('scroll', onSceneScroll, { passive: true });
  addEventListener('resize', onSceneScroll);
}
function stop() {
  removeEventListener('scroll', onSceneScroll);
  removeEventListener('resize', onSceneScroll);
  scenes.forEach((el) => delete el.dataset.step);
}
if (!reduce.matches) start();
reduce.addEventListener('change', () => (reduce.matches ? stop() : start()));
export {};
