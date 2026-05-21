# Presenter Notes: AI-Enhanced QA Workshop
### Facilitator Guide — 8 Hours | 9 Participants

**How to use this document:**
Read through entirely the night before. Print pages you'll need for each segment. Keep this open on a second screen. Every section below matches the slide deck (02-workshop-slides.md) one-to-one.

---

## Pre-Workshop Setup (the night before)

### Environment checklist — run these yourself first

```bash
node --version        # must be >= 20
npm --version         # must be >= 10
cd workshop/shop-api-starter
npm install
npx vitest run        # should show tests passing (or "no tests found" if starter is empty)
npx playwright install
npx playwright --version
```

Verify the Stryker config exists:
```bash
ls stryker.config.mjs   # if missing, create it (see Module 3 notes)
```

Verify Claude Code is accessible:
```bash
claude --version
```

### Files to have ready

- `src/product.mjs` — with `getProductById`, `getProductsByCategory`, `updateProductPrice`
- `src/cart.mjs` — skeleton only (class declared, methods empty or stubbed)
- `src/coupon.mjs` — with `applyCoupon(subtotal, coupon)` function
- `src/order.mjs` — with the log injection bug pre-inserted
- `exercises/flawed-pr.diff` — the security-flawed PR diff for Exercise D
- `exercises/hallucination-exercise.mjs` — 10 tests, mix of good and illusions

### Room setup

- Projector connected and mirroring your terminal + browser
- Font size in terminal: 18pt minimum (people in back need to read it)
- Have a spare laptop charged — someone always forgets their charger
- Sticky notes and pens on tables — used during capstone

---

## Welcome + Setup (08:30–09:00)

### Opening (5 minutes)

Do not start with slides. Start by asking people to open a terminal and run:

```bash
node --version
```

While they do that, introduce yourself briefly (2 sentences max). Then:

"Go around the room — name, team, one word for how you feel about testing right now. No wrong answers."

Listen for: "hate it", "boring", "necessary evil", "love it", "overwhelmed". Acknowledge whatever you hear. If someone says "hate it" — good, use that: "By 17:45 I want to know if that's changed."

### Environment verification (15 minutes)

Walk through the commands on the slides. As each person runs them:

```bash
node --version       # need >= 20.x
npm --version        # need >= 10.x
npx vitest --version
npx playwright --version
cd workshop/shop-api-starter && npm install
```

**Common setup problems and fixes:**

| Error | Cause | Fix |
|-------|-------|-----|
| `node: command not found` | Node not installed | `brew install node` (Mac) or direct download |
| `node --version` shows v16 or v18 | Wrong Node version | `nvm use 20` or `nvm install 20` |
| `npm install` errors on EACCES | Permission issue | `sudo chown -R $(whoami) ~/.npm` |
| `playwright: command not found` | Not installed globally | Use `npx playwright` throughout |
| `npx playwright install` hangs | Browser download slow | Do this first — takes 2–3 min on slow connections |

**If someone is completely stuck:** Pair them with a neighbor for the first module. Do not spend more than 5 minutes on any one person's environment before the whole group — come back to them individually during the first exercise.

### Schedule walkthrough (5 minutes)

Show the schedule table from the slides. Make these points explicitly:
- Breaks are real breaks — no "quick one more thing"
- Exercises have Junior and Senior variants — pick the right one, there is no shame
- Capstone at 17:00 is mandatory — start thinking about what you'll share

### Transition to Module 1

"Everyone green? Good. Let's write our first test."

---

## Module 1: Unit Testing with Vitest (09:00–10:15)

### Opening (10 minutes)

Start with the cost-of-bugs table. Ask: "Where does your team find most of your bugs today?" Get 2–3 answers. Then: "This workshop is about moving that left."

Do not rush through the Vitest vs Jest vs node:test comparison. Engineers sometimes have strong opinions about their current tool. The message is: **"The concepts are identical. The API is 95% the same. This is not a rewrite recommendation."**

### AAA pattern (10 minutes)

The AAA slide is the most important concept in Module 1. Before showing the code, ask: "How many of you already write tests? How many use AAA explicitly?"

Walk through the example slowly. Point at each section:
- "This is Arrange — we're setting up the world. No behavior yet."
- "This is Act — one call. Always exactly one."
- "This is Assert — we check one thing."

Then: "What's wrong with a test that has 8 lines of Act?" Let them answer. The answer you want: "It's testing multiple behaviors, so when it fails you don't know which one broke."

### Test naming (10 minutes)

The naming slide should feel uncomfortable. Put the bad examples on screen and ask: "Who has seen test names like `test1` or `testGetProduct` in real code?" (Almost everyone will raise a hand.)

For the rule: read the name aloud. Demonstrate this by reading: "Returns product when id exists." That's a sentence. Now read: "testGetProduct". That's a method call. Not a sentence.

If you have time: ask one person to share a test name they wrote this morning in the setup exercise, and workshop it live.

### Demo (15 minutes)

This is the most important section of Module 1. Move slowly. Do not type too fast.

**Exact sequence:**

1. `cat src/product.mjs` — show the source file first
2. Create `tests/product.test.mjs` — type it, don't paste (they need to see the structure)
3. `npx vitest run` — show GREEN
4. Introduce the bug: change `'Blue Hoodie'` to `'Red Hoodie'` in source
5. `npx vitest run` — show RED with the exact error message highlighted
6. Fix it. Show GREEN again.
7. `npx vitest` (no `run`) — show watch mode. Save the file. Show it re-run automatically.

**Common demo issues:**
- If `vitest run` says "no tests found": the import path in the test file is wrong. Check `../src/product.mjs` vs `./src/product.mjs`.
- If ESM import fails: verify `package.json` has `"type": "module"`.

**What to say during the red failure:**
"This is the most important moment. The test is telling you exactly what's wrong: expected 'Blue Hoodie', received 'Red Hoodie', line 12 of product.mjs. That's the value of a specific assertion."

---

### Exercise A: Junior Version

**Duration**: 20 minutes
**Tier**: Junior
**Prerequisites**: Node installed, `npm install` completed, `npx vitest run` worked in demo

**Setup commands** (run before exercise starts):

```bash
cd workshop/shop-api-starter
# product.mjs must be in its correct state (not broken from demo)
git checkout src/product.mjs   # or manually verify
```

**What participants do:**

1. Open `src/product.mjs` — read the three functions
2. Create (or open) `tests/product.test.mjs`
3. Write a `describe` block for `getProductById`
4. Write test 1: product has the correct id
5. Write test 2: product has the correct name
6. Write test 3: `updateProductPrice` throws when price is negative
7. Run `npx vitest run` — all 3 green before stopping

**Expected output:**

```
✓ tests/product.test.mjs (3)
  ✓ getProductById › returns a product with the correct id (3ms)
  ✓ getProductById › returns the correct product name (1ms)
  ✓ updateProductPrice › throws when price is negative (2ms)

Test Files  1 passed (1)
Tests  3 passed (3)
```

**Common errors + fixes:**

- Error: `Cannot find module '../src/product.mjs'` → Fix: check relative path in import statement; make sure you're in `tests/` when you create the file
- Error: `getProductById is not a function` → Fix: verify the export in `product.mjs` is `export function getProductById` (named export, not default)
- Error: `Expected function to throw but it did not` → Fix: wrap the call in an arrow function: `expect(() => updateProductPrice('x', -1)).toThrow()`
- Error: Tests all pass but prices are wrong → Fix: check what product data is actually in the seed data — show them `product.mjs` data array

**For juniors who finish early:** Ask them to add a test for `getProductsByCategory` — it should return an array, and the array should only contain products in the specified category.

**Debrief questions:**

1. "Read me the name of your third test." (Is it a sentence? Is it specific?)
2. "What would happen if `updateProductPrice` was missing the `< 0` check entirely — would your test catch it?"
3. "If someone changed the seed data in product.mjs, which of your 3 tests would break? Is that a problem or is that the test doing its job?"

**If it breaks (recovery path):**

If someone's environment is completely broken, have them pair with the person next to them. They should watch and narrate what they would type. This is not ideal but it keeps them in the room mentally.

---

### Exercise A: Senior Stretch

**Duration**: +20 minutes (after junior version passes)
**Tier**: Senior
**Prerequisites**: All 3 junior tests passing

**Setup commands:**

```bash
npm install --save-dev @vitest/coverage-v8
```

**What participants do:**

1. Run `npx vitest run --coverage`
2. Run `open coverage/index.html` (Mac) or `start coverage/index.html` (Windows)
3. Navigate to `product.mjs` in the report
4. Find the uncovered branch (yellow/red highlight) — it is the `if (!product)` branch in `updateProductPrice`
5. Write a test: call `updateProductPrice` with a valid price but a product id that does not exist — assert it returns `false`
6. Re-run coverage — verify that branch turns green

**Expected output (coverage):**

```
product.mjs | Stmts | Branch | Funcs | Lines
-----------|-------|--------|-------|------
           |  100% |   75%  |  100% |  100%
```

After adding the test:
```
           |  100% |  100%  |  100% |  100%
```

**What to say while circulating:**

"The branch coverage shows 75%. That means one of the four branches — if/else combinations — in this file never runs during your tests. Finding it is the exercise."

**Common errors + fixes:**

- Error: `coverage/index.html` doesn't exist → Fix: `npm install --save-dev @vitest/coverage-v8` then add `coverage: { provider: 'v8' }` to `vitest.config.mjs`
- Error: Coverage shows 100% already → The branch is already covered — check if someone fixed it during demo. If so, revert `product.mjs` and look for a different uncovered branch.

**Debrief question to ask seniors specifically:**

"You got to 100% branch coverage. Is that enough? What does mutation testing give you that branch coverage doesn't?" (Preview for Module 3.)

---

### Module 1 → Module 2 Transition

Before break (at 10:15):

"Take your 15 minutes. When you come back at 10:30, we're going to flip the process. Instead of 'write code, then write tests,' we're going to 'write tests, then write code.' It feels backward. It is not."

---

## Module 2: TDD + AI Red-Green-Refactor (10:30–11:45)

### Opening (10 minutes)

Do not start with the theory slide. Start by asking: "How many of you, when you write a new function, write the test after the function is working?" Most hands will go up. "That's natural. That's also why most test suites have oracle failures. We're going to fix that habit today."

Then show the TDD cycle diagram. Walk through it twice. The key framing is:

"RED is not failure. RED is proof that your test is real. A test that passes without implementation is not a test — it's a lie."

### The DORA data (5 minutes)

Present the numbers quickly — don't dwell. The 40–90% range always gets a question ("that's a huge range"). The answer: "Adoption depth varies. Teams that do TDD strictly for critical paths see 90%. Teams that do it inconsistently see 40%. The floor is still better than not doing it."

### AI as accelerant (10 minutes)

This is the most nuanced part of Module 2. The risk: participants leave thinking "Claude writes my tests." The message is: **Claude suggests edge cases. You decide which ones matter. You write the test. You write the implementation.**

The demonstration of the "What edge cases am I missing?" prompt is critical. Show it live. Show what Claude responds. Then point at 2–3 of the suggestions and say: "Are these real requirements or theoretical edge cases? That judgment is yours, not Claude's."

### Demo (20 minutes)

This is the centerpiece of the whole morning. Run it at a pace where people can follow:

**Exact sequence:**

1. Show `src/cart.mjs` skeleton — empty class
2. Open `tests/cart.test.mjs` — blank file
3. Write the `addItem` test (RED) — type it, don't paste
4. `npx vitest run` — show the RED failure with "Cart is not a constructor" or similar
5. "Good. The test is real. Now I'm going to write the minimum code to make it pass."
6. Write the Cart class — minimal, ugly if necessary
7. `npx vitest run` — show GREEN
8. "Now I clean up. I don't add features. I improve the code."
9. Refactor (extract a helper, rename a variable) — run again, still GREEN
10. Open Claude Code. Type the edge case prompt. Show the output.
11. Pick one edge case suggestion. Write a test for it. RED → GREEN.

**What to say during RED:**

"I want everyone to look at this error. 'Cart is not a constructor.' My test is telling me exactly what it needs. I'm going to give it exactly that."

**What to say during GREEN:**

"Notice: I did not add any features beyond what the test demanded. The test for `total()` doesn't exist yet, so I haven't written `total()`. That is the discipline."

**Common demo issues:**

- If Claude Code is not connected / MCP not configured: do the edge-case prompt as a thought exercise. Ask the group: "What edge cases would you add?" Then compare to what Claude typically suggests.
- If the cart implementation passes immediately (someone left code in the starter): add `throw new Error('Not implemented')` at the top of the class constructor as a reset.

---

### Exercise B: TDD — All (30 min)

**Duration**: 30 minutes
**Tier**: All participants
**Prerequisites**: Watch mode working; `src/cart.mjs` skeleton available

**Setup commands** (run before exercise starts):

```bash
cd workshop/shop-api-starter
git checkout src/cart.mjs   # reset to skeleton
cp src/cart.mjs src/cart.mjs.bak  # safety net
```

**What participants do:**

1. Open `tests/cart.test.mjs` — start fresh
2. Write a test for `addItem` — run it — verify RED
3. Write the minimum `Cart.addItem` implementation
4. Run — verify GREEN
5. Repeat for `total()` — test first, then implement
6. Ask Claude Code: "What edge cases am I missing for addItem?"
7. Choose one edge case from the response — add the test, implement it

**Expected output:**

```
✓ tests/cart.test.mjs (4+)
  ✓ Cart.addItem › adds a product to the cart
  ✓ Cart.addItem › increments quantity when same product added twice
  ✓ Cart.total › returns sum of all items
  ✓ Cart.addItem › [their chosen edge case]
```

**The non-negotiable rule — enforce this:**

Walk the room during the exercise. If you see someone writing implementation before a test, stop them. Gently: "What test are you writing first?" If they say "I already know what the function does, so I'll test after" — that is the exact habit we're breaking. Ask them to delete the implementation and start with the test.

**Common errors + fixes:**

- Error: `cart.items is not iterable` in total() → Fix: `this.items = []` in constructor is missing
- Error: Test passes even though implementation is empty → They wrote a test that only asserts existence (`expect(cart).toBeDefined()`) — show them the test; ask "what real bug would this miss?"
- Error: `Cannot read properties of undefined (reading 'price')` → The `addItem` method is receiving the product correctly but not storing it; check the push to `this.items`

**If someone finishes in under 20 minutes:** Ask them to explain their implementation to the person next to them. Teaching it solidifies understanding.

---

### Exercise B: Senior Stretch — applyDiscount (15 min)

**Duration**: 15 minutes (overlaps with junior time if they finish early, or runs after)
**Tier**: Senior
**Prerequisites**: addItem and total both passing with tests

**What seniors do:**

1. Write a test for `applyDiscount(-10)` — should throw `RangeError` → RED
2. Implement: throw if `percentage < 0`
3. GREEN
4. Write test for `applyDiscount(110)` — should throw → RED, implement → GREEN
5. Write test for `applyDiscount(0)` — total unchanged → RED, implement → GREEN
6. Continue through the 50% and $0 cases

**Emphasis:** Each test-implement cycle should be a separate commit if possible. This is the mechanical enforcement in practice.

**Expected output:**

```
✓ Cart.applyDiscount › throws RangeError when percentage is negative
✓ Cart.applyDiscount › throws RangeError when percentage exceeds 100
✓ Cart.applyDiscount › leaves total unchanged when percentage is 0
✓ Cart.applyDiscount › reduces total by correct percentage
✓ Cart.applyDiscount › total never goes below zero
```

**Common errors + fixes:**

- Error: `RangeError` not thrown, regular `Error` thrown → The test should use `expect(() => cart.applyDiscount(-10)).toThrow(RangeError)` — not just `.toThrow()`
- Error: Total goes negative for large discounts → They forgot the `Math.max(0, ...)` guard — let them figure it out from the failing test before hinting
- Error: 0% discount changes the total → floating point issue — use `Math.round()` or check with `toBeCloseTo()` not `toBe()`

---

### Lunch Briefing (11:45)

Exactly 15 minutes before lunch. Do not run over.

**Say this:**

"Before you close your laptops — three things. First: look at your Module 2 tests right now. Read each test name out loud in your head. Is it a sentence or a method call? Second: during lunch, think about the coupon system. We're testing `coupon.mjs` in Module 3. What invariants do you think exist? What should always be true about a coupon calculation, no matter the input? Third: write down one question you want answered this afternoon. One specific question. We come back at 13:00."

Do not extend into lunch time. Respect it.

---

## Module 3: Code Coverage + Mutation Testing (13:00–14:00)

### Opening re-entry (5 minutes)

Start by collecting the questions people wrote down. Have them read them — not all, but 3–4. Address obvious ones immediately. Hold complex ones for the debrief.

Then: "I promised this module would make you uncomfortable. Here's why."

### The coverage illusion (10 minutes)

The `toBeDefined()` example on the slides is important. Type it live if you can. Run it. Show the green checkmark. Then show the coverage report showing 100%. Then say: "This test is a lie. It proves the code runs. It says nothing about whether it's correct."

Watch for participant reaction here — some will recognize this pattern from their own code. That recognition is the learning moment.

### Mutation testing concept (10 minutes)

The mutant table needs to be concrete. Before showing it, ask: "If I changed `>` to `>=` in your price validation, would your current tests catch that?" Pause. "That's what Stryker checks. Automatically. For every operator in your code."

Mutation score thresholds: be direct about the 20.32% finding from Outsight AI. Some participants will be skeptical. The response: "This is peer-reviewed research on real codebases. The sample included enterprise-quality AI tools. The number is the number."

### Demo (15 minutes)

**Exact sequence:**

```bash
cd workshop/shop-api-starter

# Step 1: show coverage looking good
npx vitest run --coverage
# show browser: 85% — discuss what that looks like
```

Then run Stryker. Note: Stryker takes 2–5 minutes on first run. Have something to say:

"While this runs — Stryker is compiling the source, creating mutated versions, running your entire test suite once per mutant. For 50 lines of code with 20 mutants, that's 20 full test runs. This is why mutation testing runs in CI, not in watch mode."

```bash
npx stryker run
open stryker-tmp/reports/mutation/index.html
```

Walk through the report:
1. Show the summary: killed vs survived
2. Click into `cart.mjs` — find a survived mutant
3. Expand it — show what change was made
4. "Which test would have caught this? None of them, because we only tested the happy path."

**Stryker config** (if not already in repo):

```js
// stryker.config.mjs
export default {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'vitest',
  vitest: { configFile: 'vitest.config.mjs' },
  coverageAnalysis: 'perTest',
  mutate: ['src/**/*.mjs', '!src/**/*.spec.mjs'],
  thresholds: { high: 80, low: 60, break: 50 }
};
```

---

### Exercise C: Junior — Kill the Mutants (20 min)

**Duration**: 20 minutes
**Tier**: Junior
**Prerequisites**: Stryker run completed in demo; HTML report open

**Setup commands:**

```bash
# Stryker report should already be open from demo
# If not:
npx stryker run && open stryker-tmp/reports/mutation/index.html
```

**What participants do:**

1. Navigate the report — find `cart.mjs`
2. Identify 3 surviving mutants (green lines with yellow dot = survived)
3. For each mutant, read the mutation: what change was made?
4. Write a test that would catch that exact bug
5. After all 3 tests written: `npx stryker run` again
6. Verify mutation score increased above 70%

**Expected output:**

```
# Before
Mutation score: 45%
Survived: 11  Killed: 9

# After adding 3 targeted tests
Mutation score: 73%
Survived: 5  Killed: 15
```

**Common errors + fixes:**

- Error: "I can't find the survived mutants" → They're looking at the text report, not HTML. Direct them to the HTML file. The yellow dots are hard to miss in the visual.
- Error: New tests don't improve the score → Their tests are still using existence assertions. Ask them to read the assertion aloud. "Is that checking the specific value the mutant changes?"
- Error: Stryker takes too long on second run → Normal — it's re-running all mutants. Warn them in advance.

**What to circulate and watch for:**

People often try to "kill" mutants by making their existing tests more specific (adding more assertions to old tests). This is valid! Point out that sometimes you need a new test, sometimes you need a better assertion.

---

### Exercise C: Senior — Property-Based Testing (20 min)

**Duration**: 20 minutes
**Tier**: Senior
**Prerequisites**: fast-check installed; `src/coupon.mjs` present

**Setup commands:**

```bash
npm install --save-dev fast-check
```

Verify `coupon.mjs` has:
```js
export function applyCoupon(total, discountPct) {
  if (discountPct < 0 || discountPct > 100) throw new RangeError('...');
  return Math.max(0, total * (1 - discountPct / 100));
}
```

**What seniors do:**

1. Create `tests/coupon.property.test.mjs`
2. Write the 3 invariants as `fc.property()` tests (shown on slides)
3. Run `npx vitest run tests/coupon.property.test.mjs`
4. Verify all 3 pass with 100 randomized runs each

**Expected output:**

```
✓ tests/coupon.property.test.mjs (3)
  ✓ total never goes below zero after any valid discount (147ms)
  ✓ 0% discount leaves total unchanged (89ms)
  ✓ 100% fixed discount on $50 item results in $0 (93ms)
```

**Common errors + fixes:**

- Error: `fc is not defined` → Import: `import * as fc from 'fast-check'`
- Error: Property test fails immediately → Their invariant is wrong, or `applyCoupon` has a bug. Ask: "Is the invariant mathematically correct?" (e.g., 0% discount: total unchanged means `applyCoupon(50, 0) === 50`)
- Error: `toBeCloseTo` vs `toBe` for float comparison → For discount results, use `Math.abs(result - expected) < 0.01` inside the property, or `toBeCloseTo(expected, 2)`

**Debrief for seniors specifically:**

"fast-check generated 100 random inputs. How many test cases did you write? One property = 100 tests. That's the value. The risk: if the invariant is wrong, all 100 tests still pass and your assumption is wrong. The invariant is the judgment call — yours, not fast-check's."

---

### Module 3 → Module 4 Transition

"Module 3 is about measuring quality. Module 4 is about preventing problems before they land in the codebase. We're going from detection to prevention."

---

## Module 4: Code Reviews + Pre-commit Hooks (14:00–15:00)

### Opening (10 minutes)

Start with a question: "When was the last time a code review caught a real bug before production? How did you find out it was real?"

Get 2 stories. The point is to anchor the module in concrete experience, not abstract process.

Then show the 7-dimension framework. Ask: "When you do code reviews now, which of these do you actually check? Which do you skip?" Be non-judgmental — most people focus on correctness and readability and skip security and architecture.

### Two-pass system (10 minutes)

The CRITICAL vs INFORMATIONAL distinction is practical, not theoretical. Walk through the CRITICAL examples on the slide and for each one, ask: "If this ships to production today, what is the worst-case scenario?"

- SQL injection: "An attacker can dump your user table or drop it entirely."
- Hardcoded secret: "Anyone who reads this file (everyone with repo access) now has production credentials."
- Race condition: "Two requests come in simultaneously. One corrupts the other's data."

The INFORMATIONAL examples are important too: emphasize that flagging these as CRITICAL when they're not is just as damaging as missing a real CRITICAL. It trains people to ignore the review system.

### Finding format (5 minutes)

Show the format. Then show a bad finding: "this is wrong." Ask why it's bad. Then show the good format and ask participants to read it. The three elements: location, why it matters, suggested fix.

"Why it matters" is the most important part. If you can't explain why it matters in one sentence, you don't understand the finding well enough to report it.

### Demo (15 minutes)

This demo has two parts and needs to flow smoothly.

**Part 1: SQL injection → AI review → finding:**

```js
// Type this into src/order.mjs — show the vulnerability clearly
async function placeOrder(userId, quantity) {
  const query = `SELECT * FROM orders WHERE user_id = '${userId}'
                 AND quantity > ${quantity}`;
  return db.execute(query);
}
```

Open Claude Code. Prompt: "Review this function for security issues. Format any finding as: [Dimension] [CRITICAL|INFO] Description. Location: file:line."

Show the response. It will catch the injection. Read it aloud. Ask: "Is this a CRITICAL or INFORMATIONAL finding? Why?"

**Part 2: Fix + pre-commit detector:**

```js
// Fix it
const query = `SELECT * FROM orders WHERE user_id = ? AND quantity > ?`;
return db.execute(query, [userId, quantity]);
```

Then show the ripgrep detector concept — this becomes a pre-commit check:

```bash
# Would block any staged file with SQL interpolation pattern
grep -En 'query.*`.*\$\{' src/*.mjs && echo "SQL injection risk" && exit 1
```

---

### Exercise D: Junior — PR Review (15 min)

**Duration**: 15 minutes
**Tier**: Junior
**Prerequisites**: `exercises/flawed-pr.diff` is readable; participants have the 7-dimension checklist

**Setup commands:**

```bash
cat exercises/flawed-pr.diff
# or open in editor
```

**What the diff contains** (you built this):

The diff should include at minimum:
1. A SQL injection in a query string (Security: CRITICAL)
2. A missing `await` on an async database call (Correctness: CRITICAL)
3. A variable named `x` or `temp` (Readability: INFO)
4. A function with no error handling around a JSON.parse (Correctness/Performance: INFO or CRITICAL depending on context)

**What participants do:**

1. Read the diff carefully — not quickly
2. For each finding, write it in format: `[Dimension] [CRITICAL|INFO] Description. Location: file:line. Why: sentence. Fix: sentence.`
3. Write at least 3 findings — at least 1 CRITICAL, at least 1 INFO

**Expected output (example):**

```
[Security] [CRITICAL] User input from req.body.userId interpolated directly
into SQL query string without sanitization.
Location: src/order.mjs:47
Why: Allows SQL injection — attacker can read or destroy all orders.
Fix: Use parameterized query: db.execute(sql, [userId]).

[Correctness] [CRITICAL] Missing await on db.findOrder() call — function
returns a Promise, not the resolved value.
Location: src/order.mjs:52
Why: Subsequent code operates on Promise object instead of result.
Fix: Add await: const order = await db.findOrder(id);

[Readability] [INFO] Variable 'x' does not describe its purpose.
Location: src/order.mjs:38
Why: Future readers cannot determine what x represents without tracing the call.
Fix: Rename to 'userId' or 'customerId' based on actual meaning.
```

**Common errors + fixes:**

- Error: "I only found 2 things" → Walk through the diff with them. Ask: "What does this line do? What's the worst that could happen?" Often they found the right things but didn't recognize the third.
- Error: They marked everything CRITICAL → Discuss: "If everything is CRITICAL, how does your team prioritize?" INFORMATIONAL is not "unimportant" — it's "doesn't block today."
- Error: Findings have no location → Enforce the format. "Where in the file is this? I need a line number."

---

### Exercise D: Senior — Husky + secretlint (15 min)

**Duration**: 15 minutes
**Tier**: Senior
**Prerequisites**: Git repo initialized; npm install done

**Setup commands** (run before participants start):

```bash
cd workshop/shop-api-starter
git init   # if not already a git repo
git add -A && git commit -m "initial"   # need a clean state
```

**What seniors do:**

```bash
npm install --save-dev husky lint-staged \
  @secretlint/secretlint-rule-preset-recommend secretlint
npx husky init
```

Create `.secretlintrc.json`:
```json
{
  "rules": [
    { "id": "@secretlint/secretlint-rule-preset-recommend" }
  ]
}
```

Create `.lintstagedrc`:
```json
{
  "**/*": ["secretlint --secretlintrc .secretlintrc.json"]
}
```

Edit `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
npx lint-staged
```

Test it:
```bash
echo "AWS_SECRET_KEY=abc123" >> src/product.mjs
git add src/product.mjs
git commit -m "test security block"
# → should be blocked by secretlint
```

**Expected output:**

```
✖ secretlint found 1 error
  src/product.mjs
    1:1  error  [SECRETLINT_RULE_PRESET_RECOMMEND]: Found credential in src/product.mjs
      @secretlint/secretlint-rule-aws
husky - pre-commit hook exited with code 1 (error)
```

**Senior stretch:** Block `TODO:` in test files:

Add to `.lintstagedrc`:
```json
{
  "tests/**/*.{mjs,js}": [
    "bash -c 'grep -n \"TODO:\" \"$1\" && echo \"Remove TODO from test files before committing\" && exit 1 || exit 0' --"
  ]
}
```

Test: add `// TODO: fix this` inside a test file, stage it, try to commit.

**Common errors + fixes:**

- Error: `husky: command not found` → Use `npx husky init` not bare `husky init`
- Error: Pre-commit hook not executable → `chmod +x .husky/pre-commit`
- Error: secretlint passes when it should block → Check `.secretlintrc.json` is in root and properly formed JSON; run `npx secretlint src/product.mjs` directly to test
- Error: `lint-staged` runs but ignores secretlint → The pattern `"**/*"` might need to be more specific for your shell; try `"src/**"` instead

---

### Break (15:00–15:15)

"Take your break. When you come back, we're going to the browser — E2E testing with Playwright and Claude Code."

---

## Module 5: Playwright + Claude Code (15:15–16:30)

### Opening (10 minutes)

After break energy can drop. Start with a question that requires movement: "Stand up if you have E2E tests in your current project. Stay standing if they're run in CI." (Observe how many sit down at each stage.) This surfaces the reality quickly.

Then frame: "E2E tests are expensive to write and maintain. That's historically true. Claude changes the economics — but only if the output is good. Our job in this module is to generate E2E tests AND review them critically."

### Playwright vs Selenium (5 minutes)

Be brief here. The comparison table sells itself. The key point: auto-wait eliminates 60% of flaky test problems. "No more `sleep(2000)` in the middle of your test."

### Playwright MCP (10 minutes)

This is technical and some participants will not have seen it. Walk slowly.

"Without MCP: Claude looks at a screenshot. It sees pixels. It has to infer 'that blue button is probably the checkout button.' With MCP: Claude reads the accessibility tree — the semantic structure. It knows 'this is a button with label Complete Purchase.' That's what you'd tell a screen reader. It's what you should tell Claude."

Show the 4x token efficiency claim with a simple analogy: "Describing a button from a screenshot takes 200 tokens. Describing it from the accessibility tree takes 50. Multiply that by 100 elements and you see why MCP is not optional."

### Prompting skill (10 minutes)

The weak vs strong prompt table is the most practical content in this module. Go through each row.

Ask participants to type the weak prompt exactly as shown, then rewrite it into a strong one before you show the strong version. 2-minute exercise. It makes the difference concrete.

The 4 rules for strong prompts — write these on the board or whiteboard if possible:
1. Specific user action sequence
2. Named elements (real label text)
3. Explicit assertion (exact text to verify)
4. Failure condition (what should NOT happen)

### Demo (20 minutes)

This demo needs the server running. Do this before the module:

```bash
cd workshop/shop-api-starter
npm run dev
# → confirm server is running at localhost:3000 (or whatever port)
```

Open Claude Code. Type the checkout prompt slowly — let participants read it:

> "Using Playwright MCP, write an E2E test for the checkout flow: navigate to /, add 'Blue Hoodie' to the cart, proceed to checkout, fill in email field with 'test@example.com', click the 'Complete Purchase' button, verify the confirmation message contains 'Order confirmed'. Save the test to e2e/checkout.spec.js."

Wait for Claude to generate. Do not skip ahead.

When the test appears:
1. Read the assertions aloud
2. Ask: "Is `toContain('Order confirmed')` good or bad? What if the message changes to 'Purchase confirmed'?" (It would still pass — `toContain` is fragile)
3. Ask: "Are there any `waitForTimeout` calls?" (Red flag for brittle tests)
4. Run it: `npx playwright test e2e/checkout.spec.js`
5. Show the trace viewer: `npx playwright show-report`

**If Claude doesn't have Playwright MCP access:** Run without MCP — Claude will generate a test using standard Playwright API. The test may need minor adjustment. That is fine — the point is still valid.

**Common demo issues:**

- Server not running → `npm run dev` in a separate terminal
- Port conflict → change port in the server config; update the `baseURL` in `playwright.config.mjs`
- Claude generates test that fails to find elements → The element labels in the demo don't match the actual UI — update the prompt with the real element text

---

### Exercise E: Playwright E2E — All (30 min)

**Duration**: 30 minutes
**Tier**: All participants
**Prerequisites**: Server running (`npm run dev`); Playwright installed; Claude Code accessible

**Setup commands:**

```bash
cd workshop/shop-api-starter
npm run dev &   # run in background, or in a second terminal
npx playwright install   # if not already done
```

**What participants do:**

For each of the 3 tests — write prompt first, then submit to Claude:

**Test 1 — Empty cart error:**

Suggested prompt: "Using Playwright MCP, test that attempting checkout with an empty cart shows an error message. Navigate to /, click 'Proceed to Checkout' without adding any items, verify the page shows a message containing 'Your cart is empty' and does not navigate away from the cart page. Save to e2e/empty-cart.spec.js."

**Test 2 — Stock decrease:**

Suggested prompt: "Using Playwright MCP, test that after completing a purchase of 2 units of 'Blue Hoodie', the product stock count on the product page decreases by 2. Navigate to the product page first to record the initial stock, complete a purchase of 2 units, return to the product page, verify the displayed stock count is exactly 2 less than before. Save to e2e/stock-decrease.spec.js."

**Test 3 — Negative price rejection:**

Suggested prompt: "Using Playwright MCP, test that attempting to set a negative price in the admin product form shows a validation error. Navigate to /admin/products, click edit on 'Blue Hoodie', enter -10 in the price field, click 'Save', verify that a validation message appears containing 'Price must be positive' and the product's price has not changed. Save to e2e/negative-price.spec.js."

**After generating each test:**

1. Read the assertions — are they specific or existence-only?
2. Is there a `waitForTimeout`? Remove it and see if the test still passes.
3. Does the test check a failure condition (what should NOT happen)?

**Expected output (example for Test 1):**

```js
// e2e/empty-cart.spec.js (what good output looks like)
test('empty cart shows error on checkout attempt', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Proceed to Checkout');
  await expect(page.locator('[data-testid="cart-error"]'))
    .toContainText('Your cart is empty');
  await expect(page).toHaveURL('/cart');  // did not navigate away
});
```

**Common errors + fixes:**

- Error: Test can't find elements → The selectors Claude generated don't match the actual UI. Ask participants to: right-click the element in browser → Inspect → find the label or data-testid. Update the prompt with that exact text.
- Error: Test passes but shouldn't (empty assertion) → They have `expect(errorMessage).toBeDefined()` not `expect(errorMessage).toContainText('Your cart is empty')`. This is Module 6's content — note it for debrief.
- Error: Playwright can't connect to server → Server crashed or wrong port. Check `npm run dev` is still running. Check `playwright.config.mjs` baseURL matches.
- Error: Test is flaky (sometimes passes, sometimes fails) → Usually a timing issue. The `waitForTimeout` workaround is wrong — use `await expect(element).toBeVisible()` instead.

**What to circulate and ask:**

"Show me your assertion for Test 2. Is it checking the exact stock count or just that a number exists?"

---

## Module 6: AI Hallucinations + Safeguards (16:30–17:00)

### Opening (5 minutes)

Energy is lower at 16:30. Do not add slides. Start immediately with a question: "In the tests you wrote today — any of them — find one assertion and read it to me." Pick 3 people. After each one: "Is that a real assertion or an existence assertion?"

By now they know the pattern. This is recall, not new content.

### The 4 failure modes (10 minutes)

Walk through each one quickly — they've seen them in practice now. Reference actual things that happened in the room:

- "In Module 5, I saw some tests with `toBeDefined()` — that's Failure Mode 1."
- "The mock example — anyone use `vi.mock` today? Let's look at whether you mocked the right thing."
- "20.32% mutation score — that's the whole point of Module 3."
- "Oracle failure: if you used Claude to generate a test after you wrote the implementation, the test may be validating a bug."

---

### Exercise F: Hallucination Hunt — All (15 min)

**Duration**: 15 minutes
**Tier**: All participants
**Prerequisites**: `exercises/hallucination-exercise.mjs` available

**What the exercise file contains** (you built this — here is the spec):

The file should have 10 tests using Vitest, numbered or labeled. Of the 10:

- 4 are GOOD: specific assertions, test real behavior
- 6 are ILLUSIONS: existence assertions, over-mocks, weak comparisons, oracle failures

Example ILLUSION tests to include:

```js
// ILLUSION 1: existence assertion
it('total returns a value', () => {
  const cart = new Cart();
  cart.addItem({ id: 'x', price: 10 }, 1);
  expect(cart.total()).toBeDefined();  // passes even if total() returns undefined-ish value
});

// ILLUSION 2: testing the mock
it('addItem is called', () => {
  const mockCart = { addItem: vi.fn() };
  mockCart.addItem({ id: 'x', price: 10 }, 1);
  expect(mockCart.addItem).toHaveBeenCalled();  // tests the mock, not the real Cart
});

// ILLUSION 3: truthy status check
it('checkout succeeds', () => {
  const response = { status: 404, message: 'Not Found' };
  expect(response.status).toBeTruthy();  // 404 is truthy!
});

// ILLUSION 4: oracle failure
// (test written to match broken implementation)
it('total with 10% discount is correct', () => {
  const cart = new Cart();
  cart.addItem({ id: 'x', price: 100 }, 1);
  cart.applyDiscount(10);
  expect(cart.total()).toBe(95);  // correct answer is 90 — but code has bug and returns 95
});
```

**What participants do:**

1. Read all 10 tests
2. Mark each: GOOD or ILLUSION
3. For each ILLUSION: write one sentence explaining what real bug it would miss
4. Fix 2 of the ILLUSIONS — write a replacement that actually tests the behavior

**Expected output (example fix):**

```js
// BEFORE (ILLUSION):
expect(cart.total()).toBeDefined();

// AFTER (GOOD):
expect(cart.total()).toBe(10);  // 1 item at price 10, qty 1
```

**Common errors + fixes:**

- Error: Participant marks everything GOOD → Walk through ILLUSION 1 with them. "What real bug would `toBeDefined()` fail to catch? What if `total()` returned `undefined`? What would `toBeDefined()` say?" (It would say the test failed — but `null` or `NaN` or `Infinity` would all pass.)
- Error: Participant marks everything ILLUSION → They're overcorrecting. Ask them to find one test they're confident is testing real behavior. Walk through why it's good.
- Error: Fixed test also has weak assertion → Ask them to think of a specific value they can check. "If I break this function deliberately, what exact number would change?"

---

## Capstone Presentations + Critical Feedback (17:00–17:45)

### Setup (before 17:00)

Write the 3 questions on the whiteboard or show a slide with them:

1. What test did you write today that you are most confident in? Why?
2. What test did you write today that you now have doubts about? What would you change?
3. What is the one practice from today you will apply to your current project in the next week?

Prepare: index cards (one per presenter × number of participants), pens on tables.

### Facilitation script

"We have 45 minutes. 9 people. That's 5 minutes per person. I will time this. 3 minutes of presentation, 2 minutes of feedback. When I say time, we move."

Assign a speaking order — alphabetical, seating order, or ask for volunteers and fill in.

**For each presenter:**

- Start timer when they begin
- At 3:00: "Time to wrap up — feedback now"
- Ask the room: "One thing you heard — strength or question?" Get 2 responses
- Distribute the cards: "Write one sentence for [name] — strength or specific question. Pass forward."

**If someone goes over time:**

Cut them at 3 minutes. Do not apologize. "We need to move. You can finish offline. The discipline of time is part of the exercise."

**If someone says "I don't have anything to present":**

They do. "Pick any test you wrote today. Read the test name. Tell me why you named it that." Everyone wrote something.

**What to watch for in presentations:**

- Participants who say "I'm confident in this test" but the assertion is weak → Probe gently: "What bug would that assertion catch?"
- Participants who are genuinely self-critical → Affirm this. "That self-criticism is the most important skill we built today."
- The answer to question 3 should be specific: "I will add Stryker to the order service this week" is good. "I will test more" is not.

---

## Close (17:45–18:00)

### Immediate actions (3 minutes)

Read them aloud. Have them write them on their card.

1. Add `npx stryker run` to your project this week. See the real number.
2. Add one pre-commit hook. secretlint takes 5 minutes.
3. Open your existing AI-generated tests. Apply the 4 failure modes. Fix 2 illusions.

### Resources (2 minutes)

Write the URLs on the board or share via Slack/email:

- Workshop repo: [URL]
- Vitest: `vitest.dev`
- Playwright: `playwright.dev`
- Playwright MCP: `playwright.dev/docs/api/class-playwright`
- Stryker: `stryker-mutator.io`
- fast-check: `fast-check.dev`
- DORA 2025 State of DevOps: linked in repo README

### Closing (2 minutes)

"We started the day talking about where bugs are found and what they cost. We built the tools that move that left. You have the tests, the coverage, the mutation scores, the hooks, the review framework, and the AI prompting discipline.

The one thing I'll leave you with: the practice that matters most is the one you actually run. Pick one. Run it this week. Share the result with your team."

Thank them. Done.

---

## Appendix: Full Exercise Reference

### Quick-reference table

| Code | Title | Duration | Tier | Module |
|------|-------|----------|------|--------|
| A1 | Write 3 unit tests for product.mjs | 20 min | Junior | 1 |
| A2 | Coverage report + kill uncovered branch | 20 min | Senior | 1 |
| B1 | Implement Cart TDD: addItem + total | 30 min | All | 2 |
| B2 | Add applyDiscount with edge cases | 15 min | Senior | 2 |
| C1 | Find and kill 3 surviving mutants | 20 min | Junior | 3 |
| C2 | Property-based tests for coupon.mjs | 20 min | Senior | 3 |
| D1 | Review flawed-pr.diff using 7 dimensions | 15 min | Junior | 4 |
| D2 | Configure Husky + secretlint | 15 min | Senior | 4 |
| E1 | Generate 3 E2E tests via Claude Code | 30 min | All | 5 |
| F1 | Hallucination hunt: mark and fix illusions | 15 min | All | 6 |

---

## Appendix: If Things Go Wrong

### "Claude Code is not available"

Modules 2 and 5 reference Claude Code. If it's not available:

- Module 2: Skip the edge-case prompt demo. Instead, do a group exercise: "What edge cases would you add?" Get 5 answers from the room. Compare to a pre-prepared list.
- Module 5: Generate a Playwright test manually as a group exercise. Show a pre-written test. Analyze it using the 4 failure modes.

### "Stryker takes too long"

On slow machines, Stryker on a 50-line file with 100% coverage can take 10+ minutes. Options:
- Pre-run Stryker overnight and save the HTML report. Show the pre-generated report.
- Limit scope: add `mutate: ['src/cart.mjs']` in stryker config.
- Skip the Exercise C live run — show the pre-generated report for analysis.

### "Someone finishes everything 15 minutes early"

Have a stretch challenge ready for each module:
- Module 1: Write tests for getProductsByCategory edge cases
- Module 2: Add removeItem to Cart using TDD
- Module 3: Get mutation score above 90%
- Module 4: Write a second secretlint rule for GitHub tokens
- Module 5: Add E2E test for the admin product list view
- Module 6: Write 2 new ILLUSION tests and exchange with a neighbor to see if they can spot them

### "The server for Module 5 won't start"

```bash
cd workshop/shop-api-starter
npm install
npm run dev
# If port 3000 is busy:
PORT=3001 npm run dev
# Update playwright.config.mjs baseURL accordingly
```

If the server cannot start: run Module 5 against a pre-deployed version of ShopAPI (deploy to Vercel/Railway beforehand as a backup).

### "Participants are behind schedule by 30+ minutes"

Priority cuts (in order of least damage):
1. Cut Senior stretch for Exercise A2 (10 min saved)
2. Cut Exercise D Senior (Husky) — discuss conceptually instead (10 min saved)
3. Shorten Module 6 debrief (5 min saved)
4. Cut Capstone to 30 minutes — 3 minutes per person, no written feedback (15 min saved)

Do not cut Module 5 entirely — it is the most memorable and unique part of the day.
