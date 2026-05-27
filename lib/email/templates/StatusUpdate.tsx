import { Text } from '@react-email/components';
import * as React from 'react';
import type { EmailOrder } from '../types';
import { BaseTemplate, TrackingButton, styles } from './BaseTemplate';

export default function StatusUpdate({
  order,
  message,
}: {
  order: EmailOrder;
  message: string;
}) {
  return (
    <BaseTemplate
      title="Order status update"
      preview={`Update for Entity Ville order ${order.order_reference}.`}
    >
      <Text style={styles.text}>Hello {order.customer_name},</Text>
      <Text style={styles.text}>{message}</Text>
      <TrackingButton orderReference={order.order_reference} />
    </BaseTemplate>
  );
}
