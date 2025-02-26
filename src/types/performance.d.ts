// Performance measurement types
interface PerformanceMeasure {
  duration: number;
  startTime: number;
  detail: any;
}

interface PerformanceMetrics {
  [key: string]: PerformanceMeasure;
}

// Extend window with performance property
interface Window {
  performance: {
    mark(markName: string): void;
    measure(measureName: string, startMark: string, endMark: string): PerformanceMeasure;
    clearMarks(): void;
    clearMeasures(): void;
    getEntriesByType(entryType: string): PerformanceEntry[];
  };
}
