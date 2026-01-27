import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

/**
 * Карточка-контейнер с опциональным заголовком
 */
export function Card({ children, title, className = '' }: CardProps) {
  return (
    <div className={`bg-surface p-6 rounded-xl mb-5 ${className}`}>
      {title && <h2 className="mt-0 mb-4 text-white font-bold text-xl">{title}</h2>}
      {children}
    </div>
  );
}
