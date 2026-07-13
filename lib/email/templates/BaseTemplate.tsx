import {
  Body,
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
import * as React from 'react';
import { emailConfig } from '../client';

export function formatMoney(value: number) {
  return `₦${Number(value || 0).toLocaleString()}`;
}

export function BaseTemplate({
  preview,
  title,
  children,
}: {
  preview: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Img
              src={`${emailConfig.siteUrl}/images/logo.png`}
              alt="Entity Ville"
              width="160"
              style={styles.logo}
            />
          </Section>
          <Section style={styles.content}>
            <Heading style={styles.title}>{title}</Heading>
            {children}
          </Section>
          <Hr style={styles.hr} />
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Entity Ville Ltd, 37 Adeniran Ogunsanya Mall, Surulere, Lagos State, Nigeria
            </Text>
            <Text style={styles.footerText}>
              Need help? Reply to this email or contact{' '}
              <Link href={`mailto:${emailConfig.replyTo}`} style={styles.link}>
                {emailConfig.replyTo}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function BankDetailsBox() {
  return (
    <Section style={styles.bankBox}>
      <Text style={styles.boxTitle}>Bank transfer details</Text>
      <Text style={styles.boxLine}>Bank Name: {emailConfig.bank.name}</Text>
      <Text style={styles.boxLine}>Account Name: {emailConfig.bank.accountName}</Text>
      <Text style={styles.boxLine}>Account Number: {emailConfig.bank.accountNumber}</Text>
    </Section>
  );
}

export function TrackingButton({ orderReference }: { orderReference: string }) {
  return (
    <Link
      href={`${emailConfig.siteUrl}/track-order?reference=${encodeURIComponent(orderReference)}`}
      style={styles.button}
    >
      Track your order
    </Link>
  );
}

export const styles = {
  body: {
    margin: 0,
    backgroundColor: '#f3f4f6',
    fontFamily: 'Arial, sans-serif',
    color: '#111827',
  },
  container: {
    margin: '0 auto',
    padding: '24px 12px',
    maxWidth: '640px',
  },
  header: {
    padding: '20px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '8px 8px 0 0',
  },
  logo: {
    display: 'block',
  },
  content: {
    padding: '24px',
    backgroundColor: '#ffffff',
  },
  title: {
    margin: '0 0 16px',
    fontSize: '26px',
    lineHeight: '34px',
    fontWeight: '800',
    color: '#111827',
  },
  text: {
    margin: '0 0 14px',
    fontSize: '15px',
    lineHeight: '24px',
    color: '#374151',
  },
  strong: {
    color: '#111827',
    fontWeight: 700,
  },
  bankBox: {
    margin: '20px 0',
    padding: '18px',
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '8px',
  },
  boxTitle: {
    margin: '0 0 10px',
    fontSize: '15px',
    fontWeight: 800,
    color: '#1d4ed8',
  },
  boxLine: {
    margin: '4px 0',
    fontSize: '14px',
    lineHeight: '22px',
    color: '#1f2937',
  },
  orderBox: {
    margin: '18px 0',
    padding: '16px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    margin: '0 0 8px',
    fontSize: '14px',
    lineHeight: '22px',
  },
  totalRow: {
    margin: '14px 0 0',
    paddingTop: '14px',
    borderTop: '1px solid #e5e7eb',
    fontSize: '16px',
    fontWeight: 800,
  },
  button: {
    display: 'inline-block',
    marginTop: '10px',
    padding: '12px 18px',
    backgroundColor: '#027FFF',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 700,
    textDecoration: 'none',
  },
  hr: {
    margin: 0,
    borderColor: '#e5e7eb',
  },
  footer: {
    padding: '18px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '0 0 8px 8px',
  },
  footerText: {
    margin: '0 0 8px',
    fontSize: '12px',
    lineHeight: '18px',
    color: '#6b7280',
  },
  link: {
    color: '#027FFF',
  },
} satisfies Record<string, React.CSSProperties>;
