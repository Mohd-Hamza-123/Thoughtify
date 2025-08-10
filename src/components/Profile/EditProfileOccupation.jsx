import React, { useEffect, useState, memo } from 'react'
import { occupation_Arr } from './Profile_arr';



const EditProfileOccupation = ({ occupation, setProfileObject }) => {


  const [OccupationInput, setOccupationInput] = useState(occupation || "");



  useEffect(() => {
    setProfileObject((prev) => ({ ...prev, occupation: OccupationInput }))
  }, [OccupationInput]);

  return (
    <div className="EditProfile_Occupation_div">
      <p className="mb-2 mt-2 block">Occupation</p>
      <div className="flex justify-start gap-3">
        <div className="w-1/2">
          <select
            name='occupation'
            value={OccupationInput}
            onChange={(e) => {
              setOccupationInput(e.currentTarget.value)
            }}
          >
            <option value="" hidden>
              Your Occupation
            </option>
            {occupation_Arr?.map((occupation) => (
              <option key={occupation} value={occupation}>
                {occupation}
              </option>
            ))}
          </select>
        </div>

        {(OccupationInput === "Other" || !occupation_Arr.includes(OccupationInput)) && <div className="w-1/2">
          <input
            value={OccupationInput}
            type="text"
            placeholder="Enter Your Occupation"
            className="outline-none"
            maxLength={50}
            onChange={(e) => setOccupationInput(e?.target?.value)}
          />
        </div>}

      </div>
    </div>
  )
}

export default memo(EditProfileOccupation)