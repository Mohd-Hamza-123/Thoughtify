import React, { forwardRef } from "react";

const TextArea = (
  { id = "", className = "", placeholder = "", ...props },
  ref
) => {
  // console.log(id)
  return (
    <textarea
      ref={ref}
      id={id}
      className={className}
      placeholder={placeholder}
      {...props}
    ></textarea>
  );
};

export default forwardRef(TextArea);
