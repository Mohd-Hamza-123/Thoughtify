import React, { useRef, useState } from "react";
import "./EditProfile.css";
import { Input, TextArea } from "../index";
import { educationLevels, occupation_Arr } from "./Profile_arr";
const EditProfile = () => {
  const selectEduLvl = useRef();
  const [visibleEdulvl, setVisibleEdulvl] = useState(false);
  const [visibleOccupation, setVisibleOccupation] = useState(false);
  return (
    <form>
      <div
        id="EditProfile_EditImage_Div"
        className="w-full bg-white flex flex-col items-center gap-4 overflow-hidden"
      >
        <div className="flex w-9/12 justify-center" id="EditProfile_Img_Div">
          <img
            src="https://viget.imgix.net/downalod-final.png?auto=format%2Ccompress&crop=focalpoint&fit=crop&fp-x=0.5&fp-y=0.5&ixlib=php-3.3.1&q=90&w=1280&s=6abcc4363b7397bebcad981e8901af25"
            alt=""
          />
        </div>
        <div className="w-full flex justify-center" id="EditProfile_label_Div">
          <label
            id="EditProfile_ChooseImg"
            htmlFor="editProfileImg"
            className="flex gap-2 items-center cursor-pointer"
          >
            <span>Update Image </span>
            <i className="fa-solid fa-upload"></i>
          </label>

          <input
            type="file"
            name=""
            id="editProfileImg"
            className="ml-2 hidden "
          />
        </div>
      </div>
      <div className="w-full" id="EditProfile_EditContent">
        <div id="EditProfile_EditBio">
          <label htmlFor="EditProfile-bio" className="mb-2 inline-block">
            Bio
          </label>
          <TextArea
            name=""
            maxLength={200}
            placeholder="Maximum 200 characters are Allowed"
            id="EditProfile-bio"
            className="w-full resize-none outline-none"
          ></TextArea>
        </div>
        {/* Links div */}
        <div id="EditProfile_EditLinks">
          <label htmlFor="" className="mb-2 inline-block">
            Links
          </label>
          <div className="flex h-40" id="">
            <div
              id="EditProfile_EditLinks_3inputs"
              className="w-full flex flex-col gap-5 items-start"
            >
              <input
                className="outline-none px-1"
                placeholder="URL"
                type="url"
                name=""
                id=""
              />
              <input
                className="outline-none px-1"
                placeholder="Title"
                type="text"
                name=""
                id=""
              />
              <input
                type="button"
                value="Add Link"
                className="cursor-pointer Add-Link_btn"
              />
            </div>

            <div id="EditProfile_EditLinks_LinksAdded" className="inline-block">
              <section className="flex gap-3 p-1 items-center w-full">
                <span className=" p-1 flex justify-center items-center">
                  <i className="fa-solid fa-link"></i>
                </span>
                <div id="EditProfile_EditLinks_title_url_div">
                  <div className="flex justify-between">
                    <p>Title</p>
                    <span className="cursor-pointer">
                      <i className="fa-regular fa-trash-can"></i>
                    </span>
                  </div>
                  <a
                    href="https://en.wikipedia.org/wiki/Computer"
                    target="_blank"
                  >
                    {
                      "https://en.wikipedia.org/wiki/Computer         ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
                    }
                  </a>
                </div>
              </section>
            </div>
          </div>
          {/* Highest Level of Eduction div  */}
          <div className="EditProfile_Edu_Lvl_div">
            <p htmlFor="" className="mb-2 block">
              Highest Level of Education
            </p>
            <div className="flex justify-start gap-3">
              {/* <label className="w-1/3" htmlFor="">
                Select Your Education Level
              </label> */}
              <div className="w-1/2">
                <select
                  name=""
                  className=""
                  ref={selectEduLvl}
                  onChange={(e) => {
                    console.log(e.target.value);
                    if (e.currentTarget.value === "Other") {
                      setVisibleEdulvl(true);
                    } else {
                      setVisibleEdulvl(false);
                    }
                  }}
                >
                  <option value="" hidden>
                    Your Qualification
                  </option>
                  {educationLevels.map((education) => (
                    <option key={education} value={education}>
                      {education}
                    </option>
                  ))}
                </select>
              </div>
              {visibleEdulvl && (
                <div className="w-1/2">
                  <input
                    type="text"
                    placeholder="Enter Your Qualification"
                    className="outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="EditProfile_Occupation_div">
            <p htmlFor="" className="mb-2 mt-2 block">
              Occupation
            </p>
            <div className="flex justify-start gap-3">
              <div className="w-1/2">
                <select
                  name=""
                  className=""
                  onChange={(e) => {
                    console.log(e.target.value);
                    if (e.currentTarget.value === "Other") {
                      setVisibleOccupation(true);
                    } else {
                      setVisibleOccupation(false);
                    }
                  }}
                >
                  <option value="" hidden>
                    Your Occupation
                  </option>
                  {occupation_Arr.map((occupation) => (
                    <option key={occupation} value={occupation}>
                      {occupation}
                    </option>
                  ))}
                </select>
              </div>
              {visibleOccupation && (
                <div className="w-1/2">
                  <input
                    type="text"
                    placeholder="Enter Your Occupation"
                    className="outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProfile;
