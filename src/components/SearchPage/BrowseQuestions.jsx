import React, { useEffect, useState } from 'react'
import "./BrowseQuestions.css"
import { Query } from 'appwrite'
import { UpperNavigationBar, HorizontalLine, Input, Button, LowerNavigationBar } from '../index'
import { categoriesArr } from '../AskQue/Category'
import appwriteService from '../../appwrite/config'
import { useDispatch, useSelector } from 'react-redux'
import { getQueriesInRedux } from '../../store/queries'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
const BrowseQuestions = () => {
  const { category } = useParams()
  const queries = useSelector((state) => state.queriesSlice.queries);
  const { register, handleSubmit, setValue } = useForm({})
  const dispatch = useDispatch();

  const submit = async (data) => {
    console.log(data)


    const filteredQuestions = await appwriteService.getPostsWithQueries({ ...data })
    if (filteredQuestions) {
      // console.log(filteredQuestions)
      dispatch(getQueriesInRedux({ queries: filteredQuestions.documents }))
    } else {
      console.log("No Data")
    }


  }

  const getQueries = async () => {
    const queries = await appwriteService.getPosts();
    dispatch(getQueriesInRedux({ queries: queries.documents }))
  }
  useEffect(() => {
    // if (queries.length === 0) {
    //   getQueries()
    // }
  }, [])

  return (
    <>
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
              <select name="" {...register("category")} id="" className='outline-none'>
                <option value={'Select Category'}>Select Category</option>
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
          <input type='reset' value={'Reset Filter'} className='BrowseQuestions_ResentFilter' />
        </form>


        <div id='BrowseQuestions_Filtered_Questions'>
          {queries?.map((querie, index) => (
            <div key={querie.$id}>
              <span className={`${querie.gender === 'female' ? 'text-pink-600' : 'text-blue-900'}`}>{querie.name}</span>

              <Link to={`/post/${querie.$id}`}>
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
                </div>
              </Link>
            </div>
          ))}

        </div>


      </div>
    </>
  )
}

export default BrowseQuestions