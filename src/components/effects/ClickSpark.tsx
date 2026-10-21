'use client';

import type { CSSProperties, ForwardedRef, ReactNode } from 'react';
import { forwardRef } from 'react';
import ClickSparkImplementation from './ClickSparkImpl';

export interface ClickSparkProps {
  sparkColor?: string | string[];
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  sparkWidth?: number;
  duration?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring';
  extraScale?: number;
  shape?: 'line' | 'streak' | 'dot' | 'star';
  randomness?: number;
  gravity?: number;
  spread?: number;
  direction?: number;
  glow?: number;
  ring?: boolean;
  layer?: 'front' | 'back';
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

const ClickSpark = forwardRef<unknown, ClickSparkProps>(
  (props, ref: ForwardedRef<unknown>) => (
    <ClickSparkImplementation {...props} ref={ref} />
  ),
);

ClickSpark.displayName = 'ClickSpark';

export default ClickSpark;
