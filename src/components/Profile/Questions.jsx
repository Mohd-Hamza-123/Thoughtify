import { Icons, Spinner } from '../'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { categoriesArr } from '../AskQue/Category'
import appwriteService from '../../appwrite/config'
import { useDispatch, useSelector } from 'react-redux'
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useNotificationContext } from '@/context/NotificationContext'

const Questions = ({ visitedUserProfile }) => {

  const userID = visitedUserProfile?.$id
  const dispatch = useDispatch()
  const spinnerRef = useRef(null)

  const [toggle, setToggle] = useState(false)

  const { setNotification } = useNotificationContext()
  const userData = useSelector((state) => state.auth.userData);
  const [filters, setFilters] = useState({userID})
  const { register, handleSubmit, reset } = useForm()

  const { data: queries = [], isLoading, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ['questions', visitedUserProfile?.userIdAuth, filters],
    queryFn: async ({ queryKey, pageParam }) => {
      const filteredQuestions = await appwriteService.getPostsWithQueries({ ...filters }, pageParam)
      const documents = filteredQuestions.documents
      const documentsLength = documents.length;
      return {
        documents,
        nextCursor: documentsLength ? documents[documentsLength - 1].$id : undefined
      }
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: true,
  })

  
  let queriesArr = useMemo(() => queries.pages?.flatMap((page) => page.documents), [queries])

 
  const submit = async (data) => {
    data.userID = userID
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
        threshold: 0
      })
      observer.observe(ref)
      return () => ref && observer.unobserve(ref)
    }
  }, [queries])

  return (
    <div
      className="flex flex-col lg:flex-row gap-3 w-full p-2 sm:p-6 lg:p-5 bg-gray-50 rounded-2xl shadow-md"
    >
      {/* Toggle Button */}
      <Button
        onClick={() => setToggle((prev) => !prev)}
        variant="outline"
        className="lg:hidden justify-center items-center w-fit self-end lg:self-start mb-4 lg:mb-0 hover:bg-gray-100 transition flex"
      >
        <Icons.switch />
      </Button>

      {/* Filter Form */}
      <form
        id="Profile_Filter_Questions_Form"
        className={`w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-6 p-3 rounded-xl bg-white shadow border border-gray-200 transition-all duration-300 ${toggle ? 'hidden' : 'block'
          }`}
        onSubmit={handleSubmit(submit)}
      >

        <div className="flex flex-col gap-3 mt-4">
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {isLoading ? 'Searching...' : 'Apply Filter'}
          </Button>
          <Input
            type="reset"
            onClick={() => {
              reset()
              setNotification({ message: 'Filter Cleared', type: 'success' })
            }}
            value={'Reset Filter'}
            className="w-full border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-100 cursor-pointer"
          />
        </div>
        {/* Title */}
        <div id="Profile_Questions_Title" className="space-y-2">
          <p className="font-semibold text-gray-800">Filter by Post Title :</p>
          <div className="flex gap-2 items-center">
            <label htmlFor="Profile_Questions_Title_Filter" className="text-sm text-gray-600">
              Title:
            </label>
            <Input
              {...register('Title', { required: false })}
              id="Profile_Questions_Title_Filter"
              placeholder="Enter title..."
              className="flex-1 border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Views */}
        <div className="space-y-2">
          <p className="font-semibold text-gray-800">Filter By Views :</p>
          <div className="flex flex-col gap-1 text-sm">
            <label className="flex gap-2 cursor-pointer">
              <input {...register('Viewed')} type="radio" value={'MostViewed'} />
              Most Viewed
            </label>
            <label className="flex gap-2 cursor-pointer">
              <input {...register('Viewed')} type="radio" value={'lessViewed'} />
              Less Viewed
            </label>
          </div>
        </div>

        {/* Post Age */}
        <div className="space-y-2">
          <p className="font-semibold text-gray-800">Filter By Post Age :</p>
          <div className="flex flex-col gap-1 text-sm">
            <label className="flex gap-2 cursor-pointer">
              <input {...register('PostAge')} type="radio" value={'Recent'} />
              Recent
            </label>
            <label className="flex gap-2 cursor-pointer">
              <input {...register('PostAge')} type="radio" value={'Oldest'} />
              Oldest
            </label>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-2">
          <p className="font-semibold text-gray-800">Filter By Comment :</p>
          <div className="flex flex-col gap-1 text-sm">
            <label className="flex gap-2 cursor-pointer">
              <input {...register('Commented')} type="radio" value={'Most Commented'} />
              Most Commented
            </label>
            <label className="flex gap-2 cursor-pointer">
              <input {...register('Commented')} type="radio" value={'Least Commented'} />
              Least Commented
            </label>
          </div>
        </div>

        {/* Favourite */}
        <div className="space-y-2">
          <p className="font-semibold text-gray-800">Favourite :</p>
          <div className="flex flex-col gap-1 text-sm">
            <label className="flex gap-2 cursor-pointer">
              <input type="radio" {...register('Like_Dislike')} value={'Most Liked'} />
              Most liked
            </label>
            <label className="flex gap-2 cursor-pointer">
              <input type="radio" {...register('Like_Dislike')} value={'Most Disliked'} />
              Most disliked
            </label>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <p className="font-semibold text-gray-800">Filter By Category :</p>
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600">Category:</label>
            <select
              {...register('category')}
              className="flex-1 border border-gray-300 rounded-md px-2 py-1 outline-none text-sm"
            >
              <option value={'All Category'}>All Category</option>
              {categoriesArr?.map((category, index) => (
                <option key={category.category + index}>{category.category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date */}
        <div id="Profile_Questions_FilterByDate" className="space-y-2">
          <p className="font-semibold text-gray-800">Filter By Date :</p>
          <div className="flex flex-col gap-3 text-sm">
            <label className="flex gap-2 items-center">
              After:
              <input type="date" {...register('AfterDate')} className="border rounded-md px-2 py-1" />
            </label>
            <label className="flex gap-2 items-center">
              Before:
              <input type="date" {...register('BeforeDate')} className="border rounded-md px-2 py-1" />
            </label>
          </div>
        </div>

      </form>

      {/* Filtered Results */}
      <div
        id="Profile_Questions_Filtered_Questions"
        className={`w-full flex-1 rounded-xl bg-white shadow p-5 border border-gray-200 ${toggle ? 'block' : 'hidden lg:block'
          }`}
      >
        {true && <p className="text-center text-gray-500 italic">No Posts Available</p>}

        <div className="space-y-4 mt-4">
          {queriesArr?.map((querie, index) => {
            return (
              <div
                key={querie?.$id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                <span className="font-semibold text-gray-800">{querie?.name}</span>
                <Link to={`/post/${querie?.$id}/${null}`} className="block mt-2">
                  <p className="text-lg font-medium text-blue-600 hover:underline">{querie?.title}</p>
                  <div
                    id="BrowseQuestions_created_category_views"
                    className="flex gap-3 flex-wrap text-sm text-gray-600 mt-2"
                  >
                    <span>
                      {new Date(querie?.$createdAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded-md border">{querie?.category}</span>
                    <div className="flex items-center gap-1">
                      <span>{querie?.views}</span>
                      <Icons.views/>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{querie.commentCount}</span>
                      <Icons.comment/>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{querie?.like}</span>
                      <Icons.like/>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{querie?.dislike}</span>
                      <Icons.dislike/>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

        {hasNextPage && (
          <section ref={spinnerRef} className="flex justify-center mt-6">
            <Spinner />
          </section>
        )}
      </div>
    </div>
  )
}

export default Questions
