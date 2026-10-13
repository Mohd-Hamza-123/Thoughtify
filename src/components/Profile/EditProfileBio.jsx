import React, { useState, memo } from 'react'
import { Textarea as TextArea } from "../ui/textarea";

const EditProfileBio = ({ bio, setProfileObject }) => {

  const [newBio, setNewBio] = useState(bio || '')

  const onChange = (e) => {
    setProfileObject((prev) => ({ ...prev, bio: e.target.value }))
    setNewBio(e.target.value)
  }

  return (
    <div className="w-full max-w-[700px]">
      <label
        htmlFor="EditProfile-bio"
        className="mb-3 inline-block text-[16px] font-semibold"
      >
        Bio
      </label>

      <TextArea
        value={newBio}
        maxLength={200}
        placeholder="Maximum 200 characters are Allowed"
        id="EditProfile-bio"
        onChange={onChange}
        className="w-full min-h-[130px] resize-none rounded-md border border-gray-300 px-4 py-3 outline-none text-sm"
      ></TextArea>

      <div className="mt-2 flex justify-end">
        <span className="text-xs text-gray-500">
          {newBio.length}/200
        </span>
      </div>
    </div>

  )
}

export default memo(EditProfileBio)