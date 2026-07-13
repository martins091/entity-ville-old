import { Text } from '@react-email/components';
import * as React from 'react';
import type { EmailOrder } from '../types';
import { BaseTemplate, TrackingButton, styles } from './BaseTemplate';

export default function TransferNotified({ order }: { order: EmailOrder }) {
  return (
    <BaseTemplate
      title="Transfer notification received"
      preview={`We received your transfer notice for ${order.order_reference}.`}
    >
      <Text style={styles.text}>Hello {order.customer_name},</Text>
      <Text style={styles.text}>
        We have received your transfer notification for order{' '}
        <strong>{order.order_reference}</strong>. Our team will verify the payment and update you shortly.
      </Text>
      <Text style={styles.text}>
        Your current order status is <strong>verifying payment</strong>.
      </Text>
      <TrackingButton orderReference={order.order_reference} />
    </BaseTemplate>
  );
}
