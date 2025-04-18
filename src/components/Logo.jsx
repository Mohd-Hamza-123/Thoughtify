import React from "react";
import QueryFlow from "../../public/QueryFlow.png";
import { Link } from "react-router-dom";
const Logo = () => {
  return (
    <Link to="/">
      <figure className="logo_div flex justify-around cursor-pointer gap-2 items-center">
        <img
          className="w-7 md:w-8 filter brightness-200 dark:invert"
          src={QueryFlow}
          alt="Logo"
        />
        <h1 className="md:text-2xl text-xl font-semibold dark:text-white">
          Thoughtify
        </h1>
      </figure>
    </Link>
  );
};

export default Logo;
