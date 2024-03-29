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
  const postProfilesPic = useSelector((state) => state.postsSlice?.postUploaderProfilePic)
  const dispatch = useDispatch()
  const { slug } = useParams();

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const ellipsis_Vertical = useRef();
  const ViewPost_ellipsis_Vertical = useRef();
  const AllVisitedQuestions = useSelector((state) => state.viewPostsSlice.questions)

  const [profileImgURL, setprofileImgURL] = useState('')
  const [post, setPost] = useState(null);
  const isAuther = post && userData ? post.userId === userData.$id : false;
  // console.log(post)

  // poll 
  // const [pollPercentage, setPollPercentage] = useState(null)
  const [totalPollVotes, setTotalPollVotes] = useState(0)
  const [pollVotersAuthIDsAndVote, setpollVotersAuthIDsAndVote] = useState([])
  const [isPollOpinionVisible, setIsPollOpinionVisible] = useState(false)
  // console.log(pollVotersAuthIDsAndVote)
  // console.log(totalPollVotes)





  useEffect(() => {
    if ((AllVisitedQuestions.some(obj => obj.$id === slug)) === false) {
      appwriteService
        .getPost(slug)
        .then((post) => {
          if (post) {
            setPost((prev) => post)
            // console.log(post)
            setTotalPollVotes((prev) => post.totalPollVotes)
          }
          dispatch(getAllVisitedQuestionsInViewPost({ questions: post }))
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
      // console.log(post.userId)
      const ProfileURLIndex = postProfilesPic.findIndex((obj) => (
        obj.userId === post.userId
      ))
      // console.log(ProfileURLIndex)
      setprofileImgURL(postProfilesPic[ProfileURLIndex].profilePic)
    }
  }, [post])
  useEffect(() => {
    // console.log(post)
    if (post) {
      setTotalPollVotes((prev) => post.totalPollVotes)
      setpollVotersAuthIDsAndVote((prev) => {
        return post.pollVotersID.filter((obj) => {
          if (JSON.parse(obj).pollVoterID === userData.$id) {
            setIsPollOpinionVisible(true)
            return obj
          }
        })
        // return 1
      })
      // appwriteService
      //   .getPostsWithQueries({ UserID: post?.userId })
      //   .then((res) => {
      //     //  console.log(res)
      //   })
    }

  }, [post])

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then(() => {
      console.log("Post Deleted");
    });
    navigate("/");
  };
  const deleteThumbnail = async () => {
    // console.log(post.queImageID)
    if (post.queImageID) {
      let deletedImg = await appwriteService.deleteThumbnail(post.queImageID)
    }
  }

  const updatePoll = async (postId, index, option, vote, pollVoterID) => {
    console.log(post)
    let totalPollVotes = post.totalPollVotes;
    let pollOptions = post.pollOptions.map(obj => JSON.parse(obj));
    let pollVotersID = [...post.pollVotersID].map((obj) => JSON.parse(obj))
    // console.log(pollVotersID)

    // checking whether user is first time giving vote or he has already done
    let indexOfVotedOption = pollVotersID.findIndex((obj) => obj.pollVoterID === pollVoterID)
    // if index === -1 voter not exist.
    if (indexOfVotedOption === -1) {
      console.log('Voter not exist : ' + indexOfVotedOption)
      totalPollVotes = post.totalPollVotes + 1;
      pollVotersID = [...pollVotersID, { pollVoterID, optionNum: index }]
      pollOptions[index].vote = pollOptions[index].vote + 1

    } else {
      // console.log('Voter Alread Exist.Last vote on Index ' + indexOfVotedOption)
      totalPollVotes = post.totalPollVotes
      pollVotersID = [...pollVotersID]
      // console.log(pollOptions)
      // console.log(pollVotersID)
      // console.log(index)
      let myPollVoterID = pollVotersID.filter((obj) => obj.pollVoterID === userData.$id)
      // console.log(myPollVoterID)
      if (index === myPollVoterID[0].optionNum) {
        console.log("Ye to pehle wala selected option tha")
        let remainingObject = pollVotersID.filter((obj) => obj.pollVoterID !== userData.$id)
        pollVotersID = remainingObject
        // console.log(pollOptions[index].vote)
        pollOptions[index].vote = pollOptions[index].vote - 1
        totalPollVotes = post.totalPollVotes - 1;
      } else {
        // return
        let previousSelectedOptionIndex = myPollVoterID[0].optionNum;
        // console.log(previousSelectedOptionIndex)
        // console.log(pollVotersID)
        const desiredIndex = pollVotersID.findIndex((obj) => obj.pollVoterID === userData.$id)
        // console.log(desiredIndex)
        // console.log(index)
        pollVotersID[desiredIndex].optionNum = index
        pollOptions[index].vote = pollOptions[index].vote + 1
        pollOptions[previousSelectedOptionIndex].vote = pollOptions[previousSelectedOptionIndex].vote - 1
        // console.log("Ye to koi aur selected option hai")
      }
    }
    // console.log(pollVotersID)
    console.log(pollOptions)

    for (let i = 0; i < pollOptions.length; i++) {
      // console.log(pollOptions[i])
      if (pollOptions[i].vote < 0) {
        return
      }
    }
    pollVotersID = pollVotersID.map((obj) => JSON.stringify(obj))
    pollOptions = pollOptions.map(obj => JSON.stringify(obj));
    // console.log(pollOptions)
    // return
    const update = await appwriteService.updatePostWithQueries({ pollOptions, postId, totalPollVotes, pollVotersID })
    console.log(update)
    setPost((prev) => update)
    dispatch(getAllVisitedQuestionsInViewPost({ questions: update }))
    setTotalPollVotes((prev) => update.totalPollVotes)
    let myPollVoterID = pollVotersID.filter((obj) => obj.pollVoterID === userData.$id)
    if (myPollVoterID !== -1) {
      setIsPollOpinionVisible(true)
    }
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
                    {/* {isAuther && (
                      <li onClick={()=>{
                        console.log(`${window.location.href}`)
                      }}>
                        <Button><i className="fa-solid fa-share"></i></Button>
                      </li>
                    )} */}
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
              <div className="flex gap-2 items-center">
                <div className="rounded-full">
                  <img
                    src={`${profileImgURL ? profileImgURL : 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/no-profile-picture-icon.png'}`}
                    id="PostCard-profile-pic"
                    className="rounded-full"
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

              {post.pollQuestion && <div id="ViewPost_Poll_Div">
                <h5>Poll </h5>
                <p>{post.pollQuestion}</p>
                <ul>
                  {post.pollOptions?.map((option, index) => {
                    // console.log(option)
                    let selectedOption;
                    let parsedOption = JSON.parse(option).option
                    // console.log(parsedOption)
                    let parsedVote = JSON.parse(option).vote
                    // console.log(parsedVote)
                    let individualPollVote = Math.floor(Number((JSON.parse(option)).vote))
                    // console.log(individualPollVote)
                    let VoterIDandVote = pollVotersAuthIDsAndVote.map((obj) => JSON.parse(obj))

                    if (VoterIDandVote.length === 0) {
                      selectedOption = -1
                    } else {
                      selectedOption = VoterIDandVote[0].optionNum
                      // console.log(selectedOption)
                    }
                    // console.log(x)
                    // console.log(pollVotersAuthIDsAndVote)

                    let percentage = (individualPollVote / totalPollVotes) * 100;
                    percentage = percentage.toFixed(0)
                    if (isNaN(percentage)) {
                      percentage = 0
                    }
                    // console.log(percentage)

                    return <li onClick={() => updatePoll(post.$id, index, parsedOption, parsedVote, userData.$id)} key={parsedOption}>
                      <div id="ViewPost_Poll_Option">{parsedOption}</div>
                      <div id="ViewPost_Overlay_Poll" className={`${index === selectedOption ? "active" : ''}`}>{percentage}%</div>
                    </li>
                  })}
                </ul>


                {isPollOpinionVisible && <div id="ViewPost_Poll_Answer">
                  <span>{post.pollAnswer}</span>
                </div>}
                <div className="flex gap-3 ViewPost_Total_Poll_Votes">
                  <span>Total Votes :</span>
                  <span>{totalPollVotes}</span>
                </div>



              </div>}
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
