import React from "react";
import "./AskQuestion.css";
import { AskQue} from "../components/index";
import SectionTrigger from "@/components/Home/Trigger/SectionTrigger";
const AskQuestion = () => {
  return (
    <div id="AskQuestion">
      <div className="w-full flex justify-end px-3"><SectionTrigger /></div>
      <AskQue />
    </div>
  );
};

export default AskQuestion;
