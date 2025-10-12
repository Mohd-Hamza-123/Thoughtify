import React from "react";
import { Icons } from ".";


const DarkModeToggle = () => {

  const closeSideBarAndOverlay = () => {
    
  }


  return (

    <div
      className="flex gap-5 py-2 rounded-md px-6 justify-between items-center">
      <p>Theme</p>
      <div className="flex gap-5 items-center border bg-white rounded-xl px-3 py-1">
        <Icons.day
          onClick={closeSideBarAndOverlay} className="cursor-pointer text-lg hover:fill-blue-600"
        />
        <Icons.night
          onClick={closeSideBarAndOverlay}
          className="cursor-pointer text-lg hover:fill-blue-600"
        />
        <Icons.system
          onClick={closeSideBarAndOverlay} className="cursor-pointer text-lg  hover:text-blue-600"
        />
      </div>

    </div>

  );
};

export default DarkModeToggle;


{/* <div className="SideBar_Day_Night_Mode">
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
</div> */}