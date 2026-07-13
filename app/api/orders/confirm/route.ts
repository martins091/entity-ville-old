import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId } = body;
    // In a real app you'd update the order status in a database.
    console.log('Confirming transfer for order', orderId);

    return NextResponse.json({ id: orderId, status: 'pending_verification' }, { status: 200 });
  } catch (err) {
    console.error('Confirm transfer error', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
