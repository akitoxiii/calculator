import { logger } from './logger';

interface PerformanceMetric {
  name: string;
  startTime: number;
  duration: number;
  data?: any;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 100;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.observePageLoadMetrics();
      this.observeLongTasks();
    }
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private observePageLoadMetrics() {
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.addMetric('pageLoad', entry.startTime, entry.duration, {
              domComplete: (entry as PerformanceNavigationTiming).domComplete,
              loadEventEnd: (entry as PerformanceNavigationTiming).loadEventEnd,
            });
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  private observeLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.addMetric('longTask', entry.startTime, entry.duration);
          logger.warn('Long task detected', {
            duration: entry.duration,
            startTime: entry.startTime,
          });
        });
      });

      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  private addMetric(name: string, startTime: number, duration: number, data?: any) {
    const metric: PerformanceMetric = {
      name,
      startTime,
      duration,
      data,
    };

    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // 本番環境では適切なモニタリングサービスに送信
    if (process.env.NODE_ENV === 'production') {
      // TODO: 本番環境用のメトリクス送信処理を実装
      // 例: Google Analytics, New Relic, Datadog など
    }
  }

  startMeasure(name: string) {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  }

  endMeasure(name: string) {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const entries = performance.getEntriesByName(name);
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        this.addMetric(name, lastEntry.startTime, lastEntry.duration);
      }
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance(); 