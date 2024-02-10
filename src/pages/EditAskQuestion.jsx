import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import appwriteService from '../appwrite/config'
import { AskQue, HorizontalLine, LowerNavigationBar, UpperNavigationBar } from '../components/index'


const EditAskQuestion = () => {
    const [post, setPost] = useState(null)
    const { slug } = useParams()
    
    const getPost = async () => {
        let userData = await appwriteService.getPost(slug)
        setPost(userData)
    }

    useEffect(() => {
        getPost()
    }, [])

    return (
        post ? <>
            <UpperNavigationBar />
            <HorizontalLine />
            <LowerNavigationBar />
            <AskQue post={post} />

        </> : '...loading'
    )
}

export default EditAskQuestion