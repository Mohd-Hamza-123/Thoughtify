import React, { useId, forwardRef } from "react";

const Input = (
  {
    id,
    label = null,
    className = "",
    placeholder = "placeholder",
    type = "text",
    ...props
  },
  ref
) => {
  // const id = useId();
  return (
    <div className="">
      {label && (
        <label htmlfor={id} className="inline-block mb-1 pl-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        placeholder={placeholder}
        className={`border duration-200 focus:bg-gray-200 outline-none px-1 ${className}`}
        type={type}
        {...props}
      />
    </div>
  );
};

export default forwardRef(Input);
