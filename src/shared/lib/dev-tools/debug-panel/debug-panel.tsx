import React, { useState, useEffect } from 'react';
import styles from './debug-panel.module.scss';

export interface DebugData {
  performance: {
    renderTime: number;
    memoryUsage: number;
    lcp: number;
    fcp: number;
    cls: number;
  };
  errors: {
    count: number;
    messages: string[];
  };
  state: Record<string, unknown>;
}

export interface DebugPanelProps {
  className?: string;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [debugData, setDebugData] = useState<DebugData>({
    performance: {
      renderTime: 0,
      memoryUsage: 0,
      lcp: 0,
      fcp: 0,
      cls: 0,
    },
    errors: {
      count: 0,
      messages: [],
    },
    state: {},
  });

  useEffect(() => {
    // Simulate debug data collection
    const interval = setInterval(() => {
      setDebugData({
        performance: {
          renderTime: Math.random() * 50,
          memoryUsage: Math.random() * 200,
          lcp: Math.random() * 3000,
          fcp: Math.random() * 2000,
          cls: Math.random() * 0.2,
        },
        errors: {
          count: Math.floor(Math.random() * 3),
          messages: ['Sample error message'],
        },
        state: {
          user: 'john_doe',
          theme: 'dark',
        },
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${styles.panel} ${className || ''}`}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.toggleButton}>
        Debug
      </button>

      {isOpen && (
        <div className={styles.panelContent}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Debug Panel</h3>
            <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
              ×
            </button>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Performance</h4>
            <div className={styles.sectionContent}>
              <div className={styles.sectionRow}>
                <span className={styles.sectionLabel}>Render Time:</span>
                <span className={styles.sectionValue}>
                  {debugData.performance.renderTime.toFixed(2)}ms
                </span>
              </div>
              <div className={styles.sectionRow}>
                <span className={styles.sectionLabel}>Memory:</span>
                <span className={styles.sectionValue}>
                  {debugData.performance.memoryUsage.toFixed(2)}MB
                </span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Errors</h4>
            <div className={styles.sectionContent}>
              <div className={styles.sectionRow}>
                <span className={styles.sectionLabel}>Count:</span>
                <span
                  className={
                    debugData.errors.count > 0 ? styles.sectionValueError : styles.sectionValueGood
                  }
                >
                  {debugData.errors.count}
                </span>
              </div>
              {debugData.errors.messages.map((message, index) => (
                <div key={index} className={styles.errorList}>
                  {message}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>State</h4>
            <div className={styles.stateContainer}>
              {Object.keys(debugData.state).length > 0 ? (
                <pre>{JSON.stringify(debugData.state, null, 2)}</pre>
              ) : (
                <span className={styles.stateEmpty}>No state data</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
