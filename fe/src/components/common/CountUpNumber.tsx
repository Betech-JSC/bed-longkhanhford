"use client";

import { useEffect, useState, useRef } from "react";

interface CountUpNumberProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function CountUpNumber({
  target,
  duration = 1800,
  prefix = "",
  suffix = "",
  className = "",
}: CountUpNumberProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          startCounting();
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [target, duration]);

  const startCounting = () => {
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic formula for smooth deceleration
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOutProgress * target);

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
