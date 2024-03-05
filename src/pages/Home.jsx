import React from "react";
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
  const initialPost = useSelector((state) => state.postsSlice.initialPosts)
  // console.log(initialPost.documents)
  const userData = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const [profileImgID, setprofileImgID] = useState('')
  const { isAskQueVisible, setisAskQueVisible } = useAskContext();
  const dispatch = useDispatch()

  const getAllPosts = async () => {

    if (!initialPost) {
      // console.log('run')
      const posts = await appwriteService.getPosts()
      if (posts) {
        setPosts(posts.documents)
        dispatch(getInitialPost({ initialPosts: posts }))
      }
    } else {
      setPosts(initialPost.documents)
    }

  }

  useEffect(() => {
    getAllPosts()
  }, []);

  return posts?.length > 0 ? (
    <div className="w-full relative">
      <Container>
        <UpperNavigationBar className='sticky top-0' />
        <HorizontalLine />
        <LowerNavigationBar />
        <div className="flex gap-5 px-8 py-5 w-full relative">
          <div className="Home_Left flex flex-col gap-6">
            {posts?.map((post) => (
              <div key={post.$id}>
                <PostCard {...post} />
                {/* <hr /> */}
              </div>
            ))}
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
