# AI-Enhanced QA Workshop

A hands-on workshop teaching modern software testing techniques powered by Claude Code. Participants build practical AI-assisted testing skills across 5 modules using a real Express.js API as the subject.

## What You'll Build

By the end of the workshop you'll be able to:
- Write unit tests that catch real bugs
- Drive implementation via TDD
- Measure and improve test coverage with mutation testing
- Run AI-assisted code review to find security issues
- Generate Playwright E2E tests with Claude Code

## Repository Structure

```
ai-qa-workshop/
├── README.md                    ← this file
├── 01-research-overview.html    ← research background (open in browser)
├── 02-workshop-slides.html      ← slide deck (open in browser)
├── 02-workshop-slides.md        ← slide source (Markdown)
├── 03-presenter-notes.html      ← facilitator guide (open in browser)
├── 03-presenter-notes.md        ← presenter notes source
├── exercises/
│   ├── hallucination-exercise.mjs  ← Module 3: classify good vs bad AI tests
│   └── flawed-pr.diff              ← Module 4: spot the security bug
└── shop-api-starter/               ← the codebase you'll test
    ├── src/
    │   ├── product.mjs     ← product catalog (has a bug — find it!)
    │   ├── cart.mjs        ← shopping cart (skeleton — build via TDD)
    │   ├── coupon.mjs      ← coupon logic
    │   ├── order.mjs       ← order creation (has a bug — find it!)
    │   └── server.mjs      ← Express server + inline UI
    ├── tests/
    │   ├── product.test.mjs  ← starter tests (Module 1)
    │   └── cart.test.mjs     ← empty skeleton (Module 2 TDD)
    ├── e2e/
    │   └── checkout.spec.js  ← empty (Module 5 AI-generated E2E)
    ├── package.json
    ├── vitest.config.mjs     ← coverage thresholds: 70% lines/functions, 60% branches
    ├── stryker.conf.mjs      ← mutation testing: break threshold 50%
    └── playwright.config.mjs ← auto-starts server on port 3000
```

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop (for Module 5 browser automation)
- [Claude Code](https://claude.ai/code) CLI (`npm install -g @anthropic-ai/claude-code`)

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/daroroug/ai-qa-workshop.git
cd ai-qa-workshop/shop-api-starter

# 2. Install dependencies
npm install

# 3. Start the API
npm run dev
# → http://localhost:3000

# 4. Run existing tests
npm test

# 5. Check coverage
npm run coverage
```

## Workshop Modules

### Module 1 — Unit Testing Fundamentals (45 min)
**Goal**: Write tests that actually catch bugs.

Open `shop-api-starter/tests/product.test.mjs`. The file has passing tests and `// TODO` stubs. Complete the stubs to catch the intentional bug in `src/product.mjs`.

```bash
npm test -- --watch
```

*Hint: What happens when you call `updateProductPrice(-5)`?*

### Module 2 — Test-Driven Development (45 min)
**Goal**: Build `cart.mjs` from scratch using TDD.

`src/cart.mjs` contains only method stubs that throw `'Not implemented'`. `tests/cart.test.mjs` has empty `it.todo` stubs. Write each test first, watch it fail, implement just enough code to pass.

```bash
npm test -- cart --watch
```

Methods to implement: `addItem`, `removeItem`, `updateQuantity`, `getTotal`, `clear`.

### Module 3 — Coverage & Mutation Testing (45 min)
**Goal**: Distinguish meaningful tests from coverage theatre.

First, open `exercises/hallucination-exercise.mjs`. Classify each of the 10 tests as `GOOD` or `ILLUSION`. Then run mutation testing on your own test suite:

```bash
npm run mutate
```

Target: mutation score ≥ 80% (configured in `stryker.conf.mjs`).

### Module 4 — AI-Assisted Code Review (45 min)
**Goal**: Use Claude Code to find security bugs in a pull request.

Review `exercises/flawed-pr.diff`. Identify the security vulnerability before running:

```bash
claude "Review this diff for security issues" < exercises/flawed-pr.diff
```

Then apply the same technique to `src/order.mjs` — there's an intentional bug there too.

### Module 5 — AI-Generated E2E Tests (45 min)
**Goal**: Generate Playwright tests with Claude Code.

`e2e/checkout.spec.js` is empty. Use Claude Code to generate tests that cover the full checkout flow:

```bash
# Start the server first
npm run dev &

# Ask Claude to write the tests
claude "Generate Playwright tests for the checkout flow in e2e/checkout.spec.js. The server runs on localhost:3000. Cover: add to cart, apply coupon, checkout."

# Run the generated tests
npm run e2e
```

## Running All Tools

```bash
# Tests
npm test               # run once
npm run test:watch     # watch mode

# Coverage
npm run coverage       # generates lcov + text summary (threshold: 70%)

# Mutation testing
npm run mutate         # full Stryker run (takes ~2 min)

# Linting
npm run lint

# E2E (requires npm run dev in another terminal, or uses playwright's webServer)
npm run e2e
```

## The Bugs

The starter code has two intentional bugs for workshop exercises:

| File | Bug | Module |
|------|-----|--------|
| `src/product.mjs` | `updateProductPrice()` accepts negative prices | Module 1 |
| `src/order.mjs` | Log injection via unsanitised `notes` field | Module 4 |

## Facilitator Notes

See [03-presenter-notes.html](03-presenter-notes.html) for full facilitator guide including timing, common questions, and troubleshooting tips.

The slide deck is at [02-workshop-slides.html](02-workshop-slides.html). Background research at [01-research-overview.html](01-research-overview.html).

## License

MIT — free to use, adapt, and run at your own events.
