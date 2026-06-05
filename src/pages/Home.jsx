
import { useState } from "react";
import { HomeLeft, HomeRight, Trigger, Setting, Feedback } from "../components/index";
import { useSelector } from 'react-redux'


const Home = () => {

   const myProfile = useSelector((state) => state.profileSlice.userProfile)
  const [switchTrigger, setSwitchTrigger] = useState(true);

  return (
    <div>
      <Trigger setSwitchTrigger={setSwitchTrigger} />
      <div className="w-full relative flex md:flex-row flex-col gap-5 px-4 pb-5 lg:my-4 mb-2">
        <HomeLeft switchTrigger={switchTrigger} isTrustedResponder={false} />
        <HomeRight switchTrigger={switchTrigger} />
      </div>
      {myProfile && <Setting />}
      <Feedback />
    </div>
  );
};

export default Home;
