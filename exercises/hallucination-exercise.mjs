// hallucination-exercise.mjs
// AI-Enhanced QA Workshop — Module 5 Companion Exercise
//
// TASK: Each test below is marked with  // CLASSIFICATION: ???
// Replace ??? with either GOOD or ILLUSION, then explain why in one sentence.
//
// ─────────────────────────────────────────────────────────────────────────────
// THE FOUR HALLUCINATION TYPES TO LOOK FOR
// ─────────────────────────────────────────────────────────────────────────────
//
// TYPE 1 — EXISTENCE-ONLY ASSERTION
//   The test calls .toBeDefined() or .not.toBeNull() but never checks the value.
//   A function that returns the wrong thing (e.g., NaN, 0, "error") still passes.
//
// TYPE 2 — TAUTOLOGICAL TEST
//   The test asserts something that is always true by construction.
//   e.g., calling a function and then asserting the return value equals itself.
//
// TYPE 3 — OVER-MOCKED UNIT
//   The implementation is replaced by a mock that always returns the expected value.
//   The test verifies the mock, not the real code — it can never fail regardless of bugs.
//
// TYPE 4 — VACUOUS HAPPY PATH
//   Only one narrow happy-path case is tested. Edge cases (empty input, zero,
//   boundary values, invalid types) are completely absent, giving false confidence.
//
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi } from 'vitest';

// ── Domain functions under test ───────────────────────────────────────────────

function calculateDiscount(price, percentage) {
  if (typeof price !== 'number' || price < 0) throw new Error('Invalid price');
  if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
    throw new Error('Percentage must be 0–100');
  }
  return price * (1 - percentage / 100);
}

function validateEmail(email) {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) throw new Error('Invalid amount');
  return '$' + amount.toFixed(2);
}

function parseOrderId(str) {
  if (typeof str !== 'string' || !str.startsWith('ORD-')) {
    throw new Error('Order ID must start with ORD-');
  }
  const num = Number(str.slice(4));
  if (!Number.isInteger(num) || num <= 0) throw new Error('Invalid order number');
  return num;
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTS 1–5: Can you spot which are GOOD?
// ─────────────────────────────────────────────────────────────────────────────

describe('calculateDiscount', () => {

  // TEST 1
  // CLASSIFICATION: ???
  it('returns a defined value for valid inputs', () => {
    const result = calculateDiscount(100, 20);
    expect(result).toBeDefined();
  });

  // TEST 2
  // CLASSIFICATION: ???
  it('applies a 20% discount to $100.00 → $80.00', () => {
    expect(calculateDiscount(100, 20)).toBe(80);
  });

  // TEST 3
  // CLASSIFICATION: ???
  it('throws for a negative price', () => {
    expect(() => calculateDiscount(-50, 10)).toThrow('Invalid price');
  });

  // TEST 4
  // CLASSIFICATION: ???
  it('returns the result of calculateDiscount', () => {
    const price = 200;
    const pct = 25;
    const result = calculateDiscount(price, pct);
    expect(result).toBe(calculateDiscount(price, pct));
  });

  // TEST 5
  // CLASSIFICATION: ???
  it('handles 0% discount (price unchanged)', () => {
    expect(calculateDiscount(49.99, 0)).toBe(49.99);
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// TESTS 6–10: Keep going — some are subtle
// ─────────────────────────────────────────────────────────────────────────────

describe('validateEmail', () => {

  // TEST 6
  // CLASSIFICATION: ???
  it('returns true for a standard email address', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

});

describe('formatCurrency', () => {

  // TEST 7
  // CLASSIFICATION: ???
  it('formats currency correctly', () => {
    const formatCurrencyMock = vi.fn().mockReturnValue('$12.34');
    expect(formatCurrencyMock(12.34)).toBe('$12.34');
  });

  // TEST 8
  // CLASSIFICATION: ???
  it('formats $0 as $0.00', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  // TEST 9
  // CLASSIFICATION: ???
  it('formats a large amount with 2 decimal places', () => {
    const result = formatCurrency(1234.5);
    expect(result).not.toBeNull();
  });

});

describe('parseOrderId', () => {

  // TEST 10
  // CLASSIFICATION: ???
  it('parses a valid order ID string to a number', () => {
    expect(parseOrderId('ORD-42')).toBe(42);
    expect(parseOrderId('ORD-1')).toBe(1);
  });

  it('throws when order ID does not start with ORD-', () => {
    expect(() => parseOrderId('42')).toThrow('Order ID must start with ORD-');
  });

  it('throws when order number is zero or non-numeric', () => {
    expect(() => parseOrderId('ORD-0')).toThrow('Invalid order number');
    expect(() => parseOrderId('ORD-abc')).toThrow('Invalid order number');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
//
//
//
//
//
//
//
//
//
//
//
//  ANSWERS (scroll down)
//
//
//
//
//
//
//
//
//
//
//
// ─────────────────────────────────────────────────────────────────────────────
// ANSWERS
// ─────────────────────────────────────────────────────────────────────────────
//
// TEST 1 — ILLUSION (Type 1: Existence-Only Assertion)
//   toBeDefined() passes even if calculateDiscount returns 0, NaN, or any wrong
//   value. If the implementation had a typo returning `price + percentage` instead
//   of the discounted price, this test would still pass.
//
// TEST 2 — GOOD
//   Asserts the exact numeric result (80) for a concrete input pair. A bug that
//   accidentally multiplies instead of subtracts would make this fail immediately.
//
// TEST 3 — GOOD
//   Verifies the error guard for invalid input. Confirms both that an exception is
//   thrown and that it carries the right message — both facts are independently
//   meaningful.
//
// TEST 4 — ILLUSION (Type 2: Tautological Test)
//   `result` IS the return value of calculateDiscount(price, pct), so asserting
//   result === calculateDiscount(price, pct) is comparing a value to itself. This
//   test is logically equivalent to `expect(x).toBe(x)` and can never fail.
//
// TEST 5 — GOOD
//   0% is a boundary value. A common off-by-one bug might apply discount
//   incorrectly at 0 (e.g., `percentage / 100` arithmetic using integer division).
//   This test would catch that. The expected value (49.99 unchanged) is specific.
//
// TEST 6 — ILLUSION (Type 4: Vacuous Happy Path)
//   One valid email is tested. Missing: invalid formats (no @, multiple @, spaces,
//   empty string, non-string input). A naive implementation returning `true`
//   unconditionally would pass this test. Needs negative and boundary cases.
//
// TEST 7 — ILLUSION (Type 3: Over-Mocked Unit)
//   The test replaces formatCurrency with a mock that always returns '$12.34',
//   then asserts the mock returns '$12.34'. The real implementation is never
//   called. This test verifies that vi.fn().mockReturnValue works — not that
//   formatCurrency formats money correctly.
//
// TEST 8 — GOOD
//   $0.00 is a meaningful boundary. Some implementations skip the fractional part
//   for zero or return '$0' without decimals. The specific expected string '$0.00'
//   pins the exact formatting contract.
//
// TEST 9 — ILLUSION (Type 1: Existence-Only Assertion)
//   not.toBeNull() passes as long as formatCurrency returns anything truthy.
//   It would pass if the function returned 'ERROR', 1234.5, or an empty string.
//   The correct assertion would be: expect(result).toBe('$1234.50').
//
// TEST 10 — GOOD
//   Tests the happy path, a boundary (ORD-1), and three distinct error conditions
//   in one coherent block. Each expect targets a specific outcome. A bug in the
//   numeric parsing, prefix stripping, or zero-guard would be caught by a
//   different expect() within this test.
