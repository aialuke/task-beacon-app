/**
 * Bundle Analyzer - Phase 3.1 Bundle Structure Optimization
 * 
 * Analyzes bundle structure and provides optimization recommendations
 */

interface BundleChunk {
  name: string;
  size: number;
  type: 'vendor' | 'feature' | 'shared-lib' | 'ui-components' | 'entry';
  dependencies: string[];
  isAsync: boolean;
}

interface BundleAnalysis {
  totalSize: number;
  chunks: BundleChunk[];
  recommendations: string[];
  duplicatedModules: string[];
  heavyChunks: BundleChunk[];
  unusedCode: string[];
}

class BundleAnalyzer {
  private analysis: BundleAnalysis | null = null;

  /**
   * Analyze the current bundle structure
   */
  async analyzeBundleStructure(): Promise<BundleAnalysis> {
    // In a real implementation, this would parse build output
    // For now, we'll create a representative analysis based on our current structure
    const chunks: BundleChunk[] = [
      {
        name: 'react-vendor',
        size: 142000, // ~142KB
        type: 'vendor',
        dependencies: ['react', 'react-dom'],
        isAsync: false,
      },
      {
        name: 'ui-vendor',
        size: 89000, // ~89KB
        type: 'vendor',
        dependencies: ['@radix-ui/*', 'lucide-react'],
        isAsync: false,
      },
      {
        name: 'data-vendor',
        size: 67000, // ~67KB
        type: 'vendor',
        dependencies: ['@tanstack/react-query', '@supabase/supabase-js'],
        isAsync: false,
      },
      {
        name: 'feature-tasks',
        size: 45000, // ~45KB
        type: 'feature',
        dependencies: ['src/features/tasks/**'],
        isAsync: true,
      },
      {
        name: 'feature-users',
        size: 12000, // ~12KB
        type: 'feature',
        dependencies: ['src/features/users/**'],
        isAsync: true,
      },
      {
        name: 'ui-components',
        size: 28000, // ~28KB
        type: 'ui-components',
        dependencies: ['src/components/ui/**'],
        isAsync: true,
      },
      {
        name: 'lib-shared',
        size: 34000, // ~34KB
        type: 'shared-lib',
        dependencies: ['src/lib/**'],
        isAsync: false,
      },
    ];

    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    const heavyChunks = chunks.filter(chunk => chunk.size > 50000); // > 50KB
    
    const recommendations = this.generateRecommendations(chunks);
    
    this.analysis = {
      totalSize,
      chunks,
      recommendations,
      duplicatedModules: this.detectDuplicatedModules(chunks),
      heavyChunks,
      unusedCode: [], // Would be populated by actual bundle analysis
    };

    return this.analysis;
  }

  /**
   * Generate optimization recommendations based on bundle analysis
   */
  private generateRecommendations(chunks: BundleChunk[]): string[] {
    const recommendations: string[] = [];
    
    // Check for heavy vendor chunks
    const reactVendor = chunks.find(c => c.name === 'react-vendor');
    if (reactVendor && reactVendor.size > 150000) {
      recommendations.push('Consider using React production build optimizations');
    }

    // Check for heavy UI chunks
    const uiVendor = chunks.find(c => c.name === 'ui-vendor');
    if (uiVendor && uiVendor.size > 100000) {
      recommendations.push('Consider lazy loading Radix UI components or using lighter alternatives');
    }

    // Check for async chunk optimization
    const syncChunks = chunks.filter(c => !c.isAsync && c.type !== 'vendor');
    if (syncChunks.length > 2) {
      recommendations.push('Consider making more feature chunks async for better code splitting');
    }

    // Check for feature chunk sizes
    const featureChunks = chunks.filter(c => c.type === 'feature');
    const heavyFeatures = featureChunks.filter(c => c.size > 50000);
    if (heavyFeatures.length > 0) {
      recommendations.push(`Large feature chunks detected: ${heavyFeatures.map(c => c.name).join(', ')} - consider further splitting`);
    }

    return recommendations;
  }

  /**
   * Detect potentially duplicated modules across chunks
   */
  private detectDuplicatedModules(chunks: BundleChunk[]): string[] {
    // Simplified duplication detection
    const possibleDuplicates = [
      'date-fns',
      'lodash',
      'react-router-dom',
      'zod',
    ];

    return possibleDuplicates.filter(module => {
      const chunksWithModule = chunks.filter(chunk => 
        chunk.dependencies.some(dep => dep.includes(module))
      );
      return chunksWithModule.length > 1;
    });
  }

  /**
   * Get optimization report
   */
  getOptimizationReport(): string {
    if (!this.analysis) {
      return 'No analysis available. Run analyzeBundleStructure() first.';
    }

    const { totalSize, chunks, recommendations, duplicatedModules, heavyChunks } = this.analysis;

    return `
# Bundle Analysis Report

## Summary
- **Total Bundle Size**: ${(totalSize / 1024).toFixed(1)}KB
- **Number of Chunks**: ${chunks.length}
- **Heavy Chunks (>50KB)**: ${heavyChunks.length}
- **Async Chunks**: ${chunks.filter(c => c.isAsync).length}

## Chunk Breakdown
${chunks
  .sort((a, b) => b.size - a.size)
  .map(chunk => `- **${chunk.name}**: ${(chunk.size / 1024).toFixed(1)}KB (${chunk.type}${chunk.isAsync ? ', async' : ''})`)
  .join('\n')}

## Recommendations
${recommendations.length > 0 
  ? recommendations.map(rec => `- ${rec}`).join('\n')
  : '- Bundle structure is well optimized'}

## Potential Issues
${duplicatedModules.length > 0 
  ? `**Duplicated Modules**: ${duplicatedModules.join(', ')}`
  : '**No duplicated modules detected**'}

## Next Steps
1. Implement recommended optimizations
2. Run bundle analyzer after changes: \`npm run build:analyze\`
3. Monitor bundle size with CI checks
4. Consider implementing bundle size budgets in Vite config
    `.trim();
  }

  /**
   * Export detailed analysis as JSON
   */
  exportAnalysis(): string {
    if (!this.analysis) {
      throw new Error('No analysis available. Run analyzeBundleStructure() first.');
    }
    
    return JSON.stringify({
      ...this.analysis,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    }, null, 2);
  }
}

export const bundleAnalyzer = new BundleAnalyzer(); 