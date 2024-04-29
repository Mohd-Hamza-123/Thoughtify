import React, { useRef } from "react";
import "./ChatRTE.css";
import { Editor, } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
const ChatRTE = ({ name, control, editorRef }) => {

  return (
    <div id="ChatRTE" className="w-full">
      <Controller
        name={name || "commentContent"}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey="7iij1fvwyx1hpj73fvi2kgneqe5696kdqrlchijnbuenk7s0"
            initialValue=""
            init={{
              height: 200,
              autoresize_max_height: 400, //
              menubar: false,
              plugins: ["lists", "image"],
              toolbar:
                "image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | code ",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:18px }",
              file_picker_callback: function (callback, value, meta) {
                if (meta.filetype === "image") {
                  const input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/*");
                  input.onchange = function (e) {
                    const file = input.files[0];
                    const MAX_FILE_SIZE = 1 * 1024 * 1024;
                    if (file.size > MAX_FILE_SIZE) {
                      console.log("Image Must be Less then and Equal to 1 MB ")
                      return
                    }
                    const reader = new FileReader();
                    reader.onload = function () {
                      callback(reader.result, {
                        alt: file.name,
                        width: "300px",
                        height: "200px",
                      });
                    };
                    reader.readAsDataURL(file);
                  };
                  input.click();
                }
              },
            }}
            onEditorChange={(commentContent) => {
              onChange(commentContent);
            }}
            onInit={(evt, editor) => {
              editorRef.current = editor;
            }}
          />
        )}
      />
    </div>
  );
};

export default ChatRTE;

