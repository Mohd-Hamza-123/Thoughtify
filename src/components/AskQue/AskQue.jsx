import React, { useCallback, useEffect, useRef, useState } from "react";
import "./AskQue.css";
import { useAskContext } from "../../context/AskContext";
import { RTE, Input, Button, TextArea, HorizontalLine } from "../";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import appwriteService from "../../appwrite/config";
import { categoriesArr } from "./Category";
import profile from "../../appwrite/profile";

const AskQue = ({ post }) => {
  console.log(post)
  const { handleSubmit, register, control, watch, setValue, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "slug",
        content: post?.content || "",
        pollAnswer: post?.pollAnswer || ''
      },
    });
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  // Thumbnail 
  const [thumbnailFile, setthumbnailFile] = useState(null)
  // console.log(thumbnailFile)
  // console.log(thumbnailFile)
  const [thumbailURL, setThumbailURL] = useState('')
  const [imgArr, setimgArr] = useState([]);

  // Category State
  const [selectCategoryVisible, setselectCategoryVisible] = useState(false)
  const [categoryValue, setcategoryValue] = useState('');
  // console.log(categoryValue)
  // Poll State
  const [TotalPollOptions, setTotalPollOptions] = useState([]);
  const [pollQuestion, setPollQuestion] = useState('')
  const [options, setoptions] = useState('')
  // console.log(options)
  const [pollTextAreaEmpty, setpollTextAreaEmpty] = useState(true)



  const handleImageUpload = (arr) => {
    if (arr.length !== 0) {
      setimgArr(arr);
    }
  };

  // const findingImageIndex = (content) => {
  //   if (imgArr.length !== 0) {
  //     // console.log(imgArr)
  //     let minIndex = Infinity;
  //     let indexResult = null;
  //     imgArr.forEach((words, index) => {
  //       let wordIndex = content.indexOf(words);

  //       if (wordIndex !== -1 && wordIndex < minIndex && imgArr[index] !== "") {
  //         minIndex = wordIndex;
  //         indexResult = index;
  //       }
  //     });
  //     return indexResult;
  //   }
  // };

  const selectThumbnail = async (e) => {

    const file = e.currentTarget.files[0]
    setthumbnailFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setThumbailURL(reader.result)
    }
    reader.readAsDataURL(file)
  }


  const submit = async (data) => {

    console.log((data))
    if (pollQuestion && TotalPollOptions.length <= 1) {
      console.log('There must be 2 options')
      return
    }

    if (!categoryValue) {
      return
    }

    if (!data.title && !pollQuestion) {
      console.log('Title is not there')
      return
    }


    if (post) {

      if (thumbnailFile) {
        const deleteprevThumbnail = await appwriteService.deleteThumbnail(post.queImageID)
        const dbThumbnail = await appwriteService.createThumbnail({ file: thumbnailFile })

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          queImageID: dbThumbnail.$id,
          pollQuestion,
          pollOptions: TotalPollOptions,
        }, categoryValue);

      } else {
        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          queImageID: post.queImageID,
          pollQuestion,
          pollOptions: TotalPollOptions,
        }, categoryValue);
      }


      navigate("/");
      setimgArr((prev) => []);

    } else if (!post && thumbnailFile) {

      const dbThumbnail = await appwriteService.createThumbnail({ file: thumbnailFile })

      const dbPost = await appwriteService.createPost({
        ...data,
        queImageID: dbThumbnail.$id,
        userId: userData.$id,
        pollQuestion,
        pollOptions: TotalPollOptions,
        name: userData?.name
      }, categoryValue);
      // console.log(dbPost)
    } else {

      let imageURLIndex = findingImageIndex(data.content);

      if (!isNaN(imageURLIndex)) {
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
          queImage: imgArr[imageURLIndex],
          name: userData.name,
          queImageID: null,
          pollQuestion,
          pollOptions: TotalPollOptions,
        }, categoryValue);

      } else {
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
          queImage: null,
          queImageID: null,
          name: userData.name,
          pollQuestion,
          pollOptions: TotalPollOptions,
        }, categoryValue);

      }
    }
    navigate("/");
    setimgArr((prev) => []);
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
    if (post) {
      setcategoryValue(post.category)

      if (post.pollQuestion) {
        setPollQuestion(post.pollQuestion)
        setpollTextAreaEmpty(false)
      }

      setTotalPollOptions((prev) => post.pollOptions)
      appwriteService.getThumbnailPreview(post.queImageID)
        .then((res) => {
          setThumbailURL(res.href)
        })
    }
  }, [])
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

  return (
    <>
      <HorizontalLine />
      <div
        className={`ask_Que_Container`}
      >
        <h3 className="text-center text-4xl">"Got a Question? Ask Away!"</h3>

        <form id="AskQue_Form" onSubmit={handleSubmit(submit)} className="flex">
          <div id="AskQue_InsideFormLeft">
            <div className="Question_Title flex gap-3">
              <h4 className="my-4 text-xl">Title</h4>
              <TextArea
                maxLength="250"
                id="Que_Title"
                placeholder="A Catchy ,Title will get more attention. Max 250 Characters are Allowed."
                {...register("title", {
                  required: false,
                })}
              />
              <Input
                className="text-black hidden"
                placeholder="slug"
                {...register("slug", {
                  required: false,
                })}
                onInput={(e) => {
                  setValue("slug", slugTransform(e.current.target.value), {
                    shouldValidate: true,
                  });
                }}
              />
            </div>
            <div className="Descripton flex flex-col gap-3">
              <h4 className="my-3 text-xl">Additional Details (Optional)</h4>
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
              <h4 className="my-4 mb-6 mt-5 text-xl">
                Whom Opinion are You interested ?
              </h4>
              <div className="flex justify-between items-center ">
                <div className="w-1/5  text-center text-xl">
                  <span>Opinions From :</span>
                </div>

                <Controller
                  control={control}
                  name="opinionsFrom"
                  defaultValue={'Everyone'}
                  render={({ field }) => (
                    <div className="flex pl-6 justify-around w-4/5 text-xl">
                      <div className="flex-1 flex gap-3 items-center">
                        <Input
                          {...field}
                          defaultChecked={post && post?.opinionsFrom === 'Everyone' ? true : post ? false : true}
                          type="radio"
                          value="Everyone"
                          id="Id1"
                          className='cursor-pointer'
                        />
                        <label htmlFor="Id1" className='cursor-pointer'>Everyone</label>
                      </div>

                      <div className="flex-1 flex gap-3 items-center text-xl">
                        <Input
                          {...field}
                          defaultChecked={post && post.opinionsFrom === 'Boys' ? true : false}
                          type="radio"
                          value="Boys"
                          id="Id2"
                          className='cursor-pointer'
                        />
                        <label htmlFor="Id2" className='cursor-pointer'>Boys</label>
                        <i className="fa-solid fa-mars-stroke-up text-blue-700"></i>
                      </div>

                      <div className="flex-1 flex gap-3 items-center text-xl">
                        <Input
                          {...field}
                          type="radio"
                          value="Girls"
                          defaultChecked={post && post?.opinionsFrom === 'Girls' ? true : false}
                          id="Id3"
                          className='cursor-pointer'
                        />
                        <label htmlFor="Id3" className='cursor-pointer'>Girls</label>
                        <i className="fa-solid fa-mars-stroke text-pink-600"></i>
                      </div>
                    </div>
                  )}
                />

              </div>
            </div>


            <hr className="mt-5" />

          </div>

          <div id="AskQue_insideForm_right">

            <div id="AskQue_Thumbnail_preview">
              <div id="AskQue_Thumbnail">
                {!thumbailURL && <p className="text-center">Add Thumbail for Your Question
                  <br />
                  or thumbnail will be set according to category
                </p>}
                {thumbailURL && <div>
                  <img src={thumbailURL} alt="" />
                </div>}
              </div>

              <div id="AskQue_Thumbnail_label" className="flex justify-around items-center gap-5">
                <label className="AskQue_BrowseThumbnail" htmlFor="BrowseThumbnail">{thumbailURL ? `Change Image` : 'Browse Image'}</label>
                <input className="hidden" type="file"
                  name="thumbnailImage"
                  accept="image/*"
                  id="BrowseThumbnail"
                  onChange={selectThumbnail}
                />
                {thumbailURL && <span onClick={() => {
                  setThumbailURL('')
                  setthumbnailFile(null)
                }}>Remove Image</span>}
              </div>
            </div>

            <Controller
              name="status"
              control={control}
              defaultValue={'Public'}
              render={({ field }) => (
                <div id="AskQue_PostType">
                  <p>Select Post Type:</p>
                  <div className="flex justify-start gap-6">
                    <div>
                      <label className="cursor-pointer" htmlFor="public">Public</label>
                      <input
                        className="cursor-pointer"
                        {...field}
                        type="radio"
                        name="postType"
                        value={'Public'}
                        id="public"
                        defaultChecked={post ? (post?.status === 'Public' ? true : false) : true}
                      />
                    </div>
                    <div>
                      <label className="cursor-pointer" htmlFor="private">Private</label>
                      <input
                        className="cursor-pointer"
                        {...field}
                        type="radio"
                        name="postType"
                        id="private"
                        value={'Private'}
                        defaultChecked={post && post?.status === "Private" ? true : false}
                      />
                    </div>
                  </div>
                </div>
              )}

            />

            <div id="AskQue_SelectCategory">

              <p className="mb-3">Select Category : </p>
              <div className="dropdown">
                <div
                  className="dropdown-header flex items-center justify-between"
                  onClick={() => {
                    setselectCategoryVisible((prev) => !prev)
                  }}
                >
                  < span className="">{categoryValue ? categoryValue : `Select Item`}</span>
                  <i className="fa-solid fa-caret-down"></i>
                </div>

                {selectCategoryVisible && <ul className="AskQue-dropdown-list flex flex-col">
                  {categoriesArr?.map((category, index) => (
                    <li key={category} className="dropdown-item" onClick={
                      () => {
                        setselectCategoryVisible(false)
                        setcategoryValue(category)
                      }
                    }>{category}</li>
                  ))}
                </ul>}
              </div>

            </div>

            <div id="AskQue_Pole" className="mt-6">
              <p>Add Pole : (Optional) </p>

              <div id="AskQue_Pole_Options">
                <TextArea
                  placeholder='Ask Pole' className='AskQue_Pole_TextArea'
                  maxLength={110}
                  value={pollQuestion}
                  onChange={(e) => {
                    if (e.currentTarget.value !== '') {
                      setpollTextAreaEmpty(false)
                      setPollQuestion(e.currentTarget.value)
                    } else {
                      setpollTextAreaEmpty(true)
                      setTotalPollOptions((prev) => [])
                      setPollQuestion('')
                    }
                  }}
                >
                </TextArea>

                <div>

                  <div className="w-full flex flex-col gap-1 mt-1">

                    <div className="flex gap-3 h-8">
                      <input type="text" name="" id="" className="border outline-none px-2 text-sm w-3/5"
                        value={options}
                        placeholder="options"
                        onChange={(e) => {
                          setoptions((e.currentTarget.value))
                        }} />
                      <Button
                        onClick={() => {
                          console.log(pollTextAreaEmpty)
                          if (TotalPollOptions.length <= 3 && pollTextAreaEmpty === false && options !== '') {

                            setTotalPollOptions((prev) => [...prev, options])
                          }
                          setoptions("")
                        }}
                        className="border text-sm p-1">
                        Add options
                      </Button>
                    </div>

                    {TotalPollOptions?.map((options, index) => (
                      <div className="w-full flex justify-start items-center" key={options}>

                        <span className="w-3/4" >{`${index + 1} ) ${options}`}</span>

                        <i className="fa-regular fa-trash-can cursor-pointer" onClick={
                          () => {
                            setTotalPollOptions((prev) => {
                              let arr = [...prev]
                              arr.splice(index, 1)
                              return [...arr]
                            })
                          }}></i>
                      </div>
                    ))}
                    <span className={`text-gray-500 ${TotalPollOptions.length >= 2 ? null : 'hidden'}`}>Maximum 4 Options Allowed</span>
                    {!(TotalPollOptions.length >= 2) && <span className={`text-gray-500 ${TotalPollOptions.length < 2 && !pollTextAreaEmpty ? null : 'invisible'}`}>Add Minimum 2 Options</span>}
                  </div>

                  <div className="flex gap-3 h-8 mt-3 items-center">
                    <label htmlFor="">Opinion : </label>
                    <input type="text" name="" id="" className="border outline-none px-2 py-1 text-sm w-4/6" placeholder="Poll Answer /  Opinion"
                      {...register('pollAnswer', {
                        required: false
                      })}
                    />
                  </div>


                </div>

              </div>

            </div>
            <div className={`buttons flex justify-end items-center mt-14`}>

              <Button type="submit" className="askque_btn">
                {post ? "Update Your Question" : "Post Question"}
              </Button>
            </div>
          </div>

        </form >
      </div >
    </>
  );
};

export default AskQue;
