import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  ariaLabel?: string;
  disabled?: boolean;
  glow?: 'none' | 'subtle' | 'default' | 'strong' | 'accent';
}

export default function GradientButton({
  children,
  onClick,
  className = '',
  type = 'button',
  ariaLabel,
  disabled = false
  , glow = 'subtle'
}: GradientButtonProps) {
  const glowClass =
    glow === 'none' ? '' : glow === 'subtle' ? 'btn-glow-subtle' : glow === 'strong' ? 'btn-glow-strong' : glow === 'accent' ? 'btn-glow-accent' : 'btn-glow-default';
  return (
    <motion.button
      type={type}
      onClick={onClick}
      /* Keep tap scale for tactile feedback, but avoid hover scale because
         CSS provides a subtle 3D pop (.three-d) which would conflict with
         framer-motion scale transforms. */
      whileHover={disabled ? {} : {}}
      whileTap={disabled ? {} : { scale: 0.95 }}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`three-d px-8 py-3 rounded-xl brand-bg text-gray-900 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${glowClass} ${className}`}
    >
      {children}
    </motion.button>
  );
}
