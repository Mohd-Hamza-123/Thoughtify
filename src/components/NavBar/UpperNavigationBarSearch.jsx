import React from "react";
import { Icons } from "..";
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
    <form onSubmit={handleSubmit(submit)} className="flex bg-white-secondary border p-1 md:p-2 rounded-xl overflow-hidden w-1/2 md:w-full">

      <input
        {...register("searchQuestion", {
          required: true,
        })}
        className="text-black text-sm md:text-md outline-none bg-transparent poppins w-full px-1"
        type="search"
        placeholder="Search Title"
      />

      <button type="submit" className="px-1 md:px-3">
        <Icons.search className="text-bold text-sm md:text-lg" />
      </button>
    </form>

  );
};

export default UpperNavigationBarSearch;
