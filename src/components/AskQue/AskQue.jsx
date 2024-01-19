import React, { useCallback, useEffect, useRef, useState } from "react";
import "./AskQue.css";
import { useAskContext } from "../../context/AskContext";
import { RTE, Input, Button, TextArea } from "../";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import appwriteService from "../../appwrite/config";

const AskQue = ({ post }) => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const ask_Que_Container_cross_icon = useRef();
  const {
    setisAskQueVisible,
    isAskQueVisible,
    setEditAskQueVisible,
    EditAskQueVisible,
  } = useAskContext();

  const [imgArr, setimgArr] = useState([]);
  const AskQueContainer = useRef();
  const { handleSubmit, register, control, watch, setValue, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "slug",
        content: post?.content || "",
      },
    });

  const handleImageUpload = (arr) => {
    if (arr.length !== 0) {
      setimgArr(arr);
    }
  };

  const findingImageIndex = (content) => {
    if (imgArr.length !== 0) {
      // console.log(imgArr)
      let minIndex = Infinity;
      let indexResult = null;
      imgArr.forEach((words, index) => {
        let wordIndex = content.indexOf(words);

        if (wordIndex !== -1 && wordIndex < minIndex && imgArr[index] !== "") {
          minIndex = wordIndex;
          indexResult = index;
        }
      });
      return indexResult;
    }
  };

  const submit = async (data) => {
    if (post) {
      let imageURLIndex = findingImageIndex(data.content);
      console.log(imgArr);
      if (!post.queImage && imgArr.length === 0) {
        console.log("Img nhi hai");
        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          queImage: null,
        });
      } else {
        console.log(post.queImage);
        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          queImage: post?.queImage || imgArr[imageURLIndex],
        });
      }
      navigate("/");
      setEditAskQueVisible(false);
      setimgArr((prev) => []);
    } else {
      // console.log("post nhi hai");
      let imageURLIndex = findingImageIndex(data.content);
      // console.log(data.content);
      // console.log(imageURLIndex);
      // console.log(imgArr[imageURLIndex]);
      // console.log(imgArr);
      if (!isNaN(imageURLIndex)) {
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
          queImage: imgArr[imageURLIndex],
          name: userData.name,
        });
      } else {
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
          queImage: null,
          name: userData.name,
        });
      }

      navigate("/");
      setisAskQueVisible(false);
      setimgArr((prev) => []);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), {
          shouldValidate: true,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [slugTransform, setValue, watch]);
  // console.log(isAskQueVisible);
  return (
    <>
      <div
        id="askQue_div"
        className={`${isAskQueVisible ? "active" : null} ${
          EditAskQueVisible ? "active" : null
        }`}
      >
        <div id="askQue_black"></div>
        <div
          className={`ask_Que_Container ${isAskQueVisible ? "active" : ""} ${
            EditAskQueVisible ? "active" : null
          }`}
        >
          <div>
            <Button
              className="flex justify-center items-center"
              id="ask_Que_Container_cross_btn"
              onClick={() => {
                if (post) {
                  if (!isAskQueVisible) {
                    setEditAskQueVisible((prev) => !prev);
                  }
                  if (EditAskQueVisible === false) {
                    setisAskQueVisible((prev) => !prev);
                  }
                } else {
                  if (!EditAskQueVisible) {
                    setisAskQueVisible((prev) => !prev);
                  }
                }
              }}
              onMouseOver={() => {
                ask_Que_Container_cross_icon.current.classList.add("fa-beat");
              }}
              onMouseOut={() => {
                ask_Que_Container_cross_icon.current.classList.remove(
                  "fa-beat"
                );
              }}
            >
              <i
                id="ask_Que_Container_cross_icon"
                ref={ask_Que_Container_cross_icon}
                className="fa-solid fa-x"
              ></i>
            </Button>
          </div>
          <h3 className="text-center text-4xl">Ask A Question</h3>

          <form onSubmit={handleSubmit(submit)}>
            <div className="Question_Title flex gap-3">
              <h4 className="my-4 text-2xl">Question Title</h4>
              <TextArea
                maxLength="250"
                id="Que_Title"
                placeholder="A Catchy ,Title will get more attention. Max 250 Characters are Allowed."
                {...register("title", {
                  required: true,
                })}
              />
              <Input
                className="text-black hidden"
                placeholder="slug"
                {...register("slug", {
                  required: true,
                })}
                onInput={(e) => {
                  setValue("slug", slugTransform(e.current.target.value), {
                    shouldValidate: true,
                  });
                }}
              />
            </div>
            <div className="Descripton flex flex-col gap-3">
              <h4 className="my-3 text-2xl">Additional Details (Optional)</h4>
              <div className="Description_div">
                <RTE
                  name="content"
                  defaultValue={getValues("content")}
                  control={control}
                  handleImageUpload={handleImageUpload}
                />
              </div>
            </div>
            <div className="Opinions">
              <h4 className="my-4 text-2xl">
                Whom Opinion are You interested ?
              </h4>
              <div className="flex justify-between items-center ">
                <div className="w-1/5  text-center text-xl">
                  <span>Opinions From :</span>
                </div>

                <div className="flex pl-6 justify-around  w-4/5 text-xl">
                  <div className="flex-1 flex gap-3 items-center">
                    <Input defaultChecked type="radio" name="gender" id="Id1" />
                    <label htmlFor="Id1">Everyone</label>
                  </div>

                  <div className="flex-1 flex gap-3 items-center text-xl">
                    <Input type="radio" name="gender" id="Id2" />
                    <label htmlFor="Id2">Boys</label>
                    <i className="fa-solid fa-mars-stroke-up text-blue-700"></i>
                  </div>

                  <div className="flex-1 flex gap-3 items-center text-xl">
                    <Input type="radio" name="gender" id="Id3" />
                    <label htmlFor="Id3">Girls</label>
                    <i className="fa-solid fa-mars-stroke text-pink-600"></i>
                  </div>
                </div>
              </div>
            </div>
            <hr className="mt-5" />
            <div className="Anonymous_opinions my-4">
              <div className="flex justify-between items-center">
                <div className="w-1/5 text-center text-xl">
                  <span>Anonymous :</span>
                </div>
                <div className="flex pl-6 justify-around  w-4/5">
                  <div className="flex flex-1 gap-3 items-center text-xl">
                    <Input
                      type="radio"
                      className=""
                      name="anonymous"
                      id="anonymous1"
                    />
                    <label htmlFor="anonymous1">Yes</label>
                  </div>

                  <div className="flex flex-1 gap-3 items-center text-xl">
                    <Input type="radio" name="anonymous" id="anonymous2" />
                    <label htmlFor="anonymous2">Random</label>
                  </div>

                  <div className="flex flex-1 gap-3 items-center text-xl">
                    <Input
                      defaultChecked
                      type="radio"
                      name="anonymous"
                      id="anonymous3"
                    />
                    <label htmlFor="anonymous3">Never</label>
                  </div>
                </div>
              </div>
            </div>

            <div className={`buttons flex justify-around items-center`}>
              <Button
                className="askque_btn"
                onClick={(e) => {
                  e.preventDefault();
                  setisAskQueVisible((prev) => !prev);
                }}
              >
                Discard
              </Button>
              <Button className="askque_btn">New</Button>
              <Button type="submit" className="askque_btn">
                {post ? "Update & Ask " : "Ask"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AskQue;
