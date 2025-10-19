import { motion, Easing } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
  /**
   * Trigger mode: 'click' (default), 'hover', 'focus', or 'manual'.
   * - click: toggles on click/key press
   * - hover: flips on hover (enter/leave)
   * - focus: flips on focus/blur
   * - manual: controlled via isFlipped prop
   */
  trigger?: 'click' | 'hover' | 'focus' | 'manual';
  /** rotation axis */
  axis?: 'y' | 'x';
  /** animation duration in seconds */
  duration?: number;
  /** custom easing curve for framer-motion */
  easing?: Easing | Easing[]; // framer-motion easing (array or string)
  /** controlled mode: supply isFlipped and onChange to control externally */
  isFlipped?: boolean;
  onChange?: (flipped: boolean) => void;
}

export default function FlipCard({
  front,
  back,
  className = '',
  trigger = 'click',
  axis = 'y',
  duration = 0.9,
  easing = [0.22, 1, 0.36, 1],
  isFlipped: controlledFlipped,
  onChange,
}: FlipCardProps) {
  const [internal, setInternal] = useState(false);
  const isControlled = typeof controlledFlipped === 'boolean';
  const isFlipped = isControlled ? controlledFlipped! : internal;

  const handleToggle = (next?: boolean) => {
    const newState = typeof next === 'boolean' ? next : !isFlipped;
    if (isControlled) {
      onChange?.(newState);
    } else {
      setInternal(newState);
      onChange?.(newState);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (trigger === 'click' || trigger === 'manual') handleToggle();
    }
  };

  // hover/focus handlers (no-op in manual mode)
  const onMouseEnter = () => { if (trigger === 'hover') handleToggle(true); };
  const onMouseLeave = () => { if (trigger === 'hover') handleToggle(false); };
  const onFocus = () => { if (trigger === 'focus') handleToggle(true); };
  const onBlur = () => { if (trigger === 'focus') handleToggle(false); };

  const rotateProp = axis === 'y' ? { rotateY: isFlipped ? 180 : 0 } : { rotateX: isFlipped ? 180 : 0 };

  return (
    <div
      title={trigger === 'hover' ? 'Hover to flip' : 'Click to flip'}
      className={`perspective-1000 three-d glow-glassmorphism flip-hover-glow ${isFlipped ? 'flip-glow-on' : ''} ${className} overflow-hidden min-h-0 ${trigger === 'click' ? 'cursor-pointer' : ''}`}
      onClick={() => { if (trigger === 'click') handleToggle(); }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      role="button"
      tabIndex={trigger === 'manual' ? -1 : 0}
      onKeyDown={handleKey}

    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
        animate={rotateProp}
        transition={{ duration, ease: easing, type: 'tween' }}
      >
        <div className="absolute inset-0 w-full h-full backface-hidden flex flex-col">{front}</div>

        <div className={`absolute inset-0 w-full h-full backface-hidden ${axis === 'y' ? 'rotate-y-180' : 'rotate-x-180'} flex flex-col`}>{back}</div>
      </motion.div>
    </div>
  );
}
