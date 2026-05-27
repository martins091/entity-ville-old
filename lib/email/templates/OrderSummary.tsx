import { Section, Text } from '@react-email/components';
import * as React from 'react';
import type { EmailOrder } from '../types';
import { formatMoney, styles } from './BaseTemplate';

export function OrderSummary({ order }: { order: EmailOrder }) {
  return (
    <Section style={styles.orderBox}>
      <Text style={{ ...styles.text, ...styles.strong, marginBottom: 12 }}>
        Order summary
      </Text>
      {order.items.map((item, index) => (
        <Text key={`${item.name}-${index}`} style={styles.itemRow}>
          <span>
            {item.name} × {item.quantity}
          </span>
          <span>{formatMoney((item.price || 0) * item.quantity)}</span>
        </Text>
      ))}
      <Text style={styles.totalRow}>Total: {formatMoney(order.total)}</Text>
    </Section>
  );
}
