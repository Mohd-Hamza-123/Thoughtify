import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import appwriteService from "../../appwrite/config";
import { Button, Container, AskQue, Chat } from "../index";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { useAskContext } from "../../context/AskContext";
import "./ViewPost.css";

const ViewPost = () => {
  const { isAskQueVisible, EditAskQueVisible, setEditAskQueVisible } =
    useAskContext();

  // console.log(EditAskQueVisible);

  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isAuther = post && userData ? post.userId === userData.$id : false;
  const [toggle, settoggle] = useState(false);

  const ellipsis_Vertical = useRef();
  const ViewPost_ellipsis_Vertical = useRef();

  useEffect(() => {
    if (slug) {
      appwriteService
        .getPost(slug)
        .then((post) => {
          if (post) setPost((prev) => post);
          else navigate("/");
          // console.log(post);
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
  // console.log(EditAskQueVisible);
  return post ? (
    <>
      {EditAskQueVisible && <AskQue post={post} />}
      {isAskQueVisible && <AskQue />}
      <div id="ViewPost" className="p-3">
        <div id="ViewPost-Question-Container" className="w-4/6 p-2 bg-white">
          <div className="mb-3 flex justify-between mx-3 mt-1 relative">
            <span id="ViewPost-Category">Category</span>
            <div>
              <div
                id="ViewPost-ellipsis-Vertical"
                ref={ViewPost_ellipsis_Vertical}
              >
                <ul>
                  {isAuther && (
                    <li>
                      <Button
                        onClick={() => {
                          setEditAskQueVisible((prev) => !prev);
                        }}
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
          <div id="ViewPost-Question" className="bg-gray-300 mt-3">
            <div className="flex gap-2">
              <div className="rounded-full">
                <img
                  src={`${post.queImage}`}
                  id="PostCard-profile-pic"
                  className="rounded-full"
                  alt=""
                />
              </div>
              <div>
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
