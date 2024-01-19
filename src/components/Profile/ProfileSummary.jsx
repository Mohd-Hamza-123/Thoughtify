import React, { useEffect, useState } from "react";
import "./ProfileSummary.css";
import { Input } from "../";
import location from "../../appwrite/location";
import avatar from "../../appwrite/avatars";
import occupation_Arr from "./Profile_arr";

const ProfileSummary = () => {
  const [countryName, setcountryName] = useState(null);
  const [flag, setflag] = useState(null);
  const flagFunc = async () => {
    let locations = await location.GetLocation();
    // console.log(locations);
    setcountryName(locations.country);
    if (locations) {
      let flagURL = await avatar.getFlag(locations.countryCode, 20, 20);
      // console.log(flagURL.href);
      setflag(flagURL.href);
    }
  };
  console.log(occupation_Arr);
  useEffect(() => {
    flagFunc();
  }, []);
  return (
    <div id="ProfileSummary">
      <div className="">
        <span> From : </span>
        {countryName ? (
          <div className="flex gap-2">
            <span>{countryName}</span>
            <span>
              <img src={flag} alt="" className="rounded-full" />
            </span>
          </div>
        ) : (
          "Don't Know"
        )}
      </div>
      <div>
        <span>Join Date : </span>
        <span>31/01/2023</span>
      </div>
      <div>
        <span>Bio : </span>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat cumque
          aliquid sed voluptatibus! Neque voluptates deleniti necessitatibus,
          incidunt libero saepe natus cum corrupti enim laborum modi cupiditate
          laudantium. Neque, quia!
        </p>
        <a href="#">Links</a>
      </div>

      <div>
        <span>Occupation </span>
        {/* <select name="" id="">
          <option value="">Student</option>
        </select> */}
        <span>Student</span>
      </div>
    </div>
  );
};

export default ProfileSummary;
