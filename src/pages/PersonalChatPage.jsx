import React, { useEffect, useState } from 'react'
import { PersonalChat } from '../components/index'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import profile from '../appwrite/profile'
import personalChat from '../appwrite/personalChat'
import generateChatroomId from '../components/Chat/GenerateChatRoomID'

const PersonalChatPage = () => {

  const { senderSlug, receiverSlug } = useParams()
  const [receiverDetails, setreceiverDetails] = useState([])
  const senderDetails = useSelector((state) => state.profileSlice.userProfile)
  const [ChatRoomID, setchatRoomID] = useState('');

  const getParticipantsProfileDetails = async () => {

    const Profiles = await profile.listProfile({
      slug: receiverSlug
    });

    const getPreview = await profile.getStoragePreview(Profiles.documents[0].profileImgID)

    setreceiverDetails([
      Profiles.documents[0],
      getPreview.href
    ])


    let isChatRoomExists = await personalChat.getPersonalChatRoom(ChatRoomID)


    if (isChatRoomExists) {
      // console.log('chat Room exists')


    } else {
      // console.log("chat Room not exists")
      let participantsDetails = [
        JSON.stringify({ FirstParticipant: senderDetails.name }),
        JSON.stringify({ SecondParticpant: Profiles.documents[0].name })
      ]
      // console.log(participantsDetails)
      let createdChatRoom = await personalChat.createPersonalChatRoom({
        ChatRoomID,
      }, participantsDetails,)
    }

    // console.log(createdChatRoom)
  }

  useEffect(() => {
    if (ChatRoomID) {
      // console.log(ChatRoomID)
      getParticipantsProfileDetails()
    }

  }, [ChatRoomID])

  useEffect(() => {
    generateChatroomId(senderSlug, receiverSlug)
      .then((res) => {
        // console.log(res)
        setchatRoomID(res)
      })
  }, [])
  return (
    <>
      {receiverDetails && ChatRoomID ? <PersonalChat receiverDetails={receiverDetails} ChatRoomID={ChatRoomID} /> : 'loading'}
    </>
  )

}
export default PersonalChatPage