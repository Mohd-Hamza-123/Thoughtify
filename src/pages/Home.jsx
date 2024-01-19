import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Container, PostCard, NavBar, AskQue } from "../components/";
import { useSelector } from "react-redux";
import "./Home.css";
import appwriteService from "../appwrite/config";
import { useAskContext } from "../context/AskContext";
const Home = () => {
  const userData = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const { isAskQueVisible, setisAskQueVisible } = useAskContext();

  useEffect(() => {
    appwriteService
      .getPosts()
      .then((post) => {
        setPosts(post.documents);
      })
      .catch((err) => console.log(err.message));
  }, [isAskQueVisible]);

  return posts?.length > 0 ? (
    <div className="w-full">
      <Container>
        <NavBar />
        <AskQue />
        <div className="flex flex-col gap-5 px-8 py-5">
          {posts?.map((post) => (
            <div key={post.$id}>
              <PostCard {...post} />
            </div>
          ))}
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
      <NavBar />
      <AskQue />
    </>
  );
};

export default Home;
