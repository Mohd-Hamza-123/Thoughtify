import "./FindFriends.css";
import React from "react";
import { Icons } from "@/components";
import { useForm } from "react-hook-form";
import { getUserByName } from "@/lib/profile";
import { useNavigate } from "react-router-dom";
import SectionTrigger from "@/components/Home/Trigger/SectionTrigger";
import { useNotificationContext } from "@/context/NotificationContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const FindFriends = () => {

  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const { setNotification } = useNotificationContext()
  const { handleSubmit, reset, register } = useForm();

  const mutation = useMutation({
    mutationFn: (username) => getUserByName(username),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['users'], (old = []) => {
     
        const newUsers = Array.isArray(data) ? data : [data];
        const merged = [...old, ...newUsers];

        // remove duplicates by $id
        const unique = merged.filter(
          (user, index, self) =>
            index === self.findIndex((u) => u.$id === user.$id)
        );

        return unique;
      });
    },
    onError: (err) => {
      console.log(err);
      setNotification({ message: "Something went wrong", type: "error" });
    },
  });

  const searchedUser = mutation.data

  const allUsers = queryClient.getQueryData(['users']);
  
  const submit = async (data) => {
    mutation.mutate(data.searchValue)
    reset();

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
            {allUsers?.map((profile) => (
              <div
                key={profile?.$id}
                onClick={() => navigate(`/profile/${profile?.userIdAuth}`)}
                className="FindFriendsPage_ListFriends cursor-pointer"
              >
                <div>
                  <img src={profile?.profileImgURL} />
                </div>
                <p>
                  {profile?.name}
                </p>
              </div>
            ))}
            {allUsers?.length === 0 && (
              <div className="FindFriendsPage_ListFriends">
                <p >
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
            {mutation.isPending && <div className="flex justify-center">searching...</div>}

            {searchedUser?.map((persons, index) => (
              <div
                key={persons?.$id}
                className="cursor-pointer FindFriends_Profile_Details"
                onClick={() => nav(`/profile/${persons?.$id}`)}>

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
