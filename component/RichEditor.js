import React, { useEffect, useRef, useState } from "react";
import SunEditor from "suneditor-react";
import Parser from "html-react-parser";
import {
  align,
  fontColor,
  fontSize,
  hiliteColor,
  list,
  link,
  table,
  formatBlock,
  textStyle,
  image,
} from "suneditor/src/plugins";
import "suneditor/dist/css/suneditor.min.css";
const RichEditor = (props) => {
  const editor = useRef();
  const [imgCount, setImgCount] = useState(1);

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  useEffect(() => {
    localStorage.setItem("count", 1);
  }, []);
  const imageUploadBefore = (files, info, uploadHandler) => {
    if (props.image) {
      return true;
    } else {
      return false;
    }
    //   // const imgCount = localStorage.getItem("count");
    //   // if (props.image) {
    //   //   if (imgCount <= 4) {
    //   //     return true;
    //   //   } else {
    //   //     alert("You are only allow to set 4 images in editor");
    //   //     return false;
    //   //   }
    //   // } else {
    //   //   return false;
    //   // }
  };

  const handleImageUpload = (
    targetImgElement,
    index,
    state,
    imageInfo,
    remainingFilesCount
  ) => {
    const d = editor.current.getContents();
    props.setData((prev) => ({ ...prev, [props.name]: d }));

    // console.log(editor.current.getContents());
    // const imgCount = Number(localStorage.getItem("count"));
    // let temp;
    // if (state === "create") {
    //   temp = imgCount + 1;
    // }
    // if (state === "delete") {
    //   temp = imgCount - 1;
    // }
    // localStorage.setItem("count", temp);
  };

  return (
    <>
      <SunEditor
        lang="en"
        setContents={props.data}
        getSunEditorInstance={getSunEditorInstance}
        setAllPlugins={props.allPlugin ? false : true}
        onChange={(e, core) => {
          props.setData((prev) => ({ ...prev, [props.name]: e }));
          if (e !== "<p><br></p>") {
            props.setErrorDesc((prev) => ({
              ...prev,
              [props.name]: "",
            }));
          }
        }}
        showController={true}
        enableToolbar={true}
        onFocus={(event, core) => console.log("focus")}
        onBlur={(event, core) => {
          // props.setData((prev) => ({ ...prev, [props.name]: core }));
          if (core === "<p><br></p>") {
            props.setErrorDesc((prev) => ({
              ...prev,
              [props.name]: props.error,
            }));
          }
        }}
        // onBlur={() => alert("Blur")}
        setOptions={{
          defaultStyle: { fontFamily: "Poppins" },
          font: [],
          imageResizing: true,
          attributesWhitelist: {
            all: "style",
          },

          height: props.height,
          buttonList: props.allPlugin
            ? [["bold", "underline", "italic"]]
            : [
              ["undo", "redo"],
              [
                ":p-More Paragraph-default.more_paragraph",
                "font",
                "fontSize",
                "formatBlock",
                "paragraphStyle",
                "blockquote",
              ],
              [
                "bold",
                "underline",
                "italic",
                "strike",
                "subscript",
                "superscript",
              ],
              ["fontColor", "hiliteColor", "textStyle"],
              ["removeFormat"],
              ["outdent", "indent"],
              ["align", "horizontalRule", "list", "lineHeight"],
              [
                "-right",
                "fullScreen",
                "preview",
                "print",
              ],
              ["-right", "table"],
              props.image ? ["-right", "image", "link"] : ["-right", "link"],
            ],
        }}
        onImageUploadBefore={imageUploadBefore}
        onImageUpload={handleImageUpload}
      />
    </>
  );
};

export default RichEditor;
