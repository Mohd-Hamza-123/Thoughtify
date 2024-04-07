import React, { useEffect, useState } from "react";
import "./ProfileSummary.css";
import { Input } from "../";
import { occupation_Arr } from "./Profile_arr";

const ProfileSummary = ({ profileData }) => {
  const {
    bio,
    links,
    interestedIn,
    featuredImgId,
    occupation,
    educationLvl,
  } = profileData;

  return (
    <div className="w-full flex relative gap-3">
      <div id="ProfileSummary" className="w-2/3">
        <div id="ProfileSummary_Bio_Div">
          <span className=""> Bio </span>
          <pre id="ProfileSummayPre" className="whitespace-pre-wrap">{bio}</pre>
          <div className="ProfileSummary_Links mt-3">
            <span>Links </span>
            {links?.map((link) => (
              <div key={JSON.parse(link).URL} className="flex gap-2 items-center">
                <i className="fa-solid fa-link"></i>
                <a href={JSON.parse(link).URL} target="_blank" className="text-blue-600">
                  {JSON.parse(link).Title}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div id="ProfileSummary_HighlvlEduDiv" className="mt-3">
          <span>Highest Level of Education : </span>
          <span>{educationLvl}</span>
        </div>

        <div id="ProfileSummary_OccupationDiv" className="mt-3">
          <span>Occupation : </span>
          <span>{occupation}</span>
        </div>

        <div id="ProfileSummary_InterestedDiv" className="mt-3">
          <span>Interested In  </span>
          <div className="flex gap-0 flex-col mt-2">
            {interestedIn?.map((interest, index) => (
              <span key={interest + index + Date.now()}>
                {`${index + 1}) ${interest} `}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div id="ProfileSummarySecondDiv" className="w-1/3 bg-slate-500 h-full">
        {/* <p>Updates By Creater</p> */}
        <ul className="flex flex-col gap-2">
          <li>Welcome, {profileData.name}</li>
          <li>This is your one-stop shop for getting answers and connecting with others.</li>
          <li>Connect with friends!   Chat with your friends, discuss topics that interest you, and build a supportive network.</li>
          <li>Get involved!   The more active you are, the more you'll get out of this platform. Share your knowledge, answer questions, and make a difference.</li>
          <li>Become a responder and help others by answering questions. Once you've replied to 50 questions, you can be promoted to responder.</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileSummary;
