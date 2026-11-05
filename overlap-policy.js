/* One planning rule for every Day/Night entry point. No live campaign data. */
(function (root) {
  'use strict';
  const MAX_PERCENT = 1;
  const DEFAULT_PERCENT = 0;
  function sanitizePercent(value) {
    return Number.isFinite(value) ? Math.max(0, Math.min(MAX_PERCENT, value)) : DEFAULT_PERCENT;
  }
  const api = Object.freeze({ MAX_PERCENT, DEFAULT_PERCENT, sanitizePercent });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RitualOverlapPolicy = api;
})(typeof window === 'undefined' ? globalThis : window);
