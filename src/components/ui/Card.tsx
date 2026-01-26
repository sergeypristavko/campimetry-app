import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
}

export function Card({ children, title, style }: CardProps) {
  const cardStyles: React.CSSProperties = {
    backgroundColor: '#16213e',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '20px',
    ...style,
  };

  return (
    <div style={cardStyles}>
      {title && (
        <h2 style={{ marginTop: 0, marginBottom: '16px', color: '#fff' }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
