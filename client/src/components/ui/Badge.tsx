interface BadgeProps {
  variant: string;
  className?: string;
}

const VARIANT_STYLES: Record<string, string> = {
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  planning: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  review: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  on_hold: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  todo: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  in_progress: 'bg-[var(--accent-muted)] text-[var(--accent)] border-[var(--accent)]/20',
  done: 'bg-green-500/10 text-green-400 border-green-500/20',
};

export default function Badge({ variant, className = '' }: BadgeProps) {
  const style = VARIANT_STYLES[variant] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  return (
    <span className={`inline-flex items-center h-5 px-2 text-[10px] font-semibold uppercase tracking-wider rounded-md border ${style} ${className}`}>
      {variant.replace('_', ' ')}
    </span>
  );
}
