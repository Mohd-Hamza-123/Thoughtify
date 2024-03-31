import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";


const RTE = ({
  name,
  control,
  defaultValue = "",
  handleImageUpload,
}) => {
  const [imgArr, setimgArr] = useState([]);

  useEffect(() => {
    handleImageUpload(imgArr);
  }, [imgArr, setimgArr]);
  // console.log(imgArr);
  return (
    <div className="w-full">
      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey="7iij1fvwyx1hpj73fvi2kgneqe5696kdqrlchijnbuenk7s0"
            initialValue={defaultValue}
            init={{
              initialValue: defaultValue,
              height: 500,
              menubar: true,
              plugins: [
                "image",
                // "advlist",
                "autolink",
                "lists",
                "link",
                // "charmap",
                // "preview",
                "anchor",
                "searchreplace",
                // "visualblocks",
                // "code",
                "insertdatetime",
                "media",
                "table",
                // "code",
                "anchor",
                // "codesmaple",
              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
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

              setup: (editor) => {
                editor.on("NodeChange", async (event) => {
                  const url = document.querySelector(".tox-control-wrap input");

                  if (url) {
                    let URL = url.value;
                    setimgArr((prev) => [...prev, URL]);
                  }
                });
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
