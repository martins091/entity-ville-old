import { Text } from '@react-email/components';
import * as React from 'react';
import type { EmailOrder } from '../types';
import { BankDetailsBox, BaseTemplate, TrackingButton, formatMoney, styles } from './BaseTemplate';
import { OrderSummary } from './OrderSummary';

export default function OrderConfirmation({ order }: { order: EmailOrder }) {
  return (
    <BaseTemplate
      title="Order confirmation"
      preview={`Your Entity Ville order ${order.order_reference} has been received.`}
    >
      <Text style={styles.text}>Hello {order.customer_name},</Text>
      <Text style={styles.text}>
        Thank you for your order. Your order reference is{' '}
        <strong>{order.order_reference}</strong>. Please save this reference because you will need it to track your order.
      </Text>
      <Text style={styles.text}>
        Transfer exactly <strong>{formatMoney(order.total)}</strong> using the bank details below, then return to the site and click that you have transferred.
      </Text>
      <BankDetailsBox />
      <OrderSummary order={order} />
      <TrackingButton orderReference={order.order_reference} />
    </BaseTemplate>
  );
}
