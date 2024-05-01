import React, { useEffect, useState } from "react";
import "./TrustedRespondersPage.css";
import {
    HorizontalLine,
    LowerNavigationBar,
    UpperNavigationBar,
} from "../components";
import profile from "../appwrite/profile";
import { useNavigate } from "react-router-dom";
import { useAskContext } from "../context/AskContext";

import conf from "../conf/conf";

const TrustedRespondersPage = () => {
    const { mainResponder, setmainResponder } = useAskContext();
    const [trustedRespondersArr, setTrustedRespondersArr] = useState([]);
    // console.log(conf.myPrivateUserID)
    const navigate = useNavigate();
    const getResponders = async () => {
        try {
            const responders = await profile.listProfilesWithQueries({
                listResponders: true,
            });
            setTrustedRespondersArr(responders?.documents);
        } catch (error) {
            console.error("Error fetching responders:", error);
        }
    };

    useEffect(() => {
        getResponders();
        if (!mainResponder) {
            profile.listProfile({ slug: conf.myPrivateUserID }).then((res) => {
                console.log(res);
                setmainResponder((prev) => res?.documents[0]);
            });
        }
    }, []);

    const [profileImageURLs, setProfileImageURLs] = useState({});

    useEffect(() => {
        const fetchProfileImageURLs = async () => {
            const imageURLs = {};
            for (const responder of trustedRespondersArr) {
                if (responder?.profileImgID) {
                    try {
                        const imageURL = await profile.getStoragePreview(
                            responder?.profileImgID
                        );
                        imageURLs[responder?.profileImgID] = imageURL;
                    } catch (error) {
                        console.error(
                            `Error fetching profile image for responder ${responder?.profileImgID}:`,
                            error
                        );
                        imageURLs[responder?.profileImgID] = "fallback_image_url";
                    }
                }
            }
            setProfileImageURLs(imageURLs);
        };

        fetchProfileImageURLs();
    }, [trustedRespondersArr]);

    return (
        <div className="TrustedResponderPage">
            <UpperNavigationBar />
            <HorizontalLine />
            <LowerNavigationBar />
            <HorizontalLine />
            <h3 id="TrustedResponderspage_Heading" className="text-center">
                Responders
            </h3>

            {mainResponder && (
                <div
                    id="TrustedRespondersPage_wrapper_container"
                    className="flex w-full justify-center"
                >
                    <div className="wrapper">
                        <div>
                            <div
                                onClick={() =>
                                    navigate(`/profile/${mainResponder?.userIdAuth}`)
                                }
                                className="img-area cursor-pointer"
                            >
                                <div className="inner-area">
                                    <img src={mainResponder?.profileImgURL} />
                                </div>
                            </div>

                            <div
                                onClick={() =>
                                    navigate(`/profile/${mainResponder?.userIdAuth}`)
                                }
                                className="TrustedRespondersPage_name cursor-pointer"
                            >
                                {mainResponder?.name}
                            </div>

                            <div className="social-icons">
                                <a
                                    href="https://github.com/Mohd-Hamza-123"
                                    target="_blank"
                                    className="github"
                                >
                                    <i className="fab fa-github"></i>
                                </a>
                                <a
                                    href="https://www.instagram.com/bytedeveloper.hamza/"
                                    target="_blank"
                                    className="insta"
                                >
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="https://twitter.com/Mohd_Hamza_byte" target="_blank">
                                    <i className="fa-brands fa-x-twitter"></i>
                                </a>
                                <a href="https://www.linkedin.com/in/mohd-hamza-18959427a/" target="_blank">
                                    <i className="fa-brands fa-linkedin"></i>
                                </a>
                            </div>
                        </div>
                        <div
                            className="cursor-pointer"
                            onClick={() => navigate(`/profile/${mainResponder?.userIdAuth}`)}
                        >
                            <div className="about tag-red">{mainResponder?.occupation}</div>
                            <section className="TrustedRespondersPage_Bio">
                                {mainResponder?.bio}
                            </section>
                        </div>
                    </div>
                </div>
            )}
            <div id="TrustedRespondersPage">
                <div className="TrustedRespondersPage_container">
                    {trustedRespondersArr.map((respondersObj, index) => {
                        if (respondersObj.userIdAuth === conf.myPrivateUserID) return;
                        return (
                            <div
                                key={respondersObj.$id}
                                onClick={() => navigate(`/profile/${respondersObj.userIdAuth}`)}
                                className="card cursor-pointer"
                            >
                                <div className="card__footer">
                                    <div className="w-full user flex flex-col">
                                        <div className="w-full flex justify-center">
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
                                    <span className="tag tag-red">
                                        {respondersObj.occupation}
                                    </span>
                                    <p>{respondersObj.bio}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TrustedRespondersPage;
