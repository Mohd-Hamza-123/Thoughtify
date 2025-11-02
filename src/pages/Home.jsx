import "./Home.css";
import { useState } from "react";
import { HomeLeft, HomeRight, Trigger, Setting, Feedback } from "../components/index";

const Home = () => {

  const [switchTrigger, setSwitchTrigger] = useState(true);

  return (
    <div>
      <Trigger setSwitchTrigger={setSwitchTrigger} />
      <div className="w-full relative flex md:flex-row flex-col gap-5 px-4 pb-5 lg:my-4 mb-2">
          <HomeLeft
            switchTrigger={switchTrigger}
            isTrustedResponder={false}
          />
        <HomeRight switchTrigger={switchTrigger} />
      </div>
      <Setting />
      <Feedback />
    </div>
  );
};

export default Home;
