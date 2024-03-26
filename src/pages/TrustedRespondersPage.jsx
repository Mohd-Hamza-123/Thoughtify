import React, { useEffect, useState } from 'react'
import './TrustedRespondersPage.css'
import { HorizontalLine, LowerNavigationBar, UpperNavigationBar } from '../components'
import profile from '../appwrite/profile'
import { useNavigate } from 'react-router-dom'




const TrustedRespondersPage = () => {
    const [trustedRespondersArr, setTrustedRespondersArr] = useState([]);
    const navigate = useNavigate()
    const getResponders = async () => {
        try {
            const responders = await profile.listProfilesWithQueries({ listResponders: true });
            setTrustedRespondersArr(responders.documents);
        } catch (error) {
            console.error('Error fetching responders:', error);
        }
    };

    useEffect(() => {
        getResponders();
    }, []);

    const [profileImageURLs, setProfileImageURLs] = useState({});

    useEffect(() => {
        const fetchProfileImageURLs = async () => {
            const imageURLs = {};
            for (const responder of trustedRespondersArr) {
                if (responder.profileImgID) {
                    try {
                        const imageURL = await profile.getStoragePreview(responder.profileImgID);
                        imageURLs[responder.profileImgID] = imageURL;
                    } catch (error) {
                        console.error(`Error fetching profile image for responder ${responder.profileImgID}:`, error);
                        imageURLs[responder.profileImgID] = 'fallback_image_url';
                    }
                }
            }
            setProfileImageURLs(imageURLs);
        };

        fetchProfileImageURLs();
    }, [trustedRespondersArr]);

    return (
        <>
            <UpperNavigationBar />
            <HorizontalLine />
            <LowerNavigationBar />
            <HorizontalLine />
            <div id='TrustedRespondersPage'>
                <div className="TrustedRespondersPage_container">
                    {trustedRespondersArr.map((respondersObj, index) => (
                        <div key={respondersObj.$id} onClick={() => navigate(`/profile/${respondersObj.userIdAuth}`)} className="card cursor-pointer">
                            <div className="card__footer">
                                <div className="w-full user flex flex-col">
                                    <div className='w-full flex justify-center'>
                                        {respondersObj.profileImgID && (
                                            <img
                                                src={profileImageURLs[respondersObj.profileImgID]}
                                                alt="user__image"
                                                className="user__image"
                                            />
                                        )}
                                    </div>
                                    <div className="user__info text-center">
                                        <h5>{respondersObj.name}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="card__body">
                                <span className="tag tag-red">{respondersObj.occupation}</span>
                                <p>{respondersObj.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default TrustedRespondersPage;




















// const TrustedRespondersPage = () => {
//     const [trustedRespondersArr, settrustedRespondersArr] = useState([])
//     // console.log(trustedRespondersArr)
//     const getResponders = async () => {
//         const Responders = await profile.listProfilesWithQueries({ listResponders: true })
//         settrustedRespondersArr((prev) => Responders.documents)
//         console.log(Responders.documents.profileImgID)
//     }
//     const getImgURL = async (ImgID) => {
//         const URL = await profile.getStoragePreview(ImgID)
//         // console.log(URL.href)
//         return URL.href;
//     }
//     useEffect(() => {
//         getResponders();

//     }, [])
//     return (<>
//         <UpperNavigationBar />
//         <HorizontalLine />
//         <LowerNavigationBar />
//         <HorizontalLine />
//         <div id='TrustedRespondersPage'>
//             <div className="TrustedRespondersPage_container">
//                 {trustedRespondersArr?.map((respondersObj, index) => {

//                     return <div key={respondersObj.$id} className="card">
//                         <div className="card__footer">
//                             <div className="w-full user flex flex-col">
//                                 <div className='w-full flex justify-center'>
//                                     <img src={getImgURL(respondersObj.profileImgID)} alt="user__image" className="user__image" />
//                                 </div>
//                                 <div className="user__info text-center">
//                                     <h5>{respondersObj.name}</h5>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="card__body">
//                             <span className="tag tag-red">{respondersObj.occupation}</span>
//                             <p>{respondersObj.bio}</p>
//                         </div>

//                     </div>
//                 })}

//             </div>
//         </div>
//     </>
//     )
// }

// export default TrustedRespondersPage


