import React from 'react'
import { Icons } from "../index";


const SubComment = ({ subComment }) => {
    return (
        <div>
            {subComment?.map((subComment, index) => {
                const parsedComment = JSON.parse(subComment)
                // console.log(parsedComment)
                const { username, userId, comment } = parsedComment
                // if (comment?.$id != id_For_Five_Mul) {
                //   if (index >= fixedReplies) return
                // } else {
                //   if (index >= loadSubComments_Five_Mul) return
                // }
                return <div
                    key={comment + userId + index}
                    className="Chat_SubComments_Div relative">
                    {true && (
                        <button
                            onClick={() => {
                                deleteSubComment(
                                    comment?.subComment,
                                    comment?.$id,
                                    comment?.commentContent,
                                    post?.$id,
                                    index
                                );
                            }}
                        >
                            <Icons.trashcan />
                        </button>
                    )}
                    <span className="cursor-pointer" onClick={() => navigate(`/profile/${userId}`)}>{username}</span>
                    <p>{comment}</p>

                </div>
            })}
        </div>
    )
}

export default SubComment