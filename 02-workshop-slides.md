# AI-Enhanced Quality Assurance in Software Engineering
### Workshop — 8 Hours | 9 Participants | Mixed Juniors + Seniors

> "Today we ship better software by making quality unavoidable — not optional. Every tool, every exercise, every conversation in this room is aimed at one outcome: fewer bugs reaching production."

---

# Welcome + Setup (08:30)

## Getting Started

### Participant Check

- Introduce yourself: name, team, one word for how you feel about testing today
- We will build on a real e-commerce API called **ShopAPI** — products, cart, checkout
- Every module has a **Junior** track and a **Senior stretch** — do the one that fits you right now
- The only bad exercise is one you don't start

> "Before we touch code: laptops open. Let's verify your environment is clean."

### Environment Verification

```bash
node --version       # need >= 20
npm --version        # need >= 10
npx vitest --version # should print a version
npx playwright --version
cd workshop/shop-api-starter && npm install
```

- If you see errors, flag me now — do not wait
- Keep the terminal open; we will use it all day

### Schedule Overview

| Time | Block | Duration |
|------|-------|----------|
| 08:30 | Welcome + setup | 30 min |
| 09:00 | Module 1: Unit Testing with Vitest | 75 min |
| 10:15 | Break | 15 min |
| 10:30 | Module 2: TDD + AI (Red-Green-Refactor) | 75 min |
| 11:45 | Lunch prep | 15 min |
| 12:00 | Lunch | 60 min |
| 13:00 | Module 3: Coverage + Mutation Testing | 60 min |
| 14:00 | Module 4: Code Reviews + Pre-commit Hooks | 60 min |
| 15:00 | Break | 15 min |
| 15:15 | Module 5: Playwright + Claude Code | 75 min |
| 16:30 | Module 6: AI Hallucinations + Safeguards | 30 min |
| 17:00 | Capstone Presentations + Feedback | 45 min |
| 17:45 | Close | 15 min |

---

# Module 1: Unit Testing with Vitest

## Unit Testing with Vitest
### 09:00 — 75 minutes

**Learning goals:**
1. Write, run, and organize unit tests using Vitest
2. Apply the **AAA pattern** (Arrange-Act-Assert) consistently
3. Name tests so they read as executable specifications
4. Connect tests to a CI gate so broken code cannot merge

> "This module is about what tests actually are and why they matter more than most teams treat them."

---

### What Is a Unit Test?

- A **unit test** verifies the smallest independently testable piece of code
- It runs in memory — no network, no database, no file system
- It runs in milliseconds — 1000 tests should finish in under 3 seconds
- It tells you exactly what broke and where — not just "something is wrong"

**Why test at all?**

| Bug found during... | Average cost to fix |
|---------------------|---------------------|
| Development (same day) | $80 |
| Code review | $240 |
| QA cycle | $960 |
| Production | $7,600+ |

Source: IBM NIST, 2022. The ratio is roughly 1 : 3 : 12 : 95.

> "The question is not 'should we write tests.' The question is 'do we want to find bugs while they're cheap or after they're expensive.'"

---

### Why Are There Multiple Test Runners?

| Runner | Year | Notes |
|--------|------|-------|
| **Jest** | 2014 | Industry standard for years; CJS-first; slow cold start |
| **node:test** | 2023 | Built into Node 18+; no install needed; minimal API |
| **Vitest** | 2022 | ESM-native; Vite config reuse; fastest cold start; Jest-compatible API |

- We use **Vitest** because ShopAPI uses ESM modules
- If you use Jest at work: 95% of the API is identical
- `describe`, `it`, `test`, `expect`, `beforeEach`, `afterEach` — same in all three

> "You do not need to switch your existing projects. The concepts travel."

---

### The AAA Pattern

Every test has exactly three parts:

```js
it('returns the product when given a valid id', () => {
  // ARRANGE — set up the world
  const id = 'prod-001';

  // ACT — call the unit under test
  const result = getProductById(id);

  // ASSERT — verify the outcome
  expect(result.id).toBe('prod-001');
  expect(result.name).toBe('Blue Hoodie');
});
```

- **Arrange**: create inputs, set up fakes, seed state
- **Act**: one call — always one call per test
- **Assert**: one thing per test (or closely related things)

> "If your Act section has more than one line, you're probably testing two things."

---

### What Makes a Good Test Name?

A good test name is a complete English sentence that describes the behavior:

| Bad | Good |
|-----|------|
| `test1` | `returns product when id exists` |
| `testGetProduct` | `throws NotFoundError when id is unknown` |
| `price test` | `throws when price is negative` |
| `update` | `preserves other fields when updating price` |

Rule: **read the test name aloud — it should describe the behavior, not the code.**

> "If your test fails in CI and someone reads the name in a Slack alert, they should know what broke without opening the file."

---

### Watch Mode + Coverage Mode

```bash
# Run all tests once
npx vitest run

# Watch mode — re-runs on file save
npx vitest

# Coverage report
npx vitest run --coverage
# → Open coverage/index.html in browser
```

- **Watch mode** is for development — keep it running while you code
- **Coverage mode** shows which lines your tests never execute
- Do not commit with coverage below your team's threshold

---

### Demo: First Test in Vitest

> "Let me show you the full cycle before you do it yourself."

```bash
cd workshop/shop-api-starter
cat src/product.mjs
```

> **Note for participants:** The snippet above contains intentional issues — finding them is the exercise.

```js
// src/product.mjs (shown on screen)
export function getProductById(id) {
  return products.find(p => p.id === id) ?? null;
}

export function updateProductPrice(id, newPrice) {
  if (newPrice < 0) throw new Error('Price cannot be negative');
  const product = products.find(p => p.id === id);
  if (!product) return false;
  product.price = newPrice;
  return true;
}
```

```js
// tests/product.test.mjs — write this live
import { describe, it, expect } from 'vitest';
import { getProductById } from '../src/product.mjs';

describe('getProductById', () => {
  it('returns the correct product name for a valid id', () => {
    const result = getProductById('prod-001');
    expect(result.name).toBe('Blue Hoodie');
  });

  it('returns null when the id does not exist', () => {
    const result = getProductById('does-not-exist');
    expect(result).toBeNull();
  });
});
```

```bash
npx vitest run
# → show green
# → rename 'Blue Hoodie' to 'Red Hoodie' in source — show red
# → npx vitest   (watch mode — re-runs on save)
```

---

### Exercise A — Junior (20 min)

**You are given:** `src/product.mjs` with three functions:
- `getProductById(id)` — returns a product or null
- `getProductsByCategory(category)` — returns an array
- `updateProductPrice(id, newPrice)` — returns boolean, throws if price < 0

**Write 3 tests in `tests/product.test.mjs`:**

1. `getProductById` returns a product with the correct id
2. `getProductById` returns the correct name
3. `updateProductPrice` throws when price is negative

**Rules:**
- Use the AAA pattern with comments
- Name each test as a complete sentence
- Run `npx vitest run` — all 3 must be green before you stop

---

### Exercise A — Senior Stretch (+20 min)

**After your 3 tests pass:**

```bash
npx vitest run --coverage
open coverage/index.html
```

1. Open the coverage report for `product.mjs`
2. Find the **branch** that is not covered (look for yellow/red highlighting)
3. Identify what scenario that branch represents
4. Write a test that exercises that exact path
5. Re-run coverage — the red branch should turn green

**Bonus question to think about:** Is 100% branch coverage enough? Why or why not?

---

### Debrief: Module 1

Discussion questions:

1. **What makes a test name good vs bad?** Give an example of a name you wrote and whether you'd change it now.

2. **What happens if these tests are not wired to CI?** Walk through the scenario: someone edits `product.mjs` at 11pm, pushes directly to main. What does your team learn, and when?

3. **One function, one test file — is that always the right structure?** When might you want a different layout?

> "There are no wrong answers here. I want to hear your instincts and then we'll sharpen them."

---

### Module 1 Key Takeaway

> "Tests are not optional insurance. They are executable specifications."

- Every test is a commitment about how the code should behave
- Tests that don't run in CI don't exist in practice
- **AAA** is your template — use it until it's automatic
- Name every test as a sentence — if it can't be a sentence, it's not a test

---

# Module 2: TDD + AI Red-Green-Refactor

## TDD + AI: Red-Green-Refactor
### 10:30 — 75 minutes

**Learning goals:**
1. Execute the **Red-Green-Refactor** cycle with discipline
2. Understand why writing the test first changes design
3. Use Claude Code as a TDD accelerant — not a test generator
4. Recognize the TDD compliance metric and why it matters

> "This module is not about testing. It is about design. The test is a specification you write before you write code."

---

### The TDD Cycle

```
┌─────────────────────────────────┐
│  RED    Write a failing test    │
│         (it must fail first)    │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│  GREEN  Write minimal code      │
│         to make it pass         │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│  REFACTOR  Clean up the code    │
│            Tests still green    │
└─────────────────────────────────┘
```

- **Red first** — if the test passes before you write any code, it's not a real test
- **Minimal green** — do not write more code than the failing test demands
- **Refactor** — clean without adding features; tests protect you

> "The discipline is in the order. A lot of developers write tests after — that's verification, not TDD. TDD is design."

---

### Why Write the Test First?

Writing the test before the implementation forces you to answer:

- What is the **function signature**? (inputs, return type)
- What is the **contract**? (what it promises to callers)
- What are the **edge cases**? (before you're tempted to skip them)
- What would I need to **mock**? (which reveals unwanted dependencies)

> "When you write the test after, you're describing what the code does. When you write the test first, you're describing what the code should do. Those are very different things."

---

### DORA 2025: Evidence for TDD

- Teams using TDD have **40–90% lower defect density** (DORA 2025 State of DevOps)
- The range is wide because adoption depth varies
- **Test-Driven Generation (TDG)**: use AI to suggest test cases you'd miss — not to skip writing tests
- TDD compliance metric: **test lines ≥ 1/3 of source lines per commit**

| Practice | Defect density change |
|----------|----------------------|
| TDD (strict) | −40% to −90% |
| Code review only | −15% to −35% |
| Coverage gates only | +5% to +20% (false confidence) |

---

### AI as TDD Accelerant

What Claude Code is good at:
- **Suggesting edge cases you didn't think of** — "What cases am I missing for addItem?"
- **Scaffolding the test structure** — you review and adjust
- **Explaining why a test fails** — paste the error, get the diagnosis

What Claude Code is not good at:
- Knowing your business domain (it doesn't know your rules)
- Catching oracle failures (it validates what code does, not what it should do)
- Replacing your judgment on what matters

> "Think of Claude as a fast junior engineer who writes fast first drafts. Your job is to give it the right prompt and then review critically."

---

### Demo: Cart TDD Cycle

> "I'm going to show you the full Red-Green-Refactor loop before you run it yourselves."

**Start with the skeleton:**
```bash
cat src/cart.mjs
```

**Write the test first (RED):**
```js
// tests/cart.test.mjs
import { describe, it, expect, beforeEach } from 'vitest';
import { Cart } from '../src/cart.mjs';

describe('Cart.addItem', () => {
  let cart;
  beforeEach(() => { cart = new Cart(); });

  it('adds a product to the cart', () => {
    cart.addItem({ id: 'prod-001', price: 49.99 }, 1);
    expect(cart.items).toHaveLength(1);
  });

  it('increases quantity when same product added twice', () => {
    cart.addItem({ id: 'prod-001', price: 49.99 }, 1);
    cart.addItem({ id: 'prod-001', price: 49.99 }, 2);
    expect(cart.items[0].quantity).toBe(3);
  });
});
```

```bash
npx vitest run   # → RED (Cart is not implemented)
```

**Minimal implementation (GREEN):**
```js
export class Cart {
  constructor() { this.items = []; }
  addItem(product, quantity) {
    const existing = this.items.find(i => i.id === product.id);
    if (existing) { existing.quantity += quantity; }
    else { this.items.push({ ...product, quantity }); }
  }
}
```

```bash
npx vitest run   # → GREEN
```

**Ask Claude Code:**
> "What edge cases am I missing for addItem?"

> Shows suggestion: quantity = 0, quantity negative, product with no id.

**Refactor + add one edge case test — still green.**

---

### Exercise B — All (30 min)

**Starting from `src/cart.mjs` skeleton, implement using strict TDD:**

Functions to implement:
- `cart.addItem(product, quantity)` — adds product; increments if already in cart
- `cart.total()` — returns sum of all (price × quantity)

**Rules — non-negotiable:**
1. Write the test first
2. Run `npx vitest run` — watch it fail (RED)
3. Write the minimum implementation
4. Run again — watch it pass (GREEN)
5. Only then clean up

You may use Claude Code to ask: **"What edge cases am I missing for addItem?"**

Do NOT ask Claude to write the implementation.

---

### Exercise B — Senior Stretch (15 min)

**After addItem and total are passing:**

Add `cart.applyDiscount(percentage)` using TDD.

You must cover:
- Negative percentage should throw `RangeError`
- Percentage > 100 should throw `RangeError`
- 0% discount leaves total unchanged
- 50% discount on $100 cart returns $50
- Discount never drives total below $0

Write each test. Watch each fail. Implement one case at a time.

---

### The TDD Enforcer Hook

> "Let me show you how this discipline gets enforced mechanically."

In some setups, a `PreToolUse` hook intercepts Write and Edit operations:

```
PreToolUse: Write/Edit detected
→ Checking: does a test file exist for this module?
→ If NO and commit contains new src lines: BLOCKED
→ Message: "Write the test first. Run: npx vitest run (watch for RED)"
→ 5-minute override available for legitimate refactors
```

This is not about distrust. It is about making the right thing the default path.

---

### Debrief: Module 2

Discussion questions:

1. **How did writing the test first change how you thought about the function interface?** Specifically: did you change the signature or the return value after writing the test?

2. **Did Claude Code suggest an edge case you would not have thought of?** Which one? Was it a real bug or noise?

3. **Where did the cycle break for you?** Did you write implementation before the test out of habit? What would you need to not do that?

---

### Module 2 Key Takeaway

> "TDD is not about testing. It is about design. The test is a specification."

- Write the test first — if it doesn't fail first, it's not a real test
- **Red-Green-Refactor** is a discipline, not a suggestion
- AI is an edge-case suggester, not a test writer
- The compliance metric: **test lines ≥ 1/3 of source lines per commit**

---

# Lunch Briefing (11:45)

## Before You Break for Lunch

> "You have 15 minutes before lunch. Here is what to do with them — do not just check Slack."

1. **Review your Module 2 tests.** Read each test name. Does it describe a behavior or describe code?
2. **Think about the coupon system.** In Module 3 we will test `coupon.mjs`. What do you think the invariants are? What should always be true, no matter the input?
3. **Write down one question** you want answered in the afternoon. Anything — about TDD, AI, testing philosophy, whatever surfaced this morning.

We reconvene at 13:00 sharp.

---

# Module 3: Code Coverage + Mutation Testing

## Code Coverage + Mutation Testing
### 13:00 — 60 minutes

**Learning goals:**
1. Distinguish line, branch, and function coverage — and know their limits
2. Understand what **mutation testing** measures and why it matters
3. Run Stryker and interpret a mutation report
4. Close the gap between coverage percentage and real test quality

> "This module will probably make you uncomfortable. That's the point."

---

### Three Kinds of Coverage

| Type | What it measures | Foolable by |
|------|-----------------|-------------|
| **Line coverage** | Lines executed | Empty assertions (`expect(x)`) |
| **Branch coverage** | Both sides of every if/else | Tests that always take the happy path |
| **Function coverage** | Every function called | Calling a function and ignoring the result |

- Coverage tools measure **execution**, not **correctness**
- A test that calls a function and asserts nothing counts as 100% line coverage
- Coverage is necessary but not sufficient

> "I can give you 100% coverage with a single test that ignores every assertion. Watch."

---

### The Dangerous 100% Coverage Illusion

```js
// This achieves 100% line coverage and tests nothing
it('cart works', () => {
  const cart = new Cart();
  cart.addItem({ id: 'x', price: 10 }, 1);
  cart.total();              // no assertion
  expect(cart).toBeDefined(); // existence assertion — always true
});
```

- `toBeDefined()` passes as long as the object is not `undefined`
- It tells you nothing about correctness
- Coverage is **100%**. Bugs caught: **0**.

---

### What Is Mutation Testing?

**Stryker** automatically introduces small bugs into your source code, then runs your tests:

| Mutant type | Example change |
|-------------|---------------|
| Arithmetic | `price + tax` → `price - tax` |
| Boundary | `if (qty > 0)` → `if (qty >= 0)` |
| Logical | `&&` → `\|\|` |
| Negation | `return true` → `return false` |
| String | `'error'` → `''` |

**Mutation score** = killed mutants / total mutants × 100%

If your tests catch the bug: **mutant killed** (good).
If your tests still pass with the bug: **mutant survives** (gap in your tests).

---

### Mutation Score Thresholds

| Score | Meaning |
|-------|---------|
| **≥ 80%** | High quality test suite |
| **60–79%** | Acceptable with review |
| **50–59%** | CI fail recommended |
| **< 50%** | Tests provide false confidence |

**The uncomfortable finding from Outsight AI (2025):**
AI-generated test suites average **20.32% mutation score** despite high line coverage.

> "Your AI-generated tests look green. Stryker says 4 out of 5 real bugs would survive them."

---

### Demo: Coverage vs Mutation Score

```bash
cd workshop/shop-api-starter

# Step 1: look impressive
npx vitest run --coverage
# → shows 85% line coverage — looks fine

# Step 2: reality check
npx stryker run
# → open stryker-tmp/reports/mutation/index.html
```

> "Find the surviving mutants column. Here are 6 bugs your tests would not catch — even though coverage says you're at 85%."

Walk through 2–3 surviving mutants on screen:
- A `>` changed to `>=` in price validation — test only checks the happy path
- A `+` changed to `-` in total calculation — test only checks existence, not value
- A `return false` changed to `return true` in updateProductPrice — no assertion on return value

---

### Exercise C — Junior (20 min)

1. Open the Stryker HTML report from the demo run
2. Find **3 surviving mutants** in `cart.mjs`
3. For each surviving mutant, write a test that would kill it
4. Re-run Stryker: `npx stryker run`
5. Target: mutation score **above 70%**

**Hint for finding surviving mutants:** Look for green lines with a yellow dot — those are lines with a mutant your tests didn't catch.

---

### Exercise C — Senior (20 min)

Write **property-based tests** for `coupon.mjs` using `fast-check`:

```bash
npm install --save-dev fast-check
```

Define these 3 invariants as `fc.property()` tests:

1. **Total after any valid discount (0–100%) is always ≥ 0**
2. **A 0% discount leaves total unchanged**
3. **A 100% fixed discount on a $50 item results in $0**

fast-check will run each property 100 times with randomized inputs.

```js
import * as fc from 'fast-check';
import { applyCoupon } from '../src/coupon.mjs';

it('total never goes below zero after any valid discount', () => {
  fc.assert(fc.property(
    fc.float({ min: 0, max: 100 }),
    (discountPct) => {
      const total = applyCoupon(50.00, discountPct);
      return total >= 0;
    }
  ));
});
```

---

### Debrief: Module 3

Discussion questions:

1. **Were you surprised by the gap between your coverage percentage and mutation score?** What was the actual gap for your cart.mjs tests?

2. **Which surviving mutants represent real bugs?** Not theoretical bugs — actual wrong behavior a user would experience.

3. **If you had to add Stryker to your current project this week:** What would you need to change about your existing tests to get above 60%?

---

### Module 3 Key Takeaway

> "100% coverage + 4% mutation score = 96% of bugs undetected."

- **Coverage measures execution.** Mutation testing measures correctness.
- A test with a weak assertion gives you false confidence
- Target: **≥ 80% mutation score** on business-critical code
- AI-generated tests need mutation testing more than human-written tests do

---

# Module 4: Code Reviews + Pre-commit Hooks

## Code Reviews + Pre-commit Hooks
### 14:00 — 60 minutes

**Learning goals:**
1. Apply the **7-dimension review framework** consistently
2. Distinguish CRITICAL findings (block merge) from INFORMATIONAL (track, don't block)
3. Configure pre-commit hooks that are fast, targeted, and useful
4. Turn every bug you find into a detector for future bugs

> "Code review is not a courtesy read. It is the last line of defense before production."

---

### The 7-Dimension Review Framework

| Dimension | Weight | What to look for |
|-----------|--------|-----------------|
| **Correctness** | 25% | Logic errors, wrong return values, off-by-one |
| **Security** | 20% | Injection, unvalidated input, hardcoded secrets |
| **Readability** | 15% | Naming, complexity, cognitive load |
| **Performance** | 10% | N+1 queries, unbounded loops, unnecessary allocation |
| **Maintainability** | 10% | Duplication, coupling, extensibility |
| **Test Coverage** | 10% | Missing tests, weak assertions, no edge cases |
| **Architecture** | 10% | Wrong layer, wrong abstraction, violates contracts |

Total: 100%. Use this checklist every time — not just when you feel like it.

---

### Two-Pass Review System

**Pass 1: CRITICAL scan — blocks merge until resolved**

Examples of CRITICAL findings:
- SQL injection via unvalidated user input
- Hardcoded API key or secret
- Race condition in concurrent operations
- Missing error handling on async operations that can fail
- Authentication bypass

**Pass 2: INFORMATIONAL — tracked, doesn't block merge**

Examples of INFORMATIONAL findings:
- Variable name is ambiguous
- Function is 40 lines when it could be 20
- Test name doesn't describe the behavior
- Missing JSDoc comment

> "CRITICAL means 'this cannot go to production today.' INFORMATIONAL means 'let's make this better over time.'"

---

### Finding Format

Every finding should be written in a consistent format:

```
[Dimension] [CRITICAL|INFO] Description of the problem.
Location: filename.mjs:line
Why it matters: one sentence.
Suggested fix: one sentence or code snippet.
```

Example:
```
[Security] [CRITICAL] User input from req.body.quantity is
interpolated directly into a database query string without
sanitization.
Location: src/order.mjs:47
Why it matters: An attacker can inject arbitrary SQL to read
or destroy all orders.
Suggested fix: Use parameterized queries or an ORM.
```

---

### Pre-commit Hooks: Fast and Targeted

A good pre-commit hook:
- Runs in **1–5 seconds** (not 30+)
- Checks **only staged files** — not the whole repo
- **Fails loudly** with a specific message
- Is **easy to override** when you know what you're doing

A bad pre-commit hook:
- Takes 45 seconds — developers disable it
- Runs the full test suite — too slow to be useful as a commit gate
- Fails with no explanation — developers ignore it

---

### Anti-pattern Catalog

Every bug you find becomes a pre-commit detector:

| Bug found in review | Pre-commit check |
|---------------------|-----------------|
| Hardcoded `AWS_SECRET_KEY` | secretlint |
| Interpolated SQL | ripgrep pattern: `query.*\$\{` |
| `console.log` in production code | eslint no-console |
| `TODO:` inside test files | grep pattern + staged-file filter |
| Missing await on async calls | eslint require-await |

> "Every finding in a code review is a seed for automation. You fix the bug once. The detector prevents it forever."

---

### Demo: Security Bug → Pre-commit Detector

**Add the bug:**
```js
// src/order.mjs - BEFORE (vulnerable)
async function placeOrder(userId, quantity) {
  const query = `SELECT * FROM orders WHERE user_id = '${userId}'
                 AND quantity > ${quantity}`;
  return db.execute(query);
}
```

**Run AI code review — show the finding:**
```
[Security] [CRITICAL] SQL injection via unvalidated userId and
quantity parameters interpolated directly into query string.
Location: src/order.mjs:47
```

**Fix it:**
```js
// AFTER (parameterized)
const query = `SELECT * FROM orders WHERE user_id = ? AND quantity > ?`;
return db.execute(query, [userId, quantity]);
```

**Turn it into a pre-commit detector:**
```bash
# .lintstagedrc addition
{
  "src/**/*.mjs": [
    "bash -c 'grep -n \"\\${\\.\\*}\" \"$1\" && echo \"SQL injection risk: use parameterized queries\" && exit 1 || exit 0' --"
  ]
}
```

---

### Exercise D — Junior (15 min)

You are given: `exercises/flawed-pr.diff`

Review it using the 7-dimension checklist. Write **3 findings** using the format:

```
[Dimension] [CRITICAL|INFO] Description.
Location: file:line
Why it matters: one sentence.
Suggested fix: one sentence.
```

At least one finding must be CRITICAL. At least one must be INFORMATIONAL.

---

### Exercise D — Senior (15 min)

Configure Husky + lint-staged for the shop-api repo:

```bash
npm install --save-dev husky lint-staged \
  @secretlint/secretlint-rule-preset-recommend secretlint

npx husky init
```

Configure `.lintstagedrc`:
```json
{
  "**/*": ["secretlint"]
}
```

Configure `.husky/pre-commit`:
```bash
npx lint-staged
```

Test it:
```bash
echo "AWS_SECRET_KEY=abc123" >> src/product.mjs
git add src/product.mjs
git commit -m "test"
# → secretlint should block this
```

**Senior stretch:** Write a custom lint-staged command that blocks commits containing `TODO:` inside any file in `tests/`.

---

### Debrief: Module 4

Discussion questions:

1. **What is the difference between a finding and a fix?** A finding says what is wrong. A fix says what to do. Why does that distinction matter in a review comment?

2. **If you found a CRITICAL security issue in someone else's PR:** What do you do? Comment on the PR? Message them directly? Who else needs to know?

3. **What pre-commit hook would have the biggest impact on your current team's code quality?** What is stopping you from adding it this week?

---

### Module 4 Key Takeaway

> "Code review is not a formality. It is the last line of defense before production."

- Use the **7-dimension framework** — not your instincts alone
- **CRITICAL blocks merge. INFORMATIONAL does not.** Be clear which is which.
- Pre-commit hooks must be fast (< 5 sec) to be used
- Every bug you find is a detector waiting to be written

---

# Module 5: Playwright + Claude Code

## Playwright + Claude Code
### 15:15 — 75 minutes

**Learning goals:**
1. Understand when E2E tests add value unit tests can't provide
2. Use **Playwright MCP** with Claude Code to generate and run E2E tests
3. Write prompts that produce specific, assertion-rich tests
4. Review AI-generated tests with adversarial eyes

> "E2E tests are expensive to write and maintain. Playwright + Claude changes that equation. But only if you review what comes out."

---

### Unit Tests vs E2E Tests

| | Unit Tests | E2E Tests |
|--|------------|-----------|
| What they test | One function | Full user journey |
| Speed | Milliseconds | Seconds to minutes |
| Dependencies | None (mocked) | Real server, real browser |
| Failure clarity | Exact — which line | Fuzzy — something in the flow |
| Maintenance cost | Low | Higher |
| What they miss | Integration bugs | Nothing (if complete) |

> "Unit tests tell you the engine works. E2E tests tell you the car drives."

---

### Playwright vs Selenium

| | Playwright | Selenium |
|--|------------|----------|
| Auto-wait | Yes — built in | No — manual waits |
| Parallel execution | Yes, out of box | Requires Grid |
| Browser support | Chromium, Firefox, WebKit | Chrome, Firefox, Edge |
| API style | Modern async/await | Older callback-heavy |
| Trace viewer | Yes — visual replay | No |
| Speed | Fast | Slower |

- **Self-healing locators** (Playwright 1.56): if a CSS class changes, Playwright tries alternative selectors automatically
- This dramatically reduces "flaky selector" failures

---

### Playwright MCP: How It Works

Without MCP:
- Claude looks at screenshots → interprets pixels → guesses selectors
- Token-heavy, error-prone, requires visual interpretation

With Playwright MCP:
- Claude connects to the browser's **accessibility tree** — the structured semantic representation
- Gets element roles, labels, text content — not pixel positions
- **4x more token-efficient** than screenshot mode
- Selectors derived from meaning, not layout

> "Claude doesn't 'see' the page. It reads it like a screen reader would. That's why the selectors are more stable."

---

### The Prompting Skill

What makes a good Playwright prompt:

| Weak prompt | Strong prompt |
|-------------|--------------|
| "Test the checkout" | "Write an E2E test that navigates to /, adds 'Blue Hoodie' to cart, proceeds to checkout, fills in email 'test@example.com', clicks 'Complete Purchase', and verifies the confirmation text contains 'Order confirmed'" |
| "Test login" | "Test that logging in with an incorrect password shows the message 'Invalid credentials' and does not redirect" |
| "Check the cart" | "Verify that attempting checkout with an empty cart shows an error message containing 'Your cart is empty' without navigating away from the cart page" |

Rules for strong prompts:
- **Specific user action sequence** — step by step
- **Named elements** — use the real label/button text
- **Explicit assertion** — what text/state you expect to see
- **Failure condition** — what should NOT happen

---

### Demo: E2E Checkout Test via Claude Code

```bash
# Start the dev server
cd workshop/shop-api-starter
npm run dev
```

**Prompt to Claude Code (show typing this):**

> "Using Playwright MCP, write an E2E test for the checkout flow: navigate to /, add 'Blue Hoodie' to the cart, proceed to checkout, fill in email field with 'test@example.com', click the 'Complete Purchase' button, verify the confirmation message contains 'Order confirmed'. Save the test to e2e/checkout.spec.js."

Claude generates the test. Show it on screen. Run it:

```bash
npx playwright test e2e/checkout.spec.js
npx playwright show-report
```

**Review the generated test critically:**
- Is the assertion `.toContain('Order confirmed')` or `.toContain('')`?
- Does it test what happens on failure (e.g., bad email)?
- Are there hardcoded wait times (`page.waitForTimeout(3000)`) — red flag

---

### Exercise E — All (30 min)

Write your own prompts to Claude Code. Generate and run these three E2E tests:

**Test 1:** Attempting checkout with an empty cart shows an error message

**Test 2:** After completing a purchase, the product stock count decreases by the ordered quantity

**Test 3:** Attempting to set a negative price in the admin form is rejected with a validation message

**Process for each test:**
1. Write your prompt (be specific — use the prompt rules above)
2. Submit to Claude Code
3. Run the generated test: `npx playwright test`
4. Review the assertions — are they specific or existence-only?
5. Strengthen any weak assertion

After all three: be ready to share your best prompt and your weakest assertion.

---

### Debrief: Module 5

Discussion questions:

1. **Which of your three prompts produced the best test?** What specifically made it better — was it the level of detail, the named elements, the explicit assertion?

2. **Find the weakest assertion in any test you reviewed today.** Read it aloud. What real bug would it fail to catch?

3. **Where is the line between using Claude to accelerate and using Claude to avoid thinking?** What does "critical review" mean in practice for you?

---

### Module 5 Key Takeaway

> "Claude Code writes the Playwright. You write the prompts — and you review the output critically."

- Playwright MCP reads the accessibility tree — more stable than screenshots
- **Specificity in prompts = quality in tests**
- Self-healing locators reduce maintenance, not eliminate review
- Every AI-generated assertion must be read: does it actually assert the behavior?

---

# Module 6: AI Hallucinations + Safeguards

## AI Hallucinations + Safeguards
### 16:30 — 30 minutes

**Learning goals:**
1. Name and recognize the 4 failure modes of AI-generated tests
2. Build critical review habits that apply in the next 24 hours
3. Know the team-level gates that catch what individual review misses

> "The most dangerous test is one that passes but doesn't catch anything."

---

### The 4 Failure Modes

**Failure Mode 1: Existence-only assertions**
```js
// Looks like a test. Is not a test.
expect(result).toBeDefined();
expect(cart).not.toBeNull();
expect(response.status).toBeTruthy();  // 404 is truthy!
```
Fix: assert the specific value, not existence.

**Failure Mode 2: Over-mocking**
```js
// Mocks the thing you're testing — tests the mock, not the code
vi.mock('../src/cart.mjs', () => ({ addItem: vi.fn().mockReturnValue(true) }));
it('addItem returns true', () => {
  expect(addItem()).toBe(true);  // you wrote this. you're testing your own mock.
});
```
Fix: mock dependencies, not the unit under test.

---

### The 4 Failure Modes (continued)

**Failure Mode 3: Coverage without quality**

The Outsight AI finding (2025): AI-generated test suites achieve high line coverage but average **20.32% mutation score**.

The tests run every line. They detect almost no bugs. The coverage report looks healthy.

**Failure Mode 4: Oracle failures**

An oracle failure is when the test validates what the code does, not what it should do.

```js
// Cart calculates total wrong: 10 + 20 = 25 (off by 5)
// AI generates test AFTER seeing the broken implementation
it('total is correct', () => {
  expect(cart.total()).toBe(25); // wrong answer, but it matches the code
});
```

AI tests generated after the implementation tend to validate the implementation, including its bugs.

---

### The 4 Safeguards

| Safeguard | What it catches |
|-----------|----------------|
| **Write tests before code (TDD)** | Oracle failures — spec before implementation |
| **Run mutation testing on AI suites** | Coverage-without-quality, existence assertions |
| **Human review all AI tests** | Adversarial thinking — what would a real bug look like? |
| **Team gates: PR blocks if mutation < threshold** | Systematic gap — catches what individual review misses |

> "Individual vigilance is necessary. Team gates are sufficient."

The mental model for review: **"What real bug would survive this test suite?"**
Not: "Do the tests look complete?"

---

### Exercise F — All (15 min)

Open `exercises/hallucination-exercise.mjs`.

**10 tests are provided. Some are real tests. Some are testing illusions.**

For each test, mark it:
- **GOOD** — tests a real behavior with a specific assertion
- **ILLUSION** — passes but catches no real bugs

Then pick **2 ILLUSION tests** and fix them. A fixed test should fail if the code is wrong.

Be ready to explain: what real bug would each ILLUSION have missed?

---

### Debrief: Module 6

Discussion questions:

1. **Which illusions were hardest to spot?** Was it the existence assertions, the over-mocks, or something else?

2. **What pattern would you add to your team's code review checklist** to catch existence-only assertions before they merge?

3. **If you're using AI to generate tests starting tomorrow:** What is the one thing you will do differently based on today?

---

### Module 6 Key Takeaway

> "The most dangerous test is one that passes but doesn't catch anything."

- AI tests have high coverage and low mutation scores by default
- TDD is the primary safeguard — write the spec before the code
- Review AI tests adversarially: **"What bug would this miss?"**
- Team gates (mutation score in CI) are the systematic backstop

---

# Capstone Presentations + Critical Feedback

## Capstone: Present Your Work
### 17:00 — 45 minutes

**Structure:** Each participant presents for 3 minutes. Group gives 2 minutes of feedback.

**Three questions on the board — answer all three:**

1. **What test did you write today that you are most confident in? Why?**
2. **What test did you write today that you now have doubts about? What would you change?**
3. **What is the one practice from today you will apply in your current project in the next week?**

> "The third question is a commitment, not a goal. I'm going to ask you to write it down with a specific action and a specific deadline."

**Written feedback format:** Each person in the room writes one sentence on a card for the presenter — either a strength they heard or a specific question.

---

# Close

## Close
### 17:45 — 15 minutes

### What You Leave With

**Immediate actions (this week):**
- Add `npx stryker run` to your project — see your real mutation score
- Add one pre-commit hook (secretlint is the fastest win)
- Review one AI-generated test in your repo using the 4 failure modes

**Resources:**
- Workshop repo: all exercises, starters, solutions on the workshop GitHub
- Vitest docs: `vitest.dev`
- Playwright docs + MCP setup: `playwright.dev/docs/api/class-playwright`
- Stryker docs: `stryker-mutator.io`
- fast-check docs: `fast-check.dev`
- DORA 2025 State of DevOps Report (linked in repo README)

**The one-slide summary:**

| Practice | Signal it gives | Minimum threshold |
|----------|----------------|-------------------|
| Unit tests in CI | Code does not regress | 100% pass |
| Branch coverage | Tests execute branches | ≥ 80% |
| Mutation score | Tests catch real bugs | ≥ 70% |
| Pre-commit hooks | Fast feedback before push | < 5 sec |
| E2E tests | Full flow works | Critical paths covered |
| Human review of AI tests | Oracle failures blocked | Every AI-generated test |

> "Quality is not a gate at the end of development. It is a property you build in from the first line of code. Thank you for today."
