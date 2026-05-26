import CheckoutTransferClient from './CheckoutTransferClient';

export default function TransferPage({ searchParams }: { searchParams: { orderId?: string } }) {
  return <CheckoutTransferClient orderId={searchParams.orderId ?? null} />;
}
