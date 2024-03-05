import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import appwriteService from "../../appwrite/config";
import { Button, Container, AskQue, Chat } from "../index";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { useAskContext } from "../../context/AskContext";
import "./ViewPost.css";
import '../../index.css'
import profile from "../../appwrite/profile";

const ViewPost = () => {
  const { isAskQueVisible } =
    useAskContext();


  const [post, setPost] = useState(null);
  const [profileImgURL, setprofileImgURL] = useState('')
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isAuther = post && userData ? post.userId === userData.$id : false;
  const ellipsis_Vertical = useRef();
  const ViewPost_ellipsis_Vertical = useRef();

  useEffect(() => {
    if (slug) {
      appwriteService
        .getPost(slug)
        .then((post) => {
          if (post) setPost((prev) => post);
          else navigate("/");
          return post
        })
        .then((post) => {

          profile.getStoragePreview(post.profileImgID)
            .then((res) => {
              setprofileImgURL(res.href)
            })
        })
        .catch(() => {
          console.log("ViewPost Component Error");
        });
    }
  }, []);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then(() => {
      console.log("Post Deleted");
    });
    navigate("/");
  };
  const deleteThumbnail = () => {

  }
  return post ? (
    <>
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
                        Edit
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
                        Delete
                      </Button>
                    </li>
                  )}
                  {isAuther && (
                    <li>
                      <Button>Active</Button>
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

            <div id="ViewPost-parse">{parse(post.content)}</div>
          </div>
        </div>

        <div className="Chat w-4/6 mt-6">
          <Chat post={post} />
        </div>
      </div>
    </>
  ) : null;
};

export default ViewPost;
