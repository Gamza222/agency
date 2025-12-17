import React, { useState, useEffect } from 'react';
import styles from './performance-monitor.module.scss';

export interface PerformanceData {
  renderTime: number;
  memoryUsage: number;
  lcp: number;
  fcp: number;
  cls: number;
}

export interface PerformanceMonitorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  position = 'top-right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    renderTime: 0,
    memoryUsage: 0,
    lcp: 0,
    fcp: 0,
    cls: 0,
  });

  const positionClass = {
    'top-left': styles.monitorTopLeft,
    'top-right': styles.monitorTopRight,
    'bottom-left': styles.monitorBottomLeft,
    'bottom-right': styles.monitorBottomRight,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceData({
        renderTime: Math.random() * 50,
        memoryUsage: Math.random() * 200,
        lcp: Math.random() * 3000,
        fcp: Math.random() * 2000,
        cls: Math.random() * 0.2,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getProgressClass = (value: number, threshold: number) => {
    if (value > threshold) return styles.progressFillError;
    if (value > threshold * 0.7) return styles.progressFillWarning;
    return styles.progressFillGood;
  };

  const getVitalsClass = (value: number, threshold: number) => {
    return value > threshold ? styles.vitalsValueError : styles.vitalsValueGood;
  };

  return (
    <div className={`${styles.monitor} ${positionClass[position]} ${className || ''}`}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.toggleButton}>
        Performance
      </button>

      {isOpen && (
        <div className={styles.panelContent}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Performance</h3>
            <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
              ×
            </button>
          </div>

          <div className={styles.metricSection}>
            <div className={styles.metricHeader}>
              <span className={styles.metricLabel}>Render Time</span>
              <span className={styles.metricValue}>{performanceData.renderTime.toFixed(1)}ms</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${getProgressClass(performanceData.renderTime, 20)}`}
                style={{
                  width: `${Math.min((performanceData.renderTime / 50) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className={styles.metricSection}>
            <div className={styles.metricHeader}>
              <span className={styles.metricLabel}>Memory Usage</span>
              <span className={styles.metricValue}>{performanceData.memoryUsage.toFixed(1)}MB</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${getProgressClass(performanceData.memoryUsage, 100)}`}
                style={{
                  width: `${Math.min((performanceData.memoryUsage / 200) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className={styles.metricSection}>
            <div className={styles.metricHeader}>
              <span className={styles.metricLabel}>Bundle Size</span>
              <span className={styles.metricValue}>2.1MB</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${getProgressClass(2.1, 1.5)}`}
                style={{ width: `${Math.min((2.1 / 3) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className={styles.vitalsSection}>
            <h4 className={styles.vitalsTitle}>Web Vitals</h4>
            <div className={styles.vitalsList}>
              <div className={styles.vitalsRow}>
                <span className={styles.vitalsLabel}>LCP:</span>
                <span className={getVitalsClass(performanceData.lcp, 2500)}>
                  {performanceData.lcp.toFixed(0)}ms
                </span>
              </div>
              <div className={styles.vitalsRow}>
                <span className={styles.vitalsLabel}>FCP:</span>
                <span className={getVitalsClass(performanceData.fcp, 1800)}>
                  {performanceData.fcp.toFixed(0)}ms
                </span>
              </div>
              <div className={styles.vitalsRow}>
                <span className={styles.vitalsLabel}>CLS:</span>
                <span className={getVitalsClass(performanceData.cls, 0.1)}>
                  {performanceData.cls.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
