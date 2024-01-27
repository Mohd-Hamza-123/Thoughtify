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
  // console.log(bio);
  return (
    <div id="ProfileSummary">
      <div id="ProfileSummary_Bio_Div">
        <span className=""> Bio </span>
        <p>{bio}</p>
        <a href="#" target="_blank" className="text-blue-600">
          Links
        </a>
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
        <span>Interested In : </span>
      </div>
    </div>
  );
};

export default ProfileSummary;
