import ReactCrop from "react-image-crop";
import { useSelector } from "react-redux";
import React, { useRef, useState, memo } from "react";
import { getCanvasPreview } from "./getCanvasPreview";
import { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";


const MINIMUM_DIMENSION = 50;

const EditProfileImage = ({ profileImageURL, setProfileObject }) => {

    // console.log(profileImageURL)
    const imgRef = useRef(null)
    const canvasRef = useRef(null)


    const [crop, setCrop] = useState({});
    const [imageURL, setImageURL] = useState('');
    const [seePreviewBefore, setSeePreviewBefore] = useState('')

    
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
       <div className="w-full flex justify-center overflow-hidden">
  {!imageURL && (
    <div className="flex flex-col items-center gap-5">
      <div className="w-[180px] h-[180px] sm:w-[230px] sm:h-[230px] md:w-[260px] md:h-[260px] rounded-full overflow-hidden bg-white">
        <img
          src={profileImageURL?.replace("/preview", "/view")}
          alt="Profile Image"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <label
        htmlFor="editProfileImg"
        className="cursor-pointer px-4 py-2 rounded-md bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 transition"
      >
        Update
      </label>
    </div>
  )}

  <input
    type="file"
    accept="image/*"
    id="editProfileImg"
    className="hidden"
    onChange={onSelectFile}
  />

  {imageURL && (
    <div className="w-full flex flex-col lg:flex-row gap-6 items-center justify-center">
      <div className="w-full lg:w-1/2 flex flex-col items-center gap-4">
        <div className="w-full max-w-[350px] overflow-hidden rounded-lg border border-gray-300 bg-white">
          <ReactCrop
            circularCrop
            keepSelection
            crop={crop}
            minWidth={MINIMUM_DIMENSION}
            aspect={1}
            onChange={(crop, percentCrop) => {
              setCrop(percentCrop);
            }}
          >
            <img
              ref={imgRef}
              src={imageURL ? imageURL : profileImageURL}
              alt="Profile Image"
              onLoad={onImageLoad}
              className="max-w-full"
            />
          </ReactCrop>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-3">
          <label
            onClick={() => {
              setImageURL("");
              setProfileObject((prev) => ({
                ...prev,
                profileImage: null,
              }));
            }}
            className="cursor-pointer px-4 py-2 rounded-md bg-gray-200 text-gray-800 text-sm font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </label>

          <label
            htmlFor="editProfileImg"
            className="cursor-pointer px-4 py-2 rounded-md bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 transition flex items-center gap-2"
          >
            <span>Change Image</span>
            <i className="fa-solid fa-upload"></i>
          </label>

          <label
            onClick={() => {
              handleCrop();
              setSeePreviewBefore("");
            }}
            className="cursor-pointer px-4 py-2 rounded-md bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 transition"
          >
            See Preview
          </label>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex justify-center items-center min-h-[220px]">
        <div className="relative flex justify-center items-center">
          <canvas
            ref={canvasRef}
            id="myCanvas"
            className="max-w-[220px] max-h-[220px] rounded-full"
          ></canvas>

          {seePreviewBefore && (
            <span className="absolute text-sm text-gray-500 text-center">
              {seePreviewBefore}
            </span>
          )}
        </div>
      </div>
    </div>
  )}
</div>
    );
};

export default memo(EditProfileImage);
