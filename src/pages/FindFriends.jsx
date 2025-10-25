import React from "react";
import { Icons } from "@/components";
import { Link } from "react-router-dom";
import avatarService from "@/appwrite/avatar";
import { getUserByName } from "@/lib/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SectionTrigger from "@/components/Home/Trigger/SectionTrigger";
import { useNotificationContext } from "@/context/NotificationContext";

const FindFriends = () => {

  const queryClient = useQueryClient()

  const { setNotification } = useNotificationContext();

  const mutation = useMutation({
    mutationFn: (username) => getUserByName(username),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['users'], (old = []) => {
        console.log(data)
        const users = data?.map((user) => {
          if (user.profileImage) { user.profileImage = JSON.parse(user.profileImage) }
          else {
            user.profileImage = { profileImageURL: avatarService.createAvatar({ name: user.name }) }
          }
          return user
        })
        const merged = [...old, ...users];

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

  const submit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target)
    mutation.mutate(formData.get("searchValue"))
  };


  return (
    <main className="relative min-h-[83dvh] bg-slate-50 dark:bg-slate-900/60 p-4">
      <div className="w-full flex justify-end px-3">
        <div className="inline-block">
          <SectionTrigger />
        </div>
      </div>

      <h3 className="text-center md:text-left md:text-xl mt-4 text-slate-800 dark:text-slate-100 font-semibold">
        Explore New Connections
      </h3>

      <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left: Users list (spans 2 cols on md) */}
        <section className="md:col-span-2 space-y-4">
          <span className="text-sm text-slate-500 dark:text-slate-300">Searched</span>
          <div className="space-y-3">
            {Array.isArray(allUsers) && allUsers.length > 0 ? allUsers?.map((profile) => {
              const profileImageURL = profile?.profileImage?.profileImageURL;
              return (
                <Link
                  key={profile?.$id}
                  to={`/profile/${profile?.userIdAuth}`}
                  className="block"
                >
                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-white dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition">
                    <img
                      src={profileImageURL}
                      alt={profile?.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-900 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h6 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {profile?.name}
                      </h6>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {profile?.bio || "No bio added yet"}
                      </p>
                    </div>
                    <div className="text-xs text-slate-400">View</div>
                  </div>
                </Link>
              )
            }) : (
              <div className="flex items-center justify-center p-6 rounded-xl bg-white/60 dark:bg-slate-800/50 border border-dashed border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-300">
                <p>No users are here</p>
              </div>
            )}
          </div>
        </section>

        {/* Right: Search & results */}
        <section className="md:col-span-1 space-y-4">
          <div className="sticky top-6">
            <div className="bg-white dark:bg-slate-800/60 p-3 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
              <form
                className="flex items-center gap-2"
                onSubmit={submit} >
                <input
                  placeholder="Enter Full Name"
                  className="flex-1 px-3 py-2 rounded-lg outline-none text-sm placeholder:text-gray-400 bg-transparent text-slate-800 dark:text-slate-100"
                  name="searchValue"
                  required={true}
                  type="text"
                />
                <button
                  className="inline-flex items-center justify-center p-2 rounded-lg  text-white hover:bg-gray-200 active:scale-95 transition"
                  type="submit"
                >
                  <Icons.search />
                </button>
              </form>
            </div>
          </div>

          <div>
            {mutation.isPending && (
              <div className="flex justify-center text-sm text-slate-500 dark:text-slate-300">
                searching...
              </div>
            )}

            <div className="mt-3 space-y-3">
              {searchedUser?.map((persons, index) => (
                <Link key={persons?.$id} to={`/profile/${persons?.$id}`} className="block">
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start gap-3">
                      <img
                        src={persons?.profileImage?.profileImageURL || "NoProfile.png"}
                        alt={persons?.name}
                        className="w-14 h-14 rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-md"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {persons?.name}
                          </p>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                          {persons?.bio || "No bio added yet"}
                        </p>

                        {persons?.interestedIn?.length > 0 && (
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <b className="text-sm text-slate-700 dark:text-slate-200">Interested In:</b>
                            <div className="flex gap-2 flex-wrap">
                              {persons?.interestedIn?.map((interest) => (
                                <span
                                  key={interest}
                                  className="inline-block text-xs px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-slate-50/70 dark:bg-slate-700/30"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default FindFriends;
