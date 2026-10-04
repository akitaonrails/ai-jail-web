import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference) and (min-width: 64rem) and (min-height: 45rem)', () => {
  const scenes = document.querySelectorAll<HTMLElement>('[data-scene]');
  scenes.forEach((el) => {
    const steps = Number(el.dataset.scene) || 1;
    const bar = el.querySelector<HTMLElement>('[data-scene-progress]');
    el.dataset.step = '0';
    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        el.dataset.step = String(Math.min(steps - 1, Math.floor(self.progress * steps)));
        if (bar) bar.style.transform = `scaleX(${self.progress})`;
      },
    });
  });
  return () => scenes.forEach((el) => delete el.dataset.step);
});

addEventListener('load', () => ScrollTrigger.refresh());
export { gsap, ScrollTrigger, mm };
