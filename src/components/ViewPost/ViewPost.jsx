import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import appwriteService from "../../appwrite/config";
import { Button, Chat, HorizontalLine } from "../index";
import parse from "html-react-parser";
import { useSelector, useDispatch } from "react-redux";
import { useAskContext } from "../../context/AskContext";
import "./ViewPost.css";
import '../../index.css'
import profile from "../../appwrite/profile";
import { getAllVisitedQuestionsInViewPost } from "../../store/ViewPostsSlice";

const ViewPost = () => {
  const dispatch = useDispatch()
  const { isAskQueVisible } =
    useAskContext();
  const AllVisitedQuestions = useSelector((state) => state.viewPostsSlice.questions)
  // console.log(AllVisitedQuestions);
  const [post, setPost] = useState(null);
  const [profileImgURL, setprofileImgURL] = useState('')
  const { slug } = useParams();

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isAuther = post && userData ? post.userId === userData.$id : false;
  const ellipsis_Vertical = useRef();
  const ViewPost_ellipsis_Vertical = useRef();


  useEffect(() => {



    if ((AllVisitedQuestions.some(obj => obj.$id === slug)) === false) {
      appwriteService
        .getPost(slug)
        .then((post) => {
          if (post) { setPost((prev) => post) }
          dispatch(getAllVisitedQuestionsInViewPost({ questions: post }))
          return post
        })
        .then((post) => {
          return profile.getStoragePreview(post.profileImgID)
        })
        .then((res) => {
          setprofileImgURL(res.href)
        })
        .catch(() => {
          console.log("ViewPost Component Error");
        });
    } else {
      let postObject = AllVisitedQuestions.find(obj => obj.$id === slug)
      setPost((prev) => postObject)
    }

  }, []);

  useEffect(() => {
    if (post) {
      appwriteService
        .getPostsWithQueries({ UserID: post?.userId })
        .then((res) => {
          //  console.log(res)
        })
    }

  }, [post])
  const deletePost = () => {
    appwriteService.deletePost(post.$id).then(() => {
      console.log("Post Deleted");
    });
    navigate("/");
  };
  const deleteThumbnail = () => {

  }
  return post ? (
    <div className="">
      <HorizontalLine />
      <div id="ViewPost_ViewPost_RecentQuestions_Container" className="flex">
        <div id="ViewPost" className="p-3">
          <div id="ViewPost-Question-Container" className="w-4/6 p-2 bg-white">
            <div className="mb-3 flex justify-between mx-3 mt-1 relative">
              <span id="ViewPost-Category">{post.category}</span>
              <div>
                <div
                  className="ViewPost-ellipsis-Vertical"
                  ref={ViewPost_ellipsis_Vertical}
                >
                  <ul>
                    {isAuther && (
                      <li
                        onClick={() => { navigate(`/EditQuestion/${post?.$id}`) }}
                      >
                        <Button
                        >
                          <i className="fa-regular fa-pen-to-square"></i>
                        </Button>
                      </li>
                    )}
                    {isAuther && (
                      <li>
                        <Button
                          onClick={() => {
                            deletePost();
                            deleteThumbnail();
                          }}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </Button>
                      </li>
                    )}
                    {isAuther && (
                      <li>
                        <Button><i className="fa-solid fa-share"></i></Button>
                      </li>
                    )}
                    {!isAuther && (
                      <li>
                        <Button>Report</Button>
                      </li>
                    )}
                  </ul>
                </div>
                <Button
                  onMouseOver={() => {
                    ellipsis_Vertical.current.classList.add("fa-flip");
                  }}
                  onMouseOut={() => {
                    ellipsis_Vertical.current.classList.remove("fa-flip");
                  }}
                  onClick={() => {
                    ViewPost_ellipsis_Vertical.current.classList.toggle("block");
                  }}
                >
                  <i
                    id="ViewPost_fa-ellipsis"
                    ref={ellipsis_Vertical}
                    className="fa-solid fa-ellipsis-vertical text-xl"
                  ></i>
                </Button>
              </div>
            </div>
            <div id="ViewPost-Question" className="mt-3">
              <div className="flex gap-2">
                <div className="rounded-full">
                  <img
                    src={`${profileImgURL}`}
                    id="PostCard-profile-pic"
                    className="rounded-full"
                    alt=""
                  />
                </div>
                <div id='ViewPostName'>
                  <h5>{post.name}</h5>
                </div>
              </div>

              <div className="mt-3 mb-2">
                <h2 id="ViewPost-Title" className="text-3xl font-bold">
                  {post.title}
                </h2>
              </div>

              <div id="ViewPost-parse">{parse(post?.content)}</div>
            </div>
          </div>

          <div className="Chat w-4/6 mt-6">
            <Chat post={post} />
          </div>
        </div>
        <div id="ViewPost_RecentQuestions" className="">
          <p>Recent Question Asked by {post.name}</p>
          <section>

          </section>
        </div>
      </div>
    </div>
  ) : null;
};

export default ViewPost;
