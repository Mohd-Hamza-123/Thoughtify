import React, { useState, memo } from 'react'
import { TextArea } from '..'

const EditProfileBio = ({ bio, setProfileObject }) => {
  
  const [newBio, setNewBio] = useState(bio || '')
  
  const onChange = (e) => {
    setProfileObject((prev) => ({ ...prev, bio: e.target.value }))
    setNewBio(e.target.value)
  }

  return (
    <div id="EditProfile_EditBio">
      <label htmlFor="EditProfile-bio" className="mb-2 inline-block">
        Bio
      </label>
      <TextArea
        value={newBio}
        maxLength={200}
        placeholder="Maximum 200 characters are Allowed"
        id="EditProfile-bio"
        className="w-1/2 block resize-none outline-none"
        onChange={onChange}
      ></TextArea>
    </div>

  )
}

export default memo(EditProfileBio)