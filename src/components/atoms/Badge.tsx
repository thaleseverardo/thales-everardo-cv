import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  className = ''
}) => {
  const baseClasses = "px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border shrink-0 inline-flex items-center gap-1";
  
  const variants = {
    default: "dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 bg-slate-100 border-slate-200 text-slate-700",
    success: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
    danger: "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30",
    info: "bg-blue-500/10 text-blue-700 dark:text-cyan-400 border-blue-500/30"
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
