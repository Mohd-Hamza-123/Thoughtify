import conf from "../conf/conf";
import { Icons } from "@/components";
import profile from "../appwrite/profile";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const TrustedRespondersPage = () => {

  const navigate = useNavigate();
  const [trustedRespondersArr, setTrustedRespondersArr] = useState([]);

  const getResponders = async () => {
    try {
      const responders = await profile.listProfilesWithQueries({ listResponders: true });
      console.log(responders)
      setTrustedRespondersArr(responders?.documents);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    if (trustedRespondersArr.length === 0) getResponders();
  }, []);

  return (
    <div className="w-full px-4 py-8">

      {/* Heading */}
      <h3 className="text-center text-2xl md:text-3xl font-semibold mb-8">
        Responders
      </h3>

      {/* Main Responder */}

      <div className="w-full flex justify-center mb-10">

        <div className="bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-6 w-full max-w-3xl flex flex-col md:flex-row items-center gap-6 transition hover:shadow-xl">

          {/* Profile Image */}
          <div className="cursor-pointer">
            <img
              src="/Hamza.jpg"
              alt="Hamza"
              className="w-32 h-32 rounded-full object-cover border-2 border-blue-500 hover:scale-105 transition"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">

            <h4

              className="text-xl font-semibold cursor-pointer hover:text-blue-500 transition">
              Mohd Hamza
            </h4>

            <span className="inline-block mt-2 px-3 py-1 text-sm bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 rounded-full">
              Web Developer
            </span>

            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              Hey there! 👋 I'm a web developer who loves building sleek, responsive, and interactive websites.
            </p>

            {/* Social Icons */}
            <div className="flex justify-center md:justify-start gap-4 mt-4 text-xl">
              <a href="https://github.com/Mohd-Hamza-123" target="_blank" className="hover:text-gray-700 dark:hover:text-white transition">
                <Icons.github />
              </a>
              <a href="https://www.instagram.com/bytedeveloper.hamza/" target="_blank" className="hover:text-pink-500 transition">
                <Icons.instagram />
              </a>
              <a href="https://twitter.com/Mohd_Hamza_byte" target="_blank" className="hover:text-blue-500 transition">
                <Icons.twitter />
              </a>
              <a href="https://www.linkedin.com/in/mohd-hamza-18959427a/" target="_blank" className="hover:text-blue-600 transition">
                <Icons.linkedin />
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Other Responders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {trustedRespondersArr.map((respondersObj) => {
          if (respondersObj.userIdAuth === conf.myPrivateUserID) return null;

          return (
            <div
              key={respondersObj.$id}
              onClick={() => navigate(`/profile/${respondersObj.userIdAuth}`)}
              className="bg-white dark:bg-zinc-900 shadow-md rounded-xl p-5 cursor-pointer transition hover:-translate-y-1 hover:shadow-xl"
            >

              {/* Avatar */}
              <div className="flex justify-center mb-4">
                {respondersObj.profileImgID && (
                  <img
                    src={profileImageURLs[respondersObj.profileImgID]}
                    alt="user"
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                  />
                )}
              </div>

              {/* Name */}
              <h5 className="text-center font-semibold text-lg">
                {respondersObj.name}
              </h5>

              {/* Occupation */}
              <div className="flex justify-center mt-2">
                <span className="px-3 py-1 text-xs bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 rounded-full">
                  {respondersObj.occupation}
                </span>
              </div>

              {/* Bio */}
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 text-center line-clamp-3">
                {respondersObj.bio}
              </p>
            </div>
          );
        })}

      </div>

    </div>

  );
};

export default TrustedRespondersPage;
