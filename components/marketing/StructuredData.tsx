/**
 * StructuredData Component
 *
 * Adds JSON-LD structured data for SEO and rich search results.
 * Includes Organization schema for EcoPulse.
 */

interface OrganizationData {
  name: string;
  url: string;
  logo?: string;
  description: string;
  email?: string;
  sameAs?: string[];
}

interface StructuredDataProps {
  organization?: OrganizationData;
}

export function StructuredData({ organization }: StructuredDataProps) {
  const defaultOrganization: OrganizationData = {
    name: 'EcoPulse',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://ecopulse.app',
    logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ecopulse.app'}/logo.png`,
    description:
      'Community-verified environmental reporting platform. EcoPulse helps communities report, verify, and coordinate action on waste and drainage issues.',
    email: 'info@ecopulse.app',
    sameAs: [
      'https://twitter.com/ecopulse',
      'https://linkedin.com/company/ecopulse',
      'https://github.com/ecopulse',
    ],
  };

  const org = organization || defaultOrganization;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    logo: org.logo,
    description: org.description,
    contactPoint: {
      '@type': 'ContactPoint',
      email: org.email,
      contactType: 'General Inquiries',
    },
    sameAs: org.sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
