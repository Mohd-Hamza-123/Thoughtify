import React, { useEffect, useRef, useState } from "react";
import "./EditProfile.css";
import { Button, Input, TextArea } from "../index";
import { educationLevels, occupation_Arr } from "./Profile_arr";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useForm } from "react-hook-form";
import profile from "../../appwrite/profile";

const EditProfile = ({
  editProfileBoolean,
  seteditProfileBoolean,
  profileData,
}) => {
  const {
    bio,
    gender,
    links,
    interestedIn,
    name,
    featuredImgId,
    occupation,
    educationLvl,
    $id,
  } = profileData;

  const [crop, setCrop] = useState({});
  const url = useRef();
  const title = useRef();
  const [URL, setURL] = useState("");
  const [Title, setTitle] = useState("");
  const [visibleEdulvl, setVisibleEdulvl] = useState(false);
  const [visibleOccupation, setVisibleOccupation] = useState(false);
  const [URLerror, setURLerror] = useState("");
  const [interestedTagArr, setInterestedTagArr] = useState([]);
  const [linksArr, setLinksArr] = useState([]);
  const { handleSubmit, register, setValue } = useForm({
    defaultValues: {
      bio: bio,
    },
  });
  const submit = async (data) => {
    if (data) {
      let profileData = await profile.updateProfile($id, { ...data });
      console.log(profileData);
      seteditProfileBoolean(false);
    }
  };

  useEffect(() => {
    if (bio) {
      console.log(bio);
      setValue("bio", bio, { shouldValidate: true });
    }
  }, [editProfileBoolean]);
  const addTag = (e) => {
    if (e.key === "Enter") {
      let tag = e.currentTarget.value.replace(/\s+/g, " ").toUpperCase();
      if (
        interestedTagArr.includes(tag) ||
        interestedTagArr.length === 10 ||
        tag.length > 30
      ) {
        e.currentTarget.value = "";
        return;
      }
      if (tag.includes(",")) {
        console.log(tag);
        let newArrComma = tag.split(",");
        for (let i = 0; i < newArrComma.length; i++) {
          if (interestedTagArr.includes(newArrComma[i])) {
            e.currentTarget.value = "";
            return;
          }
        }
        setInterestedTagArr((prev) => {
          if (prev.length + newArrComma.length > 10) {
            return prev;
          }
          return [...prev, ...newArrComma];
        });
        e.currentTarget.value = "";
        return;
      }

      setInterestedTagArr((prev) => [...prev, tag]);
      e.currentTarget.value = "";
    }
  };
  const addLinks = async (e) => {
    if (!URL || !Title) return;
    try {
      let res = await fetch(`${URL}`);
      // console.log(res);
      setURLerror("");
    } catch (error) {
      setURLerror("URL not accessible");
      return;
    }
    if (linksArr.length >= 15) {
      setURLerror("Maximum 15 Links Allowed");
      return;
    }
    for (let i = 0; i < linksArr.length; i++) {
      let obj = linksArr[i];
      let objURL = obj.URL;
      if (URL === objURL) {
        console.log("value is already there");
        setURLerror("Same URL not Allowed");
        return;
      }
    }
    setLinksArr((prev) => [{ URL, Title }, ...prev]);
    setTitle("");
    setURL("");
    url.current.value = "";
    title.current.value = "";
  };
  return (
    <form
      className="h-full relative p-4 EditProfile_form"
      onSubmit={handleSubmit(submit)}
    >
      <button
        id="EditProfile_cross_Btn"
        type="button"
        onClick={() => {
          seteditProfileBoolean(false);
        }}
      >
        <i className="fa-solid fa-x"></i>
      </button>
      <div
        id="EditProfile_EditImage_Div"
        className="w-full flex flex-col items-center gap-4 overflow-hidden mt-3"
      >
        <div className="flex w-9/12 justify-center" id="EditProfile_Img_Div">
          {/* <ReactCrop crop={crop}> */}
          <img
            src="https://viget.imgix.net/downalod-final.png?auto=format%2Ccompress&crop=focalpoint&fit=crop&fp-x=0.5&fp-y=0.5&ixlib=php-3.3.1&q=90&w=1280&s=6abcc4363b7397bebcad981e8901af25"
            alt=""
          />
          {/* </ReactCrop> */}
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
            accept="image/*"
            name=""
            id="editProfileImg"
            className="ml-2 hidden "
            {...register("featuredImgId", {
              required: false,
            })}
          />
        </div>
      </div>

      <div className="w-full" id="EditProfile_EditContent">
        <div id="EditProfile_EditBio">
          <label htmlFor="EditProfile-bio" className="mb-2 inline-block">
            Bio
          </label>
          <TextArea
            name="bio"
            // value={bio}
            maxLength={200}
            placeholder="Maximum 200 characters are Allowed"
            id="EditProfile-bio"
            className="w-full resize-none outline-none"
            {...register("bio", {
              required: false,
            })}
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
              className="w-full flex flex-col gap-3 items-start"
            >
              <input
                className="outline-none px-1"
                placeholder="URL"
                type="url"
                name=""
                id=""
                value={URL}
                ref={url}
                onChange={(e) => {
                  setURL(e.currentTarget.value);
                }}
              />
              <input
                className="outline-none px-1"
                placeholder="Title"
                type="text"
                name=""
                id=""
                value={Title}
                ref={title}
                onChange={(e) => {
                  setTitle(e.currentTarget.value);
                }}
              />
              <input
                type="button"
                value="Add Link"
                className="cursor-pointer Add-Link_btn"
                onClick={addLinks}
              />
              {URLerror && (
                <span className="text-red-600 font_bold_500">{URLerror}</span>
              )}
            </div>

            <div id="EditProfile_EditLinks_LinksAdded" className="inline-block">
              {linksArr?.map((link, index) => (
                <section
                  key={link.URL}
                  className="flex gap-3 p-1 items-center w-full"
                >
                  <span className="p-1 flex justify-center items-center link-circle">
                    <i className="fa-solid fa-link"></i>
                  </span>
                  <div className="EditProfile_EditLinks_title_url_div w-full">
                    <div className="flex justify-between w-full">
                      <p>{link.Title}</p>
                      <span
                        className="cursor-pointer"
                        onClick={() =>
                          setLinksArr((prev) => {
                            let linksArr = [...prev];
                            linksArr.splice(index, 1);
                            return linksArr;
                          })
                        }
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </span>
                    </div>
                    <a href={link.URL} target="_blank">
                      {link.URL}
                    </a>
                  </div>
                </section>
              ))}
            </div>
          </div>
          {/* Highest Level of Eduction div  */}
          <div className="EditProfile_Edu_Lvl_div">
            <p htmlFor="" className="mb-2 block">
              Highest Level of Education
            </p>
            <div className="flex justify-start gap-3">
              <div className="w-1/2">
                <select
                  name=""
                  className=""
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
                    maxLength={50}
                    // {...register("educationLvl", {
                    //   required: false,
                    // })}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="EditProfile_Occupation_div">
            <p className="mb-2 mt-2 block">Occupation</p>
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
                    maxLength={50}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="EditProfile_Interested_div">
            <p className="mb-2 mt-2 block">Interested In </p>
            <div className="EditProfile_Interested_Tag">
              <p className="">Press Enter or add a comma after every tag</p>
              <div className="EditProfile_tag_box p-2 mb-2">
                <ul className="flex flex-wrap gap-3">
                  {interestedTagArr?.map((Tag, index) => (
                    <li key={Tag} className="flex items-center gap-2">
                      <span>{Tag}</span>
                      <span
                        className="cursor-pointer"
                        onClick={(e) => {
                          setInterestedTagArr((prev) => {
                            let newArray = [...prev];
                            newArray.splice(index, 1);
                            return newArray;
                          });
                        }}
                      >
                        <i className="fa-solid fa-x"></i>
                      </span>
                    </li>
                  ))}

                  <input
                    type="text"
                    name=""
                    id=""
                    className="outline-none"
                    placeholder="Coding,Java,Python"
                    onKeyUp={addTag}
                  />
                </ul>
              </div>
              <div className="flex justify-between items-center EditProfile_Interested_remaining">
                <p>
                  <span> {10 - interestedTagArr.length} </span>tags are
                  remaining
                </p>
                <Button
                  className="green font_bold_500 text-white"
                  onClick={() => {
                    setInterestedTagArr((prev) => []);
                  }}
                >
                  Remove all
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button
        type="submit"
        id="EditProfile_submit_btn"
        className="flex justify-center items-center"
      >
        <i className="fa-solid fa-file-arrow-up"></i>
      </Button>
    </form>
  );
};

export default EditProfile;
