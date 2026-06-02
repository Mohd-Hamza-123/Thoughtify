import React, { useEffect, useState, useRef } from 'react'
import {toast} from "sonner"
import { Icons } from '..';


const EditProfileLinks = ({ links, setProfileObject }) => {

  const [URL, setURL] = useState("");
  const [Title, setTitle] = useState("");
  const [URLerror, setURLerror] = useState("");
  const [linksArr, setLinksArr] = useState(links || []);

  // console.log(linksArr)
  const url = useRef();
  const title = useRef();

  function isValidURL(URL) {
    // Regular expression for a valid URL
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    // Test the provided URL against the regular expression
    return urlRegex.test(URL);
  }


  const addLinks = async (e) => {

    if (!URL || !Title) {
      setNotification({ message: "Enter URL and Title", type: "error" })
      return
    }

    if (!isValidURL(URL)) {
      setURLerror("Enter Valid URL");
      setNotification({ message: "Enter Valid URL", type: "error" })
      return;
    }

    if (linksArr.length >= 15) {
      setURLerror("Maximum 15 Links Allowed");
      setNotification({ message: "Maximum 15 Links Allowed", type: "error" })
      return;
    }

    setProfileObject((prev) => ({ ...prev, links: [...linksArr, JSON.stringify({ URL, Title })] }))
    setLinksArr((prev) => [JSON.stringify({ URL, Title }), ...prev]);

    setTitle("");
    setURL("");
    url.current.value = "";
    title.current.value = "";
  };

  useEffect(() => {
    setLinksArr((prev) => {
      if (links) {
        return [...links];
      } else {
        return [];
      }
    });
  }, []);

  useEffect(() => {
    setProfileObject((prev) => ({ ...prev, links: linksArr }))
  }, [linksArr])

  return (
  <div className="w-full max-w-[700px]">
  <span className="mb-3 inline-block text-[16px] font-semibold">
    Links
  </span>

  <div className="flex flex-col lg:flex-row gap-5 w-full">
    <div className="w-full lg:w-1/2 flex flex-col gap-3 items-start">
      <input
        placeholder="URL"
        type="url"
        value={URL}
        ref={url}
        id="URL"
        onChange={(e) => setURL(e.currentTarget.value)}
        className="w-full h-[42px] px-3 border border-gray-300 rounded-md outline-none text-sm"
      />

      <input
        placeholder="Title"
        type="text"
        value={Title}
        ref={title}
        onChange={(e) => {
          setTitle(e.currentTarget.value);
        }}
        className="w-full h-[42px] px-3 border border-gray-300 rounded-md outline-none text-sm"
      />

      <input
        type="button"
        value="Add Link"
        onClick={addLinks}
        className="cursor-pointer px-4 py-2 rounded-md bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 transition"
      />

      {URLerror && (
        <span className="text-red-600 font-medium text-sm">
          {URLerror}
        </span>
      )}
    </div>

    <div className="w-full lg:w-1/2 flex flex-col gap-3">
      {linksArr?.map((link, index) => (
        <section
          key={JSON.parse(link).URL + index}
          className="flex items-start gap-3 w-full p-3 border border-gray-200 rounded-md bg-white"
        >
          <span
            className="shrink-0 w-9 h-9 rounded-full bg-red-50 text-red-500 flex justify-center items-center cursor-pointer hover:bg-red-100 transition"
            onClick={() =>
              setLinksArr((prev) => {
                let linksArr = [...prev];
                linksArr.splice(index, 1);
                return linksArr;
              })
            }
          >
            <Icons.trashcan />
          </span>

          <div className="w-full min-w-0">
            <p className="w-full font-medium text-sm text-gray-900 truncate">
              {JSON.parse(link).Title}
            </p>

            <a
              href={JSON.parse(link).URL}
              target="_blank"
              className="block text-sm text-sky-600 hover:underline break-all"
            >
              {JSON.parse(link).URL}
            </a>
          </div>
        </section>
      ))}
    </div>
  </div>
</div>
  )
}

export default EditProfileLinks