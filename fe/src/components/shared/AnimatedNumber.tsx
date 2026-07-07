"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number; // ms
  formatFn?: (val: number) => string;
}

export default function AnimatedNumber({ value, duration = 800, formatFn }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const start = previousValueRef.current;
    const end = value;
    if (start === end) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const rate = Math.min(progress / duration, 1);
      
      // Easing function: easeOutQuad
      const ease = rate * (2 - rate);
      const current = Math.round(start + (end - start) * ease);
      
      setDisplayValue(current);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
        previousValueRef.current = end;
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);

  // Keep internal ref updated to avoid stale values
  useEffect(() => {
    previousValueRef.current = displayValue;
  }, [displayValue]);

  return <>{formatFn ? formatFn(displayValue) : displayValue}</>;
}
