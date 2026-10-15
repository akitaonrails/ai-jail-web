export const site = {
  name: 'ai-jail',
  // The production domain. astro.config.mjs reads it from here.
  url: 'https://aijail.io',
  repo: 'https://github.com/akitaonrails/ai-jail',
  docs: 'https://github.com/akitaonrails/ai-jail/blob/master/docs',
  sibling: 'https://aimemory.sh',
  siblingIntegration: 'https://aimemory.sh/integrations/#yolo',
  author: 'Fabio Akita',
  authorUrl: 'https://akitaonrails.com',
};

export type Hue = 'rose' | 'clay' | 'mustard' | 'sage' | 'teal' | 'indigo' | 'red';
export interface NavLink { id: string; href: string; hue: Hue }

// Labels and notes live in common.json under nav.<id>. One hue per subject, everywhere that subject appears:
// why = rose, how it works = clay, compare = indigo, what you turn on = mustard, limits = red, the agent and the one action = teal.
export const nav: NavLink[] = [
  { id: 'why', href: '/why/', hue: 'rose' },
  { id: 'how', href: '/how-it-works/', hue: 'clay' },
  { id: 'compare', href: '/compare/', hue: 'indigo' },
  { id: 'configure', href: '/configure/', hue: 'mustard' },
  { id: 'security', href: '/security/', hue: 'red' },
  { id: 'download', href: '/download/', hue: 'teal' },
];
export const pageHue: Record<string, Hue> = { ...Object.fromEntries(nav.map((n) => [n.id, n.hue])), install: 'teal', download: 'teal' } as Record<string, Hue>;
