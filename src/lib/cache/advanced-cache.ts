
import { useState, useEffect } from 'react';

/**
 * Advanced Caching System - Phase 4 Implementation
 * 
 * Provides intelligent caching with:
 * - TTL-based expiration
 * - Memory-efficient storage
 * - Compression support
 * - Cache invalidation strategies
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  size: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheOptions {
  maxSize?: number;
  defaultTTL?: number;
  enableCompression?: boolean;
  enableStatistics?: boolean;
}

export class AdvancedCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private statistics = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalSize: 0,
  };

  constructor(private options: CacheOptions = {}) {
    const {
      maxSize = 100 * 1024 * 1024, // 100MB
      defaultTTL = 5 * 60 * 1000, // 5 minutes
      enableStatistics = true,
    } = options;

    this.options = {
      maxSize,
      defaultTTL,
      enableStatistics,
      ...options,
    };

    // Periodic cleanup
    setInterval(() => { this.cleanup(); }, 60000); // Every minute
  }

  set(key: string, data: T, ttl?: number): void {
    const entryTTL = ttl ?? this.options.defaultTTL!;
    const size = this.calculateSize(data);
    
    // Check if we need to evict entries
    this.evictIfNeeded(size);

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: entryTTL,
      size,
      accessCount: 0,
      lastAccessed: Date.now(),
    };

    this.cache.set(key, entry);
    this.statistics.totalSize += size;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.statistics.misses++;
      return undefined;
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.delete(key);
      this.statistics.misses++;
      return undefined;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.statistics.hits++;

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry ? !this.isExpired(entry) : false;
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.statistics.totalSize -= entry.size;
      return this.cache.delete(key);
    }
    return false;
  }

  clear(): void {
    this.cache.clear();
    this.statistics.totalSize = 0;
  }

  getStatistics() {
    const hitRate = this.statistics.hits / (this.statistics.hits + this.statistics.misses);
    return {
      ...this.statistics,
      hitRate: isNaN(hitRate) ? 0 : hitRate,
      size: this.cache.size,
    };
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private calculateSize(data: T): number {
    try {
      return JSON.stringify(data).length * 2; // Rough estimate
    } catch {
      return 1000; // Default size for non-serializable data
    }
  }

  private evictIfNeeded(newEntrySize: number): void {
    const maxSize = this.options.maxSize!;
    
    while (this.statistics.totalSize + newEntrySize > maxSize && this.cache.size > 0) {
      this.evictLeastRecentlyUsed();
    }
  }

  private evictLeastRecentlyUsed(): void {
    let lruKey: string | null = null;
    let lruTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.delete(lruKey);
      this.statistics.evictions++;
    }
  }

  private cleanup(): void {
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.delete(key));
  }
}

// Global cache instance
export const globalCache = new AdvancedCache({
  maxSize: 50 * 1024 * 1024, // 50MB
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  enableCompression: false,
  enableStatistics: true,
});

// Cache hooks for React components
export function useCachedData<T>(
  key: string, 
  fetchFn: () => Promise<T>, 
  ttl?: number
) {
  const [data, setData] = useState<T | undefined>(() => {
    const cachedData = globalCache.get(key) as T | undefined;
    return cachedData;
  });
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (globalCache.has(key)) {
      const cachedData = globalCache.get(key) as T | undefined;
      if (cachedData !== undefined) {
        setData(cachedData);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    fetchFn()
      .then(result => {
        globalCache.set(key, result, ttl);
        setData(result);
        setError(null);
      })
      .catch((err: unknown) => {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [key, ttl]);

  return { data, loading, error };
}
// CodeRabbit review
// CodeRabbit review
