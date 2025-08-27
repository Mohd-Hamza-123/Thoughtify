import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import profile from '../../appwrite/profile'
import { useNotificationContext } from '@/context/NotificationContext'
import { useSelector } from 'react-redux'
import { userProfile } from '@/store/profileSlice'

const Setting = () => {
  const { setNotification } = useNotificationContext()
  const { register, handleSubmit } = useForm();
  const [settingPopUp, setSettingPopUp] = useState(false)
  const [isOverlayBoolean, setisOverlayBoolean] = useState(false)
  const myUserProfile = useSelector((state) => state.profileSlice.userProfile)

  const submit = async (data) => {
    try {
      const updateProfile = await profile.updateEveryProfileAttribute({ ...data, profileID: myUserProfile?.$id })
      dispatch(userProfile({ userProfile: updateProfile }))
      setNotification({ type: 'success', message: 'Setting Changed' })
    } catch (error) {
      setNotification({ type: 'error', message: error?.message })
    }
  }

  return (
    <form 
      onSubmit={handleSubmit(submit)} 
      className={`fixed inset-0 z-50 flex items-center justify-center ${settingPopUp ? '' : 'hidden'}`}
    >
      {/* Overlay */}
      {isOverlayBoolean && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      )}

      {/* Settings Card */}
      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-lg ring-1 ring-black/10 p-6 space-y-6 animate-in fade-in zoom-in-95">
        <h4 className="text-lg font-semibold text-gray-800 text-center">Settings</h4>

        {/* Section */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Who Can Filter Your Posts :</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex-1">
              <input
                defaultChecked={myUserProfile?.othersCanFilterYourPosts === 'My Following'}
                {...register("othersCanFilterYourPosts")}
                type="radio"
                name="othersCanFilterYourPosts"
                value="My Following"
              />
              My Following
            </label>
            <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex-1">
              <input
                defaultChecked={myUserProfile?.othersCanFilterYourPosts === 'Everyone'}
                {...register("othersCanFilterYourPosts")}
                type="radio"
                name="othersCanFilterYourPosts"
                value="Everyone"
              />
              Everyone
            </label>
            <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex-1">
              <input
                defaultChecked={myUserProfile?.othersCanFilterYourPosts === 'None'}
                {...register("othersCanFilterYourPosts")}
                type="radio"
                name="othersCanFilterYourPosts"
                value="None"
              />
              None
            </label>
          </div>
        </div>

        {/* Repeat for Opinions */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Others Can Filter Your Opinions :</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex-1">
              <input
                defaultChecked={myUserProfile?.othersCanFilterYourOpinions === 'My Following'}
                {...register("othersCanFilterYourOpinions")}
                type="radio"
                name="othersCanFilterYourOpinions"
                value="My Following"
              />
              My Following
            </label>
            <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex-1">
              <input
                defaultChecked={myUserProfile?.othersCanFilterYourOpinions === 'Everyone'}
                {...register("othersCanFilterYourOpinions")}
                type="radio"
                name="othersCanFilterYourOpinions"
                value="Everyone"
              />
              Everyone
            </label>
            <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex-1">
              <input
                defaultChecked={myUserProfile?.othersCanFilterYourOpinions === 'None'}
                {...register("othersCanFilterYourOpinions")}
                type="radio"
                name="othersCanFilterYourOpinions"
                value="None"
              />
              None
            </label>
          </div>
        </div>

        {/* Followers/Following */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Who Can See Your Followers/Following :</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex-1">
              <input
                defaultChecked={myUserProfile?.othersSeeYourFollowers_Following === 'My Following'}
                {...register("othersSeeYourFollowers_Following")}
                type="radio"
                name="othersSeeYourFollowers_Following"
                value="My Following"
              />
              My Following
            </label>
            <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex-1">
              <input
                defaultChecked={myUserProfile?.othersSeeYourFollowers_Following === 'Everyone'}
                {...register("othersSeeYourFollowers_Following")}
                type="radio"
                name="othersSeeYourFollowers_Following"
                value="Everyone"
              />
              Everyone
            </label>
            <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex-1">
              <input
                defaultChecked={myUserProfile?.othersSeeYourFollowers_Following === 'None'}
                {...register("othersSeeYourFollowers_Following")}
                type="radio"
                name="othersSeeYourFollowers_Following"
                value="None"
              />
              None
            </label>
          </div>
        </div>

        {/* Who Can Message You */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Who Can Message You :</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex-1">
              <input
                defaultChecked={myUserProfile?.whoCanMsgYou === 'My Following'}
                {...register("whoCanMsgYou")}
                type="radio"
                name="whoCanMsgYou"
                value="My Following"
              />
              My Following
            </label>
            <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex-1">
              <input
                defaultChecked={myUserProfile?.whoCanMsgYou === 'Everyone'}
                {...register("whoCanMsgYou")}
                type="radio"
                name="whoCanMsgYou"
                value="Everyone"
              />
              Everyone
            </label>
            <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex-1">
              <input
                defaultChecked={myUserProfile?.whoCanMsgYou === 'None'}
                {...register("whoCanMsgYou")}
                type="radio"
                name="whoCanMsgYou"
                value="None"
              />
              None
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            onClick={() => {
              setSettingPopUp(false)
              setisOverlayBoolean(false)
            }}
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-bluePrimary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-bluePrimary/80"
          >
            Update
          </button>
        </div>
      </div>
    </form>
  )
}

export default Setting
