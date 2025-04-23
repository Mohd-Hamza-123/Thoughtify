import "./Home.css";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAskContext } from "../context/AskContext";
import { HomeLeft, HomeRight} from "../components/index";

const Home = () => {

  const { isDarkModeOn } = useAskContext();
  const homeRight = useRef();
  const homeLeft = useRef();

  const HomePageRef = useRef();
  const lastScrollY = useRef(window.scrollY);
  const [isNavbarHidden, setisNavbarHidden] = useState(false);

  const handleScroll = (e) => {
    let position = e.target.scrollTop;

    sessionStorage.setItem("scrollPosition", position.toString());
    if (lastScrollY.current < position) {
      setisNavbarHidden(true);
    } else {
      setisNavbarHidden(false);
    }
    lastScrollY.current = position;
  };

  useEffect(() => {
    if (HomePageRef.current) {
      const storedScrollPosition = sessionStorage.getItem("scrollPosition");
      const parsedScrollPosition = parseInt(storedScrollPosition, 10);

      HomePageRef.current.scrollTop = parsedScrollPosition;
    }
  }, [HomePageRef.current]);

  const toggleGridButton = () => {
    if (homeLeft.current && homeRight.current) {
      homeLeft.current.classList.toggle("none");
    }
  };

  return (
    <div
      ref={HomePageRef}
      className="w-full h-[80dvh]"
      onScroll={handleScroll}
    >
      <div
        className={`h-full relative flex gap-5 px-5 py-5 w-full ${
          isDarkModeOn ? "darkMode" : ""
        }`}
      >
        <Button
          onClick={toggleGridButton}
          className="flex justify-center items-center w-8 md:hidden"
          variant="outline"
        >
          <i className="bx bxs-grid-alt text-xl"></i>
        </Button>
        <HomeLeft />
        <HomeRight />
      </div>
    </div>
  );

};

export default Home;
