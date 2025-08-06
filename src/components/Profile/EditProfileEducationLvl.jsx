import React, { useState, memo, useEffect } from 'react'
import { EDUCTION_OPTIONS } from './Profile_arr';


const EditProfileEducationLvl = ({ educationLevel, setProfileObject }) => {


  const [EducationLevel, setEducationLevel] = useState(educationLevel);


  useEffect(() => {
    setProfileObject((prev) => ({ ...prev, educationLvl: EducationLevel }))
  }, [EducationLevel])


  return (
    <div className="EditProfile_Edu_Lvl_div">
      <p htmlFor="" className="mb-2 block">
        Highest Level of Education
      </p>
      <div className="flex justify-start gap-3">
        <div className="w-1/2">
          <select
            name='educationLvl'
            value={EducationLevel}
            onChange={(e) => setEducationLevel(e.currentTarget.value)}
          >
            <option hidden>Your Qualification</option>
            {EDUCTION_OPTIONS?.map((education) => (
              <option key={education} value={education}>
                {education}
              </option>
            ))}
          </select>
        </div>

        {EducationLevel === "Other" && <div className="w-1/2">
          <input
            type="text"
            placeholder="Enter Your Qualification"
            className="outline-none"
            maxLength={50}
            onChange={(e) => setProfileObject((prev) => ({ ...prev, educationLvl: e?.target?.value }))}
          />
        </div>}

      </div>
    </div>
  )
}

export default memo(EditProfileEducationLvl)