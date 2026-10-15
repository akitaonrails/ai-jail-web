// Header: the language menu, the mobile drawer, and the language cookie.
// The route is authoritative. This also records a language when someone follows a
// localized link directly, and resets an old localized choice after they remove the
// locale prefix from the URL.
const pageLang = document.documentElement.dataset.locale;
const savedLang = document.cookie.match(/(?:^|; )nf_lang=([^;]*)/)?.[1];
if (pageLang && savedLang !== pageLang) setLanguageCookie(pageLang);

const drawer = document.querySelector<HTMLDialogElement>('#drawer');
document.addEventListener('click', (e) => {
  const el = e.target as HTMLElement;
  const menu = el.closest<HTMLElement>('[data-menu]');
  document.querySelectorAll<HTMLElement>('[data-menu][data-open]').forEach((m) => { if (m !== menu) close(m); });
  if (el.closest('[data-menu-trigger]') && menu) (menu.hasAttribute('data-open') ? close : open)(menu);
  if (el.closest('[data-drawer-open]')) drawer?.showModal();
  if (el.closest('[data-drawer-close]') || el === drawer || el.closest('#drawer a')) drawer?.close();
  const lang = el.closest<HTMLElement>('[data-set-lang]')?.dataset.setLang;
  if (lang) setLanguageCookie(lang);
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll<HTMLElement>('[data-menu][data-open]').forEach(close); });
function open(m: HTMLElement) { m.setAttribute('data-open', ''); m.querySelector('[data-menu-trigger]')?.setAttribute('aria-expanded', 'true'); }
function close(m: HTMLElement) { m.removeAttribute('data-open'); m.querySelector('[data-menu-trigger]')?.setAttribute('aria-expanded', 'false'); }
function setLanguageCookie(lang: string) { document.cookie = `nf_lang=${lang}; path=/; max-age=31536000; samesite=lax`; }
