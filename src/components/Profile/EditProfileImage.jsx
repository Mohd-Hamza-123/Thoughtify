import ReactCrop from "react-image-crop";
import { useSelector } from "react-redux";
import React, { useRef, useState, memo } from "react";
import { getCanvasPreview } from "./getCanvasPreview";
import { useNotificationContext } from "@/context/NotificationContext";
import { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";

const MINIMUM_DIMENSION = 50;

const EditProfileImage = ({ profileImageURL, setProfileObject }) => {

    const imgRef = useRef(null)
    const canvasRef = useRef(null)


    const [crop, setCrop] = useState({});
    const [imageURL, setImageURL] = useState('');
    const [seePreviewBefore, setSeePreviewBefore] = useState('')

    const { setNotification } = useNotificationContext();
    const userData = useSelector((state) => state.auth.userData);



    const onSelectFile = async (e) => {

        const file = e.currentTarget?.files[0];
        const MAX_FILE_SIZE = 1 * 1024 * 1024;

        if (file.size > MAX_FILE_SIZE) {
            setNotification({ message: "Image Must be Less then and Equal to 1 MB", type: "error" })
            return
        }
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            setImageURL(reader.result);
            setSeePreviewBefore('Make sure to see preview before uploading image')

        });
        reader.readAsDataURL(file);

    };

    const handleCrop = async (e) => {

        getCanvasPreview(
            imgRef?.current,
            canvasRef?.current,
            convertToPixelCrop(crop, imgRef?.current?.width, imgRef?.current?.height)
        );

        try {
            canvasRef.current.toBlob((blob) => {
                const croppedFile = new File([blob], `${userData?.name}`, { type: 'image/png' });
                setProfileObject((prev) => ({ ...prev, profileImage: croppedFile }))
            }, 'image/png');
        } catch (error) {
            setNotification({ message: "Image Upload Failed", type: "error" })
        }
    }

    function onImageLoad(e) {

        const cropSelection = document.querySelector('.ReactCrop__crop-selection');
        const { naturalWidth, naturalHeight, width, height } = e.currentTarget;

        const cropPrev = makeAspectCrop(
            {
                unit: "%",
                width: MINIMUM_DIMENSION,
            },
            1,
            width,
            height
        );
        const crops = centerCrop(cropPrev, width, height);
        setCrop(crops);
    }

    return (
        <div
            id="EditProfile_EditImage_Div"
            className="w-full flex items-center overflow-hidden justify-start gap-5">

            {(profileImageURL && !imageURL) && (
                <div id="EditProfile-Prev-active">
                    <div className="" id="EditProfile-PrevImage">
                        <img
                            src={profileImageURL}
                            className="rounded-ful bg-white"
                        />
                    </div>
                    <label
                        htmlFor="editProfileImg"
                        className="EditProfile_ChooseImg flex gap-2 items-center cursor-pointer mr-3">
                        <span> Update </span>
                        <i className="fa-solid fa-upload"></i>
                    </label>
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                name=""
                id="editProfileImg"
                className="hidden"
                onChange={onSelectFile}
            />

            {imageURL && (
                <div id="EditProfile-Prev-Inactive">
                    <div className="flex flex-col">
                        <div id="EditProfile-Prev-Inactive-2">
                            <div id="ReactCrop-container">
                                <ReactCrop
                                    circularCrop
                                    keepSelection
                                    crop={crop}
                                    minWidth={MINIMUM_DIMENSION}
                                    aspect={1}
                                    onChange={(crop, percentCrop) => { setCrop(percentCrop); }}>
                                    <img
                                        ref={imgRef}
                                        src={imageURL ? imageURL : profileImageURL}
                                        alt="Profile Image"
                                        onLoad={onImageLoad}
                                    />
                                </ReactCrop>
                            </div>
                        </div>
                        <div
                            className="w-full flex justify-center items-center"
                            id="EditProfile_label_Div">
                            <label
                                onClick={() => {
                                    setImageURL('')
                                    setProfileObject((prev) => ({ ...prev, profileImage: null }))
                                }}
                                className="EditProfile_ChooseImg flex gap-2 items-center cursor-pointer mr-3">
                                Cancel
                            </label>
                            <label
                                htmlFor="editProfileImg"
                                className="EditProfile_ChooseImg flex gap-2 items-center cursor-pointer mr-3">
                                <span> Change Image </span>
                                <i className="fa-solid fa-upload"></i>
                            </label>

                            <label
                                className="EditProfile_ChooseImg flex gap-2 items-center cursor-pointer"
                                onClick={() => {
                                    handleCrop();
                                    setSeePreviewBefore("");
                                }}>
                                <span> See Preview </span>
                            </label>
                        </div>
                    </div>

                    <div
                        className="w-full h-full flex justify-center items-center">
                        <canvas ref={canvasRef} id="myCanvas"></canvas>
                        {seePreviewBefore && (
                            <span
                                id="EditProfile-seePreviewBefore">
                                {seePreviewBefore}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(EditProfileImage);
