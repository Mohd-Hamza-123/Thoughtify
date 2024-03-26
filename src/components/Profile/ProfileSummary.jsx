import React, { useEffect, useState } from "react";
import "./ProfileSummary.css";
import { Input } from "../";
import { occupation_Arr } from "./Profile_arr";

const ProfileSummary = ({ profileData }) => {
  const {
    bio,
    gender,
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
        <p>Updates By Creater</p>
        <ul>
          <li>Welocme {'Name'}. This is a platform where you can ask any doubt.</li>
          <li>You can have chats with your friends.</li>
          <li>Stay Active.</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileSummary;
