export const site = {
  name: 'ai-jail',
  // The production domain. astro.config.mjs reads it from here.
  url: 'https://aijail.io',
  repo: 'https://github.com/akitaonrails/ai-jail',
  docs: 'https://github.com/akitaonrails/ai-jail/blob/master/docs',
  sibling: 'https://aimemory.io',
  author: 'Fabio Akita',
  authorUrl: 'https://akitaonrails.com',
};

export type Hue = 'gold' | 'orange' | 'red' | 'magenta' | 'cyan';
export interface NavLink { id: string; href: string; hue: Hue }

// Labels and notes live in common.json under nav.<id>. One hue per subject, everywhere that subject appears:
// why = magenta, how it works = orange, the agents = cyan, what you turn on = gold, limits = red.
export const nav: NavLink[] = [
  { id: 'why', href: '/why/', hue: 'magenta' },
  { id: 'how', href: '/how-it-works/', hue: 'orange' },
  { id: 'compare', href: '/compare/', hue: 'cyan' },
  { id: 'configure', href: '/configure/', hue: 'gold' },
  { id: 'security', href: '/security/', hue: 'red' },
];
export const pageHue: Record<string, Hue> = { ...Object.fromEntries(nav.map((n) => [n.id, n.hue])), install: 'cyan' } as Record<string, Hue>;
