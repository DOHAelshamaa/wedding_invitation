import { forwardRef, type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 px-8 py-3 text-sm tracking-[0.2em] uppercase transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-clay disabled:opacity-50 disabled:cursor-not-allowed';
    const styles =
      variant === 'primary'
        ? 'bg-dark-brown text-white hover:bg-brown'
        : 'border border-brown text-brown hover:bg-brown hover:text-white';

    return (
      <button ref={ref} className={`${base} ${styles} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
