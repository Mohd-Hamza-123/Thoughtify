import React from "react";
import { AskQue } from "../components/index";
import SectionTrigger from "@/components/Home/Trigger/SectionTrigger";

const AskQuestion = () => {
  return (
    <>
      <div className="w-full flex justify-end px-3">
        <SectionTrigger />
      </div>
      <AskQue />
    </>
  );
};

export default AskQuestion;
