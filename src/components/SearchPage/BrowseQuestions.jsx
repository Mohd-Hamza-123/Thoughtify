import React, { useEffect, useState, useRef } from 'react'
import "./BrowseQuestions.css"
import { UpperNavigationBar, HorizontalLine, Input, Button, LowerNavigationBar, Spinner } from '../index'
import { categoriesArr } from '../AskQue/Category'
import appwriteService from '../../appwrite/config'
import { useDispatch, useSelector } from 'react-redux'
import { getQueriesInRedux } from '../../store/queries'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { useAskContext } from '../../context/AskContext'

const BrowseQuestions = () => {
  const { category, searchInput } = useParams()
  // console.log(category)
  // console.log(searchInput)

  const { register, handleSubmit, setValue, reset, getValues } = useForm({})

  const [queries, setQueries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // console.log('IsLoading : ' + isLoading)
  let spinnerRef = useRef();
  const [lastPostID, setLastPostID] = useState(null)
  // console.log(lastPostID)
  // const [submitData, setSubmitData] = useState({})
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [totalFilteredQueries, settotalFilteredQueries] = useState(0)

  // console.log('isIntersecting : ' + isIntersecting)
  const { hasMorePostsInBrowseQuestions,
    sethasMorePostsInBrowseQuestions } = useAskContext()
  const [isPostAvailable, setisPostAvailable] = useState(true)

  const submit = async (data) => {
    console.log(data)
    // return
    sethasMorePostsInBrowseQuestions(true)
    const filteredQuestions = await appwriteService.getPostsWithQueries({ ...data })
    // console.log(filteredQuestions)
    const isArray = Array.isArray(filteredQuestions)

    if (isArray) {
      sethasMorePostsInBrowseQuestions(false)
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
  }

  useEffect(() => {
    if (queries.length >= totalFilteredQueries) {
      setIsLoading(false)
      sethasMorePostsInBrowseQuestions(false)
      setLastPostID((prev) => null)
    } else {
      setLastPostID((prev) => queries[queries.length - 1]?.$id)
      setIsLoading(true)
      sethasMorePostsInBrowseQuestions(true)
    }
  }, [queries, isIntersecting, isLoading])

  useEffect(() => {
    // console.log("bye")
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
    // console.log(searchInput)
    // console.log(category)
    if (category !== 'null') {
      // console.log("hi")
      setValue("category", category);
      const data = getValues()
      // console.log(data)
      submit(data)
    } else if (searchInput !== 'null') {
      setValue("Title", searchInput);
      const data = getValues()
      // console.log(data)
      submit(data)
    }
  }, [searchInput])
  return (
    <div id='BrowseQuestions'>
      <UpperNavigationBar />
      <HorizontalLine />
      <LowerNavigationBar />
      <strong id='BrowseQuestions_SearchQuestion_Heading' className='flex justify-center'>Filter Questions</strong>
      <div className='flex gap-2'>

        <form id='BrowseQuestions_Filters' className='w-full flex flex-col gap-5 p-3 relative' onSubmit={handleSubmit(submit)}>

          <div id='BrowseQuestions_PostTitle'>
            <p>Filter by Post Title :</p>
            <div className='flex gap-2'>
              <label htmlFor='BrowseQuestions_PostTitle_Filter'>Title : </label>
              <Input {...register("Title", {
                required: false
              })} id='BrowseQuestions_PostTitle_Filter' placeholder="Title" />
            </div>
          </div>

          <div>
            <p>Filter By Views :</p>
            <div className='flex flex-col gap-1'>
              <div className='flex gap-2'>
                <input {...register("Viewed")} type="radio" name="Viewed" id="BrowseQuestions_Most_Viewed" value={'MostViewed'} />
                <label htmlFor='BrowseQuestions_Most_Viewed'>Most Viewed</label>
              </div>
              <div className='flex gap-2'>
                <input {...register("Viewed")} type="radio" name="Viewed" id="BrowseQuestions_Less_Viewed" value={'lessViewed'} />
                <label htmlFor='BrowseQuestions_Less_Viewed'>Less Viewed</label>
              </div>
            </div>
          </div>

          <div>
            <p>Filter By Post Age :</p>
            <div className='flex flex-col gap-1'>
              <div className='flex gap-2'>
                <input  {...register("PostAge")} id="BrowseQuestion_PostAge_Recent" type="radio" name="PostAge" value={'Recent'} />
                <label className="cursor-pointer" htmlFor='BrowseQuestion_PostAge_Recent'>Recent</label>
              </div>
              <div className='flex gap-2'>
                <input {...register("PostAge")} id="BrowseQuestion_PostAge_Oldest" type="radio" name="PostAge" value={'Oldest'} />
                <label className="cursor-pointer" htmlFor='BrowseQuestion_PostAge_Oldest'>Oldest</label>
              </div>
            </div>
          </div>


          <div>
            <p>Filter By Comment :</p>
            <div className='flex flex-col gap-1'>
              <div className='flex gap-2'>
                <input  {...register("Commented")} id="BrowseQuestion_Most_Commented" type="radio" name="Commented" value={'Most Commented'} />
                <label className="cursor-pointer" htmlFor='BrowseQuestion_Most_Commented'>Most Commented</label>
              </div>
              <div className='flex gap-2'>
                <input {...register("Commented")} id="BrowseQuestion_Least_Commented" type="radio" name="Commented" value={'Least Commented'} />
                <label className="cursor-pointer" htmlFor='BrowseQuestion_Least_Commented'>Least Commented</label>
              </div>
            </div>
          </div>





          <div>
            <div>
              <p>Favourite : </p>
            </div>
            <div className='flex gap-2'>
              <input type="radio" {...register("Like_Dislike")} name="Like_Dislike" id="BrowseQuestion_Liked" value={'Most Liked'} />
              <label htmlFor="BrowseQuestion_Liked">Most liked</label>
            </div>
            <div className='flex gap-2'>
              <input type="radio"  {...register("Like_Dislike")} name="Like_Dislike" id="BrowseQuestion_Disliked" value={'Most Disliked'} />
              <label htmlFor="BrowseQuestion_Disliked">Most disliked</label>
            </div>
          </div>

          <div>
            <p>Filter By Category : </p>
            <div id='BrowseQuestions_Category' className='flex gap-2'>
              <label htmlFor="">Category : </label>
              <select name="category" {...register("category")} id="" className='outline-none'>
                <option defaultChecked value={'All Category'}>All Category</option>
                {categoriesArr?.map((category, index) => (
                  <option key={category.category + index}>{category.category}</option>
                ))}
              </select>
            </div>
          </div>

          <div id='BrowseQuestions_FilterByDate'>
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

          <Button type='Submit' className='BrowseQuestions_ApplyFilter'>Apply Filter</Button>
          <input type='reset' onClick={() => {
            reset()
            sethasMorePostsInBrowseQuestions(false)
          }} value={'Reset Filter'} className='BrowseQuestions_ResentFilter' />
        </form>


        <div id='BrowseQuestions_Filtered_Questions'>
          {!isPostAvailable && <p className='text-center'>No Posts Available</p>}
          {queries?.map((querie, index) => {
            if (isPostAvailable !== true) {
              return
            }
            return <div key={querie.$id}>
              <span className={`${querie.gender === 'female' ? 'text-pink-600' : 'text-blue-900'}`}>{querie.name}</span>

              <Link to={`/post/${querie.$id}/${null}`}>
                <p>{querie.title}</p>
                <div id='BrowseQuestions_created_category_views' className='flex gap-3'>
                  <span>{new Date(querie.$createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>{querie.category}</span>
                  <div className='flex justify-center items-center'>
                    <span>{querie.views}</span>
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

          {(isLoading && hasMorePostsInBrowseQuestions) && <section ref={spinnerRef} className='flex justify-center'>
            <Spinner />
          </section>}
        </div>


      </div>
    </div>
  )
}

export default BrowseQuestions