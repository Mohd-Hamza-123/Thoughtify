import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button';

const EditProfileTags = ({ interestedIn, setProfileObject }) => {

  const [interestedTag, setInterestedTag] = useState("");
  const [interestedTagArr, setInterestedTagArr] = useState(interestedIn || []);

  const addTag = (e) => {
    let tag = e.currentTarget.value.replace(/\s+/g, " ").toUpperCase();
    setInterestedTag(tag);
  };

  const addTags = () => {

    if (
      interestedTagArr.includes(interestedTag) ||
      interestedTagArr.length === 10 ||
      interestedTag.length > 30 ||
      interestedTag === "" ||
      interestedTag === " "
    ) {
      setInterestedTag("");
      return;
    }
    if (interestedTag.includes(",")) {
      let newArrComma = interestedTag.split(",");
      for (let i = 0; i < newArrComma.length; i++) {
        if (interestedTagArr.includes(newArrComma[i])) {
          setInterestedTag("");
          return;
        }
      }
      setInterestedTagArr((prev) => {
        if (prev.length + newArrComma.length > 10) {
          return prev;
        }
        return [...prev, ...newArrComma];
      });
      setInterestedTag("");
      return;
    }

    setInterestedTagArr((prev) => [...prev, interestedTag]);

    setInterestedTag("");
  };

  useEffect(() => {
    setProfileObject((prev) => ({ ...prev, interestedIn: interestedTagArr }))
  }, [interestedTagArr])


  return (
    <div className="EditProfile_Interested_div">
      <p className="mb-2 mt-2 block">Interested In </p>
      <div className="EditProfile_Interested_Tag">
        <p className="">
          Enter tag name or you can type like this PYTHON,JAVA,C#
        </p>
        <div className={`EditProfile_tag_box p-2 mb-2`}>
          <ul className="flex flex-wrap gap-3">
            {interestedTagArr?.map((Tag, index) => (
              <li key={Tag} className="flex items-center gap-2">
                <span>{Tag}</span>
                <span
                  className={`cursor-pointer`}
                  onClick={(e) => {
                    setInterestedTagArr((prev) => {
                      let newArray = [...prev];
                      newArray.splice(index, 1);
                      return newArray;
                    });
                  }}
                >
                  <i className="fa-solid fa-x"></i>
                </span>
              </li>
            ))}

            <input
              type="text"
              name=""
              id=""
              className="outline-none"
              placeholder="Coding,Java,Python"
              onInput={addTag}
              value={interestedTag}
            />
          </ul>
        </div>
        <div className="flex justify-between items-center EditProfile_Interested_remaining mt-5 flex-wrap">
          <p>
            <span> {10 - interestedTagArr.length} </span>tags are
            remaining
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              className="secondaryBlue font_bold_500 text-white"
              onClick={addTags}>
              Add Tag
            </Button>
            <Button
              type='button'
              className="secondaryBlue font_bold_500 text-white"
              onClick={() => setInterestedTagArr([])}>
              Remove all
            </Button>
          </div>
        </div>
      </div>
    </div >
  )
}

export default EditProfileTags