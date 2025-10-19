import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  hover?: boolean;
}

export default function GlassCard({ children, hover = true, className = '', ...rest }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      className={`three-d backdrop-blur-md bg-white/95 dark:bg-white/5 rounded-2xl p-6 flex flex-col h-full light:text-black light:border-2 light:border-black ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
