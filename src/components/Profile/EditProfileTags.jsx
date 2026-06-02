import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button';
import Icons from '@/components/Icons';

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
    <div className="w-full max-w-[700px]">
      <p className="text-[16px] font-semibold mb-3">
        Interested In
      </p>

      <div>
        <p className="text-[13px] text-gray-700 mb-3">
          Enter tag name or you can type like this PYTHON,JAVA,C#
        </p>

        <div className="w-full min-h-[50px] border border-gray-300 rounded-md bg-white p-3">
          <ul className="flex flex-wrap items-center gap-2">
            {interestedTagArr?.map((Tag, index) => (
              <li
                key={Tag}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 text-sky-600 text-sm font-medium"
              >
                <span>{Tag}</span>

                <span
                  className="cursor-pointer text-[11px]"
                  onClick={(e) => {
                    setInterestedTagArr((prev) => {
                      let newArray = [...prev];
                      newArray.splice(index, 1);
                      return newArray;
                    });
                  }}
                >
                  <Icons.cross />
                </span>
              </li>
            ))}

            <input
              type="text"
              placeholder="Coding,Java,Python"
              onInput={addTag}
              value={interestedTag}
              className="flex-1 min-w-[140px] outline-none border-none text-sm py-1"
            />
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5">
          <p className="text-sm font-medium">
            <span className="font-bold">
              {10 - interestedTagArr.length}
            </span>{" "}
            tags are remaining
          </p>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <Button
              type="button"
              className="secondaryBlue font_bold_500 text-white flex-1 sm:flex-none"
              onClick={addTags}
            >
              Add Tag
            </Button>

            <Button
              type="button"
              className="secondaryBlue font_bold_500 text-white flex-1 sm:flex-none"
              onClick={() => setInterestedTagArr([])}
            >
              Remove all
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfileTags