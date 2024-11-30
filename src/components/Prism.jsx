import { useEffect } from "react";
import prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-cshtml";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";

const Prism = () => {
  useEffect(() => {
    prism.highlightAll();
  }, []);
  return <div className="hidden"></div>;
};

export default Prism;
