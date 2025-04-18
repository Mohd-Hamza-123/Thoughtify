import React from "react";
import { useForm } from "react-hook-form";
import { useAskContext } from "@/context/AskContext";
import { useNavigate } from "react-router-dom";
import { SvgIcons } from "..";

const UpperNavigationBarSearch = () => {
  const navigate = useNavigate();
  const { isDarkModeOn } = useAskContext();
  const { register, handleSubmit, setValue } = useForm();

  const submit = (data) => {
    navigate(`/BrowseQuestion/${null}/${data?.searchQuestion}`);
    setValue("searchQuestion", "");
  };
  return (
    <div id="UpperNavigationBar_Search_Bar">
      <form onSubmit={handleSubmit(submit)} className="search_Form">
        <div className={`search_icon_div ${isDarkModeOn ? "darkMode" : ""}`}>
          <button type="submit">
            <SvgIcons.search />
          </button>
        </div>

        <div className="search_div_input h-inherit">
          <input
            {...register("searchQuestion", {
              required: true,
            })}
            id="UpperNavigationBar_search_Input"
            className={`outline-none font-bold text-black  rounded-t-none rounded-b-none ${
              isDarkModeOn ? "darkMode" : ""
            }`}
            type="search"
            placeholder="Search Title"
          />
        </div>
      </form>
    </div>
  );
};

export default UpperNavigationBarSearch;
