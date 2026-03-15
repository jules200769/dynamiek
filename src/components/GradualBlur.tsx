import React, { useMemo, useState, useEffect } from 'react';
import './GradualBlur.css';

type Position = 'top' | 'bottom' | 'left' | 'right';

const SCROLL_END_THRESHOLD = 24;

function isScrolledToBottom(): boolean {
  if (typeof window === 'undefined') return false;
  const { scrollY, innerHeight } = window;
  const { scrollHeight } = document.documentElement;
  return scrollY + innerHeight >= scrollHeight - SCROLL_END_THRESHOLD;
}

interface GradualBlurProps {
  position?: Position;
  strength?: number;
  height?: string;
  divCount?: number;
  exponential?: boolean;
  opacity?: number;
  curve?: 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out';
  /** Pin to viewport (bottom/top of screen) so it stays visible while scrolling */
  fixed?: boolean;
  /** When true and fixed: fade out when scrolled to bottom, fade in when scrolling up */
  hideAtBottom?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CURVE_FUNCTIONS: Record<string, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  'ease-in': (p) => p * p,
  'ease-out': (p) => 1 - Math.pow(1 - p, 2),
  'ease-in-out': (p) =>
    p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2,
};

const getGradientDirection = (position: Position): string =>
  ({
    top: 'to top',
    bottom: 'to bottom',
    left: 'to left',
    right: 'to right',
  })[position] ?? 'to bottom';

export default function GradualBlur({
  position = 'bottom',
  strength = 2,
  height = '6rem',
  divCount = 5,
  exponential = false,
  opacity = 1,
  curve = 'linear',
  fixed = false,
  hideAtBottom = false,
  className = '',
  style = {},
}: GradualBlurProps) {
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    if (!fixed || !hideAtBottom) return;
    const check = () => setAtBottom(isScrolledToBottom());
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [fixed, hideAtBottom]);

  const visible = !hideAtBottom || !atBottom;

  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = [];
    const increment = 100 / divCount;
    const curveFunc = CURVE_FUNCTIONS[curve] ?? CURVE_FUNCTIONS.linear;

    for (let i = 1; i <= divCount; i++) {
      let progress = i / divCount;
      progress = curveFunc(progress);

      const blurValue = exponential
        ? Math.pow(2, progress * 4) * 0.0625 * strength
        : 0.0625 * (progress * divCount + 1) * strength;

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = getGradientDirection(position);

      const divStyle: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity,
      };

      divs.push(<div key={i} style={divStyle} />);
    }

    return divs;
  }, [position, strength, divCount, exponential, opacity, curve]);

  const containerStyle: React.CSSProperties = {
    position: fixed ? 'fixed' : 'absolute',
    pointerEvents: 'none',
    zIndex: fixed ? 1000 : 10,
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.18s ease-out',
    ...style,
  };

  if (position === 'top' || position === 'bottom') {
    containerStyle.height = height;
    containerStyle.width = '100%';
    containerStyle[position] = 0;
    containerStyle.left = 0;
    containerStyle.right = 0;
  } else {
    containerStyle.width = height;
    containerStyle.height = '100%';
    containerStyle[position] = 0;
    containerStyle.top = 0;
    containerStyle.bottom = 0;
  }

  return (
    <div
      className={`gradual-blur ${className}`}
      style={containerStyle}
      aria-hidden
    >
      <div
        className="gradual-blur-inner"
        style={{ position: 'relative', width: '100%', height: '100%' }}
      >
        {blurDivs}
      </div>
    </div>
  );
}
