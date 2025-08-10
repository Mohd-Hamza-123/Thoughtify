import React from "react";
import { Link } from "react-router-dom";
import { getAvatar } from "@/services/getAvatar";
import { useSelector } from "react-redux";
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

  const myProfile = useSelector((state) => state.profileSlice.userProfile)
  console.log(myProfile)
  const { profileImageURL, profileImageID } = myProfile?.profileImage ? JSON.parse(myProfile?.profileImage) : "No Image"

  return <img
    {...props}
    src={profileImageURL?.replace("/preview", "/view")}
    alt="Profile Pic"
    className={`w-[30px] md:w-[35px] h-[30px] md:h-[35px] rounded-full ${className}`}
  />
}