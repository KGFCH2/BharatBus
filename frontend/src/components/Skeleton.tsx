import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'card';
    width?: string | number;
    height?: string | number;
    lines?: number;
}

const shimmer = {
    initial: { x: '-100%' },
    animate: { x: '100%' },
    transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear' as const,
    },
};

export default function Skeleton({
    className = '',
    variant = 'rectangular',
    width,
    height,
    lines = 1,
}: SkeletonProps) {
    const baseClasses = 'bg-white/10 overflow-hidden relative';

    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
        card: 'rounded-xl',
    };

    const style: React.CSSProperties = {
        width: width || '100%',
        height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? '48px' : '100%'),
    };

    if (variant === 'circular' && !width) {
        style.width = height || '48px';
    }

    if (variant === 'text' && lines > 1) {
        return (
            <div className={`space-y-2 ${className}`}>
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={`${baseClasses} ${variantClasses.text}`}
                        style={{
                            ...style,
                            width: i === lines - 1 ? '70%' : '100%',
                        }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                            {...shimmer}
                        />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        >
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                {...shimmer}
            />
        </div>
    );
}

// Pre-built skeleton patterns
export function TicketCardSkeleton() {
    return (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <Skeleton variant="text" width="120px" />
                    <Skeleton variant="rectangular" width="80px" height="24px" />
                </div>
                <Skeleton variant="rectangular" width="64px" height="64px" />
            </div>
            <div className="flex items-center justify-center gap-4 py-3">
                <Skeleton variant="text" width="80px" />
                <Skeleton variant="circular" width="24px" height="24px" />
                <Skeleton variant="text" width="80px" />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="100%" />
            </div>
            <div className="flex gap-2 pt-3">
                <Skeleton variant="rectangular" height="40px" />
                <Skeleton variant="rectangular" height="40px" />
            </div>
        </div>
    );
}

export function RouteCardSkeleton() {
    return (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <Skeleton variant="text" width="150px" height="28px" />
                    <Skeleton variant="text" width="100px" />
                </div>
                <div className="text-right space-y-1">
                    <Skeleton variant="text" width="60px" height="28px" />
                    <Skeleton variant="text" width="40px" />
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <Skeleton variant="circular" width="20px" height="20px" />
                    <Skeleton variant="text" width="120px" />
                </div>
                <div className="ml-2 pl-6 py-2">
                    <Skeleton variant="text" width="80px" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton variant="circular" width="20px" height="20px" />
                    <Skeleton variant="text" width="120px" />
                </div>
            </div>
        </div>
    );
}

export function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton variant="circular" width="80px" height="80px" />
                <div className="space-y-2">
                    <Skeleton variant="text" width="180px" height="24px" />
                    <Skeleton variant="text" width="140px" />
                </div>
            </div>
            <div className="space-y-4">
                <Skeleton variant="text" lines={3} />
            </div>
        </div>
    );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
    return (
        <div className="flex items-center gap-4 py-3 px-4">
            {Array.from({ length: columns }).map((_, i) => (
                <Skeleton key={i} variant="text" className="flex-1" />
            ))}
        </div>
    );
}
