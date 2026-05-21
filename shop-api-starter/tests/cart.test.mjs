// cart.test.mjs — Module 2 (TDD Exercise B1 + B2)
// Write tests FIRST. Run them (RED). Then implement in src/cart.mjs.

import { describe, it, expect, beforeEach } from 'vitest';
import { Cart } from '../src/cart.mjs';

let cart;
beforeEach(() => {
  cart = new Cart();
});

// Exercise B1: TDD — addItem and total
// Write failing tests first, then implement Cart methods.

describe('Cart', () => {
  it.todo('B1: a new cart has 0 items and total of 0');

  // TODO B1: Test that a new cart has 0 items and total of 0

  // TODO B1: Test that addItem adds a product with quantity 1

  // TODO B1: Test that adding the same product twice increases quantity (not adds duplicate)

  // TODO B1: Test that total() returns sum of (price × quantity) for all items

  // TODO B1: Test that addItem throws for quantity < 1

  // TODO B2 (senior): Test that applyDiscount(10) reduces total by 10%

  // TODO B2 (senior): Test that applyDiscount(-1) throws

  // TODO B2 (senior): Test that applyDiscount(101) throws

  // TODO B2 (senior): Test that total after applyDiscount is never below 0
});
