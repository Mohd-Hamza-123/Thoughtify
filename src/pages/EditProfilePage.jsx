import React from 'react'
import "./EditProfilePage.css"
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { EditProfile } from '../components/index'

const EditProfilePage = () => {
    
    const userData = useSelector((state) => state.auth.userData)
    const { slug } = useParams();
    const navigate = useNavigate()
    const realUser = slug === userData?.$id;

    if (!realUser) return navigate("/")

    return <EditProfile />

}

export default EditProfilePage