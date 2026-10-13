import "../../index.css";
import { Spinner } from "..";
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from "react-router-dom";
import { makeCodeBlock } from "../../helpers/code-block-formatting";
import { ViewPostLikeDislikeBookmark, ViewPostMainContent } from "..";

const ViewPost = () => {

  const ViewPostRef = useRef();
  const viewPostLeft = useRef();
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  const [post, setPost] = useState(null);
  const { slug, filterCommentID } = useParams();

  const getPost = async () => {

    let data = null
    const query = queryClient.getQueryData(["posts"]);
    const pages = query?.pages || []

    if (!Array.isArray(pages) || pages.length === 0) {
      navigate("/")
      toast.error("No Posts Found")
      return
    }

    const posts = pages.flatMap(page => page?.documents || [])
    data = posts.find(post => post?.$id === slug)

    if (!data) {
      navigate("/")
      toast.error("No Posts Found")
      return
    }
    
    setPost(data)
  }

  useEffect(() => {
    makeCodeBlock()
    getPost()
  }, [])

  return post ? <div
    ref={ViewPostRef}
    className="w-full relative flex">

    <section ref={viewPostLeft} className="p-3 w-full md:w-[70%] overflow-x-hidden">
       <ViewPostMainContent post={post} />
      <ViewPostLikeDislikeBookmark post={post} />
    </section>
      
  </div> : <div className="w-full flex justify-center items-center h-[80dvh]">
    <Spinner />
  </div>
};

export default ViewPost;
