import React from "react";
import { useForm } from "react-hook-form";
import { useAskContext } from "@/context/AskContext";
import { useNavigate } from "react-router-dom";
import { SvgIcons } from "..";
import { Input } from "../ui/input";

const UpperNavigationBarSearch = () => {
  const navigate = useNavigate();
  const { isDarkModeOn } = useAskContext();
  const { register, handleSubmit, setValue } = useForm();

  const submit = (data) => {
    navigate(`/BrowseQuestion/${null}/${data?.searchQuestion}`);
    setValue("searchQuestion", "");
  };
  return (

    <form onSubmit={handleSubmit(submit)} className="flex">

      <Input
        {...register("searchQuestion", {
          required: true,
        })}
        // id="UpperNavigationBar_search_Input"
        className={`border border-black font-bold text-black ${isDarkModeOn ? "darkMode" : ""
          }`}
        type="search"
        placeholder="Search Title"
      />

      <button type="submit" className="px-3"> <SvgIcons.search className="text-bold text-lg" /> </button>
    </form>

  );
};

export default UpperNavigationBarSearch;
