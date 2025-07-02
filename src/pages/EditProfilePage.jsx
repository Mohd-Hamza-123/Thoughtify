import React from 'react'
import "./EditProfilePage.css"
import { useParams } from 'react-router-dom'
import { EditProfile } from '../components/index'
import { useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux'

const EditProfilePage = () => {
    
    const userData = useSelector((state) => state.auth.userData)
    const { slug } = useParams();
    const navigate = useNavigate()
    const realUser = slug === userData?.$id;

    if (!realUser) return navigate("/")

    return <EditProfile />

}

export default EditProfilePage