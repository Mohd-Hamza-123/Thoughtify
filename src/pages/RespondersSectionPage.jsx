import { HomeLeft } from "../components";
import { HomeRight } from "../components";
import React, { useState } from "react";
import { Trigger } from "../components";

const RespondersSectionPage = () => {

  const [switchTrigger, setSwitchTrigger] = useState(true);

  return (
    <div>
      <Trigger setSwitchTrigger={setSwitchTrigger} />
      <div className="w-full relative flex md:flex-row flex-col gap-5 px-4 pb-5 lg:my-4 mb-2">
        <HomeLeft
          switchTrigger={switchTrigger}
          isTrustedResponder={true} />
        <HomeRight
          switchTrigger={switchTrigger}
        />
      </div>
    </div>
  );
};

export default RespondersSectionPage;
