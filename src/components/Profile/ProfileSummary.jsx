import React from "react";
import { useSelector } from "react-redux";

const ProfileSummary = ({ profileData = {} }) => {
  const {
    bio,
    links,
    interestedIn,
    occupation,
    educationLvl,
    userIdAuth,
  } = profileData;

  const userData = useSelector((state) => state?.auth?.userData);

  return (
    <div className="ProfileSummary w-full flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8 bg-gray-50 rounded-2xl shadow-md">
      {/* Left Section */}
      <div
        id="ProfileSummary"
        className={`w-full ${userIdAuth === userData?.$id ? "lg:w-2/3" : "w-full"}`}>
        {/* Bio */}
       

        {/* Links */}
        <div className="ProfileSummary_Links mb-6">
          <h3 className="text-md sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
            <i className="fa-solid fa-link text-green-600"></i> Links
          </h3>
          <div className="flex flex-col gap-2 mt-2">
            {links && links.length > 0 ? (
              links.map((link, index) => (
                <div
                  key={JSON.parse(link).URL + index}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm sm:text-base"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square text-gray-500"></i>
                  <a
                    href={JSON.parse(link).URL}
                    target="_blank"
                    className="hover:underline truncate max-w-[90%]"
                  >
                    {JSON.parse(link).Title}
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm sm:text-base">
                No links added.
              </p>
            )}
          </div>
        </div>

        {/* Education */}
        <div
          id="ProfileSummary_HighlvlEduDiv"
          className="mb-4 flex flex-wrap items-center gap-2 text-gray-700 text-sm sm:text-base"
        >
          <i className="fa-solid fa-graduation-cap text-indigo-600"></i>
          <span className="font-semibold">Highest Level of Education:</span>
          <span>{educationLvl || "Not specified"}</span>
        </div>

        {/* Occupation */}
        <div
          id="ProfileSummary_OccupationDiv"
          className="mb-4 flex flex-wrap items-center gap-2 text-gray-700 text-sm sm:text-base"
        >
          <i className="fa-solid fa-briefcase text-purple-600"></i>
          <span className="font-semibold">Occupation:</span>
          <span>{occupation || "Not specified"}</span>
        </div>

        {/* Interested In */}
        <div id="ProfileSummary_InterestedDiv">
          <h3 className="text-md sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
            <i className="fa-solid fa-star text-yellow-500"></i> Interested In
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {interestedIn && interestedIn.length > 0 ? (
              interestedIn.map((interest, index) => (
                <span
                  key={interest + index + Date.now()}
                  className="text-gray-600 bg-gray-100 px-3 py-1 rounded-md border border-gray-200 text-sm sm:text-base"
                >
                  {`${index + 1}) ${interest}`}
                </span>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm sm:text-base">
                No interests added yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Section */}
      {userIdAuth === userData?.$id && <div
        id="ProfileSummarySecondDiv"
        className="w-full lg:w-1/3 bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8 border border-gray-100">
        <ul className="flex flex-col gap-4 text-gray-700 leading-relaxed text-sm sm:text-base">
          <li className="font-bold text-gray-900 text-base sm:text-lg">
            Welcome, {profileData?.name}
          </li>
          <li>
            This is your one-stop shop for getting answers and connecting with
            others.
          </li>
          <li>
            Connect with friends! Chat with your friends, discuss topics that
            interest you, and build a supportive network.
          </li>
          <li>
            Get involved! The more active you are, the more you'll get out of
            this platform. Share your knowledge, answer questions, and make a
            difference.
          </li>
        </ul>
      </div>}
    </div>
  );
};

export default ProfileSummary;
