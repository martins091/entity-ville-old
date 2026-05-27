import { Resend } from 'resend';

let resend: Resend | null = null;

export function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY');
  }

  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  return resend;
}

export const emailConfig = {
  from: process.env.EMAIL_FROM || 'Entity Ville <onboarding@resend.dev>',
  replyTo: process.env.EMAIL_REPLY_TO || 'sales@entityville.com',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  bank: {
    name: process.env.BANK_NAME || 'First Bank of Nigeria',
    accountName: process.env.BANK_ACCOUNT_NAME || 'Entity Ville Ltd',
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || '1234567890',
  },
};
