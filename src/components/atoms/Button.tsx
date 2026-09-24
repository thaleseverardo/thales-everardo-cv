import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  className = '', 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-1.5 font-mono font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed shrink-0";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-sm",
    secondary: "dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 bg-white hover:bg-slate-100 border-slate-300 text-slate-800 border",
    ghost: "bg-transparent dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/50 text-slate-500 hover:text-slate-900 hover:bg-slate-100",
    danger: "bg-rose-600 text-white hover:bg-rose-500 shadow-sm"
  };
  
  const sizes = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};
