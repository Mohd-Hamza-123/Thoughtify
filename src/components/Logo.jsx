import React from "react";

const Logo = ({ className }) => {
  return (
    <div className={`w-14 h-13 ${className}`}>
      <img src="Logo/Logo.png" alt="img" />
    </div>
  );
};

export default Logo;
