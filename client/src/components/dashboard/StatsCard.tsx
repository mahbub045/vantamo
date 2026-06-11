import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  accent?: boolean;
  delay?: number;
}

export default function StatsCard({ label, value, icon: Icon, trend, accent, delay = 0 }: StatsCardProps) {
  return (
    <div
      className={`card p-5 animate-slide-up opacity-0 ${accent ? 'accent-gradient text-white border-0' : ''}`}
      style={{ animationDelay: `${delay * 0.08}s`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-medium uppercase tracking-wider ${accent ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
            {label}
          </p>
          <p className="text-3xl font-bold font-display mt-2">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${accent ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>{trend}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent ? 'bg-white/20' : 'accent-bg'}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
