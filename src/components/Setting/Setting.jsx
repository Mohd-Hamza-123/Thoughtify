import React from 'react'
import {toast} from "sonner"
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import profile from '../../appwrite/profile'
import { userProfile } from '@/store/profileSlice'
import { useBooleanContext } from '@/context/BooleanContext'

const Setting = () => {

  const { register, handleSubmit } = useForm();
  const myProfile = useSelector((state) => state.profileSlice.userProfile)
  const { isSettingOpen, setIsSettingOpen, isOverlayVisible, setIsOverlayVisible } = useBooleanContext()

  console.log(myProfile)

  const submit = async (data) => {
    try {
      const updateProfile = await profile.updateEveryProfileAttribute({ ...data, profileID: myProfile?.$id })
      dispatch(userProfile({ userProfile: updateProfile }))
      toast.success("setting changed")
    } catch (error) {
      toast.error("setting change failed")
    }
  }

  return (
   <form
  onSubmit={handleSubmit(submit)}
  className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isSettingOpen ? '' : 'hidden'}`}
>
  {/* Overlay */}
  {isOverlayVisible && (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
  )}

  {/* Settings Card */}
  <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-lg ring-1 ring-black/10 p-4 sm:p-6 space-y-4 sm:space-y-6 animate-in fade-in zoom-in-95">
    <h4 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">Settings</h4>

    {/* Section 1: Filter Posts */}
    <div className="space-y-3">
      <p className="text-xs sm:text-sm font-medium text-gray-700">Who Can Filter Your Posts :</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <input
            defaultChecked={myProfile?.othersCanFilterYourPosts === 'My Following'}
            {...register("othersCanFilterYourPosts")}
            type="radio"
            name="othersCanFilterYourPosts"
            value="My Following"
            className="cursor-pointer"
          />
          <span>My Following</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <input
            defaultChecked={myProfile?.othersCanFilterYourPosts === 'Everyone'}
            {...register("othersCanFilterYourPosts")}
            type="radio"
            name="othersCanFilterYourPosts"
            value="Everyone"
            className="cursor-pointer"
          />
          <span>Everyone</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <input
            defaultChecked={myProfile?.othersCanFilterYourPosts === 'None'}
            {...register("othersCanFilterYourPosts")}
            type="radio"
            name="othersCanFilterYourPosts"
            value="None"
            className="cursor-pointer"
          />
          <span>None</span>
        </label>
      </div>
    </div>

    {/* Section 2: Filter Opinions */}
    <div className="space-y-3">
      <p className="text-xs sm:text-sm font-medium text-gray-700">Others Can Filter Your Opinions :</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <input
            defaultChecked={myProfile?.othersCanFilterYourOpinions === 'My Following'}
            {...register("othersCanFilterYourOpinions")}
            type="radio"
            name="othersCanFilterYourOpinions"
            value="My Following"
            className="cursor-pointer"
          />
          <span>My Following</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <input
            defaultChecked={myProfile?.othersCanFilterYourOpinions === 'Everyone'}
            {...register("othersCanFilterYourOpinions")}
            type="radio"
            name="othersCanFilterYourOpinions"
            value="Everyone"
            className="cursor-pointer"
          />
          <span>Everyone</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <input
            defaultChecked={myProfile?.othersCanFilterYourOpinions === 'None'}
            {...register("othersCanFilterYourOpinions")}
            type="radio"
            name="othersCanFilterYourOpinions"
            value="None"
            className="cursor-pointer"
          />
          <span>None</span>
        </label>
      </div>
    </div>

    {/* Section 3: Followers/Following */}
    <div className="space-y-3">
      <p className="text-xs sm:text-sm font-medium text-gray-700">Who Can See Your Followers/Following :</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <input
            defaultChecked={myProfile?.othersSeeYourFollowers_Following === 'My Following'}
            {...register("othersSeeYourFollowers_Following")}
            type="radio"
            name="othersSeeYourFollowers_Following"
            value="My Following"
            className="cursor-pointer"
          />
          <span>My Following</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <input
            defaultChecked={myProfile?.othersSeeYourFollowers_Following === 'Everyone'}
            {...register("othersSeeYourFollowers_Following")}
            type="radio"
            name="othersSeeYourFollowers_Following"
            value="Everyone"
            className="cursor-pointer"
          />
          <span>Everyone</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <input
            defaultChecked={myProfile?.othersSeeYourFollowers_Following === 'None'}
            {...register("othersSeeYourFollowers_Following")}
            type="radio"
            name="othersSeeYourFollowers_Following"
            value="None"
            className="cursor-pointer"
          />
          <span>None</span>
        </label>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 border-t pt-4 sm:pt-6">
      <button
        onClick={() => {
          setIsSettingOpen(false)
          setIsOverlayVisible(false)
        }}
        type="button"
        className="rounded-lg border border-gray-300 px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition w-full sm:w-auto"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="rounded-lg bg-bluePrimary px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-bluePrimary/80 transition w-full sm:w-auto"
      >
        Update
      </button>
    </div>
  </div>
</form>
  )
}

export default Setting
