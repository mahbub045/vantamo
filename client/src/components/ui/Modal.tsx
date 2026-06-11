import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) { ref.current?.showModal(); } else { ref.current?.close(); }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <dialog
      ref={ref}
      className={`${sizes[size]} w-full rounded-2xl p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-2xl animate-scale-in`}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <div className="flex items-center justify-between p-5 pb-0">
        <h2 className="text-lg font-semibold font-display">{title}</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--accent-muted)] transition-colors cursor-pointer">
          <X size={18} />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  );
}
