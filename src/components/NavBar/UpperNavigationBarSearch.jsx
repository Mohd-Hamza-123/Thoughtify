import React from "react";
import { SvgIcons } from "..";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const UpperNavigationBarSearch = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();

  const submit = (data) => {
    navigate(`/BrowseQuestion/${null}/${data?.searchQuestion}`);
    setValue("searchQuestion", "");
  };
  
  return (
    <form onSubmit={handleSubmit(submit)} className="flex bg-white-secondary border p-2 rounded-xl">

      <input
        {...register("searchQuestion", {
          required: true,
        })}
        className="text-black text-md outline-none bg-transparent poppins"
        type="search"
        placeholder="Search Title"
      />

      <button type="submit" className="px-3">
        <SvgIcons.search className="text-bold text-lg" />
      </button>
    </form>

  );
};

export default UpperNavigationBarSearch;
