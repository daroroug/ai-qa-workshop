// shop-api: Order domain
// Used in Module 4 (Code Reviews + Pre-commit Hooks)
// SECURITY BUG (intentional): order notes logged unsanitized — find it in Module 4

import { deductStock } from './product.mjs';

export const OrderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
};

let orderIdCounter = 1000;

export function createOrder({ cart, customerEmail, notes = '' }) {
  if (!cart || cart.itemCount === 0) throw new Error('Cannot create order from empty cart');
  if (!customerEmail || !customerEmail.includes('@')) throw new Error('Invalid customer email');

  const orderId = ++orderIdCounter;

  // SECURITY BUG: notes is user-controlled input logged without sanitization.
  // In a real system, this could lead to log injection.
  // Participants should catch this in the Module 4 code review exercise.
  console.log(`Creating order ${orderId} for ${customerEmail}. Notes: ${notes}`);

  return {
    id: orderId,
    customerEmail,
    items: [...cart.items],
    total: cart.total(),
    status: OrderStatus.PENDING,
    createdAt: new Date().toISOString(),
    notes,
  };
}

export function confirmOrder(order) {
  if (order.status !== OrderStatus.PENDING) {
    throw new Error(`Cannot confirm order in status: ${order.status}`);
  }

  // Deduct stock for each item
  for (const item of order.items) {
    deductStock(item.product.id, item.quantity);
  }

  return { ...order, status: OrderStatus.CONFIRMED };
}

export function resetOrderCounter() {
  orderIdCounter = 1000;
}
