import React, { useEffect, useState } from "react";
import "./ProfileSummary.css";
import { Input } from "../";
import occupation_Arr from "./Profile_arr";

const ProfileSummary = () => {
  return (
    <div id="ProfileSummary">
      <div id="ProfileSummary_Bio_Div">
        <span className=""> Bio </span>
        <p>
          Certainly! To create a bio for you, I'll need some information. Feel
          free to provide details such as your name, age, profession, interests,
          achievements, and any other relevant information you'd like to
          include. Additionally, let me know if there's a specific tone or style
          you prefer for your bio.!
        </p>
        <a href="#" target="_blank" className="text-blue-600">
          Links
        </a>
      </div>

      <div id="ProfileSummary_HighlvlEduDiv" className="mt-3">
        <span>Highest Level of Education : </span>
        <span>Intermediate</span>
      </div>

      <div id="ProfileSummary_OccupationDiv" className="mt-3">
        <span>Occupation : </span>
        <span> Student</span>
      </div>

      <div id="ProfileSummary_InterestedDiv" className="mt-3">
        <span>Interested In : </span>
      </div>
    </div>
  );
};

export default ProfileSummary;
