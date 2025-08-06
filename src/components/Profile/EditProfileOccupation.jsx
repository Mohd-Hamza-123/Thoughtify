import React, { useEffect, useState, memo } from 'react'
import { occupation_Arr } from './Profile_arr';
import { set } from 'react-hook-form';


const EditProfileOccupation = ({ occupation,setProfileObject }) => {

  const [OccupationInput, setOccupationInput] = useState(occupation === "Not Set" ? "" : occupation);
  // console.log(OccupationInput)


  useEffect(() => {
    setProfileObject((prev) => ({ ...prev, occupation: OccupationInput }))
  }, []);


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

        {OccupationInput === "Other" && <div className="w-1/2">
          <input
            type="text"
            placeholder="Enter Your Occupation"
            className="outline-none"
            maxLength={50}
            onChange={(e) => setProfileObject((prev) => ({ ...prev, occupation: e.target?.value }))}
          />
        </div>}

      </div>
    </div>
  )
}

export default EditProfileOccupation