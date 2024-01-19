import React, { useEffect } from "react";
import "./MyProfile.css";
import authService from "../../appwrite/auth";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../../store/authSlice";
import { Favourite, Opinions, Questions, ProfileSummary } from "../index";
import { Button } from "../index";

const MyProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.auth.status);
  // useEffect(() => {
  //   authService
  //     .getCurrentUser()
  //     .then((userData) => {
  //       if (userData) {
  //         dispatch(login({ userData }));
  //         navigate("/Myprofile");
  //       } else {
  //         dispatch(logout());
  //         navigate("/signup");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     })
  //     .finally(() => {
  //       // setLoading(false);
  //     });
  // }, []);

  return (
    <div id="MyProfile_Parent" className="py-4">
      <div id="MyProfile" className="">
        <div id="MyProfile_Header" className="w-full flex">
          <div className="w-2/3 flex">
            <div
              id="MyProfile_Img_Div"
              className="w-1/4 h-full flex justify-center items-center"
            >
              <span>
                <i className="fa-regular fa-pen-to-square"></i>
              </span>
              <img
                src="https://i.pinimg.com/736x/01/35/f3/0135f3c592342631da4308a8b60b98bc.jpg"
                alt=""
              />
            </div>
            <div
              id="MyProfile_Name_Div"
              className="w-3/4 h-full flex flex-col justify-center gap-3"
            >
              <section className="flex flex-col items-left">
                <h6>{`Mohd Hamza`}</h6>
                <div>
                  <span>Gender : </span>
                  <span>{`Male`}</span>
                </div>
              </section>
              <div id="MyProfile_3Buttons" className="flex gap-3">
                <Button className="p-2 rounded-sm">Message</Button>
                <Button className="p-2 rounded-sm">Follow</Button>
                <Button className="p-2 rounded-sm">Block</Button>
              </div>
            </div>
          </div>

          <div id="MyProfile_VerticalLine" className="h-full flex items-center">
            <p></p>
          </div>

          <div
            id="MyProfile_Header_Right"
            className="w-1/3 flex flex-col items-start justify-center gap-3 p-5"
          >
            <div className="flex w-full">
              <p className="w-1/2">Country :</p>
              <div>
                <span>India</span>
                <span>
                  <img src="#" alt="" />
                </span>
              </div>
            </div>

            <div className="flex w-full">
              <p className="w-1/2">Followers :</p>
              <span>38</span>
            </div>
            <div className="flex w-full">
              <p className="w-1/2">QueryFlow Age :</p>
              <span>4 hours</span>
            </div>
            <div className="flex w-full">
              <p className="w-1/2">Last seen :</p>
              <span>1 hour ago</span>
            </div>
          </div>
        </div>

        <div id="MyProfile_Data" className="flex">
          <section id="MyProfile_Data_section">
            <ul className="flex justify-between">
              <li onClick={() => {}} className="MyProfile_Data_items">
                Profile Summary
              </li>

              <li onClick={() => {}} className="MyProfile_Data_items">
                Questions
              </li>

              <li onClick={() => {}} className="MyProfile_Data_items">
                Opinions
              </li>
              <li onClick={() => {}} className="MyProfile_Data_items">
                Favourites
              </li>

              <li onClick={() => {}} className="MyProfile_Data_items">
                More
              </li>
            </ul>
          </section>
        </div>

        <div>
          <ProfileSummary />
          {/* <Favourite />
          <Opinions />
          <Questions /> */}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
