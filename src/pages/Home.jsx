import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Container, PostCard, NavBar, AskQue, UpperNavigationBar, LowerNavigationBar, HorizontalLine, HomeRight } from "../components/index";
import { useSelector, useDispatch } from "react-redux";
import "./Home.css";
import appwriteService from "../appwrite/config";
import { useAskContext } from "../context/AskContext";
import profile from "../appwrite/profile";
import { getInitialPost } from "../store/postsSlice";


const Home = () => {
  const dispatch = useDispatch()
  const initialPost = useSelector((state) => state.postsSlice.initialPosts)
  console.log(initialPost)
  const { increaseViews, hasMorePostsInHome,
    sethasMorePostsInHome } = useAskContext();
  // console.log(hasMorePostsInHome)
  const [posts, setPosts] = useState([]);

  const [isLoading, setIsLoading] = useState(false)
  // console.log(isLoading)
  const [lastPostID, setLastPostID] = useState(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  // console.log(isIntersecting)
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
            let lastID = posts.documents[posts.documents.length - 1].$id
            setLastPostID((prev) => lastID)
            dispatch(getInitialPost({ initialPosts: posts.documents }))
          }
        } else {
          setPosts(initialPost)
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

        console.log(initialPost[initialPost.length - 1].$id)
        let LastID = initialPost[initialPost.length - 1].$id;
        const posts = await appwriteService.getPosts(LastID)
        console.log(posts)
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
    if (initialPost.length !== 0 && hasMorePostsInHome) {
      setPosts((prev) => initialPost)
    }
  }, [initialPost])


  const HomePageRef = useRef()

  const handleScroll = (e) => {
    let position = e.target.scrollTop
    sessionStorage.setItem('scrollPosition', position.toString());
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
      onScroll={handleScroll}>
      <Container>
        <UpperNavigationBar className='sticky top-0' />
        <HorizontalLine />
        <LowerNavigationBar />
        <div className="flex gap-5 px-8 py-5 w-full relative">
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
          <div className="Home_Right">
            <HomeRight />
          </div>
        </div>
      </Container>
    </div>
  ) : (
    // <div id="Mainloader">
    //   <img
    //     src="https://forums.synfig.org/uploads/default/original/2X/3/320a629e5c20a8f67d6378c5273cda8a9e2ff0bc.gif"
    //     alt="Loading"
    //   />
    // </div>
    <>
      <UpperNavigationBar />
      <HorizontalLine />
      <LowerNavigationBar />
    </>
  );
};

export default Home;
