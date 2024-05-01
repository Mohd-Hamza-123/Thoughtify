import React, { useEffect, useRef, useState } from "react";
import "./EditProfile.css";
import { Button, TextArea } from "../index";
import { educationLevels, occupation_Arr } from "./Profile_arr";
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useForm } from "react-hook-form";
import profile from "../../appwrite/profile";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { getCanvasPreview } from "./getCanvasPreview";
import { useAskContext } from "../../context/AskContext";


const MinimumDimension = 50;
const EditProfile = ({
  profileData,
}) => {
  const {
    bio,
    links,
    interestedIn,
    profileImgID,
    occupation,
    educationLvl,
    $id,
    profileImgURL,
  } = profileData;

  const { myUserProfile,
    setMyUserProfile,
    setNotificationPopMsgNature,
    setnotificationPopMsg,
    isDarkModeOn
  } = useAskContext()
  const userData = useSelector((state) => state.auth.userData);

  const navigate = useNavigate();
  const imgRef = useRef(null)
  const canvasRef = useRef(null)
  const url = useRef();
  const title = useRef();
  const [crop, setCrop] = useState({});
  const [URL, setURL] = useState("");
  const [Title, setTitle] = useState("");
  const [visibleEdulvl, setVisibleEdulvl] = useState(false);
  const [visibleOccupation, setVisibleOccupation] = useState(false);
  const [cropSelection, setCropSelection] = useState(null)
  const [interestedTagArr, setInterestedTagArr] = useState([]);
  const [file, setFile] = useState(null);

  const [canvasPreview, setcanvasPreview] = useState(true)
  const [prevFileURL, setprevFileURL] = useState('')
  const [imageURL, setImageURL] = useState("");
  const [URLerror, setURLerror] = useState("");
  const [interestedTag, setInterestedTag] = useState("");
  const [linksArr, setLinksArr] = useState([]);

  const [EducationLevel, setEducationLevel] = useState("");
  const [OccupationInput, setOccupationInput] = useState("");
  const [seePreviewBefore, setseePreviewBefore] = useState('')
  const { handleSubmit, register, setValue } = useForm({
    defaultValues: {
      bio: bio,
    },
  });

  const [prevProfilePic, setprevProfilePic] = useState('');

  
  const [isUpdating, setisUpdating] = useState(false)
  useEffect(() => {


    if (profileImgID) {

      if (myUserProfile?.profileImgURL) {

        setprevProfilePic(myUserProfile?.profileImgURL)
        setprevFileURL(myUserProfile?.profileImgURL)

      } else {
        profile.getStoragePreview(profileImgID)
          .then((res) => {
            setprevFileURL(res?.href);
          })


        const get = async (profileImgID) => {
          const prev = await profile.getStoragePreview(profileImgID)
          setprevProfilePic(prev?.href)
        }
        get(profileImgID)
      }


    }
  }, [profileImgID])

  const addEdulvl = (e) => {
    setEducationLevel(e.currentTarget.value);
    if (e.currentTarget.value === "Other") {
      setVisibleEdulvl(true);
      setValue("educationLvl", "", {
        shouldValidate: true,
      });
    } else {
      setVisibleEdulvl(false);
      setValue("educationLvl", "", {
        shouldValidate: true,
      });
    }
  };
  const addOccupation = (e) => {
    console.log(e.target.value);
    setOccupationInput(e.target.value);
    if (e.currentTarget.value === "Other") {
      setVisibleOccupation(true);
      setValue("occupation", "", {
        shouldValidate: true,
      });
    } else {
      setVisibleOccupation(false);
      setValue("occupation", "", {
        shouldValidate: true,
      });
    }
  };
  
  const submit = async (data) => {
    setisUpdating((prev) => true)
   
    if (!prevFileURL && !file) {
      setseePreviewBefore('Make sure to see preview before uploading image')
      setNotificationPopMsgNature((prev) => false)
      setnotificationPopMsg("Make sure to see preview before uploading image")
      return
    }
    if (seePreviewBefore !== '') {
      setseePreviewBefore('Make sure to see preview before uploading image')
      setNotificationPopMsgNature((prev) => false)
      setnotificationPopMsg("Make sure to see preview before uploading image")
      return
    }

    if (file) {
      const deletePic = await profile.deleteStorage(profileImgID)
      const uploadedPic = await profile.createBucket({ file })
      
      const profileImgURL = await profile.getStoragePreview(uploadedPic?.$id)
      data.profileImgURL = profileImgURL?.href
      data.profileImgID = `${uploadedPic?.$id}`

    } else {
      data.profileImgID = profileImgID
    }

    if (data) {
      if (data.educationLvl) {
        if (data.occupation) {
          let profileData = await profile.updateProfile(
            $id,
            { ...data },
            linksArr,
            interestedTagArr,
          );
          setMyUserProfile(profileData)
        } else {
          let profileData = await profile.updateProfile(
            $id,
            { ...data, occupation: OccupationInput },
            linksArr,
            interestedTagArr,
          );
          setMyUserProfile(profileData)
        }
      } else {
        if (data.occupation) {
          let profileData = await profile.updateProfile(
            $id,
            { ...data, educationLvl: EducationLevel },
            linksArr,
            interestedTagArr,
          );
          setMyUserProfile(profileData)
        } else {
          let profileData = await profile.updateProfile(
            $id,
            {
              ...data,
              occupation: OccupationInput,
              educationLvl: EducationLevel,
            },
            linksArr,
            interestedTagArr,
          );
          setMyUserProfile(profileData);
        }
      }
      navigate(`/profile/${userData?.$id}`);
      setseePreviewBefore('')
      setNotificationPopMsgNature((prev) => true)
      setnotificationPopMsg("Profile Updated");
      setisUpdating((prev) => false)
    }
  };

  const addTag = (e) => {
    let tag = e.currentTarget.value.replace(/\s+/g, " ").toUpperCase();
    setInterestedTag(tag);
  };

  const addTags = () => {
   
    if (
      interestedTagArr.includes(interestedTag) ||
      interestedTagArr.length === 10 ||
      interestedTag.length > 30 ||
      interestedTag === "" ||
      interestedTag === " "
    ) {
      setInterestedTag("");
      return;
    }
    if (interestedTag.includes(",")) {
      let newArrComma = interestedTag.split(",");
      for (let i = 0; i < newArrComma.length; i++) {
        if (interestedTagArr.includes(newArrComma[i])) {
          setInterestedTag("");
          return;
        }
      }
      setInterestedTagArr((prev) => {
        if (prev.length + newArrComma.length > 10) {
          return prev;
        }
        return [...prev, ...newArrComma];
      });
      setInterestedTag("");
      return;
    }
    setInterestedTagArr((prev) => [...prev, interestedTag]);
    setInterestedTag("");
  };

  const addLinks = async (e) => {
    if (!URL || !Title) return;

    function isValidURL(URL) {
      // Regular expression for a valid URL
      const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

      // Test the provided URL against the regular expression
      return urlRegex.test(URL);
    }

    if (!isValidURL(URL)) {
      setURLerror("Enter Valid URL");
      setNotificationPopMsgNature((prev) => false)
      setnotificationPopMsg((prev) => "Enter Valid URL")
      return;
    }

    if (linksArr.length >= 15) {
      setURLerror("Maximum 15 Links Allowed");
      setNotificationPopMsgNature((prev) => false)
      setnotificationPopMsg((prev) => "Maximum 15 Links Allowed")
      return;
    }

    for (let i = 0; i < linksArr.length; i++) {
      let objURL = JSON.parse(linksArr[i]).URL;

      if (URL === objURL) {
        setURLerror("Same URL not Allowed");
        setNotificationPopMsgNature((prev) => false)
        setnotificationPopMsg((prev) => "Same URL not Allowed")
        return;
      }
    }
    setLinksArr((prev) => [JSON.stringify({ URL, Title }), ...prev]);
    setTitle("");
    setURL("");
    setURLerror("");
    url.current.value = "";
    title.current.value = "";
  };
  const onSelectFile = async (e) => {
    setprevFileURL('')
    const file = e.currentTarget?.files[0];
    const MAX_FILE_SIZE = 1 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setNotificationPopMsgNature((prev) => false)
      setnotificationPopMsg("Image Must be Less then and Equal to 1 MB")
      return
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageURL(reader.result);
      setseePreviewBefore('Make sure to see preview before uploading image')

    });
    reader.readAsDataURL(file);

  };

  const handleCrop = async (e) => {

    getCanvasPreview(
      imgRef.current,
      canvasRef.current,
      convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
    );

    try {
      canvasRef.current.toBlob((blob) => {
        const croppedFile = new File([blob], `${userData.name}`, { type: 'image/png' });
        setFile(croppedFile)
      }, 'image/png');
    } catch (error) {
    
    }
  }

  function onImageLoad(e) {

    const cropSelection = document.querySelector('.ReactCrop__crop-selection');
    setCropSelection(cropSelection);
    const { naturalWidth, naturalHeight, width, height } = e.currentTarget;

    const cropPrev = makeAspectCrop(
      {
        unit: "%",
        width: MinimumDimension,
      },
      1,
      width,
      height
    );
    const crops = centerCrop(cropPrev, width, height);
    setCrop(crops);

  }


  useEffect(() => {

    if (interestedIn) {
      setInterestedTagArr((prev) => [...interestedIn]);
    }

    if (bio) {
      setValue("bio", bio, { shouldValidate: true });
    }

    setLinksArr((prev) => {
      if (links) {
        return [...links];
      } else {
        return [];
      }
    });

    if (educationLevels.includes(educationLvl)) {
      setEducationLevel(educationLvl);

      if (educationLvl === "Other") {
        setVisibleEdulvl(true);
      } else {
        setVisibleEdulvl(false);
      }
      setValue("educationLvl", "", {
        shouldValidate: true,
      });
    } else {
      setValue("educationLvl", educationLvl, { shouldValidate: true });
      setEducationLevel("Other");
      setVisibleEdulvl(true);
    }

    if (occupation_Arr.includes(occupation)) {
      setOccupationInput(occupation);

      if (occupation === "Other") {
        setVisibleOccupation(true);
      } else {
        setVisibleOccupation(false);
      }
      setValue("occupation", "", {
        shouldValidate: true,
      });
    } else {
      setValue("occupation", occupation, {
        shouldValidate: true,
      });
      setVisibleOccupation(true);
      setOccupationInput("Other");
    }



  }, [bio, interestedIn]);

  return (
    profileData ?
      <>
        <div className={`EditProfile-FormContainer ${isDarkModeOn ? 'darkMode' : ''}`}>
          <div className={`MyProfile_HorizontalLine ${isDarkModeOn ? 'hidden' : ''}`}></div>
          <form
            className="h-full relative p-3 EditProfile_form"
            onSubmit={handleSubmit(submit)}
          >

            <div
              id="EditProfile_EditImage_Div"
              className="w-full flex items-center overflow-hidden justify-start gap-5"
            >

              {prevFileURL &&
                <div id="EditProfile-Prev-active">
                  <div className="" id="EditProfile-PrevImage">
                    <img src={prevFileURL} className={`rounded-ful bg-white`} />
                  </div>
                  <label
                    htmlFor="editProfileImg"
                    className={`EditProfile_ChooseImg flex gap-2 items-center cursor-pointer mr-3 ${isDarkModeOn ? 'darkMode' : ''}`}
                  >
                    <span> Update </span>
                    <i className="fa-solid fa-upload"></i>
                  </label>
                </div>
              }
              <input
                type="file"
                accept="image/*"
                name=""
                id="editProfileImg"
                className="hidden"
                {...register("profileImgID", {
                  required: false,
                })}
                onChange={(e) => {
                  onSelectFile(e)
                }}
              />
              {!prevFileURL &&
                <div id="EditProfile-Prev-Inactive">

                  <div className="flex flex-col">
                    <div id="EditProfile-Prev-Inactive-2">
                      <div id="ReactCrop-container">
                        <ReactCrop
                          circularCrop
                          keepSelection
                          crop={crop}
                          minWidth={MinimumDimension}
                          aspect={1}
                          onChange={(crop, percentCrop) => {
                            setCrop(percentCrop)
                          }}
                        >
                          <img
                            ref={imgRef}
                            src={
                              imageURL
                                ? imageURL
                                : prevProfilePic
                            }
                            alt="Profile Image"
                            onLoad={onImageLoad}
                          />
                        </ReactCrop>
                      </div>
                    </div>
                    <div className="w-full flex justify-center items-center" id="EditProfile_label_Div">

                      <label
                        onClick={() => setprevFileURL(profileImgURL)}
                        className="EditProfile_ChooseImg flex gap-2 items-center cursor-pointer mr-3"
                      >
                        <span> Cancel </span>
                      </label>
                      <label
                        htmlFor="editProfileImg"
                        className="EditProfile_ChooseImg flex gap-2 items-center cursor-pointer mr-3"
                      >
                        <span> Change Image </span>
                        <i className="fa-solid fa-upload"></i>
                      </label>


                      <label
                        className="EditProfile_ChooseImg flex gap-2 items-center cursor-pointer"
                        onClick={() => {
                          handleCrop()
                          setseePreviewBefore('')
                        }}
                      >
                        <span> See Preview </span>
                      </label>

                    </div>

                  </div>


                  <div className={`w-full h-full flex justify-center items-center ${canvasPreview ? '' : 'hidden'}`}>
                    <canvas ref={canvasRef} id="myCanvas"></canvas>
                    {seePreviewBefore && <span id="EditProfile-seePreviewBefore"
                      className={`${isDarkModeOn ? 'text-white !important' : ''}`}
                    >{seePreviewBefore}</span>}
                  </div>

                </div>
              }



            </div>
            <div className="MyProfile_HorizontalLine"></div>

            <div className="w-full" id="EditProfile_EditContent">
              <div id="EditProfile_EditBio">
                <label htmlFor="EditProfile-bio" className="mb-2 inline-block">
                  Bio
                </label>
                <TextArea
                  name="bio"
                  maxLength={2000}
                  placeholder="Maximum 200 characters are Allowed"
                  id="EditProfile-bio"
                  className="w-1/2 block resize-none outline-none"
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
                <div className="flex EditProfile_Links_Div w-full" id="">
                  <div
                    id="EditProfile_EditLinks_3inputs"
                    className={`w-full flex flex-col gap-3 items-start ${isDarkModeOn ? 'darkMode' : ''}`}
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

                  <div id="EditProfile_EditLinks_LinksAdded" className="">
                    {linksArr?.map((link, index) => (
                      <section
                        key={JSON.parse(link).URL}
                        className="flex gap-3 p-1 items-center w-full"
                      >
                        <span className="p-1 flex justify-center items-center link-circle">
                          <i className="fa-solid fa-link"></i>
                        </span>
                        <div className={`EditProfile_EditLinks_title_url_div w-full ${isDarkModeOn ? 'darkMode' : ''}`}>
                          <div className="flex justify-between w-full">
                            <p>{JSON.parse(link).Title}</p>
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
                          <a href={JSON.parse(link).URL} target="_blank">
                            {JSON.parse(link).URL}
                          </a>
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              </div>

              <div className="EditProfile_Edu_Lvl_div">
                <p htmlFor="" className="mb-2 block">
                  Highest Level of Education
                </p>
                <div className="flex justify-start gap-3">
                  <div className="w-1/2">
                    <select
                      name=""
                      className=""
                      value={EducationLevel}
                      onChange={addEdulvl}
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
                        {...register("educationLvl", {
                          required: false,
                        })}
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
                      value={OccupationInput}
                      name=""
                      className=""
                      onChange={addOccupation}
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
                        {...register("occupation", {
                          required: false,
                        })}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="EditProfile_Interested_div">
                <p className="mb-2 mt-2 block">Interested In </p>
                <div className="EditProfile_Interested_Tag">
                  <p className="">
                    Enter tag name or you can type like this PYTHON,JAVA,C#
                  </p>
                  <div className={`EditProfile_tag_box p-2 mb-2 ${isDarkModeOn ? 'darkMode' : ''}`}>
                    <ul className="flex flex-wrap gap-3">
                      {interestedTagArr?.map((Tag, index) => (
                        <li key={Tag} className="flex items-center gap-2">
                          <span className={`${isDarkModeOn ? 'text-white darkMode' : 'text-black'}`}>{Tag}</span>
                          <span
                            className={`cursor-pointer ${isDarkModeOn ? 'darkMode' : ''}`}
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
                        onInput={addTag}
                        value={interestedTag}
                      />
                    </ul>
                  </div>
                  <div className="flex justify-between items-center EditProfile_Interested_remaining mt-5 flex-wrap">
                    <p>
                      <span> {10 - interestedTagArr.length} </span>tags are
                      remaining
                    </p>
                    <div className="flex gap-3">
                      <Button
                        className="secondaryBlue font_bold_500 text-white"
                        onClick={addTags}
                      >
                        Add Tag
                      </Button>
                      <Button
                        className="secondaryBlue font_bold_500 text-white"
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
            <div

            >
              <Button
                type="submit"
                id="EditProfile_submit_btn"
                className="flex justify-center items-center"
              >
                {`${isUpdating ? "Updating..." : 'Update Profile'}`}
                <i className="fa-solid fa-file-arrow-up"></i>
              </Button>
            </div>
          </form>
        </div>

      </> : `Loading`
  );
};

export default EditProfile;
