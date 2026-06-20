import "./MyProfile.css";
import { toast } from "sonner";
import { Button } from "../ui/button";
import authService from "@/appwrite/auth";
import { logout } from "@/store/authSlice";
import profile from "../../appwrite/profile";
import { useTotalPost } from "@/hooks/usePost";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { userProfile } from "@/store/profileSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { followUnfollow, blockUnblock } from "@/lib/profile";
import {
  Opinions,
  Favourite,
  Questions,
  Spinner,
  ChatInProfile,
  ProfileSummary,
  Icons,
} from "../index";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


const MyProfile = () => {

  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state?.auth?.userData);
  const authStatus = useSelector((state) => state?.auth?.status);
  const myProfile = useSelector((state) => state.profileSlice.userProfile);
  // console.log(myProfile)
  const isFollow = myProfile?.following?.find((follow) => JSON.parse(follow)?.profileID === slug)
  const isBlocked = myProfile?.blockedUsers?.includes(slug)
  const realUser = userData ? slug === userData.$id : false;

  const [isDisable, setIsDisable] = useState(false)
  const [activeNav, setActiveNav] = useState('Profile Summary');
  const [activeNavRender, setActiveNavRender] = useState(null);

  
  const {data : totalPost} = useTotalPost()


  const { data: profileData, isPending, isError, isSuccess, error } = useQuery({
    queryKey: ['profiles', slug],
    queryFn: () => profile.listSingleProfile(slug),
    staleTime: Infinity,
  })


  const follow_Unfollow = async () => {
    setIsDisable(true)
    if (!authStatus) {
      toast.error("You are not Login")
      return
    }
    const newProfile = await followUnfollow({ isFollow, slug, myProfile })
    if (newProfile?.success) dispatch(userProfile({ userProfile: newProfile?.payload }))
    else setNotification({ message: newProfile?.error, type: "error" })
    setIsDisable(false)
  }
  const block_Unblock = async () => {
    setIsDisable(true)
    if (!authStatus) {
      toast.error("You are not Login")
      return
    }
    const newProfile = await blockUnblock({ isBlocked, slug, myProfile })
    if (newProfile?.success) dispatch(userProfile({ userProfile: newProfile?.payload }))
    else setNotification({ message: newProfile?.error, type: "error" })
    setIsDisable(false)
  }
  const deleteUserAccount = async () => {

    if (slug === userData.$id) {
      authService.deleteAccount(userData.$id)
        .then((res) => {
          console.log(JSON.parse(res.responseBody))
          if (res) {
            toast.success("Account Deleted")
            dispatch(logout())
            navigate(`/`)
          } else {
            toast.error(res?.error)
          }
        })
        .catch((err) => {
          console.log(err instanceof Error ? err.message : err)
          toast.error(err.message)
        })
    }

  }

  useEffect(() => {
    setActiveNav('Profile Summary')
    setActiveNavRender(<ProfileSummary profileData={profileData} />)
  }, [slug, profileData]);

  useEffect(() => {
    switch (activeNav) {
      case 'Opinions': setActiveNavRender(<Opinions visitedProfileUserID={slug} />)
        break;
      case 'bookmark': setActiveNavRender(<Favourite visitedUserProfile={profileData} />)
        break;
      case 'Questions': setActiveNavRender(<Questions visitedUserProfile={profileData} />)
        break;
      case 'Followers': setActiveNavRender(<ChatInProfile profileData={profileData || {}} />)
        break;
      default: setActiveNavRender(<ProfileSummary profileData={profileData || {}} />)
    }
  }, [activeNav])

  useEffect(() => {
    if (isError) {
      navigate('/')
      toast.error("Profile Not found")
    }
  }, [error, isError])

  const navLinks = [
    { name: 'Profile Summary', visible: true },
    { name: 'Questions', visible: true },
    { name: 'Opinions', visible: true },
    { name: 'bookmark', visible: userData?.$id === slug },
    { name: 'Followers', visible: true },
  ]

  const userInfo = [
    { label: "Followers", value: profileData?.followers?.length },
    { label: "Following", value: profileData?.following?.length },
    { label: "Verified", value: userData?.emailVerification ? "Yes" : "No" },
    { label: "Joined", value: new Date(profileData?.$createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) },
    { label: "Posts", value: totalPost }
  ]

  if (!isPending && isSuccess && profileData) {
    const { profileImageURL } = JSON.parse(profileData?.profileImage)
    return (
      <div className="bg-gray-100 dark:bg-black py-4 w-full min-h-screen">
        <div className="w-[95%] md:w-[85%] mx-auto">

          <section
            id="MyProfile_Header"
            className="w-full rounded-2xl bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Left Profile Info */}
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left lg:w-2/3">
                <figure className="flex shrink-0 justify-center">
                  <img
                    src={profileImageURL?.replace("/preview", "/view")}
                    alt="profileImage"
                    className="h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32 lg:h-40 lg:w-40"
                  />
                </figure>

                <div className="flex w-full flex-col items-center gap-2 sm:items-start">
                  <h6 className="flex items-center gap-1 text-xl font-bold text-gray-900">
                    <span>{profileData?.name}</span>
                    {profileData?.verified && <Icons.verified />}
                  </h6>

                  <p className="max-w-xl text-sm leading-6 text-gray-500">
                    {profileData?.bio ||
                      "No bio added yet. Share something about yourself!"}
                  </p>

                  {realUser && (
                    <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                      <Button
                        className="rounded-lg px-4 py-2"
                        variant="outline"
                        onClick={() => navigate(`/edit-profile/${slug}`)}
                      >
                        Edit Profile
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="rounded-lg px-4 py-2">
                            Account Delete
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure, you want to delete your account? All your data
                              will be deleted.
                            </AlertDialogTitle>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={deleteUserAccount}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}

                  {!realUser && (
                    <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                      <Button
                        disabled={isDisable}
                        className="rounded-lg px-4 py-2"
                        onClick={follow_Unfollow}
                      >
                        {isFollow ? "Unfollow" : "Follow"}
                      </Button>

                      <Button
                        disabled={isDisable}
                        variant="outline"
                        className="rounded-lg px-4 py-2"
                        onClick={block_Unblock}
                      >
                        {isBlocked ? "UnBlock" : "Block"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right User Stats */}
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:grid-cols-3 lg:w-1/3 lg:grid-cols-1">

                {userInfo.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-1 rounded-lg bg-white p-3 sm:flex-row sm:items-center sm:justify-between lg:bg-transparent lg:p-0"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {item.label} :
                    </p>
                    <span className="text-sm text-gray-700">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="my-6">
            <ul className="flex border-b">
              {navLinks
                .filter(link => link.visible)
                .map(link => (
                  <li
                    key={link.name}
                    onClick={() => setActiveNav(link.name)}
                    className={`
          px-8 py-4 cursor-pointer relative
          font-medium transition-all
          ${activeNav === link.name
                        ? "text-slate-900"
                        : "text-slate-500 hover:text-slate-800"
                      }
        `}
                  >
                    {link.name}

                    {activeNav === link.name && (
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full" />
                    )}
                  </li>
                ))}
            </ul>
          </section>

          <section className="w-full">{activeNavRender}</section>
        </div>
      </div>)
  }

  if (isPending)
    return <div className="w-screen h-screen flex justify-center items-center">
      <div className="MyProfile_Loader_Div">
        <Spinner />
      </div>
    </div>

}



export default MyProfile;
