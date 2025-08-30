import './Opinions.css'
import { Spinner } from '../'
import parse from "html-react-parser";
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button.jsx'
import { useSelector } from 'react-redux'
import realTime from '../../appwrite/realTime.js'
import { categoriesArr } from '../AskQue/Category'
import React, { useRef, useState, useEffect } from 'react'

const Opinions = ({ visitedProfileUserID }) => {

  const spinnerRef = useRef()
  const [comments, setcomments] = useState([]);

  const userData = useSelector((state) => state.auth.userData);

  const { register, handleSubmit, reset, getValues } = useForm({})

  const opinionsLeft = useRef()
  const opinionsRight = useRef()

  const submit = async (data) => {
    setisSearching((prev) => true);


    if (visitedProfileUserID !== userData?.$id) {
      const visitedProfileUserData = othersUserProfile?.find((profile) => profile?.userIdAuth === visitedProfileUserID);

      if (!visitedProfileUserData) return

      if (visitedProfileUserData?.othersCanFilterYourPosts === "My Following") {
        const parsingFollowingArr = visitedProfileUserData?.following.map((obj) => JSON.parse(obj));

        const isHeFollowsYou = parsingFollowingArr?.find((follows) => follows?.profileID === userData?.$id);

        if (!isHeFollowsYou) {
          setNotificationPopMsgNature((prev) => false);
          setnotificationPopMsg((prev) => "You can't filter");
          return
        }
      } else if (visitedProfileUserData?.othersCanFilterYourPosts === "None") {
        setNotificationPopMsgNature((prev) => false);
        setnotificationPopMsg((prev) => 'No one can filter');
        return
      }

    }

    data.UserID = visitedProfileUserID

    sethasMorePostsInProfileFilterOpinions(true)
    const filteredOpinions = await realTime.getCommentsWithQueries({ ...data })

    const isArray = Array.isArray(filteredOpinions)
    if (isArray) {
      sethasMorePostsInProfileFilterOpinions(false)
      setIsLoading(false)
      settotalFilteredcomments(0)
      setLastPostID(null)
      setisPostAvailable(false)
    } else {
      setIsLoading(true)
      setisPostAvailable(true)
      if (filteredOpinions.documents.length > 0) {
        settotalFilteredcomments(filteredOpinions.total)
        setcomments((prev) => filteredOpinions.documents)
      } else {
        settotalFilteredcomments(0)
        setcomments((prev) => [])
        setisPostAvailable(false)
      }
    }


    setisSearching((prev) => false)

    if (opinionsLeft.current && opinionsRight.current && window.innerWidth <= 500) {
      opinionsLeft.current.classList.toggle("none");

    }
  }



  useEffect(() => {
    const ref = spinnerRef.current;
    if (ref) {
      const observer = new IntersectionObserver(([entry]) => {

      }, {
        root: null,
        rootMargin: '0px',
        threshold: 1
      })

      observer.observe(ref)
      return () => ref && observer.unobserve(ref)
    }

  }, [spinnerRef.current, comments])


  return (
    <div id='Profile_Opinions_Filter'>
      <div
        onClick={() => {
          if (opinionsLeft.current && opinionsRight.current) {
            opinionsLeft.current.classList.toggle("none");
          }
        }}
        className="Home_RIGHT_LEFT_Grid_div">
        <button
          className="flex justify-center items-center">
          <i className='bx bxs-grid-alt'></i>
        </button>
      </div>
      <form
        ref={opinionsLeft}
        id='Profile_Filter_Opinions_Form' className='w-full flex flex-col gap-5 p-3 relative' onSubmit={handleSubmit(submit)}>

        <div>
          <p>Filter By Post Age :</p>
          <div className='flex flex-col gap-1'>
            <div className='flex gap-2'>
              <input  {...register("PostAge")} id="Profile_Opinions_PostAge_Recent" type="radio" name="PostAge" value={'Recent'} />
              <label className="cursor-pointer" htmlFor='Profile_Opinions_PostAge_Recent'>Recent</label>
            </div>
            <div className='flex gap-2'>
              <input {...register("PostAge")} id="Profile_Opinions_PostAge_Oldest" type="radio" name="PostAge" value={'Oldest'} />
              <label className="cursor-pointer" htmlFor='Profile_Opinions_PostAge_Oldest'>Oldest</label>
            </div>
          </div>
        </div>



        <div>
          <p>Filter By Category : </p>
          <div id='Profile_Opinions_Category' className='flex gap-2'>
            <label htmlFor="">Category : </label>
            <select name="category" {...register("category")} id="" className='outline-none'>
              <option defaultChecked value={'All Category'}>All Category</option>
              {categoriesArr?.map((category, index) => (
                <option key={category.category + index}>{category.category}</option>
              ))}
            </select>
          </div>
        </div>

        <div id='Profile_Opinions_FilterByDate'>
          <p>Filter By Date : </p>
          <div className='flex flex-col gap-3'>


            <div className='flex gap-1'>
              <label className='' htmlFor="AfterDate">After Date :</label>
              <input {...register("AfterDate", {
                required: false
              })} type="date" name="AfterDate" id="AfterDate" />
            </div>

            <div className='flex gap-1'>
              <label className='' htmlFor="BeforeDate">Before Date :</label>
              <input type="date" name="BeforeDate" id="BeforeDate" {...register("BeforeDate")} />
            </div>
          </div>
        </div>

        <Button type='Submit' className={`Profile_Opinions_ApplyFilter`}>{`${true ? 'Searching' : 'Apply Filter'}`}</Button>
        <input type='reset'
          onClick={() => {
            reset()
          }}
          value={'Reset Filter'}
          className={`Profile_Opinions_ResentFilter`} />
      </form>


      <div
        ref={opinionsRight}
        id='Profile_Opinions_Filtered_Questions'>
        {true && <p className={`text-center`}>No Posts Available</p>}
        {comments?.map((comment, index) => {
          if (isPostAvailable !== true) {
            return
          }
          return <div className={`Profile_Opinions_Comments ${isDarkModeOn ? 'darkMode' : ''}`} onClick={() => increaseViews(comment?.postid)} key={comment?.$id}>
            <span className={`${isDarkModeOn ? 'text-red-600' : 'first-letter:'}`}>{comment?.name}</span>

            <Link to={`/post/${comment?.postid}/${comment?.$id}`}>
              <article>{parse(comment?.commentContent)}</article>
              <div id='BrowseQuestions_created_category_views' className='flex gap-3 flex-wrap'>
                <span className={`text-black`}>{new Date(comment?.$createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className={`text-black`}>{comment?.category}</span>

                <div>
                  <i className="fa-solid fa-comments"></i>
                  <span>{comment?.subComment?.length}</span>
                </div>

              </div>
            </Link>
          </div>
        })}

        {true && <section ref={spinnerRef} className='flex justify-center'>
          <Spinner />
        </section>}
      </div>

    </div>
  )
}

export default Opinions