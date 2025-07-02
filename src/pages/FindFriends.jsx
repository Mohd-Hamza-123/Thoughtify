import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import profile from "../appwrite/profile";
import { useSelector, useDispatch } from "react-redux";
import "./FindFriends.css";
import { getOtherUserProfile } from "../store/usersProfileSlice";
import { useAskContext } from "../context/AskContext";
import SectionTrigger from "@/components/Home/Trigger/SectionTrigger";
import { Icons } from "@/components";

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
    setisSearching(false);
  };
  const nav = (slug) => navigate(slug)

  return (
    <main className="relative">
      <div className="w-full flex justify-end px-3"><SectionTrigger /></div>
      <h3 className="text-center md:text-lg mt-4">Explore New Connections</h3>
      <div className="FindFriendsPage_Main">
        <section className="px-3">
          <p>Searched</p>
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
        <section className="p-2">
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
                <Icons.search />
              </button>
            </form>
          </div>

          <div>
            {isSearching && <div className="flex justify-center">searching...</div>}

            {searchedPerson?.map((persons, index) => (
              <div
                key={persons?.userIdAuth}
                className="cursor-pointer FindFriends_Profile_Details"
                onClick={() => nav(`/profile/${persons?.userIdAuth}`)}>

                <div className="FindFriendsPage_ListFriends_Searched_Person">

                  <div className="flex gap-3 items-center">
                    <img src={persons?.profileImgURL || "NoProfile.png"}
                      alt="NoProfile" />
                    <p>{persons?.name}</p>
                  </div>

                  <div>{persons?.bio}</div>

                  <div>
                    <b>Occupation :</b> {persons?.occupation}
                  </div>

                  <div className="my-1 flex">
                    <b>EducationLvl : </b> {persons?.educationLvl}
                  </div>

                  {persons?.interestedIn > 0 && <div className="flex gap-1 flex-wrap">
                    <b>Interested In : </b>
                    <div className="flex gap-3">
                      {persons?.interestedIn?.map((interest) => (
                        <span key={interest}>{interest}</span>
                      ))}
                    </div>
                  </div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default FindFriends;
