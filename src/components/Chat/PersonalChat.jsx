import React, { useState, useEffect, useRef } from 'react'
import './PersonalChat.css'
import { TextArea } from '../../components/index'
import { useForm } from 'react-hook-form'
import personalChat from '../../appwrite/personalChat'
import { useSelector } from 'react-redux'
import conf from '../../conf/conf'
import { Client } from 'appwrite'
import profile from '../../appwrite/profile'
const PersonalChat = ({ receiverDetails, ChatRoomID }) => {
  let client = new Client()
    .setEndpoint(conf.appwriteURL)
    .setProject(conf.appwriteProjectId)
  const userData = useSelector((state) => state.auth.userData)
  console.log(receiverDetails[0]?.profileImgID)
  const messagesDiv = useRef()
  // useStates
  const [receiverImage, setreceiverImage] = useState('')
  const [messageBody, setmessageBody] = useState('')
  const [messages, setmessages] = useState(
    [
    ])
  // console.log(messages)
  const { register, handleSubmit, setValue } = useForm();
  const getMessages = async (ChatRoomID) => {
    const messagesData = await personalChat.listPersonalMessages({ ChatRoomID })
    // console.log(messagesData)

    setmessages((prev) => [...messagesData.documents])
  }

  const deleteMessage = async (messageid) => {
    personalChat.deleteMessage(messageid)
      .then((res) => {
        // console.log("Message deleted")
      })
  }
  useEffect(() => {
    const realtime = client.subscribe(`databases.${conf.appwriteDatabaseId}.collections.${conf.appwritePersonalChatConverstionsCollectionId}.documents`, (response) => {
      // console.log(response)
      if (response.events.includes("databases.*.collections.*.documents.*.create")) {
        // console.log("New Document added")
        // console.log(response)
        if (response.payload.chatRoomID === ChatRoomID) {
          setmessages((prev) => [...prev, response.payload])
        }

      } else if ("databases.*.collections.*.documents.*.delete") {
        // console.log("New Document delete " + response)

        setmessages((prev) => prev.filter((message) => {
          if (response.payload.chatRoomID === ChatRoomID) {
            return message.$id !== response.payload.$id
          }
        }))
      }
    })

    return () => realtime()
  }, [])

  useEffect(() => {
    if (messagesDiv) {
      messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight
    }
    getMessages(ChatRoomID)
    profile.getStoragePreview(receiverDetails[0]?.profileImgID)
      .then((res) => setreceiverImage(res.href))
  }, [])


  const sendText = async (data) => {
    setValue('text', '')
    const createMessage = await personalChat.sendPersonalMessage(
      {
        ...data,
        chatRoomID: ChatRoomID,
        userId: userData?.$id,
        username: userData?.name
      }
    )
    

  }
  return (
    <>
      <div className="container">
        <div className="room--container">

          <div id='PersonalChat_Receiver_div' className='flex justify-between'>

            <div className='flex items-center px-5 gap-4'>
              <div>
                <img src={receiverImage ? receiverImage : null} alt="pic" />
              </div>

              <div>
                <p>{receiverDetails[0]?.name}</p>
                <span>Online</span>
              </div>
            </div>

            <div>
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </div>

          </div>
          <div ref={messagesDiv} id='PersonalChat_Messages'>
            {messages?.map((message, index) => (
              <div key={message.$id} className={"message--wrapper"}>
                {/* <div className='border'> */}
                <div className="message--header">
                  <small className="message-timestamp">
                    {/* {new Date(message.$createdAt).toLocaleString()} */}
                  </small>
                  <button
                    className={`${message.userId === userData.$id ? '' : 'hidden'}`}
                    onClick={() => deleteMessage(message.$id)}
                    id='PersonalChatDeleteBtn'
                  >
                    Delete
                  </button>
                </div>
                <div className={`message--body ${message.userId === userData.$id ? 'bg-red-600 self-end' : 'bg-black self-start'}`}>
                  <span>{message.text}</span>
                </div>
              </div>
            ))}
          </div>


          <form className='PeronalChat_Form mt-2' id="message-form" onSubmit={handleSubmit(sendText)}>
            <div className='flex justify-between items-center'>
              <TextArea
                name=""
                id="PersonalChatTextArea"
                cols="30"
                rows="3"
                className="resize-none"
                // value={messageBody}
                placeholder="Say Something..."
                maxLength={"1000"}
                {...register("text", {
                  required: true
                })}
              ></TextArea>

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