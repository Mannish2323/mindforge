import { cn } from '@/utils';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: 'brand' | 'success' | 'warning' | 'error' | 'accent';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export function ProgressBar({ value, max = 100, color = 'brand', size = 'sm', showLabel, animated = true, className }: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const heights = { xs: 'h-1', sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };
  const colors = {
    brand:   'linear-gradient(90deg, #7c3aed, #a855f7)',
    success: 'linear-gradient(90deg, #16a34a, #22c55e)',
    warning: 'linear-gradient(90deg, #d97706, #f59e0b)',
    error:   'linear-gradient(90deg, #dc2626, #ef4444)',
    accent:  'linear-gradient(90deg, #be185d, #db2777)',
  };

  return (
    <div className={cn(className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-[rgba(160,150,220,0.6)] mb-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className={cn('progress-track', heights[size])}>
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            background: colors[color],
            transition: animated ? 'width 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none',
          }}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}
export function CircularProgress({ value, max = 100, size = 80, strokeWidth = 6, color = '#7c3aed', children }: CircularProgressProps) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(value / max, 0), 1);
  const dash = circ * pct;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth={strokeWidth} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  );
}
