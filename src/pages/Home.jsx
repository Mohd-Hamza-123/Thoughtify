import "./Home.css";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { HomeLeft, HomeRight } from "../components/index";
import { IoGrid } from "react-icons/io5";
const Home = () => {

  const HomePageRef = useRef();
  const homeRight = useRef();
  const homeLeft = useRef();

  const toggleGridButton = () => {
    if (homeLeft.current && homeRight.current) {
      homeLeft.current.classList.toggle("none");
    }
  };

  return (

    <div className="w-full relative flex md:flex-row flex-col gap-5 px-3 lg:my-4">
      <Button
        onClick={toggleGridButton}
        className="flex justify-center items-center w-8 md:hidden"
        variant="outline">
        <IoGrid />
      </Button>
      <HomeLeft />
      <HomeRight />
    </div>

  );

};

export default Home;
