import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  style,
  ...props
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.1s, opacity 0.1s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#e94560',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#0f3460',
      color: 'white',
    },
    danger: {
      backgroundColor: '#dc2626',
      color: 'white',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#e94560',
      border: '1px solid #e94560',
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: '8px 16px',
      fontSize: '14px',
    },
    md: {
      padding: '12px 24px',
      fontSize: '16px',
    },
    lg: {
      padding: '16px 32px',
      fontSize: '18px',
    },
  };

  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(fullWidth ? { width: '100%' } : {}),
    ...(props.disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
    ...style,
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!props.disabled) {
      e.currentTarget.style.transform = 'scale(1.02)';
    }
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(1)';
  };

  return (
    <button
      style={combinedStyles}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      {...props}
    >
      {children}
    </button>
  );
}
