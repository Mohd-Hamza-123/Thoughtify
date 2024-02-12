import React, { useState, useEffect, useRef } from 'react'
import './PersonalChat.css'
const PersonalChat = ({ partipantsDetails }) => {
  console.log(partipantsDetails)
  const messagesDiv = useRef()
  const [messages, setmessages] = useState(
    [
      { body: "1 Hello", $createdAt: '11/02/2003', $id: "44" },
    ])
  const [messageBody, setmessageBody] = useState('')


  useEffect(() => {

  }, [])
  useEffect(() => {
    if (messagesDiv) {
      messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight
    }
  }, [])


  const handleSubmit = async () => {

  }
  return (
    <>
      <div className="container">
        <div className="room--container">

          <div id='PersonalChat_Receiver_div' className='flex justify-between'>

            <div className='flex items-center px-5 gap-4'>
              <div>
                <img src="https://wallpapers.com/images/hd/cool-profile-picture-87h46gcobjl5e4xu.jpg" alt="" />
              </div>

              <div>
                <p>Receiver Name</p>
                <span>Online</span>
              </div>
            </div>

            <div>
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </div>

          </div>
          <div ref={messagesDiv} id='PersonalChat_Messages'>
            {messages?.map((message, index) => (
              <div key={message.$id + index} className={"message--wrapper"}>
                {/* <div className='border'> */}
                <div className="message--header">
                  <small className="message-timestamp">
                    {new Date(message.$createdAt).toLocaleString()}
                  </small>
                  <button
                    onClick={() => deleteMessage(message.$id)}
                    id='PersonalChatDeleteBtn'
                  >
                    Delete
                  </button>
                </div>
                <div className="message--body">
                  <span>{message.body}</span>
                </div>
              </div>
            ))}
          </div>
          <form className='PeronalChat_Form mt-2' id="message-form" onSubmit={handleSubmit}>
            <div className='flex justify-between items-center'>
              <textarea
                name=""
                id="PersonalChatTextArea"
                cols="30"
                rows="3"
                className="resize-none"
                value={messageBody}
                placeholder="Say Something..."
                maxLength={"1000"}
                onInput={(e) => {
                  setmessageBody(e.target.value);
                }}
              ></textarea>

              <div className="send-btn--wrapper">
                <input
                  id='PersonalChatSubmit'
                  className="btn"
                  type="submit"
                  value="Send"
                />
              </div>

            </div>

          </form>


        </div>
      </div>
    </>
  )
}

export default PersonalChat