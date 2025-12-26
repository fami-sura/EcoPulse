import { MetadataRoute } from 'next';

/**
 * Dynamic sitemap generation for EcoPulse
 * Generates sitemap.xml with all public marketing pages
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ecopulse.app';
  const lastModified = new Date();

  // Marketing pages (high priority)
  const marketingPages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/mission', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/pilot', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/faq', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.5, changeFrequency: 'yearly' as const },
  ];

  // Product pages (medium priority)
  const productPages = [{ path: '/map', priority: 0.9, changeFrequency: 'daily' as const }];

  // Supported locales
  const locales = ['en'];

  // Generate sitemap entries for all locale + page combinations
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Marketing pages
    for (const page of marketingPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }

    // Product pages
    for (const page of productPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  return entries;
}
