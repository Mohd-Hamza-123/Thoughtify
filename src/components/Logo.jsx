import React from "react";
import { Link } from "react-router-dom";
import { getAvatar } from "@/services/getAvatar";

const Logo = () => {
  return (
    <Link to="/">
      <figure className="logo_div flex justify-around cursor-pointer gap-2 items-center">
        <img
          className="w-5 md:w-8 filter brightness-200 dark:invert"
          src="Thoughtify.webp"
          alt="Logo"
          loading="lazy"
        />
        <h1 className="md:text-2xl text-md font-semibold dark:text-white">
          Thoughtify
        </h1>
      </figure>
    </Link>
  );
};

export default Logo;


export const ThoughtifyLogo = ({ className = '' }) => {
  return <img
    className={`h-[50px] filter brightness-200 dark:invert ${className}`}
    src="Thoughtify.webp"
    alt="Logo"
    loading="lazy"
  />
}


export const ProfileImage = ({ className = '', ...props }) => {
  return <img
    {...props}
    src={getAvatar()}
    alt="Profile Pic"
    className={`w-[30px] md:w-[35px] h-[30px] md:h-[35px] rounded-full ${className}`}
  />
}