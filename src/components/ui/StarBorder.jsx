import React from 'react';

const StarBorder = ({
  as: Component = 'button',
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  ...rest
}) => {
  return (
    <Component
      className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}
      style={{
        padding: `${thickness}px`,
        ...rest.style
      }}
      {...rest}
    >
      <style>{`
        @keyframes star-border-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${color} 90deg, transparent 180deg)`,
          animation: `star-border-spin ${speed} linear infinite`
        }}
      />
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: `conic-gradient(from 180deg, transparent 0deg, ${color} 90deg, transparent 180deg)`,
          animation: `star-border-spin ${speed} linear infinite`
        }}
      />
      <div className="relative z-10 bg-gray-900 rounded-[inherit] w-full h-full flex items-center justify-center">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;