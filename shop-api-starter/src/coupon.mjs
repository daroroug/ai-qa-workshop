// shop-api: Coupon domain
// Used in Module 3 (Coverage + Mutation Testing) — property-based tests

export const CouponType = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
};

export function createCoupon({ code, type, value, expiresAt = null }) {
  if (!code || typeof code !== 'string') throw new Error('Invalid coupon code');
  if (!Object.values(CouponType).includes(type)) throw new Error('Invalid coupon type');
  if (typeof value !== 'number' || value < 0) throw new Error('Coupon value must be non-negative');
  if (type === CouponType.PERCENTAGE && value > 100) throw new Error('Percentage cannot exceed 100');
  return { code, type, value, expiresAt };
}

export function isCouponValid(coupon) {
  if (!coupon) return false;
  if (!coupon.expiresAt) return true;
  return new Date(coupon.expiresAt) > new Date();
}

// Apply coupon to a subtotal. Returns discounted total.
// Invariants:
//   - Result is always >= 0
//   - Percentage 0 leaves total unchanged
//   - Fixed coupon cannot reduce below 0
export function applyCoupon(subtotal, coupon) {
  if (!isCouponValid(coupon)) throw new Error('Coupon is expired or invalid');
  if (subtotal < 0) throw new Error('Subtotal cannot be negative');

  if (coupon.type === CouponType.PERCENTAGE) {
    return Math.round(subtotal * (1 - coupon.value / 100) * 100) / 100;
  }

  if (coupon.type === CouponType.FIXED) {
    return Math.round(Math.max(0, subtotal - coupon.value) * 100) / 100;
  }

  throw new Error(`Unknown coupon type: ${coupon.type}`);
}
