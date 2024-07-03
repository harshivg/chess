import React from "react";

const Button = ({
  onClick,
  children,
  className = "",
  disabled = false,
}: {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-blue-500 cursor-pointer text-white font-bold text-3xl px-12 py-5 rounded
        ${disabled ? 'cursor-not-allowed' : 'hover:bg-blue-700'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;