import "./AskQue.css";
import { toast } from "sonner"
import { Icons, RTE } from "../";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { categoryArr } from "./Category";
import { MAX_IMAGE_SIZE } from "@/constant";
import useCreatePost from "@/hooks/useCreatePost";
import useUpdatePost from "@/hooks/useUpdatePost";
import appwriteService from "../../appwrite/config";
import { Textarea as TextArea } from "../ui/textarea";
import React, { useEffect, useState, memo, useRef } from "react";

const AskQue = ({ post }) => {

  const optionsRef = useRef();
  const userStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state)=>state.auth.userData)

  // console.log(userData)

  const { handleSubmit, register, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        content: post?.content || "",
        pollAnswer: post?.pollAnswer || "",
        opinionsFrom: post?.opinionsFrom || "",
        category: post?.category || "General",
        pollQuestion: post?.pollQuestion || "",
      },
    });

  const [queImage, setQueImage] = useState(post?.queImage || {})
  const [pollOptions, setPollOptions] = useState(post?.pollOptions || [])

  const [file, setFile] = useState(null)
  const [fileView, setFileView] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { createPost } = useCreatePost()
  const { updatePost } = useUpdatePost()

  const selectThumbnail = async (e) => {

    const file = e.currentTarget.files[0]

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image Must be Less then and Equal to 512kb")
      e.currentTarget.value = ''
      return
    }

    setFile(file)

    const reader = new FileReader()
    reader.onload = () => {
      setFileView(reader.result)
    }

    reader.readAsDataURL(file)
  }

  useEffect(() => {

    if (post && post?.queImage) {

      // console.log(post.queImage)

      const { imageURL } = JSON.parse(post?.queImage || {})

      setFileView(imageURL?.replace("preview", "view"))

    }

  }, [])

  const deleteThumbnail = async () => {
    try {
      // console.log(post.queImage)
      const { imageID } = JSON.parse(post?.queImage)
      const response = await appwriteService.deleteThumbnail(imageID)
      await appwriteService.updatePost({ slug: post?.$id, payload: { queImage: null } })
    } catch (error) {
      const message = error instanceof Error ? error.message : error
      console.error(message)
    }
    setFile(null)
    setFileView('')
  }

  const addPollOptions = () => {

    if (post) {
      toast.error("You cannot edit Poll");
      return;
    }

    if (pollOptions.length >= 4) {
      toast("Maximum 4 options allowed");
      optionsRef.current.value = ""
      return;
    }

    const option = optionsRef.current.value.trim();
    if (!option) return

    setPollOptions([...pollOptions, { option, vote: 0 }]);
    optionsRef.current.value = ""

  };

  const deletePollOptions = (index) => setPollOptions(pollOptions.filter((_, i) => i !== index));

  const submit = async (data) => {

    if (!userStatus) {
      toast.error("You are not logged In")
      return
    }

    if (!data.title && !data.pollQuestion) {
      toast.error("Title or Poll Question is required")
      return
    }

    if (pollOptions.length > 0 && !data.pollQuestion) {
      toast.error("Poll Question is required")
      return
    }

    if (data.pollQuestion && pollOptions.length < 2) {
      toast.error("There must be 2 Poll options");
      return;
    }

    setIsLoading(true)

    data.trustedResponderPost = userData.labels.includes("admin")
    data.queImage = queImage
    data.pollOptions = pollOptions.map((obj) => JSON.stringify(obj)) || []

    // console.log(data)
    // return

    if (post) {

      const oldPost = await appwriteService.getPost(post?.$id)
      await updatePost({ data, file, oldPost })

    } else {
      await createPost({ data, file })
    }

    setIsLoading(false)

  }


  return (

    <div className="py-3 px-3">

      <h3 className="text-center text-2xl lg:text-3xl mt-2">Got a Question? Ask Away!</h3>

      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col lg:flex-row gap-3 mt-4">

        <section className="flex flex-col gap-6 w-full">
          {/* title */}
          <div className="flex flex-col gap-3">
            <label htmlFor="Que_Title" className="font-bold">Title</label>
            <TextArea
              maxLength="250"
              className="h-[100px]"
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

        <section className="flex flex-col w-full lg:w-[40%]">
          {/* thumbnail */}
          <div className="flex flex-col justify-center items-center">
            <div id="AskQue_Thumbnail">
              {!fileView && <p className="text-center">Add thumbnail for Your Question or thumbnail will be set according to category
              </p>}
              {fileView && <img src={fileView} alt="thumbnail" />}
            </div>

            <div id="AskQue_Thumbnail_label" className="flex justify-around items-center gap-5">

              <label className="AskQue_BrowseThumbnail" htmlFor="BrowseThumbnail">
                {fileView ? `Change Image` : 'Browse Image'}
              </label>

              <input className="hidden"
                type="file"
                name="thumbnailImage"
                accept="image/*"
                id="BrowseThumbnail"
                onChange={selectThumbnail}
              />

              {fileView && <span onClick={deleteThumbnail}>Remove Image</span>}
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
              <select {...register("category", {
                required: true
              })}>
                {categoryArr.map((object) => (
                  <option
                    key={object.category}
                    value={object.category}>
                    {object.category}
                  </option>
                ))}
              </select>

            </div>
          </div>
          {/* pole */}
          {<div id="AskQue_Pole" className={`mt-6 ${post && post.pollQuestion === '' ? 'invisible' : ""}`}>
            <span>Add Pole : (Optional) </span>

            <TextArea
              maxLength={100}
              placeholder='Ask Pole'
              className={`AskQue_Pole_TextArea`}
              {...register("pollQuestion", {
                required: false
              })}
            >
            </TextArea>

            <div className="w-full flex flex-col gap-1 mt-1">

              <div className="flex gap-3 h-8">
                <input
                  ref={optionsRef}
                  type="text"
                  className="border outline-none px-2 text-sm w-3/5"
                  placeholder="options"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPollOptions}
                  className="border p-1">
                  Add options
                </Button>
              </div>

              {pollOptions.map((options, index) => {
                return <div className="w-full flex justify-start items-center" key={options}>
                  <span className={`w-3/4`} >{`${index + 1} ) ${options}`}</span>
                  {!post && <span onClick={() => deletePollOptions(index)}><Icons.trashcan /></span>}
                </div>
              })}

              <span className={`text-gray-500 ${pollOptions.length >= 2 ? null : 'hidden'} ${`${post ? 'hidden' : ''}`}`}>Maximum 4 Options Allowed</span>
              {!(pollOptions.length >= 2) && <span className={`text-gray-500`}>Add Minimum 2 Options</span>}
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
            {isLoading ?
              <Button type="submit" className="askque_btn">
                <Spinner />
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
