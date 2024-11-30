import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import "./RTE.css";
import conf from "../conf/conf";
import { useAskContext } from "../context/AskContext";

const RTE = ({ name, control, defaultValue = "" }) => {
  const { setnotificationPopMsg, setNotificationPopMsgNature } =
    useAskContext();

  return (
    <div className="w-full">
      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey={conf.tinyMCEapiKey}
            initialValue={defaultValue}
            init={{
              initialValue: defaultValue,
              height: 500,
              autoresize_max_height: 800,
              menubar: true,
              codesample_global_prismjs: true,
              plugins:
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | anchor | removeformat | custom_anchor | codesample",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              codesample_languages: [
                { text: "HTML/XML", value: "markup" },
                { text: "JavaScript", value: "javascript" },
                { text: "JSX", value: "jsx" },
                { text: "TypeScript", value: "typescript" },
                { text: "TSX", value: "tsx" },
                { text: "CSS", value: "css" },
                { text: "SCSS", value: "scss" },
                { text: "Python", value: "python" },
                { text: "Java", value: "java" },
                { text: "C", value: "c" },
                { text: "C#", value: "csharp" },
                { text: "C++", value: "cpp" },
              ],
              file_picker_callback: function (callback, value, meta) {
                if (meta.filetype === "image") {
                  const editor = tinymce.activeEditor;
                  editor.selection.select(editor.getBody(), true);
                  editor.selection.collapse(false);
                  // Trigger a click on the input element for file selection
                  const input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/*");
                  input.onchange = function (e) {
                    const file = input.files[0];
                    const MAX_FILE_SIZE = 1 * 1024 * 1024;
                    if (file.size > MAX_FILE_SIZE) {
                      setNotificationPopMsgNature((prev) => false);
                      setnotificationPopMsg(
                        (prev) => "Image Must be Less then and Equal to 1 MB"
                      );
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = function () {
                      callback(reader.result, {
                        alt: file.name,
                        width: "400px",
                        height: "250px",
                      });
                    };
                    reader.readAsDataURL(file);
                  };
                  input.click();
                }
              },
            }}
            onEditorChange={(content) => {
              onChange(content);
            }}
          />
        )}
      />
    </div>
  );
};

export default RTE;
