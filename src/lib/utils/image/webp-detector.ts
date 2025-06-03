/**
 * WebP Detection and Feature Support
 * 
 * Advanced WebP support detection with specific feature testing.
 * This module provides comprehensive WebP browser support detection.
 */

import type { WebPSupport } from './types';
import { WEBP_TEST_IMAGES } from './constants';

/**
 * Advanced WebP support detection with specific feature testing
 */
export class WebPDetector {
  private static _supportsWebP: boolean | null = null;
  private static _supportsLossless: boolean | null = null;
  private static _supportsAlpha: boolean | null = null;
  private static _supportsAnimation: boolean | null = null;

  /**
   * Test basic WebP support
   */
  static async supportsWebP(): Promise<boolean> {
    if (this._supportsWebP !== null) {
      return this._supportsWebP;
    }

    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this._supportsWebP = webP.height === 2;
        resolve(this._supportsWebP);
      };
      webP.src = WEBP_TEST_IMAGES.basic;
    });
  }

  /**
   * Test WebP lossless support
   */
  static async supportsLossless(): Promise<boolean> {
    if (this._supportsLossless !== null) {
      return this._supportsLossless;
    }

    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this._supportsLossless = webP.height === 2;
        resolve(this._supportsLossless);
      };
      webP.src = WEBP_TEST_IMAGES.lossless;
    });
  }

  /**
   * Test WebP alpha channel support
   */
  static async supportsAlpha(): Promise<boolean> {
    if (this._supportsAlpha !== null) {
      return this._supportsAlpha;
    }

    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this._supportsAlpha = webP.height === 2;
        resolve(this._supportsAlpha);
      };
      webP.src = WEBP_TEST_IMAGES.alpha;
    });
  }

  /**
   * Test WebP animation support
   */
  static async supportsAnimation(): Promise<boolean> {
    if (this._supportsAnimation !== null) {
      return this._supportsAnimation;
    }

    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this._supportsAnimation = webP.height === 2;
        resolve(this._supportsAnimation);
      };
      webP.src = WEBP_TEST_IMAGES.animation;
    });
  }

  /**
   * Get comprehensive WebP support info
   */
  static async getWebPSupport(): Promise<WebPSupport> {
    const [basic, lossless, alpha, animation] = await Promise.all([
      this.supportsWebP(),
      this.supportsLossless(),
      this.supportsAlpha(),
      this.supportsAnimation(),
    ]);

    return {
      basic,
      lossless,
      alpha,
      animation,
      full: basic && lossless && alpha,
    };
  }

  /**
   * Reset cached support flags (useful for testing)
   */
  static resetCache(): void {
    this._supportsWebP = null;
    this._supportsLossless = null;
    this._supportsAlpha = null;
    this._supportsAnimation = null;
  }
}

/**
 * Singleton instance for convenient access
 */
export const webpDetector = WebPDetector; 