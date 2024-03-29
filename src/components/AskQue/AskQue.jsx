import React, { useCallback, useEffect, useRef, useState } from "react";
import "./AskQue.css";
import { useAskContext } from "../../context/AskContext";
import { RTE, Input, Button, TextArea, HorizontalLine, Opinions } from "../";
import conf from "../../conf/conf";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import appwriteService from "../../appwrite/config";
import { categoriesArr } from "./Category";
import profile from "../../appwrite/profile";

const AskQue = ({ post }) => {

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
  const [thumbailURL, setThumbailURL] = useState('')
  const [imgArr, setimgArr] = useState([]);

  // Category State
  const [selectCategoryVisible, setselectCategoryVisible] = useState(false)
  const [categoryValue, setcategoryValue] = useState('');
  // console.log(categoryValue)
  // Poll State
  const [TotalPollOptions, setTotalPollOptions] = useState([]);
  console.log(TotalPollOptions)
  const [pollQuestion, setPollQuestion] = useState('')
  const [options, setoptions] = useState('')
  // console.log(options)
  const [pollTextAreaEmpty, setpollTextAreaEmpty] = useState(true)

  

  const handleImageUpload = (arr) => {
    if (arr.length !== 0) {
      setimgArr(arr);
    }
  };

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

    // console.log(data)
    // console.log(TotalPollOptions)
    const pollOptions = TotalPollOptions.map((obj) => JSON.stringify(obj))
    // console.log(pollOptions)
    data.pollQuestion = pollQuestion
    // console.log(data)
    // console.log(TotalPollOptions)
    // return
    let date = new Date()
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    let day = String(date.getDate()).padStart(2, '0');

    if (pollQuestion && TotalPollOptions.length <= 1) {
      console.log('There must be 2 options')
      return
    }
    if (data.title === '' && data.content !== '') {
      console.log("Not valid ")
      return
    }
    if (!categoryValue) {
      return
    }

    if (!data.title && !pollQuestion) {
      console.log('Title is not there');
      return
    }
    console.log("Ha")
    // return
    if (post) {

      if (thumbnailFile) {
        const deleteprevThumbnail = await appwriteService.deleteThumbnail(post.queImageID)
        const dbThumbnail = await appwriteService.createThumbnail({ file: thumbnailFile })

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          queImageID: dbThumbnail.$id,
          pollQuestion,
          pollOptions
        }, categoryValue);

      } else {
        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          queImageID: post.queImageID,
          pollQuestion,
          pollOptions
        }, categoryValue);
      }


      navigate("/");
      setimgArr((prev) => []);

    } else if (!post && thumbnailFile) {
      // const userProfile = await profile.listProfile({ slug: userData.$id })


      const dbThumbnail = await appwriteService.createThumbnail({ file: thumbnailFile })

      const dbPost = await appwriteService.createPost({
        ...data,
        queImageID: dbThumbnail.$id,
        userId: userData.$id,
        pollQuestion,
        queImage: null,
        pollOptions,
        name: userData?.name,
        date: `${year}-${month}-${day}`
      }, categoryValue);
      // console.log(dbPost)
    } else {

      // const userProfile = await profile.listProfile({ slug: userData.$id })

      try {
        const unsplashImg = await fetch(`https://api.unsplash.com/search/photos?query=${categoryValue}&per_page=10&client_id=${conf.unsplashApiKey}`)

        const UnsplashRes = await unsplashImg.json();
        const ImgArrUnsplash = UnsplashRes.results

        const randomIndex = Math.floor(Math.random() * 10);
        // console.log(ImgArrUnsplash[randomIndex])
        const ImgURL = ImgArrUnsplash[randomIndex].urls.full

        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
          queImage: ImgURL,
          queImageID: null,
          pollQuestion,
          pollOptions,
          name: userData?.name,
          date: `${year}-${month}-${day}`
        }, categoryValue);
        console.log("Thubmnai hai")
      } catch (error) {
        console.log("Thumbnail nhi")
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
          queImage: null,
          queImageID: null,
          name: userData.name,
          pollQuestion,
          pollOptions,
        }, categoryValue);
      }

    }
    navigate("/")
    setimgArr((prev) => [])
  }

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
      const pollOptionsArray = post.pollOptions.map((option) => JSON.parse(option))
      setTotalPollOptions((prev) => pollOptionsArray)
      appwriteService.getThumbnailPreview(post.queImageID)
        .then((res) => {
          setThumbailURL(res.href)
        })
    } else {

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
  }, [slugTransform, setValue, watch])

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
                placeholder="A Catchy , Title will get more attention. Max 250 Characters are Allowed."
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


                <div className="flex pl-6 justify-around w-4/5 text-xl">
                  <div className="flex-1 flex gap-3 items-center">
                    <Input
                      {...register("opinionsFrom", {
                        required: false
                      })}
                      defaultChecked={post && post?.opinionsFrom === 'Everyone' ? true : post ? false : true}
                      type="radio"
                      value="Everyone"
                      name='opinionsFrom'
                      id="Id1"
                      className='cursor-pointer'
                    />
                    <label htmlFor="Id1" className='cursor-pointer'>Everyone</label>
                  </div>


                  <div className="flex-1 flex gap-3 items-center text-xl">
                    <Input
                      {...register('opinionsFrom')}
                      type="radio"
                      value="Responders"
                      defaultChecked={''}
                      id="Id3"
                      name='opinionsFrom'
                      className='cursor-pointer'
                    />
                    <label htmlFor="Id3" className='cursor-pointer'>Responders</label>
                    <i className="fa-solid fa-mars-stroke text-red-600"></i>
                  </div>
                </div>


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


            <div id="AskQue_PostType">
              <p>Select Post Type:</p>
              <div className="flex justify-start gap-6">
                <div>
                  <label className="cursor-pointer" htmlFor="public">Public</label>
                  <input
                    className="cursor-pointer"
                    {...register("status")}
                    type="radio"
                    name='status'
                    value={'Public'}
                    id="public"
                    defaultChecked={post ? (post?.status === 'Public' ? true : false) : true}
                  />
                </div>
                <div>
                  <label className="cursor-pointer" htmlFor="private">Private</label>
                  <input
                    className="cursor-pointer"
                    {...register("status", {
                      required: false
                    })}
                    type="radio"
                    name="status"
                    id="private"
                    value={'Private'}
                    defaultChecked={post && post?.status === "Private" ? true : false}
                  />
                </div>
              </div>
            </div>


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
                  {categoriesArr?.map((object, index) => (
                    <li key={object.category + index} className="dropdown-item" onClick={
                      () => {
                        setselectCategoryVisible(false)
                        setcategoryValue(object.category)
                      }
                    }>{object.category}</li>
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
                  value={`${post ? post.pollQuestion : pollQuestion}`}
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
                          if (post) {
                            console.log("You cannot edit Poll")
                            setoptions("")
                            return
                          }
                          console.log(TotalPollOptions.includes(options))
                          for (let i = 0; i < TotalPollOptions.length; i++) {
                            if (TotalPollOptions[i].option === options) {
                              setoptions("")
                              return
                            }
                          }
                          if (TotalPollOptions.length <= 3 && pollTextAreaEmpty === false && options !== '') {
                            setTotalPollOptions((prev) => {
                              let arr = [...prev, { option: options, vote: 0 }]

                              return [...arr]
                            })
                          }
                          setoptions("")
                        }}
                        className="border text-sm p-1">
                        Add options
                      </Button>
                    </div>

                    {TotalPollOptions?.map((options, index) => {
                      console.log(options)
                      return <div className="w-full flex justify-start items-center" key={options.option}>

                        <span className="w-3/4" >{`${index + 1} ) ${options.option}`}</span>

                        <span className={`${post ? 'hidden' : ''}`}><i className={`fa-regular fa-trash-can cursor-pointer`} onClick={
                          () => {
                            setTotalPollOptions((prev) => {
                              let arr = [...prev]
                              arr.splice(index, 1)
                              return [...arr]
                            })
                          }}></i></span>
                      </div>
                    })}
                    <span className={`text - gray - 500 ${TotalPollOptions.length >= 2 ? null : 'hidden'} ${`${post ? 'hidden' : ''}`}`}>Maximum 4 Options Allowed</span>
                    {!(TotalPollOptions.length >= 2) && <span className={`text - gray - 500 ${TotalPollOptions.length < 2 && !pollTextAreaEmpty ? null : 'invisible'} `}>Add Minimum 2 Options</span>}
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
            <div className={`buttons flex justify - end items - center mt - 14`}>

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
