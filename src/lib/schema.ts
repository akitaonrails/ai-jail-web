// schema.org structured data. Base.astro builds the site-wide graph; pages add their own with faqPage().
import { site } from '@/data/site';

export interface Faq { q: string; a: string }

/** FAQPage from the same list the page renders. Answers may hold inline HTML; search engines want text. */
export const faqPage = (items: readonly Faq[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') } })),
});

interface GraphInput { home: string; canonical: string; htmlLang: string; tagline: string; description: string; fullTitle: string; version: string; extra: Record<string, unknown>[] }

export function siteGraph({ home, canonical, htmlLang, tagline, description, fullTitle, version, extra }: GraphInput) {
  const author = { '@id': `${home}#author` };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${home}#site`, url: home, name: site.name, description: tagline, inLanguage: htmlLang, publisher: author },
      { '@type': 'Person', ...author, name: site.author, url: site.authorUrl },
      {
        '@type': 'SoftwareApplication', '@id': `${home}#software`, name: site.name, description, url: home,
        applicationCategory: 'DeveloperApplication', operatingSystem: 'Linux, macOS', softwareVersion: version,
        license: 'https://www.gnu.org/licenses/gpl-3.0.html', codeRepository: site.repo, downloadUrl: `${site.repo}/releases/latest`, author,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      { '@type': 'WebPage', '@id': `${canonical}#page`, url: canonical, name: fullTitle, description, inLanguage: htmlLang, isPartOf: { '@id': `${home}#site` }, about: { '@id': `${home}#software` } },
      ...extra,
    ],
  };
}
