// shop-api: Express server
// Used in Module 5 (Playwright + Claude Code)
// Run: node src/server.mjs  →  http://localhost:3000

import express from 'express';
import { getAllProducts, getProductById, updateProductPrice } from './product.mjs';
import { Cart } from './cart.mjs';
import { applyCoupon, createCoupon, CouponType } from './coupon.mjs';
import { createOrder, confirmOrder } from './order.mjs';

const WORKSHOP10_COUPON = 'WORKSHOP10';

const app = express();
app.use(express.json());
app.use(express.static('public'));

// WORKSHOP: shared across all requests — intentional bug for Module 1
const cart = new Cart();

// ── Products ──────────────────────────────────────────────────────────────────

app.get('/api/products', (req, res) => {
  res.json(getAllProducts());
});

app.get('/api/products/:id', (req, res) => {
  const product = getProductById(Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// ── Cart ──────────────────────────────────────────────────────────────────────

app.get('/api/cart', (req, res) => {
  res.json({ items: cart.items, total: cart.total(), itemCount: cart.itemCount });
});

app.post('/api/cart/add', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = getProductById(Number(productId));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  try {
    cart.addItem(product, quantity);
    res.json({ items: cart.items, total: cart.total() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/cart', (req, res) => {
  cart.clear();
  res.json({ items: [], total: 0 });
});

// ── Checkout ──────────────────────────────────────────────────────────────────

app.post('/api/checkout', (req, res) => {
  const { customerEmail, couponCode, notes } = req.body;
  if (!customerEmail || typeof customerEmail !== 'string') {
    return res.status(400).json({ error: 'customerEmail is required' });
  }
  try {
    let subtotal = cart.total();

    if (couponCode === WORKSHOP10_COUPON) {
      const coupon = createCoupon({ code: WORKSHOP10_COUPON, type: CouponType.PERCENTAGE, value: 10 });
      subtotal = applyCoupon(subtotal, coupon);
    }

    const order = createOrder({ cart, customerEmail, notes });
    const confirmed = confirmOrder(order);
    cart.clear();

    res.json({ order: confirmed, discountedTotal: subtotal });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── UI ────────────────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ShopAPI Workshop</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; background: #f8fafc; }
    h1 { color: #1e293b; }
    .product { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 8px 0; background: white; display: flex; justify-content: space-between; align-items: center; }
    .product button { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
    .product button:hover { background: #2563eb; }
    #cart-summary { background: #1e293b; color: white; padding: 16px; border-radius: 8px; margin: 16px 0; }
    input { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; width: 100%; box-sizing: border-box; margin: 4px 0; }
    #checkout-btn { background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; width: 100%; margin-top: 8px; }
    #checkout-btn:hover { background: #059669; }
    #confirmation { background: #dcfce7; border: 1px solid #86efac; padding: 16px; border-radius: 8px; display: none; }
    #error-msg { background: #fee2e2; border: 1px solid #fca5a5; padding: 12px; border-radius: 8px; display: none; color: #dc2626; }
  </style>
</head>
<body>
  <h1>ShopAPI Workshop</h1>

  <h2>Products</h2>
  <div id="products"></div>

  <h2>Your Cart</h2>
  <div id="cart-summary">
    <span id="cart-count">0 items</span> — Total: $<span id="cart-total">0.00</span>
  </div>

  <h2>Checkout</h2>
  <div id="error-msg"></div>
  <input type="email" id="email" placeholder="Email address" />
  <input type="text" id="coupon" placeholder="Coupon code (try WORKSHOP10)" />
  <input type="text" id="notes" placeholder="Order notes (optional)" />
  <button id="checkout-btn">Complete Purchase</button>

  <div id="confirmation">
    <strong>Order confirmed!</strong>
    <p>Order #<span id="order-id"></span> — $<span id="order-total"></span></p>
  </div>

  <script>
    async function loadProducts() {
      const res = await fetch('/api/products');
      const products = await res.json();
      document.getElementById('products').innerHTML = products.map(p =>
        \`<div class="product" data-id="\${p.id}">
          <div><strong>\${p.name}</strong><br>$\${p.price.toFixed(2)} · \${p.stock} in stock</div>
          <button onclick="addToCart(\${p.id})">Add to Cart</button>
        </div>\`
      ).join('');
    }

    async function addToCart(productId) {
      await fetch('/api/cart/add', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ productId, quantity: 1 }) });
      await refreshCart();
    }

    async function refreshCart() {
      const res = await fetch('/api/cart');
      const { items, total, itemCount } = await res.json();
      document.getElementById('cart-count').textContent = \`\${itemCount} item\${itemCount !== 1 ? 's' : ''}\`;
      document.getElementById('cart-total').textContent = total.toFixed(2);
    }

    document.getElementById('checkout-btn').addEventListener('click', async () => {
      const email = document.getElementById('email').value;
      const couponCode = document.getElementById('coupon').value;
      const notes = document.getElementById('notes').value;
      const errEl = document.getElementById('error-msg');
      errEl.style.display = 'none';

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ customerEmail: email, couponCode, notes })
      });

      const data = await res.json();
      if (!res.ok) {
        errEl.textContent = data.error;
        errEl.style.display = 'block';
        return;
      }
      document.getElementById('order-id').textContent = data.order.id;
      document.getElementById('order-total').textContent = data.discountedTotal.toFixed(2);
      document.getElementById('confirmation').style.display = 'block';
      await refreshCart();
    });

    loadProducts();
    refreshCart();
  </script>
</body>
</html>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ShopAPI running on http://localhost:${PORT}`));
