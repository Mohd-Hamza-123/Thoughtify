import { toast } from "sonner";
import { Icons } from "@/components";
import { Link } from "react-router-dom";
import React from "react";
import profile from "@/appwrite/profile";
import { getAvatar } from "@/lib/avatar";
import avatarService from "@/appwrite/avatar";
import { getUserByName } from "@/lib/profile";
import { useSelector } from "react-redux";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import SectionTrigger from "@/components/Home/Trigger/SectionTrigger";

const normalizeUsers = (users = []) => {
  return users.map((user) => {
    let profileImage = user.profileImage;

    if (profileImage) {
      try {
        profileImage =
          typeof profileImage === "string"
            ? JSON.parse(profileImage)
            : profileImage;
      } catch {
        profileImage = null;
      }
    }

    return {
      ...user,
      profileImage: profileImage || {
        profileImageURL: avatarService.createAvatar({ name: user.name }),
      },
    };
  });
};

const removeDuplicateUsers = (users = []) => {
  return users.filter(
    (user, index, self) =>
      index === self.findIndex((u) => u.$id === user.$id)
  );
};

const FindFriends = () => {
  const queryClient = useQueryClient();
  const userData = useSelector((state) => state.auth.userData);

  const currentUserName = userData?.name;

  const { data: allUsers = [], isLoading } = useQuery({
    queryKey: ["users", currentUserName],
    queryFn: async () => {
      const users = await getUserByName(currentUserName);
      return normalizeUsers(users || []);
    },
    enabled: Boolean(currentUserName),
  });

  const mutation = useMutation({
    mutationFn: (username) => getUserByName(username),

    onSuccess: (data) => {
      const searchedUsers = normalizeUsers(data || []);

      queryClient.setQueryData(["users", currentUserName], (old = []) => {
        return removeDuplicateUsers([...searchedUsers, ...old]);
      });
    },

    onError: (err) => {
      console.log(err instanceof Error ? err.message : err);
      toast.error("Something went wrong");
    },
  });

  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const searchValue = formData.get("searchValue")?.trim();

    if (!searchValue) return;

    mutation.mutate(searchValue);
    e.target.reset();
  };

  return (
    <main className="relative min-h-[83dvh] bg-slate-50 dark:bg-slate-900/60 p-4">
      <div className="w-full flex justify-end px-3">
        <div className="inline-block">
          <SectionTrigger />
        </div>
      </div>

      <h3 className="text-center md:text-left md:text-xl mt-4 text-slate-800 font-semibold">
        Explore New Connections
      </h3>

      <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2 space-y-4">
          <span className="text-sm text-slate-500 dark:text-slate-300">
            Searched
          </span>

          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center p-6 rounded-xl bg-white/60 dark:bg-slate-800/50 border border-dashed border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-300">
                Loading users...
              </div>
            ) : Array.isArray(allUsers) && allUsers.length > 0 ? (
              allUsers.map((user) => {
                // console.log(user)
                const profileImageURL = user?.profileImage?.profileImageURL;

                return (
                  <Link
                    key={user?.$id}
                    to={`/profile/${user?.$id}`}
                    className="block"
                  >
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-white dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition">
                      <img
                        src={profileImageURL || getAvatar(user?.name)}
                        alt={user?.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                      />

                      <div className="flex-1 min-w-0">
                        <h6 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {user?.name}
                        </h6>

                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user?.bio || "No bio added yet"}
                        </p>
                      </div>

                      <div className="text-xs text-slate-400">View</div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="flex items-center justify-center p-6 rounded-xl bg-white/60 dark:bg-slate-800/50 border border-dashed border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-300">
                No users are here
              </div>
            )}
          </div>
        </section>

        <section className="md:col-span-1 space-y-4">
          <div className="sticky top-6">
            <div className="bg-white dark:bg-slate-800/60 p-3 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
              <form className="flex items-center gap-2" onSubmit={submit}>
                <input
                  placeholder="Enter Full Name"
                  className="flex-1 px-3 py-2 rounded-lg outline-none text-sm placeholder:text-gray-400 bg-transparent text-slate-800 dark:text-slate-100"
                  name="searchValue"
                  required
                  type="text"
                />

                <button
                  className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-gray-200 active:scale-95 transition"
                  type="submit"
                >
                  <Icons.search />
                </button>
              </form>
            </div>
          </div>

          {mutation.isPending && (
            <div className="flex justify-center text-sm text-slate-500 dark:text-slate-300">
              searching...
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default FindFriends;