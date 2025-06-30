import React from 'react';

interface DividerProps {
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ className = '' }) => {
  return (
    <span 
      className={`block h-1.5 bg-gray-100 ${className}`}
      role="separator"
      aria-orientation="horizontal"
    />
  );
};

export default Divider;