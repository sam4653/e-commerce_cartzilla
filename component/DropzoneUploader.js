import React from "react";

import Dropzone from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";

const SimpleDropZone = ({ setData }) => {
    // Payload data and url to upload files
    const getUploadParams = ({ meta }) => {
        return { url: "https://httpbin.org/post" };
    };

    // Return the current status of files being uploaded
    const handleChangeStatus = ({ meta, file }, status) => {
        console.log("change :", status, meta, file);
    };

    // Return array of uploaded files after submit button is clicked
    const handleDropzoneSubmit = (files, allFiles) => {
        // console.log(files.map((f) => f.meta));

        allFiles.forEach((f) => f.remove());
        setData((prev) => ({
            ...prev,
            photo: files.map((f) => f.file),
        }));
    };

    return (
        <Dropzone
            getUploadParams={getUploadParams}
            onChangeStatus={handleChangeStatus}
            onSubmit={handleDropzoneSubmit}
            accept="image/*"
            maxFiles={5}
            inputContent={(files, extra) =>
                extra.reject
                    ? "Only Image is allowed"
                    : "Select and Drop Multiple Files"
            }
            styles={{
                dropzoneReject: {
                    borderColor: "#F19373",
                    backgroundColor: "#F1BDAB",
                },
                inputLabel: (files, extra) =>
                    extra.reject
                        ? {
                              color: "#A02800",
                          }
                        : {},
            }}
        />
    );
};

export default SimpleDropZone;
