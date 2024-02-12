import React, { useEffect, useState } from 'react'
import { PersonalChat } from '../components/index'
import { useParams } from 'react-router-dom'
import profile from '../appwrite/profile'

const PersonalChatPage = () => {
  const { senderSlug, receiverSlug } = useParams()
  const [partipantsDetails, setpartipantsDetails] = useState({})
  const [senderProfileImgURL, setSenderProfileImgURL] = useState('')
  const [receiverProfileImgURL, setReceiverProfileImgURL] = useState('')
  const getParticipantsProfileDetails = async () => {
    const Profiles = await profile.listProfiles({
      senderSlug,
      receiverSlug
    });
    const getImgURL = async () => {
      profile.getStoragePreview(Profiles.documents[0].profileImgID)
        .then((res) => {
          setSenderProfileImgURL(res.href)
        })
        .finally(() => {
          profile.getStoragePreview(Profiles.documents[1].profileImgID)
            .then((res) => {
              setReceiverProfileImgURL(res.href)
              setpartipantsDetails({
                senderName: Profiles.documents[0].name,
                senderProfileImgURL: senderProfileImgURL,
                receiverName: Profiles.documents[1].name,
                receiverProfileImgURL: receiverProfileImgURL
              })
            })
        })




    }
    getImgURL()
    // console.log(Profiles)


  }

  useEffect(() => {
    getParticipantsProfileDetails()

  }, [])
  return (
    <>
      <PersonalChat partipantsDetails={partipantsDetails} />
    </>
  )
}

export default PersonalChatPage