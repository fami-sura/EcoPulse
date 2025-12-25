'use server';

import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface ContactFormData {
  name: string;
  email: string;
  organization?: string;
  message: string;
}

export async function submitContact(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const data: ContactFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    organization: (formData.get('organization') as string) || undefined,
    message: formData.get('message') as string,
  };

  // Basic validation
  if (!data.name || !data.email || !data.message) {
    return { success: false, error: 'Missing required fields' };
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { success: false, error: 'Invalid email format' };
  }

  // If Resend is not configured, log and return success for development
  if (!resend) {
    console.log('Contact form submission (Resend not configured):', data);
    return { success: true };
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'EcoPulse <noreply@ecopulse.org>',
      to: process.env.CONTACT_EMAIL || 'hello@ecopulse.org',
      replyTo: data.email,
      subject: `[EcoPulse Contact] Message from ${data.name}${data.organization ? ` (${data.organization})` : ''}`,
      text: `Name: ${data.name}
Email: ${data.email}
Organization: ${data.organization || 'Not provided'}

Message:
${data.message}`,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return { success: false, error: 'Failed to send message' };
  }
}
