import { Spinner } from '../'
import parse from "html-react-parser";
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button.jsx'
import { useSelector } from 'react-redux'
import realTime from '../../appwrite/realTime.js'
import { categoriesArr } from '../AskQue/Category'
import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query';

const Opinions = ({ visitedProfileUserID }) => {

  const spinnerRef = useRef()
  const opinionsLeft = useRef()
  const opinionsRight = useRef()
  const { register, handleSubmit, reset } = useForm()
  const userData = useSelector((state) => state.auth.userData);
  const [filters, setFilters] = useState({ userID: visitedProfileUserID })

  const { data = [], hasNextPage, fetchNextPage, isLoading, refetch } = useInfiniteQuery({
    queryKey: ['opinions', visitedProfileUserID, filters],
    queryFn: async ({ queryKey, pageParam }) => {
    
      const filteredOpinions = await realTime.getCommentsWithQueries({ ...filters, lastPostID: pageParam })
      
      const documents = filteredOpinions.documents
      const documentsLength = documents.length;
      return {
        documents,
        nextCursor: documentsLength ? documents[documentsLength - 1].$id : undefined
      }
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const comments = useMemo(() => data.pages?.flatMap((page) => page.documents), [data])

  const submit = async (data) => {
    data.userID = visitedProfileUserID
    setFilters(data)
    refetch()
  }

  useEffect(() => {
    const ref = spinnerRef.current;
    if (ref) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) fetchNextPage()
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      })

      observer.observe(ref)
      return () => ref && observer.unobserve(ref)
    }

  }, [hasNextPage, fetchNextPage, data])

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div
        onClick={() => {
          if (opinionsLeft.current && opinionsRight.current) {
            opinionsLeft.current.classList.toggle("none");
          }
        }}
        className="Home_RIGHT_LEFT_Grid_div mb-4 flex justify-end lg:hidden"
      >
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:shadow-md active:scale-[0.98] dark:bg-gray-900 dark:border-gray-800"
        >
          <i className='bx bxs-grid-alt text-lg' />
          <span className="hidden sm:inline">Toggle Filters</span>
        </button>
      </div>

      <section className="flex flex-col lg:flex-row gap-3">
        {/* Left: Filters */}
        <form
          ref={opinionsLeft}
          id='Profile_Filter_Opinions_Form'
          className="w-full lg:w-[30%] flex flex-col gap-6 rounded-md border border-gray-200 bg-white p-4 sm:p-3 shadow-sm dark:bg-gray-900 dark:border-gray-800"
          onSubmit={handleSubmit(submit)}
        >
          <div className="mt-2 flex items-center gap-3">
            <Button
              type='Submit'
              className={`Profile_Opinions_ApplyFilter inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-[0.98]`}>
              {`${isLoading ? 'Searching' : 'Apply Filter'}`}
            </Button>

            <input
              type='reset'
              onClick={() => { reset() }}
              value={'Reset Filter'}
              className="Profile_Opinions_ResentFilter cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98] dark:bg-gray-950 dark:border-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="border-b border-gray-200 pb-2 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter By Post Age :</p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor='Profile_Opinions_PostAge_Recent' className="inline-flex items-center gap-2 cursor-pointer">
              <input {...register("PostAge")} id="Profile_Opinions_PostAge_Recent" type="radio" name="PostAge" value={'Recent'}
                className="h-4 w-4 accent-blue-600" />
              <span className="text-sm text-gray-700 dark:text-gray-200">Recent</span>
            </label>

            <label htmlFor='Profile_Opinions_PostAge_Oldest' className="inline-flex items-center gap-2 cursor-pointer">
              <input {...register("PostAge")} id="Profile_Opinions_PostAge_Oldest" type="radio" name="PostAge" value={'Oldest'}
                className="h-4 w-4 accent-blue-600" />
              <span className="text-sm text-gray-700 dark:text-gray-200">Oldest</span>
            </label>
          </div>

          <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
            <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">Filter By Category :</p>
            <div id='Profile_Opinions_Category' className='flex items-center gap-3'>
              <label className="text-sm text-gray-600 dark:text-gray-300">Category</label>
              <select
                name="category" {...register("category")}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-200'
              >
                <option defaultChecked value={'All Category'}>All Category</option>
                {categoriesArr?.map((category, index) => (
                  <option key={category.category + index}>{category.category}</option>
                ))}
              </select>
            </div>
          </div>

          <div id='Profile_Opinions_FilterByDate' className="border-t border-gray-200 pt-4 dark:border-gray-800">
            <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">Filter By Date :</p>

            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-3'>
                <label htmlFor="AfterDate" className='w-28 text-sm text-gray-600 dark:text-gray-300'>After Date</label>
                <input
                  {...register("AfterDate", { required: false })}
                  type="date" name="AfterDate" id="AfterDate"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-200"
                />
              </div>

              <div className='flex items-center gap-3'>
                <label htmlFor="BeforeDate" className='w-28 text-sm text-gray-600 dark:text-gray-300'>Before Date</label>
                <input
                  type="date" name="BeforeDate" id="BeforeDate" {...register("BeforeDate")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
          </div>


        </form>

        {/* Right: Results */}
        <div
          ref={opinionsRight}
          className="flex-1 rounded-2xl border border-dashed border-gray-200 p-4 sm:p-6 min-h-[320px] bg-gray-50 dark:bg-gray-950 dark:border-gray-800"
        >
          {comments?.length === 0 && (
            <p className="text-center text-sm font-semibold text-gray-600 dark:text-gray-300">
              No Posts Available
            </p>
          )}

          {comments?.map((comment, index) => {
            return (
              <div
                className={`Profile_Opinions_Comments group mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-gray-900 dark:border-gray-800`}
                onClick={() => increaseViews(comment?.postid)}
                key={comment?.$id}
              >
                <span className={`block text-sm font-semibold`}>
                  {comment?.name}
                </span>

                <Link to={`/post/${comment?.postid}/${comment?.$id}`} className="block">
                  <article className="prose prose-sm max-w-none text-gray-800 dark:prose-invert dark:text-gray-100">
                    {parse(comment?.commentContent)}
                  </article>

                  <div id='BrowseQuestions_created_category_views' className='mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-300'>
                    <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
                      {new Date(comment?.$createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
                      {comment?.category}
                    </span>
                    <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
                      <i className="fa-solid fa-comments" />
                      <span>{comment?.subComment?.length}</span>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}

          {hasNextPage && (
            <section ref={spinnerRef} className='mt-6 flex justify-center'>
              <Spinner />
            </section>
          )}
        </div>
      </section>
    </div>
  )
}

export default Opinions
