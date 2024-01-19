import React from "react";

const Button = ({
  children,
  type = "button",
  // bgColor = "bg-black",
  // textColor = "text-white",
  // defaultClassName = "px-4 py-1 rounded-md",
  className = "",
  ...props
}) => {
  return (
    <button type={type} className={`${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
