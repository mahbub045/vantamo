import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'accent';
  hover?: boolean;
}

export default function Card({ variant = 'default', hover = false, className = '', children, ...props }: CardProps) {
  const bases = {
    default: 'card',
    glass: 'glass rounded-[var(--radius)]',
    accent: 'card accent-gradient text-white',
  };
  return (
    <div className={`${bases[variant]} ${hover ? 'hover:-translate-y-0.5 cursor-pointer' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}
