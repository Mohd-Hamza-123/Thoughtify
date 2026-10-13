import React, { useState, memo, useEffect } from 'react'
import { EDUCTION_OPTIONS } from './Profile_arr';


const EditProfileEducationLvl = ({
  educationLevel,
  setProfileObject
}) => {

  
  const [EducationLevel, setEducationLevel] = useState(educationLevel);


  useEffect(() => {
    setProfileObject((prev) => ({ ...prev, educationLvl: EducationLevel }))
  }, [EducationLevel])


  return (
  <div className="w-full max-w-[700px]">
  <p className="text-[16px] font-semibold mb-3">
    Highest Level of Education
  </p>

  <div className="flex flex-col sm:flex-row gap-4">
    <div className="w-full sm:w-1/2">
      <select
        name="educationLvl"
        value={EducationLevel}
        onChange={(e) => setEducationLevel(e.currentTarget.value)}
        className="w-full h-[45px] px-3 border border-gray-300 rounded-md outline-none text-sm bg-white"
      >
        <option hidden>
          Your Qualification
        </option>

        {EDUCTION_OPTIONS?.map((education) => (
          <option key={education} value={education}>
            {education}
          </option>
        ))}
      </select>
    </div>

    {(EducationLevel === "Other" ||
      !EDUCTION_OPTIONS.includes(EducationLevel)) && (
      <div className="w-full sm:w-1/2">
        <input
          value={EducationLevel}
          type="text"
          placeholder="Enter Your Qualification"
          maxLength={50}
          onChange={(e) => setEducationLevel(e?.target?.value)}
          className="w-full h-[45px] px-3 border border-gray-300 rounded-md outline-none text-sm"
        />
      </div>
    )}
  </div>
</div>
  )
}

export default memo(EditProfileEducationLvl)