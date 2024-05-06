import React, { useState, useEffect, useRef } from 'react'
import './PersonalChat.css'
import { HorizontalLine, TextArea, UpperNavigationBar } from '../../components/index'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import conf from '../../conf/conf'
import { Client } from 'appwrite'
import NoProfile from '../../assets/NoProfile.png'
import { Link } from 'react-router-dom'
import { useAskContext } from '../../context/AskContext'
import { addDoc, collection, onSnapshot, query, where, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '../../Firebase/Firebase-config'

const PersonalChat = ({ receiverDetails, ChatRoomID }) => {

  let client = new Client()
    .setEndpoint(conf.appwriteURL)
    .setProject(conf.appwriteProjectId)
  const userData = useSelector((state) => state.auth.userData)
  const messagesDiv = useRef();
  const {
    setnotificationPopMsg,
    setNotificationPopMsgNature,
  } = useAskContext()

  const [receiverImage, setreceiverImage] = useState('')
  const [isDeleteAllMsgActive, setisDeleteAllMsgActive] = useState(false)
  const [messages, setmessages] = useState([]);
 
  const [isSending, setIsSending] = useState(false)


  const { register, handleSubmit, setValue, reset } = useForm();


  const messageRef = collection(db, "messages");
  const sendText = async (data) => {

    const createdMsg = await addDoc(messageRef, {
      text: data.text,
      username: userData?.name,
      createdAt: new Date().toISOString(),
      room: ChatRoomID,
      userId: userData?.$id,
    })

    setTimeout(() => {
      if (messagesDiv.current) {
        messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
      }
    }, 500);

    reset()

  }

  useEffect(() => {
    const queryMessage = query(messageRef, where("room", "==", ChatRoomID));
    const unsuscribe = onSnapshot(queryMessage, (snapshot) => {
      setTimeout(() => {
        if (messagesDiv.current) {
          messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
        }
      }, 500)
      let messages = []
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), $id: doc.id })
      })
     

      setmessages((prev) => {
        return messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      })
    })


    setTimeout(() => {
      if (messagesDiv.current) {
        messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
      }
    }, 500)
    return () => unsuscribe()


  }, [])


  const handleDeleteMessage = async (id) => {
    try {
      await deleteDoc(doc(db, "messages", id));
      setNotificationPopMsgNature((prev) => true)
      setnotificationPopMsg((prev) => "Message Deleted")
    } catch (error) {
      setNotificationPopMsgNature((prev) => false)
      setnotificationPopMsg((prev) => "Oops")
    }
  };

  const deleteAllMessages = async () => {
    messages.forEach((msg) => {
      deleteDoc(doc(db, "messages", msg?.$id))
        .then((res) => {
          setNotificationPopMsgNature((prev) => true)
          setnotificationPopMsg((prev) => "All Messages Cleared")
        })
    })

  };

  useEffect(() => {

    if (messages.length > 100) {

      for (let i = messages?.length, j = 0; i >= 100; i--, j++) {
        deleteDoc(doc(db, "messages", messages[j].$id))
      }
    }

  }, [messages])
  return (

    <div className="PersonalChat_container">
      <div>
        <UpperNavigationBar />
        <HorizontalLine />
      </div>
      <div id='Personalchat'>
        <div className="room--container">

          <div id='PersonalChat_Receiver_div' className='flex justify-between'>
            <Link to={`/profile/${receiverDetails[0]?.userIdAuth}`}>
              <div className='flex items-center px-5 gap-4'>
                <div>
                  <img src={receiverImage ? receiverImage : NoProfile} />
                </div>

                <div>
                  <p className='font-bold'>{receiverDetails[0]?.name ? receiverDetails[0]?.name : 'Name'}</p>
                </div>
              </div>
            </Link>
            <div className='PersonalChat_Ellipsis_Vertical'>
              {messages?.length !== 0 && <i onClick={() => setisDeleteAllMsgActive((prev) => !prev)} className="fa-solid fa-ellipsis-vertical cursor-pointer"></i>}
              {messages?.length !== 0 && <p
                onClick={deleteAllMessages}
                className={`${isDeleteAllMsgActive ? 'active' : ''}`}>Clear Chat</p>}
            </div>

          </div>
          <div ref={messagesDiv} id='PersonalChat_Messages' onClick={() => setisDeleteAllMsgActive((prev) => false)}>
            {messages?.map((message, index) => {
              return <div key={message.$id} className={"message--wrapper"}>

                <div className="message--header">
                  <button
                    className={`PersonalChatDeleteBtn ${message.userId === userData.$id ? '' : 'hidden'}`}
                    onClick={() => handleDeleteMessage(message.$id)}
                    id=''
                  >
                    Delete
                  </button>
                </div>
                <p className={`message-timestamp ${message?.userId === userData.$id ? 'text-right' : 'text-left'}`}>
                  {new Date(message.createdAt).toLocaleDateString() + ', ' + new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
                <div className={`message--body ${message?.userId === userData.$id ? 'PersonalChatMyColor self-end' : 'bg-black self-start PersonalChatYourColor'}`}>
                  <span>{message?.text}</span>
                </div>

              </div>
            })}
          </div>


          <form className='PeronalChat_Form' id="message-form" onSubmit={handleSubmit(sendText)}>
            <div className='PersonalChat_TextArea_btn_div flex justify-between items-center'>
              <div>
                <TextArea
                  name=""
                  id="PersonalChatTextArea"
                  className="resize-none"
                  placeholder="Say Something..."
                  maxLength={"100000"}
                  {...register("text", {
                    required: true
                  })}
                ></TextArea>
              </div>
              <div className="send-btn--wrapper">
                <button
                  type='submit'
                  id='PersonalChatSubmit'
                  className="btn flex justify-center items-center">
                  {!isSending && <i className="fa-regular fa-paper-plane"></i>}
                  {isSending && <i>---</i>}
                </button>
              </div>

            </div>

          </form>


        </div>
      </div>
    </div>
  )
}

export default PersonalChat