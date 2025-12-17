import React from 'react';
import type { LoadingFallbackProps } from '../types/types';
import { ComponentHeight, LoadingSize } from '../types/suspenseEnums';
import styles from './fallbacks.module.scss';

const LoadingSpinner: React.FC<{ size: LoadingSize }> = ({ size }) => {
  const spinnerClass = {
    [LoadingSize.SMALL]: styles.spinnerSmall,
    [LoadingSize.MEDIUM]: styles.spinnerMedium,
    [LoadingSize.LARGE]: styles.spinnerLarge,
  };

  return <div className={`${styles.spinner} ${spinnerClass[size]}`} />;
};

export const ComponentLoadingFallback: React.FC<LoadingFallbackProps> = ({
  size = LoadingSize.MEDIUM,
  height,
  text = 'Loading...',
  className,
}) => {
  const heightClass = {
    [ComponentHeight.SMALL]: styles.componentFallbackSmall,
    [ComponentHeight.MEDIUM]: styles.componentFallbackMedium,
    [ComponentHeight.LARGE]: styles.componentFallbackLarge,
    full: styles.componentFallbackFull,
  };

  return (
    <div
      className={`${styles.componentFallback} ${heightClass[height || ComponentHeight.MEDIUM]} ${className || ''}`}
    >
      <div className={styles.componentContent}>
        <LoadingSpinner size={size as LoadingSize} />
        <span className={styles.componentText}>{text}</span>
      </div>
    </div>
  );
};

export const PageLoadingFallback: React.FC<LoadingFallbackProps> = ({
  size = LoadingSize.LARGE,
  text = 'Loading page...',
  className,
}) => {
  return (
    <div className={`${styles.pageFallback} ${className || ''}`}>
      <div className={styles.pageContent}>
        <LoadingSpinner size={size as LoadingSize} />
        <span className={styles.pageText}>{text}</span>
      </div>
    </div>
  );
};

export const DefaultSuspenseFallback: React.FC<LoadingFallbackProps> = ({
  size = LoadingSize.MEDIUM,
  text = 'Loading...',
  className,
}) => {
  return (
    <div className={`${styles.defaultFallback} ${className || ''}`}>
      <div className={styles.defaultContent}>
        <LoadingSpinner size={size as LoadingSize} />
        <span className={styles.defaultText}>{text}</span>
      </div>
    </div>
  );
};

export const InlineLoadingFallback: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <span className={styles.inlineFallback}>
    <LoadingSpinner size={LoadingSize.SMALL} />
    <span>{text}</span>
  </span>
);

export const CardLoadingFallback: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${styles.cardFallback} ${className || ''}`}>
    <div className={`${styles.cardLine} ${styles.cardLine1}`}></div>
    <div className={`${styles.cardLine} ${styles.cardLine2}`}></div>
    <div className={`${styles.cardLine} ${styles.cardLine3}`}></div>
  </div>
);
