import React from 'react'
import { AskQue, Container, UpperNavigationBar, NavBar, HorizontalLine, LowerNavigationBar } from '../components/index'
const AskQuestion = () => {
    return (
        <>
            <Container>
                <UpperNavigationBar />
                <HorizontalLine />
                <LowerNavigationBar />
                <AskQue />
            </Container>
        </>
    )
}

export default AskQuestion

export const getProfilePicData = async () => {
    if (myUserProfile) {
        // setprofileImgURL(myUserProfile?.profileImgURL)
        return myUserProfile?.profileImgURL
    } else {
        const profileData = await profile.listProfile({ slug: userData?.$id })
        if (profileData.documents.length > 0) {
            const profileImgID = profileData.documents[0].profileImgID
            const profileImgURL = await profile.getStoragePreview(profileImgID)
            return profileImgURL.href
        }
    }
}