import React, { useEffect, useState, useRef } from 'react'
import { useNotificationContext } from '@/context/NotificationContext';
import { Icons } from '..';


const EditProfileLinks = ({ links, setProfileObject }) => {

  const [URL, setURL] = useState("");
  const [Title, setTitle] = useState("");
  const [URLerror, setURLerror] = useState("");
  const [linksArr, setLinksArr] = useState([]);
  
  // console.log(linksArr)
  const url = useRef();
  const title = useRef();

  const { setNotification } = useNotificationContext()



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

  return (
    <div id="EditProfile_EditLinks">
      <span className="mb-2 inline-block"> Links</span>
      <div className="flex EditProfile_Links_Div w-full" id="">
        <div
          id="EditProfile_EditLinks_3inputs"
          className={`w-full flex flex-col gap-3 items-start`}>
          <input
            className="outline-none px-1"
            placeholder="URL"
            type="url"
            value={URL}
            ref={url}
            id='URL'
            onChange={(e) => setURL(e.currentTarget.value)}
          />
          <input
            className="outline-none px-1"
            placeholder="Title"
            type="text"
            value={Title}
            ref={title}
            onChange={(e) => { setTitle(e.currentTarget.value) }}
          />
          <input
            type="button"
            value="Add Link"
            className="cursor-pointer Add-Link_btn"
            onClick={addLinks}
          />
          {URLerror && (
            <span className="text-red-600 font_bold_500">{URLerror}</span>
          )}
        </div>

        <div id="EditProfile_EditLinks_LinksAdded">
          {linksArr?.map((link, index) => (
            <section
              key={JSON.parse(link).URL + index}
              className="flex gap-3 p-1 items-center w-full">
              <span className="p-1 flex justify-center items-center link-circle"
                onClick={() =>
                  setLinksArr((prev) => {
                    let linksArr = [...prev];
                    linksArr.splice(index, 1);
                    return linksArr;
                  })
                }>
                <Icons.trashcan />
              </span>
              <div className={`EditProfile_EditLinks_title_url_div w-full`}>
                <p className="flex justify-between w-full">{JSON.parse(link).Title}</p>
                <a href={JSON.parse(link).URL} target="_blank">
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