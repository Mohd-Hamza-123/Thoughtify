import React from "react";
import { CiUser } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { GrSystem } from "react-icons/gr";
import { BsDownload } from "react-icons/bs";
import { WiDaySunny } from "react-icons/wi";
import { GiBeveledStar } from "react-icons/gi";
import { PiChatsCircleLight } from "react-icons/pi";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { MdOutlineNightlight } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropright } from "react-icons/io";
import { IoIosSwitch } from "react-icons/io";
import { AiOutlineLeftCircle } from "react-icons/ai";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import { FaThumbsUp } from "react-icons/fa";
import { FaThumbsDown } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
const Icons = {
  dislike : (props) => (<FaThumbsDown {...props} />),
  like : (props) => (<FaThumbsUp {...props} />),
  views : (props) => (<IoEyeSharp {...props} />),
  trashcan : (props) => (<FaRegTrashCan {...props} />),
  switch : (props) => (<IoIosSwitch {...props} />),
  dropdownleft : (props) => (<AiOutlineLeftCircle {...props} />),
  dropdownright : (props) => (<IoIosArrowDropright {...props} />),
  dropdown : (props) => (<IoIosArrowDropdown {...props} />),
  bell : (props) => (<IoNotificationsOutline {...props} />),
  edit: (props) => (<MdEdit {...props} />),
  profile: (props) => (<CiUser {...props} />),
  day: (props) => (<WiDaySunny {...props} />),
  logout: (props) => (<CiLogout {...props} />),
  system : (props) => (<GrSystem {...props} />),
  download: (props) => (<BsDownload {...props} />),
  special: (props) => (<GiBeveledStar {...props} />),
  chats: (props) => (<PiChatsCircleLight {...props} />),
  night: (props) => (<MdOutlineNightlight {...props} />),
  trusted: (props) => (<VscWorkspaceTrusted {...props} />),
  comment: (props) => (<FaComment {...props} />),
  cross: (props) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      viewBox="0 0 384 512"
    >
      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
    </svg>
  ),
  search: (props) => (
    <svg
      {...props}
      id="search_icon"
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      viewBox="0 0 512 512"
    >
      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
    </svg>
  ),

};

export default Icons;
