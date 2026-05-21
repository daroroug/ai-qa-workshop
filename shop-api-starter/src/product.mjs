// shop-api: Product domain
// Used in Module 1 (Unit Testing) and Module 4 (Code Review)

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Blue Hoodie', price: 49.99, stock: 20, category: 'clothing' },
  { id: 2, name: 'Wireless Earbuds', price: 89.99, stock: 50, category: 'electronics' },
  { id: 3, name: 'Running Shoes', price: 119.99, stock: 15, category: 'footwear' },
  { id: 4, name: 'Water Bottle', price: 24.99, stock: 100, category: 'accessories' },
  { id: 5, name: 'Yoga Mat', price: 34.99, stock: 30, category: 'fitness' },
];

const products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));

export function getProductById(id) {
  return products.find(p => p.id === id) ?? null;
}

export function getProductsByCategory(category) {
  return products.filter(p => p.category === category);
}

export function getAllProducts() {
  return [...products];
}

// BUG: No validation — allows negative prices. Participants discover this in Module 1.
export function updateProductPrice(id, newPrice) {
  const product = products.find(p => p.id === id);
  if (!product) throw new Error(`Product ${id} not found`);
  product.price = newPrice;  // ← should validate newPrice > 0
  return product;
}

export function deductStock(id, quantity) {
  const product = products.find(p => p.id === id);
  if (!product) throw new Error(`Product ${id} not found`);
  if (product.stock < quantity) throw new Error(`Insufficient stock for product ${id}`);
  product.stock -= quantity;
  return product;
}

export function resetProducts() {
  // Test helper — resets to initial state between tests
  const fresh = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
  products.length = 0;
  products.push(...fresh);
}
