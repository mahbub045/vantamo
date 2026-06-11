interface AvatarProps {
  name: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = { sm: 'w-6 h-6 text-[10px]', md: 'w-8 h-8 text-xs', lg: 'w-10 h-10 text-sm' };

const COLORS = [
  'bg-violet-500/20 text-violet-400',
  'bg-blue-500/20 text-blue-400',
  'bg-emerald-500/20 text-emerald-400',
  'bg-amber-500/20 text-amber-400',
  'bg-rose-500/20 text-rose-400',
  'bg-cyan-500/20 text-cyan-400',
];

function hashName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h);
}

export default function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const color = COLORS[hashName(name) % COLORS.length];

  if (src) {
    return <img src={src} alt={name} className={`${SIZES[size]} rounded-full object-cover ${className}`} />;
  }

  return (
    <div className={`${SIZES[size]} rounded-full flex items-center justify-center font-semibold ${color} ${className}`}>
      {initials}
    </div>
  );
}
