import React, { useState, useEffect, useRef } from 'react'
import './PersonalChat.css'
import { HorizontalLine, TextArea, UpperNavigationBar } from '../../components/index'
import { useForm } from 'react-hook-form'
import personalChat from '../../appwrite/personalChat'
import { useSelector } from 'react-redux'
import conf from '../../conf/conf'
import { Client } from 'appwrite'
import profile from '../../appwrite/profile'
import NoProfile from '../../assets/NoProfile.png'
import { Link } from 'react-router-dom'
import { useAskContext } from '../../context/AskContext'
const PersonalChat = ({ receiverDetails, ChatRoomID }) => {
  console.log(receiverDetails)
  let client = new Client()
    .setEndpoint(conf.appwriteURL)
    .setProject(conf.appwriteProjectId)
  const userData = useSelector((state) => state.auth.userData)
  const messagesDiv = useRef();
  const {
    savedPersonalChatMsgs,
    setsavedPersonalChatMsgs,
    setnotificationPopMsg,
    setNotificationPopMsgNature,
  } = useAskContext()

  const [receiverImage, setreceiverImage] = useState('')
  const [isDeleteAllMsgActive, setisDeleteAllMsgActive] = useState(false)
  const [messages, setmessages] = useState([])

  const { register, handleSubmit, setValue } = useForm();

  const getMessages = async (ChatRoomID) => {
    const messagesData = await personalChat.listPersonalMessages({ ChatRoomID });
    console.log(messagesData)
    setmessages((prev) => [...messagesData.documents]);
    setsavedPersonalChatMsgs((prev) => [...messagesData.documents])
    if (messagesDiv.current) {

      messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight
    }
  }
  const deleteMessage = async (messageid) => {
    personalChat.deleteMessage(messageid)
      .then((res) => {
        const deletingThisChatRoomMsgs = savedPersonalChatMsgs?.filter((obj) => obj.$id !== messageid);
        setsavedPersonalChatMsgs((prev) => deletingThisChatRoomMsgs);
      })
  }
  const deleteAllMessages = async () => {
    setisDeleteAllMsgActive((prev) => false);
    try {
      const listMesssages = await personalChat.listPersonalMessages({ ChatRoomID });

      let totalMessagesToDelete = listMesssages?.total;
      while (totalMessagesToDelete > 0) {

        const listMesssages = await personalChat.listPersonalMessages({ ChatRoomID });
        totalMessagesToDelete = listMesssages?.total;
        for (let i = 0; i < listMesssages?.documents?.length; i++) {
          personalChat.deleteMessage(listMesssages.documents[i].$id)
        }
      }
      const deletingThisChatRoomMsgs = savedPersonalChatMsgs?.filter((obj) => obj.chatRoomID !== ChatRoomID);
      setsavedPersonalChatMsgs((prev) => deletingThisChatRoomMsgs);
    } catch (error) {
      setNotificationPopMsgNature((prev) => false)
      setnotificationPopMsg((prev) => "comments not deleted")
    }

  }
  const deleteMsgsAutomatically = async () => {
    const res = await personalChat.listPersonalMessages({ ChatRoomID });

    if (res?.total > 25) {
      const totalItemsToDelete = res?.total - 25;

      const listdocumentstoDelete = await personalChat.listPersonalMessages({ ChatRoomID, limit: 25 })

      for (let i = 0; i < totalItemsToDelete; i++) {
        let messageID = listdocumentstoDelete?.documents[i]?.$id;
        if (!messageID) return;
        personalChat.deleteMessage(messageID);
      }
    }
  }
  useEffect(() => {
    const realtime = client.subscribe(`databases.${conf.appwriteDatabaseId}.collections.${conf.appwritePersonalChatConverstionsCollectionId}.documents`, (response) => {

      if (response.events.includes("databases.*.collections.*.documents.*.create")) {
        console.log(response);

        if (response.payload.chatRoomID === ChatRoomID && receiverDetails[0].
          userIdAuth === response.payload.userId
        ) {

          setmessages((prev) => [...prev, response.payload]);
          setsavedPersonalChatMsgs((prev) => [...prev, response.payload]);
         
          setTimeout(() => {
            if (messagesDiv.current) {
              messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
            }
          }, 1000)
          setNotificationPopMsgNature((prev) => true)
          setnotificationPopMsg((prev) => `${receiverDetails[0].name + ' replied'}`)
        }

        if (response.payload.userId === userData?.$id) {
          setTimeout(() => {
            if (messagesDiv.current) {
              messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
            }
          }, 1000)
        }

      } else if ("databases.*.collections.*.documents.*.delete") {

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
    const filterThisChatRoomMsgs = savedPersonalChatMsgs?.filter((obj) => obj.chatRoomID === ChatRoomID);

    if (!filterThisChatRoomMsgs) {
      getMessages(ChatRoomID);
    } else {
      setmessages((prev) => filterThisChatRoomMsgs);
    }

    profile.getStoragePreview(receiverDetails[0]?.profileImgID)
      .then((res) => setreceiverImage(res.href))

    deleteMsgsAutomatically();
    getMessages()

    setTimeout(() => {
      if (messagesDiv.current) {
        messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
      }
    }, 1000)
  }, [])

  const sendText = async (data) => {
    setValue('text', '');
    setisDeleteAllMsgActive((prev) => false);
    try {
      const createMessage = await personalChat.sendPersonalMessage(
        {
          ...data,
          chatRoomID: ChatRoomID,
          userId: userData?.$id,
          username: userData?.name
        }
      );

      setmessages((prev) => [...prev, createMessage]);
      setTimeout(() => {
        if (messagesDiv.current) {
          messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
        }
      }, 1000)
    } catch (error) {
      setmessages((prev) => [...prev]);
    }

  }

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
              {messages?.length !== 0 && <p onClick={deleteAllMessages} className={`${isDeleteAllMsgActive ? 'active' : ''}`}>Clear Chat</p>}
            </div>

          </div>
          <div ref={messagesDiv} id='PersonalChat_Messages' onClick={() => setisDeleteAllMsgActive((prev) => false)}>
            {messages?.map((message, index) => (
              <div key={message.$id} className={"message--wrapper"}>

                <div className="message--header">
                  <button
                    className={`PersonalChatDeleteBtn ${message.userId === userData.$id ? '' : 'hidden'}`}
                    onClick={() => deleteMessage(message.$id)}
                    id=''
                  >
                    Delete
                  </button>
                </div>
                <p className={`message-timestamp ${message?.userId === userData.$id ? 'text-right' : 'text-left'}`}>
                  {new Date(message.$createdAt).toLocaleDateString() + ', ' + new Date(message.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
                <div className={`message--body ${message?.userId === userData.$id ? 'PersonalChatMyColor self-end' : 'bg-black self-start PersonalChatYourColor'}`}>
                  <span>{message?.text}</span>
                </div>

              </div>
            ))}
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
                  className="btn">
                  <i className="fa-regular fa-paper-plane"></i>
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