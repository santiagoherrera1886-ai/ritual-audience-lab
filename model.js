/* Planning assumptions inherited from the original atlas, not measured reach. */
(function (root) {
  'use strict';
  const CHANNELS = [
    { id: 'meta', name: 'Meta Ads', share: 35, cpm: 9200, cap: .78, accent: '#5387ef' },
    { id: 'google', name: 'Google Ads', share: 20, cpm: 12500, cap: .62, accent: '#5caf85' },
    { id: 'tiktok', name: 'TikTok Ads', share: 15, cpm: 8200, cap: .58, accent: '#55c5ce' },
    { id: 'youtube', name: 'YouTube', share: 20, cpm: 10500, cap: .66, accent: '#ef7589' },
    { id: 'programmatic', name: 'Programmatic', share: 10, cpm: 9800, cap: .46, accent: '#a579e6' }
  ];
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  function defaults() {
    return { budget: 600, universe: 14, shares: CHANNELS.map(c => c.share), cpms: CHANNELS.map(c => c.cpm) };
  }
  function sanitize(value) {
    const fallback = defaults();
    if (!value || typeof value !== 'object') return fallback;
    const result = {
      budget: Number.isFinite(value.budget) ? clamp(value.budget, 0, 6000) : fallback.budget,
      universe: Number.isFinite(value.universe) ? clamp(value.universe, .1, 100) : fallback.universe,
      shares: fallback.shares,
      cpms: fallback.cpms
    };
    if (Array.isArray(value.shares) && value.shares.length === 5 && value.shares.every(x => Number.isInteger(x) && x >= 0 && x <= 100) && value.shares.reduce((a, b) => a + b, 0) === 100) result.shares = [...value.shares];
    if (Array.isArray(value.cpms) && value.cpms.length === 5) result.cpms = value.cpms.map((x, i) => Number.isFinite(x) && x >= 100 && x <= 1000000 ? x : fallback.cpms[i]);
    return result;
  }
  // Rebalance other channels with the largest-remainder method: exact integer sum 100.
  function rebalance(shares, index, value) {
    const target = Math.round(clamp(Number(value) || 0, 0, 100));
    const remaining = 100 - target;
    const others = shares.map((share, i) => ({ i, share })).filter(x => x.i !== index);
    const total = others.reduce((sum, x) => sum + x.share, 0);
    const allocated = others.map(x => {
      const exact = remaining * (total ? x.share / total : 1 / others.length);
      return { i: x.i, n: Math.floor(exact), remainder: exact % 1 };
    });
    let left = remaining - allocated.reduce((sum, x) => sum + x.n, 0);
    allocated.sort((a, b) => b.remainder - a.remainder || a.i - b.i);
    for (let i = 0; i < left; i++) allocated[i].n++;
    const result = shares.map(() => 0);
    result[index] = target;
    allocated.forEach(x => { result[x.i] = x.n; });
    return result;
  }
  function calculate(input, scale = 1) {
    const state = sanitize(input);
    const budget = state.budget * 1e6 * Math.max(0, Number.isFinite(scale) ? scale : 1);
    const universe = state.universe * 1e6;
    const channels = CHANNELS.map((channel, i) => {
      const spend = budget * state.shares[i] / 100;
      const impressions = spend / state.cpms[i] * 1000;
      const cap = universe * channel.cap;
      const k = 1.85 + (1 - channel.cap) * 1.6;
      const reach = cap * -Math.expm1(-impressions / (cap * k));
      return { ...channel, share: state.shares[i], cpm: state.cpms[i], spend, impressions, reach };
    });
    const impressions = channels.reduce((sum, c) => sum + c.impressions, 0);
    const reach = Math.min(universe, universe * (1 - channels.reduce((remaining, c) => remaining * (1 - c.reach / universe), 1)));
    return { budget, universe, impressions, reach, coverage: reach / universe, frequency: reach > 0 ? impressions / reach : 0, channels };
  }
  const api = { CHANNELS, defaults, sanitize, rebalance, calculate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RitualModel = api;
})(typeof window === 'undefined' ? globalThis : window);
