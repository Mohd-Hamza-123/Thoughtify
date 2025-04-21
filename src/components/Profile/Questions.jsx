import React, { useRef, useState, useEffect } from 'react'
import './Questions.css'
import appwriteService from '../../appwrite/config'
import { Spinner } from '../'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { categoriesArr } from '../AskQue/Category'
import { useAskContext } from '../../context/AskContext'
import { getTotalPostByMe } from '../../store/profileSlice'
const Questions = ({ visitedProfileUserID }) => {
  const TotalPostByMe = useSelector((state) => state.profileSlice?.totalPostsbyMe)
  const dispatch = useDispatch()


  const spinnerRef = useRef()
  const [isLoading, setIsLoading] = useState(false)
  const [queries, setQueries] = useState([]);

  const [lastPostID, setLastPostID] = useState(null)
  const [isPostAvailable, setisPostAvailable] = useState(true)
  const [totalFilteredQueries, settotalFilteredQueries] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isSearching, setIsSearching] = useState(false)
  const {
    hasMorePostsInProfileFilterQuestions,
    sethasMorePostsInProfileFilterQuestions,
    isDarkModeOn,
    savedMyProfilePosts,
    setSavedMyProfilePosts,
    setnotificationPopMsg,
    setNotificationPopMsgNature,
  } = useAskContext()

  const QuestionsLeft = useRef()
  const QuestionRight = useRef()

  const userData = useSelector((state) => state.auth.userData);
  const othersUserProfile = useSelector((state) => state?.usersProfileSlice?.userProfileArr);
  const { register, handleSubmit, reset, getValues } = useForm({})
  const [totalNumberofPosts, settotalNumberofPosts] = useState(0);

  const submit = async (data) => {

    if (visitedProfileUserID !== userData?.$id) {
      const visitedProfileUserData = othersUserProfile?.find((profile) => profile?.userIdAuth === visitedProfileUserID);


      if (!visitedProfileUserData) return

      if (visitedProfileUserData?.othersCanFilterYourPosts === "My Following") {
        const parsingFollowingArr = visitedProfileUserData?.following.map((obj) => JSON.parse(obj));
        console.log(parsingFollowingArr);
        const isHeFollowsYou = parsingFollowingArr?.find((follows) => follows?.profileID === userData?.$id);
        console.log(isHeFollowsYou);
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

    setIsSearching((prev) => true)

    data.UserID = visitedProfileUserID

    sethasMorePostsInProfileFilterQuestions(true)
    const filteredQuestions = await appwriteService.getPostsWithQueries({ ...data })

    const isArray = Array.isArray(filteredQuestions)
    if (isArray) {
      sethasMorePostsInProfileFilterQuestions(false)
      setIsLoading(false)
      settotalFilteredQueries(0)
      setLastPostID(null)
      setisPostAvailable(false)
    } else {
      setIsLoading(true)
      setisPostAvailable(true)
      if (filteredQuestions.documents.length > 0) {
        settotalFilteredQueries(filteredQuestions.total)
        setQueries((prev) => filteredQuestions.documents)
      } else {
        settotalFilteredQueries(0)
        setQueries((prev) => [])
        setisPostAvailable(false)
      }
    }

    setIsSearching((prev) => false)
    if (QuestionsLeft.current && QuestionRight.current && window.innerWidth < 500) {
      QuestionsLeft.current.classList.toggle("none");
    }
  }

  useEffect(() => {
    if (queries?.length >= totalFilteredQueries) {
      setIsLoading(false)
      sethasMorePostsInProfileFilterQuestions(false)
      setLastPostID((prev) => null)
    } else {
      setLastPostID((prev) => queries[queries?.length - 1]?.$id)
      setIsLoading(true)
      sethasMorePostsInProfileFilterQuestions(true)
    }

    if (queries?.length > 0) setSavedMyProfilePosts((prev) => queries)
  }, [queries, isIntersecting, isLoading])
  useEffect(() => {

    const getMoreQueries = async () => {
      const data = getValues()
      const filteredQuestions = await appwriteService.getPostsWithQueries({ ...data, lastPostID })
      console.log(filteredQuestions)
      if (filteredQuestions.length !== 0) {
        setQueries((prev) => [...prev, ...filteredQuestions.documents])
      }

    }

    if (isIntersecting) {
      if (lastPostID !== null) {
        getMoreQueries()
      }
    }
  }, [isIntersecting])
  useEffect(() => {
    const ref = spinnerRef.current;
    if (ref) {
      const observer = new IntersectionObserver(([entry]) => {

        setIsIntersecting((prev) => entry.isIntersecting)
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 1
      })

      observer.observe(ref)
      return () => ref && observer.unobserve(ref)
    }

  }, [spinnerRef.current, queries, lastPostID, totalFilteredQueries])

  useEffect(() => {
    if (TotalPostByMe == 0) {
      appwriteService
        .getPosts({ lastPostID: null, TrustedResponders: null })
        .then((res) => {
          if (!res) return
          settotalNumberofPosts((prev) => res?.total)
          dispatch(getTotalPostByMe({ totalPostsbyMe: res?.total }))
        })
    } else {
      settotalNumberofPosts((prev) => TotalPostByMe)
    }
  }, []);
  useEffect(() => {
    if (savedMyProfilePosts?.length > 0) {
      setQueries((prev) => savedMyProfilePosts)
    }
  }, []);


  return (

    <div id='Profile_Questions_Filter' className='flex'>
      <div
        onClick={() => {
          if (QuestionsLeft.current && QuestionRight.current) {
            QuestionsLeft.current.classList.toggle("none");
          }
        }}
        className="Home_RIGHT_LEFT_Grid_div">
        <button
          className="flex justify-center items-center">
          <i className='bx bxs-grid-alt'></i>
        </button>
      </div>
      <form
        ref={QuestionsLeft}
        id='Profile_Filter_Questions_Form' className={`w-full flex flex-col gap-5 p-3 relative ${isDarkModeOn ? 'darkMode' : ''}`} onSubmit={handleSubmit(submit)}>

        <div id='Profile_Questions_Title'>
          <p className={`${isDarkModeOn ? 'text-white' : 'text-black'}`}>Filter by Post Title :</p>
          <div className='flex gap-2'>
            <label htmlFor='Profile_Questions_Title_Filter'>Title : </label>
            <Input {...register("Title", {
              required: false
            })} id='Profile_Questions_Title_Filter' placeholder="Title" />
          </div>
        </div>

        <div>
          <p>Filter By Views :</p>
          <div className='flex flex-col gap-1'>
            <div className='flex gap-2'>
              <input {...register("Viewed")} type="radio" name="Viewed" id="Profile_Questions_Most_Viewed" value={'MostViewed'} />
              <label htmlFor='Profile_Questions_Most_Viewed'>Most Viewed</label>
            </div>
            <div className='flex gap-2'>
              <input {...register("Viewed")} type="radio" name="Viewed" id="Profile_Questions_Less_Viewed" value={'lessViewed'} />
              <label htmlFor='Profile_Questions_Less_Viewed'>Less Viewed</label>
            </div>
          </div>
        </div>

        <div>
          <p>Filter By Post Age :</p>
          <div className='flex flex-col gap-1'>
            <div className='flex gap-2'>
              <input  {...register("PostAge")} id="Profile_Questions_PostAge_Recent" type="radio" name="PostAge" value={'Recent'} />
              <label className="cursor-pointer" htmlFor='Profile_Questions_PostAge_Recent'>Recent</label>
            </div>
            <div className='flex gap-2'>
              <input {...register("PostAge")} id="Profile_Questions_PostAge_Oldest" type="radio" name="PostAge" value={'Oldest'} />
              <label className="cursor-pointer" htmlFor='Profile_Questions_PostAge_Oldest'>Oldest</label>
            </div>
          </div>
        </div>


        <div>
          <p>Filter By Comment :</p>
          <div className='flex flex-col gap-1'>
            <div className='flex gap-2'>
              <input  {...register("Commented")} id="Profile_Questions_Most_Commented" type="radio" name="Commented" value={'Most Commented'} />
              <label className="cursor-pointer" htmlFor='Profile_Questions_Most_Commented'>Most Commented</label>
            </div>
            <div className='flex gap-2'>
              <input {...register("Commented")} id="Profile_Questions_Least_Commented" type="radio" name="Commented" value={'Least Commented'} />
              <label className="cursor-pointer" htmlFor='Profile_Questions_Least_Commented'>Least Commented</label>
            </div>
          </div>
        </div>





        <div>
          <div>
            <p>Favourite : </p>
          </div>
          <div className='flex gap-2'>
            <input type="radio" {...register("Like_Dislike")} name="Like_Dislike" id="Profile_Questions_Liked" value={'Most Liked'} />
            <label htmlFor="Profile_Questions_Liked">Most liked</label>
          </div>
          <div className='flex gap-2'>
            <input type="radio"  {...register("Like_Dislike")} name="Like_Dislike" id="Profile_Questions_Disliked" value={'Most Disliked'} />
            <label htmlFor="Profile_Questions_Disliked">Most disliked</label>
          </div>
        </div>

        <div>
          <p>Filter By Category : </p>
          <div id='Profile_Questions_Category' className='flex gap-2'>
            <label htmlFor="">Category : </label>
            <select name="category" {...register("category")} id="" className='outline-none'>
              <option defaultChecked value={'All Category'}>All Category</option>
              {categoriesArr?.map((category, index) => (
                <option key={category.category + index}>{category.category}</option>
              ))}
            </select>
          </div>
        </div>

        <div id='Profile_Questions_FilterByDate'>
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

        <Button type='Submit' className={`Profile_Questions_ApplyFilter ${isDarkModeOn ? 'darkMode' : ''}`}>{isSearching ? 'Searching' : 'Apply Filter'}</Button>
        <input type='reset' onClick={() => {
          reset()
          setNotificationPopMsgNature((prev) => true)
          setnotificationPopMsg((prev) => "Filter Cleared")
        }} value={'Reset Filter'} className={`Profile_Questions_ResentFilter ${isDarkModeOn ? 'darkMode' : ''}`} />
      </form>
      <div
        ref={QuestionRight}
        id='Profile_Questions_Filtered_Questions' className={`${isDarkModeOn ? 'darkMode' : ''}`}>

        {!isPostAvailable && <p className='text-center'>No Posts Available</p>}
        {queries?.map((querie, index) => {
          if (isPostAvailable !== true) {
            return
          }
          return <div key={querie?.$id}>
            <span>{querie?.name}</span>

            <Link to={`/post/${querie?.$id}/${null}`}>
              <p>{querie?.title}</p>
              <div id='BrowseQuestions_created_category_views' className='flex gap-3 flex-wrap'>
                <span className={`${isDarkModeOn ? 'text-black' : 'text-black'}`}>{new Date(querie?.$createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className={`${isDarkModeOn ? 'text-black' : 'text-black'}`}>{querie?.category}</span>
                <div className='flex justify-center items-center'>
                  <span>{querie?.views}</span>
                  <i className=" fa-solid fa-eye" aria-hidden="true"></i>
                </div>
                <div>
                  <span>{querie.commentCount}</span>
                  <i className="fa-solid fa-comment"></i>
                </div>
                <div>
                  <span>{querie?.like}</span>
                  <i className="fa-solid fa-thumbs-up"></i>
                </div>

                <div>
                  <span>{querie?.dislike}</span>
                  <i className="fa-solid fa-thumbs-down"></i>
                </div>
              </div>
            </Link>
          </div>
        })}

        {(isLoading && hasMorePostsInProfileFilterQuestions) && <section ref={spinnerRef} className='flex justify-center'>
          <Spinner />
        </section>}
      </div>

    </div>
  )
}

export default Questions