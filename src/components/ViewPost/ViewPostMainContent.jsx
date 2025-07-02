import { memo } from "react";
import ViewPostHeader from "./ViewPostHeader";
import ViewPostMain from "./ViewPostMain";


const ViewPostMainContent = ({ post }) => {

  return (
    <section className="p-2 shadow-lg">
      <ViewPostHeader post={post} />
      <ViewPostMain post={post} />
    </section>
  );
};

export default memo(ViewPostMainContent);