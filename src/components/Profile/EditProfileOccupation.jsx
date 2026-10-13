import React, { useEffect, useState, memo } from 'react'
import { occupation_Arr } from './Profile_arr';



const EditProfileOccupation = ({ occupation, setProfileObject }) => {


  const [OccupationInput, setOccupationInput] = useState(occupation || "");



  useEffect(() => {
    setProfileObject((prev) => ({ ...prev, occupation: OccupationInput }))
  }, [OccupationInput]);

  return (
    <div className="w-full max-w-[700px]">
      <p className="text-[16px] font-semibold mb-3">
        Occupation
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/2">
          <select
            name="occupation"
            value={OccupationInput}
            onChange={(e) => {
              setOccupationInput(e.currentTarget.value);
            }}
            className="w-full h-[45px] px-3 border border-gray-300 rounded-md outline-none text-sm bg-white"
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

        {(OccupationInput === "Other" ||
          !occupation_Arr.includes(OccupationInput)) && (
            <div className="w-full sm:w-1/2">
              <input
                value={OccupationInput}
                type="text"
                placeholder="Enter Your Occupation"
                maxLength={50}
                onChange={(e) => setOccupationInput(e?.target?.value)}
                className="w-full h-[45px] px-3 border border-gray-300 rounded-md outline-none text-sm"
              />
            </div>
          )}
      </div>
    </div>
  )
}

export default memo(EditProfileOccupation)