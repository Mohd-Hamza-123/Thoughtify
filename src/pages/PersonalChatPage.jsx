import React, { useEffect, useRef, useState } from 'react'
import { PersonalChat, SecondLoader } from '../components/index'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import profile from '../appwrite/profile'
import personalChat from '../appwrite/personalChat'
import generateChatroomId from '../components/Chat/GenerateChatRoomID'
import './PersonalChatPage.css'

const PersonalChatPage = () => {

  const { senderSlug, receiverSlug } = useParams();

  const [receiverDetails, setreceiverDetails] = useState([]);

  const senderDetails = useSelector((state) => state.auth.userData);
  const othersUserProfile = useSelector((state) => state.usersProfileSlice?.userProfileArr);

  const [ChatRoomID, setchatRoomID] = useState('');

  const receiverName = useRef(null)

  const getParticipantsProfileDetails = async () => {
    const receiverDetailsIndex = othersUserProfile.findIndex((profile) => profile.userIdAuth === receiverSlug
    )


    if (receiverDetailsIndex === -1) {
      const Profiles = await profile.listProfile({
        slug: receiverSlug
      });
      receiverName.current = Profiles.documents[0]?.name
      setreceiverDetails([
        Profiles.documents[0]
      ])
    } else {
      receiverName.current = othersUserProfile[receiverDetailsIndex].name
      setreceiverDetails([
        othersUserProfile[receiverDetailsIndex]
      ])
    }

    let isChatRoomExists = await personalChat.getPersonalChatRoom(ChatRoomID);

    if (isChatRoomExists) {

    } else {

      let participantsDetails = [
        JSON.stringify({ FirstParticipant: senderDetails.name }),
        JSON.stringify({ SecondParticpant: receiverName.current })
      ]
      console.log(participantsDetails)
      let createdChatRoom = await personalChat.createPersonalChatRoom({
        ChatRoomID,
      }, participantsDetails)
    }

  }

  useEffect(() => {
    if (ChatRoomID) {
      getParticipantsProfileDetails()
    }

  }, [ChatRoomID])

  useEffect(() => {
    generateChatroomId(senderSlug, receiverSlug)
      .then((res) => {
        setchatRoomID(res)
      })
  }, [])
  
  return (
    (receiverDetails?.length > 0 && ChatRoomID) ?
      <div className='PersonalChatPage'>
        <PersonalChat receiverDetails={receiverDetails} ChatRoomID={ChatRoomID} />
      </div> : <div className='w-full h-full flex justify-center items-center'>
        <SecondLoader />
      </div>
  )

}
export default PersonalChatPage