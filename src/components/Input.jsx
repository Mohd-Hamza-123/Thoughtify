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
        className={`outline-none ${className}`}
        type={type}
        {...props}
      />
    </div>
  );
};

export default forwardRef(Input);
