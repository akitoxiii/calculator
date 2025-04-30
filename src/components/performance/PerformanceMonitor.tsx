'use client';

import { useEffect } from 'react';
import { performanceMonitor } from '@/utils/performance';
import { logger } from '@/utils/logger';

export function PerformanceMonitor() {
  useEffect(() => {
    try {
      performanceMonitor.startMeasure('pageLoad');
      
      return () => {
        performanceMonitor.endMeasure('pageLoad');
      };
    } catch (error) {
      logger.error('Failed to measure page load', error);
    }
  }, []);

  return null;
} 