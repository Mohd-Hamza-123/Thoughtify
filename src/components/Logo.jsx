import React from "react";
import { Link } from "react-router-dom";
const Logo = () => {
  return (
    <Link to="/">
      <figure className="logo_div flex justify-around cursor-pointer gap-2 items-center">
        <img
          className="w-7 md:w-8 filter brightness-200 dark:invert"
          src="Thoughtify.webp"
          alt="Logo"
          loading="lazy"
        />
        <h1 className="md:text-2xl text-xl font-semibold dark:text-white">
          Thoughtify
        </h1>
      </figure>
    </Link>
  );
};

export default Logo;


export const ThoughtifyLogo = ({className = ''}) => {
  return <img
    className={`w-[38px] h-[50px] filter brightness-200 dark:invert ${className}`}
    src="Thoughtify.webp"
    alt="Logo"
    loading="lazy"
  />
}
