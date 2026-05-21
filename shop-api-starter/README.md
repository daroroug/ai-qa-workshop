# ShopAPI Workshop Starter

A minimal e-commerce API used as the capstone project for the **AI-Enhanced QA Workshop**. Participants work through five modules — unit testing, TDD, coverage/mutation, code review, and AI-assisted E2E testing — all against this single codebase.

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | >= 20 |
| npm | >= 10 |
| Claude Code | latest |
| Playwright browsers | installed via `npx playwright install` |

---

## Setup

```bash
git clone <repo-url>
cd shop-api-starter
npm install
npx playwright install chromium
node src/server.mjs
```

Open http://localhost:3000 in your browser. You should see the ShopAPI product listing.

---

## Running Tests

```bash
# Unit tests (single run)
npm test

# Unit tests (watch mode — reruns on file save)
npm run test:watch

# Coverage report (HTML output in coverage/)
npm run coverage

# Mutation testing (HTML report in reports/mutation/)
npm run mutate

# Lint
npm run lint

# End-to-end tests (requires server running or uses webServer config)
npm run e2e
```

---

## Workshop Module Map

| Module | Topic | Files Touched |
|---|---|---|
| 1 — Unit Testing | Write and extend unit tests; discover the price bug | `src/product.mjs`, `tests/product.test.mjs` |
| 2 — TDD | Red-Green-Refactor cycle for the Cart | `src/cart.mjs`, `tests/cart.test.mjs` |
| 3 — Coverage + Mutation | Property-based tests; kill surviving mutants | `src/coupon.mjs`, `tests/coupon.test.mjs` |
| 4 — Code Review | Spot security issues; configure pre-commit hooks | `src/order.mjs`, `.husky/pre-commit` |
| 5 — AI-Assisted E2E | Prompt Claude Code to write Playwright tests; evaluate output | `e2e/checkout.spec.js`, `playwright.config.mjs` |

---

## Project Structure

```
shop-api-starter/
  src/
    product.mjs     — Product catalog (Module 1)
    cart.mjs        — Cart skeleton (Module 2 — implement via TDD)
    coupon.mjs      — Coupon logic (Module 3)
    order.mjs       — Order creation (Module 4)
    server.mjs      — Express server (Module 5)
  tests/
    product.test.mjs
    cart.test.mjs
  e2e/
    checkout.spec.js
  .husky/
    pre-commit
  vitest.config.mjs
  stryker.conf.mjs
  playwright.config.mjs
```

---

## SPOILERS — Read Only After Completing the Exercises

> **Stop here if you are a workshop participant who has not finished the exercises.**

---

### Bug 1 — Negative Prices (Module 1, `src/product.mjs`)

`updateProductPrice()` accepts any numeric value including negatives. The fix is a single guard:

```js
if (typeof newPrice !== 'number' || newPrice <= 0) {
  throw new Error('Price must be a positive number');
}
```

Participants discover this by writing the "set price to -10" test in Exercise A1, which passes when it should throw.

### Bug 2 — Log Injection (Module 4, `src/order.mjs`)

The `console.log` in `createOrder()` interpolates `notes` directly from user input. An attacker can inject fake log lines by crafting a notes string containing newlines and structured text. The fix is to sanitize or strip newlines before logging, or log the field as a structured JSON property rather than a template string.

```js
// Vulnerable:
console.log(`Creating order ${orderId} for ${customerEmail}. Notes: ${notes}`);

// Fixed:
console.log(JSON.stringify({ event: 'order.create', orderId, customerEmail, notes }));
```
