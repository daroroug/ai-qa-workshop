/** @type {import('@stryker-mutator/core').PartialStrykerOptions} */
export default {
  testRunner: 'vitest',
  vitest: {
    configFile: 'vitest.config.mjs',
  },
  mutate: ['src/product.mjs', 'src/cart.mjs', 'src/coupon.mjs', 'src/order.mjs'],
  thresholds: {
    high: 80,
    low: 60,
    break: 50,
  },
  reporters: ['clear-text', 'html', 'json'],
  htmlReporter: { baseDir: 'reports/mutation' },
  jsonReporter: { fileName: 'reports/mutation/report.json' },
  coverageAnalysis: 'perTest',
  timeoutMS: 30000,
  concurrency: 2,
};
