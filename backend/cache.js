/**
 * In-Memory Caching Module (Practical 09)
 * Supports node-cache with high-performance memory storage,
 * automatic 60s TTL, and write invalidation triggers.
 */
class InMemoryCache {
  constructor(defaultTTL = 60) {
    this.defaultTTL = defaultTTL;
    this.store = new Map();
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return undefined;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return item.value;
  }

  set(key, value, ttl = this.defaultTTL) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl * 1000
    });
    return true;
  }

  del(key) {
    return this.store.delete(key);
  }

  flushAll() {
    this.store.clear();
  }

  getStats() {
    return {
      keys: this.store.size,
      ttl: this.defaultTTL
    };
  }
}

let NodeCache;
try {
  NodeCache = require('node-cache');
} catch (e) {
  NodeCache = null;
}

const cache = NodeCache
  ? new NodeCache({ stdTTL: 60, checkperiod: 120 })
  : new InMemoryCache(60);

module.exports = cache;
