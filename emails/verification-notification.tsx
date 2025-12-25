/**
 * Verification Notification Email Template
 *
 * Sent to reporters when their report is verified by the community.
 * Uses React Email for professional formatting.
 *
 * Story 2.1.8 - Verification Notifications (Email)
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface VerificationEmailProps {
  /** Reporter's username */
  username: string;
  /** Issue category (waste/drainage) */
  category: string;
  /** Issue location/address */
  location: string;
  /** Number of verifications */
  verificationCount: number;
  /** Link to view the issue */
  issueUrl: string;
  /** Names of verifiers (optional) */
  verifierNames?: string[];
}

export function VerificationNotificationEmail({
  username = 'Community Member',
  category = 'waste',
  location = 'Lagos, Nigeria',
  verificationCount = 2,
  issueUrl = 'https://ecopulse.ng/issues/123',
  verifierNames,
}: VerificationEmailProps) {
  const previewText = `Your ${category} report has been verified by the community!`;
  const categoryLabel = category === 'waste' ? 'Waste/Litter' : 'Drainage/Flood Risk';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Img
              src="https://ecopulse.ng/logo.png"
              width="120"
              height="40"
              alt="EcoPulse"
              style={logo}
            />
          </Section>

          {/* Success Icon */}
          <Section style={iconSection}>
            <div style={successIcon}>✓</div>
          </Section>

          {/* Main Content */}
          <Heading style={heading}>Your Report Has Been Verified!</Heading>

          <Text style={paragraph}>Hi {username},</Text>

          <Text style={paragraph}>
            Great news! Your <strong>{categoryLabel}</strong> report at <strong>{location}</strong>{' '}
            has been verified by <strong>{verificationCount} community members</strong>.
          </Text>

          {verifierNames && verifierNames.length > 0 && (
            <Text style={verifierText}>Verified by: {verifierNames.join(', ')}</Text>
          )}

          {/* Impact Message */}
          <Section style={impactSection}>
            <Text style={impactText}>🌍 Your report is helping clean up your community!</Text>
            <Text style={impactSubtext}>
              Community-verified reports are prioritized by local authorities and NGOs for faster
              resolution.
            </Text>
          </Section>

          {/* CTA Button */}
          <Section style={buttonSection}>
            <Button style={button} href={issueUrl}>
              View Your Report
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            Thank you for making a difference in your community with EcoPulse.
          </Text>

          <Text style={footerSmall}>
            You received this email because you submitted an environmental report on EcoPulse.
            <br />
            <Link href="https://ecopulse.ng/profile/settings" style={link}>
              Manage notification preferences
            </Link>
          </Text>

          <Text style={footerSmall}>
            © {new Date().getFullYear()} EcoPulse. All rights reserved.
            <br />
            Lagos, Nigeria
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default VerificationNotificationEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const logoSection = {
  padding: '32px 20px 0',
};

const logo = {
  margin: '0 auto',
};

const iconSection = {
  textAlign: 'center' as const,
  padding: '24px 0',
};

const successIcon = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#059669',
  color: '#ffffff',
  fontSize: '28px',
  lineHeight: '60px',
  textAlign: 'center' as const,
  margin: '0 auto',
};

const heading = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  textAlign: 'center' as const,
  margin: '0 0 24px',
  padding: '0 20px',
};

const paragraph = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
  padding: '0 20px',
};

const verifierText = {
  color: '#6b7280',
  fontSize: '14px',
  fontStyle: 'italic' as const,
  margin: '0 0 24px',
  padding: '0 20px',
};

const impactSection = {
  backgroundColor: '#ecfdf5',
  borderRadius: '12px',
  padding: '20px',
  margin: '24px 20px',
};

const impactText = {
  color: '#065f46',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 8px',
  textAlign: 'center' as const,
};

const impactSubtext = {
  color: '#047857',
  fontSize: '14px',
  margin: '0',
  textAlign: 'center' as const,
};

const buttonSection = {
  textAlign: 'center' as const,
  padding: '24px 20px',
};

const button = {
  backgroundColor: '#059669',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 20px',
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '0 0 16px',
  padding: '0 20px',
};

const footerSmall = {
  color: '#9ca3af',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '0 0 8px',
  padding: '0 20px',
};

const link = {
  color: '#059669',
  textDecoration: 'underline',
};
