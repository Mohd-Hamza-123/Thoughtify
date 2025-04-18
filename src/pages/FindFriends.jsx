import React, { useState } from "react";
import { NavBar } from "../components";
import NoProfile from "../assets/NoProfile.png";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import profile from "../appwrite/profile";
import { useSelector, useDispatch } from "react-redux";
import "./FindFriends.css";
import { getOtherUserProfile } from "../store/usersProfileSlice";
import { useAskContext } from "../context/AskContext";

const FindFriends = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleSubmit, reset, register } = useForm();

  const othersUserProfile = useSelector(
    (state) => state.usersProfileSlice?.userProfileArr
  );
  const userData = useSelector((state) => state.auth.userData);
  const { setnotificationPopMsg, setNotificationPopMsgNature, isDarkModeOn } =
    useAskContext();

  const [isSearching, setisSearching] = useState(false);
  const [searchedPerson, setsearchedPerson] = useState(null);

  const submit = async (data) => {
    setisSearching((prev) => true);
    try {
      const GettingName = await profile.listProfile({
        name: data?.searchValue,
      });

      if (GettingName?.documents?.length === 0) {
        setNotificationPopMsgNature((prev) => false);
        setnotificationPopMsg((prev) => "No Users Found");
        setisSearching((prev) => false);
        return;
      }

      setsearchedPerson((prev) => [...GettingName.documents]);
      for (let i = 0; i < GettingName.total; i++) {
        if (GettingName?.documents[i]?.userIdAuth !== userData?.$id) {
          dispatch(
            getOtherUserProfile({ userProfileArr: [GettingName?.documents[i]] })
          );
        }
      }

      reset();
    } catch (error) {
      return null;
    }
    setisSearching((prev) => false);
  };
  const nav = (slug) => {
    navigate(slug);
  };

  return (
    <div id="FindFriendsPage">
    
        <NavBar />
      
      <h3
        className={`FindFirendsPage_Heading text-center ${
          isDarkModeOn ? "text-white" : "text-black"
        }`}
      >
        Explore New Connections{" "}
      </h3>
      <main className="FindFriendsPage_Main">
        <section className="p-3">
          <p className={`${isDarkModeOn ? "text-white" : "text-black"}`}>
            Searched
          </p>
          <div>
            {othersUserProfile?.map((profile) => (
              <div
                key={profile?.$id}
                onClick={() => navigate(`/profile/${profile?.userIdAuth}`)}
                className="FindFriendsPage_ListFriends cursor-pointer"
              >
                <div>
                  <img src={profile?.profileImgURL} />
                </div>
                <p className={`${isDarkModeOn ? "text-white" : "text-black"}`}>
                  {profile?.name}
                </p>
              </div>
            ))}
            {othersUserProfile?.length === 0 && (
              <div className="FindFriendsPage_ListFriends">
                <p className={`${isDarkModeOn ? "text-white" : "text-black"}`}>
                  No Users are here
                </p>
              </div>
            )}
          </div>
        </section>
        <section>
          <div className="Find_Friends_wrapper">
            <form
              className="Find_Friends_wrapper_searchBar"
              onSubmit={handleSubmit(submit)}
            >
              <input
                {...register("searchValue", {
                  required: true,
                })}
                className="searchQueryInput"
                type="text"
                placeholder="Enter Full Name"
              />
              <button className="searchQuerySubmit" type="submit">
                <svg viewBox="0 0 24 24">
                  <path
                    fill="#666666"
                    d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
                  />
                </svg>
              </button>
            </form>
          </div>

          <div>
            {isSearching && (
              <div
                className={`flex justify-center ${
                  isDarkModeOn ? "text-white" : "text-black"
                }`}
              >
                Searching...
              </div>
            )}

            {searchedPerson?.map((persons, index) => (
              <div
                key={persons?.userIdAuth}
                className={`cursor-pointer FindFriends_Profile_Details ${
                  isDarkModeOn ? "darkMode" : ""
                }`}
                onClick={() => nav(`/profile/${persons?.userIdAuth}`)}
              >
                <div
                  className={`FindFriendsPage_ListFriends_Searched_Person ${
                    isDarkModeOn ? "darkMode" : ""
                  }`}
                >
                  <div className="flex gap-3 items-center">
                    <div>
                      <img src={persons?.profileImgURL || NoProfile} />
                    </div>
                    <p>{persons?.name}</p>
                  </div>

                  <div>{persons?.bio}</div>

                  <div>
                    <b>Occupation :</b> {persons?.occupation}
                  </div>

                  <div className="my-1 flex">
                    <b>EducationLvl : </b> {persons?.educationLvl}
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    <b>Interested In : </b>
                    <div className="flex gap-3">
                      {persons?.interestedIn.map((interest) => (
                        <span key={interest}>{interest}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FindFriends;
