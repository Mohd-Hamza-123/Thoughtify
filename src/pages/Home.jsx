import "./Home.css";

import { HomeLeft, HomeRight, Trigger } from "../components/index";


const Home = () => {

  return (
    <div>
      <Trigger />
      <div className="w-full relative flex md:flex-row flex-col gap-5 px-4 pb-5 lg:my-4 mb-2">
        <HomeLeft />
        <HomeRight />
      </div>
    </div>
  );
};

export default Home;
