// product.test.mjs — Module 1 starting point
// Some tests are provided. Exercise A1: add 3 more.
// Exercise A2 (senior): run coverage and find the untested branch.

import { describe, it, expect, beforeEach } from 'vitest';
import { getProductById, getProductsByCategory, updateProductPrice, resetProducts } from '../src/product.mjs';

beforeEach(() => {
  resetProducts();
});

describe('getProductById', () => {
  it('returns the correct product for a valid id', () => {
    const product = getProductById(1);
    expect(product.id).toBe(1);
    expect(product.name).toBe('Blue Hoodie');
  });

  it('returns null for an unknown id', () => {
    expect(getProductById(999)).toBeNull();
  });

  // TODO Exercise A1: Add a test that checks product.price is greater than 0
  // TODO Exercise A1: Add a test for getProductsByCategory('clothing') — should return 1 product
  // TODO Exercise A1: Add a test that checks updateProductPrice throws for unknown id
});

describe('updateProductPrice', () => {
  it('updates price for a valid product', () => {
    updateProductPrice(1, 59.99);
    expect(getProductById(1).price).toBe(59.99);
  });

  // TODO Exercise A1 (key test): Try to set price to -10.
  // What happens? Should it throw? Write a test for it.
  // Hint: You might discover a bug here.
});
