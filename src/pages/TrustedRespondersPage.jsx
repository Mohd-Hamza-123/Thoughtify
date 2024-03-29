import React, { useEffect, useState } from 'react'
import './TrustedRespondersPage.css'
import { HorizontalLine, LowerNavigationBar, UpperNavigationBar } from '../components'
import profile from '../appwrite/profile'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAskContext } from '../context/AskContext'



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
            <h3 id='TrustedResponderspage_Heading' className='text-center'>Responders</h3>
            <div id='TrustedRespondersPage_wrapper_container' className='flex w-full justify-center'>
               
                <div className="wrapper">
                    <div>
                        <div className="img-area">
                            <div className="inner-area">
                                <img src="https://images.unsplash.com/photo-1492288991661-058aa541ff43?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="" />
                            </div>
                        </div>

                        <div className="name">CodingNepal</div>

                        <div className="TrustedRespondersPage_buttons">
                            <button>Message</button>
                            <button>Follow</button>
                        </div>
                        <div className="social-icons">
                            <a href="#" className="fb"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="twitter"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="insta"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                    <div>
                        <div className="about tag-red">Designer & Developer</div>
                        <section>Bio</section>
                    </div>
                </div>

            </div>
            <div id='TrustedRespondersPage'>
                <div className="TrustedRespondersPage_container">

                    {trustedRespondersArr.map((respondersObj, index) => {

                        if (respondersObj.userIdAuth === `65cce8e4b7ca69061cc8`) return
                        return <div key={respondersObj.$id} onClick={() => navigate(`/profile/${respondersObj.userIdAuth}`)} className="card cursor-pointer">
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
                    })}
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


