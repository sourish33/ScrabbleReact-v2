import React from 'react';

const TortoiseLogo = ({ size = 100, className = '' }) => {
  return (
    <img
      src={`${process.env.PUBLIC_URL}/tortoise-logo.svg`}
      alt="Tortoise Scrabble Logo"
      style={{ height: `${size}px`, width: 'auto' }}
      className={className}
    />
  );
};

export default TortoiseLogo;
