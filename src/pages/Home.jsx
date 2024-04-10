import React, { useCallback, useRef } from "react";
import { useEffect } from "react"
import { useState } from "react"
import { Container, PostCard, NavBar, AskQue, UpperNavigationBar, LowerNavigationBar, HorizontalLine, HomeRight } from "../components/index";
import { useSelector, useDispatch } from "react-redux";
import "./Home.css";
import appwriteService from "../appwrite/config";
import { useAskContext } from "../context/AskContext";
import { getInitialPost } from "../store/postsSlice";
import authService from "../appwrite/auth";


const Home = () => {

  const dispatch = useDispatch()
  const initialPost = useSelector((state) => state.postsSlice.initialPosts)

  const userProfileCollection = useSelector((state) => state.userProfileSlice?.userProfileArr)
  // console.log(userProfileCollection)


  const { increaseViews, hasMorePostsInHome,
    sethasMorePostsInHome } = useAskContext();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  const [lastPostID, setLastPostID] = useState(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  const [maximumPostsNumber, setmaximumPostsNumber] = useState(null)

  let spinnerRef = useRef();

  useEffect(() => {
    const getAllPosts = async () => {
      setIsLoading((prev) => true)
      try {
        if (initialPost.length === 0) {
          const posts = await appwriteService.getPosts(lastPostID)
          setmaximumPostsNumber((prev) => posts.total)
          if (initialPost.length < posts.total) {
            sethasMorePostsInHome((prev) => true)
          } else {
            sethasMorePostsInHome((prev) => false)
          }
          if (posts) {
            setPosts((prev) => posts.documents)
            let lastID = posts.documents[posts.documents.length - 1]?.$id
            setLastPostID((prev) => lastID)
            dispatch(getInitialPost({ initialPosts: posts.documents }))
          }
        } else {
          // console.log(initialPost)
          setPosts((prev) => [...initialPost])
        }
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      } finally {
        // setIsLoading((prev) => false)
      }
    }
    getAllPosts();
  }, []);

  useEffect(() => {
    const ref = spinnerRef.current;
    // console.log(ref)
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

  }, [spinnerRef.current, posts])

  useEffect(() => {
    // console.log(maximumPostsNumber)
    if (isIntersecting && hasMorePostsInHome) {
      const getAllPosts = async () => {
        // console.log(initialPost[initialPost.length - 1].$id)
        let LastID = initialPost[initialPost.length - 1].$id;
        const posts = await appwriteService.getPosts(LastID)
        // console.log(posts)
        // setPosts((prev) => [...prev, posts])
        if (initialPost.length < posts.total) {
          sethasMorePostsInHome((prev) => true)
        } else {
          sethasMorePostsInHome((prev) => false)
        }
        setmaximumPostsNumber((prev) => posts.total)
        if (posts.documents.length === 0) {
          setIsLoading((prev) => false)
          return
        }
        let lastID = posts.documents[posts.documents.length - 1].$id
        setLastPostID((prev) => lastID)
        dispatch(getInitialPost({ initialPosts: posts.documents }))
      }
      getAllPosts()
    }
    // console.log(initialPost)
  }, [isIntersecting, hasMorePostsInHome])

  useEffect(() => {
    if (initialPost.length !== 0) {
      setPosts((prev) => initialPost)
    } else {
      setPosts((prev) => [])
    }
  }, [initialPost])


  const HomePageRef = useRef()

  const lastScrollY = useRef(window.scrollY);
  const [isNavbarHidden, setisNavbarHidden] = useState(false)
  // console.log(isNavbarHidden)

  const handleScroll = (e) => {
    let position = e.target.scrollTop;
    // console.log('lastScrollY ' + lastScrollY.current)
    // console.log('position ' + position)
    sessionStorage.setItem('scrollPosition', position.toString());
    if (lastScrollY.current < position) {
      // console.log('down')
      setisNavbarHidden(true)
    } else {
      // console.log('up')
      setisNavbarHidden(false)
    }
    // setlastScrollY(position)
    lastScrollY.current = position
  }


  useEffect(() => {
    // console.log(HomePageRef.current)
    if (HomePageRef.current) {
      // console.log("HOme")
      const storedScrollPosition = sessionStorage.getItem('scrollPosition');
      const parsedScrollPosition = parseInt(storedScrollPosition, 10);
      // console.log(parsedScrollPosition)
      HomePageRef.current.scrollTop = parsedScrollPosition
    }
  }, [HomePageRef.current, posts]);


  return posts?.length > 0 ? (
    <div
      id="Home"
      ref={HomePageRef}
      className="w-full relative"
      onScroll={handleScroll}
    >
      <nav className={`Home_Nav_Container w-full text-center ${isNavbarHidden ? 'active' : ''}`}>
        <UpperNavigationBar className='' />
        <HorizontalLine />
        <LowerNavigationBar />
      </nav>


      <div id="Home_RIGHT_LEFT" className={`flex gap-5 px-8 py-5 w-full`}>
        <div className="Home_Left flex flex-col gap-6">
          {posts?.map((post) => (
            <div key={post?.$id} onClick={() => increaseViews(post.$id)}>
              <PostCard {...post} />
            </div>
          ))}

          {(isLoading && hasMorePostsInHome) && <div ref={spinnerRef} className="flex justify-center">
            <span className="Home_loader"></span>
          </div>}

        </div>
        <div className={`Home_Right ${isNavbarHidden ? '' : 'active'}`}>
          <HomeRight />
        </div>
      </div>
    </div>
  ) : (
    <div
      id="Home"
      ref={HomePageRef}
      className="w-full relative"
      onScroll={handleScroll}
    >
      <nav className={`Home_Nav_Container w-full text-center ${isNavbarHidden ? 'active' : ''}`}>
        <UpperNavigationBar className='' />
        <HorizontalLine />
        <LowerNavigationBar />
      </nav>

      <div id="Home_RIGHT_LEFT" className={`flex gap-5 px-8 py-5 w-full`}>
        <div className="Home_Left flex flex-col gap-6 justify-center items-center font-semibold">
          No Posts
        </div>
        <div className={`Home_Right ${isNavbarHidden ? '' : 'active'}`}>
          <HomeRight />
        </div>
      </div>

    </div>
  );
};

export default Home;
