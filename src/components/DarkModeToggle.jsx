import React from "react";
import { useAskContext } from "@/context/AskContext";
const DarkModeToggle = () => {
    const {
        setIsOpen,
        isDarkModeOn,
        setisDarkModeOn,
        setisOverlayBoolean,
      } = useAskContext();
  return (
    <div className="SideBar_Day_Night_Mode">
      <div className="SideBar_NightDayIcon_Div">
        <div>
          <label htmlFor="Night">
            <i
              onClick={() => {
                setisDarkModeOn(true);
                setisOverlayBoolean(false);
                setIsOpen(false);
              }}
              className="fa-regular fa-moon flex justify-center cursor-pointer"
            ></i>
          </label>
        </div>
        <input
          onChange={() => setisDarkModeOn(true)}
          type="radio"
          name="Day_Night"
          id="Night"
          defaultChecked={isDarkModeOn ? true : false}
        />
      </div>

      <div className="SideBar_NightDayIcon_Div">
        <div>
          <label htmlFor="Day">
            <i
              onClick={() => {
                setisDarkModeOn(false);
                setIsOpen(false);
                setisOverlayBoolean(false);
              }}
              className="fa-regular fa-sun cursor-pointer flex justify-center"
            ></i>
          </label>
        </div>
        <input
          onChange={() => setisDarkModeOn(false)}
          type="radio"
          name="Day_Night"
          id="Day"
          defaultChecked={isDarkModeOn ? false : true}
        />
      </div>
    </div>
  );
};

export default DarkModeToggle;
