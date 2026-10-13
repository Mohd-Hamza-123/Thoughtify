import { memo } from "react";
import ViewPostMain from "./ViewPostMain";
import ViewPostHeader from "./ViewPostHeader";

const ViewPostMainContent = ({ post }) => {

  return (
    <section className="p-2 shadow-lg">
      <ViewPostHeader post={post} />
      <ViewPostMain post={post} />
    </section>
  );
};

export default memo(ViewPostMainContent);