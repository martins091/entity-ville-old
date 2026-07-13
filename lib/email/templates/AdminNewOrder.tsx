import { Link, Section, Text } from '@react-email/components';
import * as React from 'react';
import type { EmailOrder } from '../types';
import { BaseTemplate, formatMoney, styles } from './BaseTemplate';
import { OrderSummary } from './OrderSummary';
import { emailConfig } from '../client';

export default function AdminNewOrder({ order }: { order: EmailOrder }) {
  const address = [
    order.shipping_address,
    order.shipping_city,
    order.shipping_state,
    order.shipping_zip,
  ].filter(Boolean).join(', ');

  return (
    <BaseTemplate
      title="New order received"
      preview={`New Entity Ville order ${order.order_reference} from ${order.customer_name}.`}
    >
      <Text style={styles.text}>
        A new order has been placed on Entity Ville and is awaiting bank transfer.
      </Text>

      <Section style={styles.orderBox}>
        <Text style={styles.boxLine}>Order Reference: <strong>{order.order_reference}</strong></Text>
        <Text style={styles.boxLine}>Customer: {order.customer_name}</Text>
        <Text style={styles.boxLine}>Email: {order.customer_email}</Text>
        <Text style={styles.boxLine}>Phone: {order.customer_phone || 'Not provided'}</Text>
        <Text style={styles.boxLine}>Delivery Address: {address}</Text>
        <Text style={styles.boxLine}>Total: <strong>{formatMoney(order.total)}</strong></Text>
        {order.order_notes && (
          <Text style={styles.boxLine}>Order Notes: {order.order_notes}</Text>
        )}
      </Section>

      <OrderSummary order={order} />

      <Link href={`${emailConfig.siteUrl}/admin/orders`} style={styles.button}>
        View order in admin
      </Link>
    </BaseTemplate>
  );
}
