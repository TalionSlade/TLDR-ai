import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'premium' | 'simple';
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'simple',
  className = '',
  onClick,
  hover = false,
}) => {
  const getCardClass = () => {
    switch (variant) {
      case 'glass':
        return 'glass-card';
      case 'premium':
        return 'premium-card';
      case 'simple':
      default:
        return 'bg-white rounded-lg shadow border border-surface-100';
    }
  };

  const cardClass = `${getCardClass()} ${className}`;

  if (hover) {
    return (
      <motion.div
        className={cardClass}
        onClick={onClick}
        whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClass} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;