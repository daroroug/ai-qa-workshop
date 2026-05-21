// shop-api: Cart domain
// SKELETON — built in Module 2 using TDD
// DO NOT implement these functions before writing tests!

export class Cart {
  constructor() {
    this.items = [];
  }

  // Add product to cart. If product already in cart, increase quantity.
  // Throws if quantity < 1 or product is null/undefined.
  // TODO: implement in Module 2 Exercise B1
  addItem(product, quantity = 1) {
    throw new Error('Not implemented');
  }

  // Remove product from cart entirely.
  // Throws if product not in cart.
  // TODO: implement in Module 2 Exercise B1
  removeItem(productId) {
    throw new Error('Not implemented');
  }

  // Return total price of all items in cart (sum of price × quantity).
  // Returns 0 for empty cart.
  // TODO: implement in Module 2 Exercise B1
  total() {
    throw new Error('Not implemented');
  }

  // Apply a percentage discount (0-100) to the total.
  // Throws if percentage < 0 or > 100.
  // Returns discounted total (never below 0).
  // TODO: implement in Module 2 Exercise B2 (senior stretch)
  applyDiscount(percentage) {
    throw new Error('Not implemented');
  }

  // Remove all items from cart.
  clear() {
    this.items = [];
  }

  // Return number of unique products in cart.
  get itemCount() {
    return this.items.length;
  }
}
