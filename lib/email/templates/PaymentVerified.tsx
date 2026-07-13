import { Text } from '@react-email/components';
import * as React from 'react';
import type { EmailOrder } from '../types';
import { BaseTemplate, TrackingButton, styles } from './BaseTemplate';

export default function PaymentVerified({ order }: { order: EmailOrder }) {
  return (
    <BaseTemplate
      title="Payment verified"
      preview={`Payment for ${order.order_reference} has been verified.`}
    >
      <Text style={styles.text}>Hello {order.customer_name},</Text>
      <Text style={styles.text}>
        Payment for order <strong>{order.order_reference}</strong> has been verified.
      </Text>
      <Text style={styles.text}>
        Our team will contact you soon by phone to confirm the next delivery step.
      </Text>
      <TrackingButton orderReference={order.order_reference} />
    </BaseTemplate>
  );
}
