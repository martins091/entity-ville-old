import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In a real app you would persist the order to a database and integrate payments.
    // Here we just return a fake order id for demo purposes.
    const orderId = `ORD-${Date.now()}`;
    console.log('Received order', { orderId, body });

    return NextResponse.json({ id: orderId, status: 'ok' }, { status: 201 });
  } catch (err) {
    console.error('Order error', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
