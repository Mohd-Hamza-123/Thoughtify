import "./AskQue.css";
import conf from "../../conf/conf";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { categoriesArr } from "./Category";
import { Icons, RTE, TextArea } from "../";
import { MAX_IMAGE_SIZE } from "@/constant";
import profile from "../../appwrite/profile";
import { useNavigate } from "react-router-dom";
import appwriteService from "../../appwrite/config";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState, memo } from "react";
import convertToWebPFile from "@/helpers/convert-image-into-webp";
import { useNotificationContext } from "@/context/NotificationContext";
import { uploadQuestionWithImage, uploadPostWithUnsplashAPI } from "@/lib/posts";


const AskQue = ({ post }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const UserAuthStatus = useSelector((state) => state.auth.status);
  const isAdmin = userData.labels.includes("admin") ? true : false;

  const { handleSubmit, register, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        content: post?.content || "",
        pollAnswer: post?.pollAnswer || '',
        opinionsFrom: post?.opinionsFrom || '',
      },
    });

  const [initialPostData, setInitialPostData] = useState({
    options: '',
    thumbnailURL: '',
    pollQuestion: '',
    isUploading: false,
    categoryValue: '',
    thumbnailFile: null,
    pollOptions: [],
    pollTextAreaEmpty: true,
    categoryFlag: false,
  })


  const {
    options,
    isUploading,
    pollOptions,
    thumbnailURL,
    pollQuestion,
    categoryFlag,
    thumbnailFile,
    categoryValue,
    pollTextAreaEmpty
  } = initialPostData

  const { setNotification } = useNotificationContext()

  const selectThumbnail = async (e) => {

    const file = e.currentTarget.files[0]

    if (file.size > MAX_IMAGE_SIZE) {
      setNotification({ message: "Image Must be Less then and Equal to 512kb", type: "error" })
      e.currentTarget.value = ''
      return
    }

    setInitialPostData((prev) => ({ ...prev, thumbnailFile: file }))
    const reader = new FileReader()
    reader.onload = () => {
      setInitialPostData((prev) => ({ ...prev, thumbnailURL: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (post) {
      const { imageURL } = JSON.parse(post?.queImage)

      setInitialPostData((prev) => ({
        ...prev,
        categoryValue: post.category,
        thumbnailURL: imageURL?.replace("preview", "view"),
      }))

      if (post?.pollQuestion && post?.pollQuestion) {
        const pollOptionsArray = post.pollOptions.map((option) => JSON.parse(option))
        setInitialPostData((prev) => ({
          ...prev,
          pollQuestion: post.pollQuestion,
          pollOptions: pollOptionsArray,
          pollTextAreaEmpty: false
        }))
      }
    }

  }, [])

  const deleteThumbnail = async () => {
    setInitialPostData((prev) => ({ ...prev, thumbnailURL: '', thumbnailFile: null }))
    try {
      await appwriteService.deleteThumbnail(post?.queImageID)
    } catch (error) {
      console.log("AskQue delete Img error.")
    }
  }

  const categoryDropdownTrigger = () => setInitialPostData((prev) => ({ ...prev, categoryFlag: !prev.categoryFlag }))

  const selectPostCategory = (category) => {
    categoryDropdownTrigger()
    setInitialPostData((prev) => ({ ...prev, categoryValue: category }))
  }

  const poolQuestionChange = (e) => {
    if (e.target?.value !== '') {
      setInitialPostData((prev) => ({
        ...prev,
        pollQuestion: e.target?.value,
        pollTextAreaEmpty: false
      }))
    } else {
      setInitialPostData((prev) => ({
        ...prev,
        pollQuestion: "",
        pollTextAreaEmpty: true,
        pollOptions: []
      }))
    }
  }
  const addPollOptions = (e) => {

    if (post) {
      setNotification({ message: "You cannot edit Poll", type: "error" })
      setInitialPostData((prev) => ({ ...prev, options: "" }))
      return
    }

    for (let i = 0; i < pollOptions.length; i++) {
      if (pollOptions[i].option === options) {
        setInitialPostData((prev) => ({ ...prev, options: "" }))
        return
      }
    }

    if (pollOptions.length <= 3 && pollTextAreaEmpty === false && options !== '') {
      setInitialPostData((prev) => {
        let arr = [...prev.pollOptions, { option: options, vote: 0 }]
        return { ...prev, pollOptions: arr }
      })
    } else {
      if (!pollQuestion) {
        setNotification({ message: "Write a Poll", type: "error" })
        setInitialPostData((prev) => ({ ...prev, options: "" }))
        return
      }
      setNotification({ message: "Maximum 4 Options Allowed", type: "error" })
    }
    setInitialPostData((prev) => ({ ...prev, options: "" }))
  }
  const submit = async (data) => {

    if (!UserAuthStatus) {
      setNotification({ message: "You are not logged In", type: "error" })
      return
    }

    if (pollQuestion && pollOptions.length <= 1) {
      setNotification({ message: "There must be 2 Poll options", type: "error" })
      return
    }

    if (!initialPostData?.categoryValue) {
      setNotification({ message: "Select a Category. Choose General If not Specific", type: "error" })
      return
    }

    if (!data.title && !pollQuestion) {
      setNotification({ message: "Title is Empty", type: "error" })
      return
    }

    setInitialPostData((prev) => ({ ...prev, isUploading: true }))

    if (post) {

      const { imageURL, imageID } = JSON.parse(post?.queImage)

      if (thumbnailFile) {

        try {
          if (imageID) await appwriteService.deleteThumbnail(imageID)
          const webpFile = await convertToWebPFile(thumbnailFile);
          const dbThumbnail = await appwriteService.createThumbnail({ file: webpFile });
          const imageURL = await appwriteService.getThumbnailPreview(dbThumbnail?.$id)

          const dbPost = await appwriteService.updatePost(post.$id, {
            ...data,
            queImage: JSON.stringify({ imageURL, imageID: dbThumbnail.$id }),
            pollQuestion,
            pollOptions: pollOptions?.map((obj) => JSON.stringify(obj)),
            trustedResponderPost: isAdmin
          }, categoryValue);

          setNotification({ message: "Post Updated", type: "success" })
        } catch (error) {
          console.log(error)
          setNotification({ message: "Post is Not Updated", type: "error" })
        }

      } else if (thumbnailURL && !imageID) {
        try {

          console.log(thumbnailURL)
          console.log(imageID)
          const dbPost = await appwriteService.updatePost(post?.$id, {
            ...data,
            queImage: JSON.stringify({ imageURL: thumbnailURL, imageID: null }),
            pollQuestion: pollQuestion,
            pollOptions: pollOptions?.map((obj) => JSON.stringify(obj)),
            trustedResponderPost: isAdmin
          }, categoryValue);

          
          setNotification({ message: "Post Updated", type: "success" })
        } catch (error) {
          setNotification({ message: "Post is Not Updated", type: "error" })
        }
      } else if (thumbnailURL && imageID) {
        console.log(thumbnailURL)
        console.log(imageID)
        try {
          const dbPost = await appwriteService.updatePost(post?.$id, {
            ...data,
            pollQuestion,
            pollOptions: pollOptions?.map((obj) => JSON.stringify(obj)),
            trustedResponderPost: isAdmin
          }, categoryValue);
          setNotification({ message: "Post Updated", type: "success" })
        } catch (error) {
          setNotification({ message: "Post is Not Updated", type: "error" })
        }

      } else {

        console.log(thumbnailURL)
        console.log(imageID)

        try {
          if (imageID) await appwriteService.deleteThumbnail(imageID)
          const unsplashImg = await fetch(`https://api.unsplash.com/search/photos?query=${categoryValue}&per_page=10&client_id=${conf.unsplashApiKey}`)
          const UnsplashRes = await unsplashImg.json();
          const ImgArrUnsplash = UnsplashRes.results
          const randomIndex = Math.floor(Math.random() * 10);


          const ImgURL = ImgArrUnsplash[randomIndex]?.urls?.regular || ImgArrUnsplash[randomIndex]?.urls?.small

          const queImage = JSON.stringify({ imageURL: ImgURL, imageID: null });

          const dbPost = await appwriteService.updatePost(post?.$id, {
            ...data,
            queImage,
            pollQuestion,
            pollOptions: pollOptions?.map((obj) => JSON.stringify(obj)),
            trustedResponderPost: isAdmin
          }, categoryValue);

         
          setNotification({ message: "Post Updated", type: "success" })

        } catch (error) {
          setNotification({ message: "Post is Not Updated", type: "error" })
          return
        }
      }
      navigate("/");
    } else {

      const uploaderProfile = await profile.listProfile({ slug: userData?.$id });

      if (uploaderProfile?.total === 0) {
        setNotification({ message: "Your Profile is not Verified", type: "error" })
        return
      }

      if (initialPostData?.thumbnailFile) {
        try {
          const dbPost = await uploadQuestionWithImage(
            data,
            userData,
            initialPostData,
            uploaderProfile,
          )
          setNotification({ message: "Post Created", type: "success" })
          navigate(`/post/${dbPost?.$id}/null`)
        } catch (error) {
          console.log(error)
          setNotification({ message: "Post is not Created", type: "error" })
        }

      } else {
        const dbPost = await uploadPostWithUnsplashAPI(initialPostData, data, userData, uploaderProfile)
        if (dbPost) {
          setNotification({ message: "Post Created", type: "success" })
          navigate(`/post/${dbPost?.$id}/null`)
          return
        } else {
          setNotification({ message: "Post is not Created", type: "error" })
        }
      }
    }
    setInitialPostData((prev) => ({ ...prev, isUploading: false }))
  }


  return (

    <div className="py-3 px-3">

      <h3 className="text-center text-2xl lg:text-3xl mt-2">Got a Question? Ask Away!</h3>

      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col lg:flex-row gap-3 mt-4">

        <section className="flex flex-col gap-6 w-full md:w-[70%]">
          {/* title */}
          <div className="flex flex-col gap-3">
            <label htmlFor="Que_Title" className="font-bold">Title</label>
            <TextArea
              maxLength="250"
              id="Que_Title"
              placeholder="A Catchy , Title will get more attention. Max 250 Characters are Allowed."
              {...register("title", {
                required: false,
              })} />
          </div>
          {/* description */}
          <div className="flex flex-col gap-3">
            <label className="font-bold">Addtional Details (Optional)</label>
            <div className="Description_div">
              <RTE
                name="content"
                defaultValue={getValues("content")}
                control={control}
              />
            </div>
          </div>
          {/* opinion from */}
          <div className="flex flex-col gap-3">
            <label className="font-bold">Whom Opinion are You interested ?</label>
            <div className="flex justify-around">
              <div className="flex gap-3 items-center">
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
                <label htmlFor="Id1" className="cursor-pointer">Everyone</label>
              </div>
              <div className="flex gap-3 items-center">
                <Input
                  {...register('opinionsFrom')}
                  type="radio"
                  value="Responders"
                  defaultChecked={post && post?.opinionsFrom === 'Responders' ? true : false}
                  id="Id3"
                  name='opinionsFrom'
                  className='cursor-pointer'
                />
                <label htmlFor="Id3" className="cursor-pointer">Responders</label>
              </div>
            </div>

          </div>

        </section>

        <section className="flex flex-col w-full md:w-[30%]">
          {/* thumbnail */}
          <div className="flex flex-col justify-center items-center">
            <div id="AskQue_Thumbnail">
              {!thumbnailURL && <p className="text-center">Add thumbnail for Your Question or thumbnail will be set according to category
              </p>}
              {thumbnailURL && <img src={thumbnailURL} alt="thumbnail" />}
            </div>

            <div id="AskQue_Thumbnail_label" className="flex justify-around items-center gap-5">
              <label className={`AskQue_BrowseThumbnail`} htmlFor="BrowseThumbnail">{thumbnailURL ? `Change Image` : 'Browse Image'}</label>

              <Input className="hidden" type="file"
                name="thumbnailImage"
                accept="image/*"
                id="BrowseThumbnail"
                onChange={selectThumbnail} />

              {thumbnailURL && <span onClick={deleteThumbnail}>Remove Image</span>}
            </div>
          </div>
          {/* post type */}
          <div id="AskQue_PostType">
            <p className="cursor-pointer" >Select Post Type:</p>
            <div className="flex justify-start gap-6">
              <div>
                <label className={`cursor-pointer`} htmlFor="public">Public</label>
                <input
                  className="cursor-pointer"
                  {...register("status")}
                  type="radio"
                  name='status'
                  value="Public"
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
          {/* select category */}
          <div id="AskQue_SelectCategory">
            <p className={`mb-3`}>Select Category : </p>
            <div className="dropdown">
              <div className="dropdown-header flex items-center justify-between"
                onClick={categoryDropdownTrigger}>
                <span>{initialPostData?.categoryValue ? initialPostData?.categoryValue : `Select Item`}</span>
                <Icons.dropdown />
              </div>

              {categoryFlag && <ul className={`AskQue-dropdown-list flex flex-col`}>
                {categoriesArr?.map((object, index) => (
                  <li key={object.category + index} className="dropdown-item" onClick={() => selectPostCategory(object.category)}>{object.category}</li>
                ))}
              </ul>}
            </div>

          </div>
          {/* pole */}
          {<div id="AskQue_Pole" className={`mt-6 ${post && post.pollQuestion === '' ? 'invisible' : ""}`}>
            <span>Add Pole : (Optional) </span>

            <TextArea
              maxLength={100}
              placeholder='Ask Pole'
              className={`AskQue_Pole_TextArea`}
              value={`${post ? post?.pollQuestion : pollQuestion}`}
              onChange={poolQuestionChange}>
            </TextArea>

            <div className="w-full flex flex-col gap-1 mt-1">

              <div className="flex gap-3 h-8">
                <input
                  type="text"
                  className="border outline-none px-2 text-sm w-3/5"
                  value={options}
                  placeholder="options"
                  onChange={(e) => setInitialPostData((prev) => ({ ...prev, options: e.target?.value }))} />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPollOptions}
                  className="border p-1">
                  Add options
                </Button>
              </div>

              {pollOptions?.map((options, index) => {

                return <div className="w-full flex justify-start items-center" key={options.option}>

                  <span className={`w-3/4`} >{`${index + 1} ) ${options.option}`}</span>

                  <span className={`${post ? 'hidden' : ''}`}><i className={`fa-regular fa-trash-can cursor-pointer`} onClick={
                    () => {
                      setpollOptions((prev) => {
                        let arr = [...prev]
                        arr.splice(index, 1)
                        return [...arr]
                      })
                    }}></i></span>
                </div>
              })}
              <span className={`text-gray-500 ${pollOptions.length >= 2 ? null : 'hidden'} ${`${post ? 'hidden' : ''}`}`}>Maximum 4 Options Allowed</span>
              {!(pollOptions.length >= 2) && <span className={`text - gray - 500 ${pollOptions.length < 2 && !pollTextAreaEmpty ? null : 'invisible'} `}>Add Minimum 2 Options</span>}
            </div>

            <div className="flex gap-3 h-8 mt-3 items-center">
              <label htmlFor="">Opinion : </label>
              <input type="text" name="" id="" className="border outline-none px-2 py-1 text-sm w-4/6" placeholder="Poll Answer /  Opinion"
                {...register('pollAnswer', {
                  required: false
                })}
              />
            </div>

          </div>}
          {/* buttons */}
          <div>
            {isUploading ?
              <Button type="submit" className="askque_btn">
                {post ? "Updating..." : "Uploading..."}
              </Button>
              :
              <Button type="submit" className="askque_btn">
                {post ? "Update Your Question" : "Post Question"}
              </Button>}
          </div>
        </section>

      </form >
    </div>
  );
};

export default memo(AskQue);
