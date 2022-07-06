import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ImageUpload = ({ fileData, setFileData, setData, setButtonMsg, data }) => {
    // const [file, setFile] = useState(fileData?.length ? [...fileData] : [{ data: [], url: ''}]);

    // console.log(file);
    const router = useRouter();
    const [image, setImage] = useState([]);
    const [test, setTest] = useState([])

    const handleImageUpload = (e) => {
        let tempArr = [];
        setButtonMsg("Click on upload button");
        // if (router.pathname === "/vendor/productAdd") {
        //     if (data.photos.length !== 0) {
        //         data.photos.map((d) => {
        //             tempArr.push({ data: d.data, url: d.url });
        //         })
        //     }
        // }
        [...e.target.files].forEach((file) => {
            tempArr.push({ data: file, url: URL.createObjectURL(file) });
        });
        setFileData((prev) => ([...prev, ...tempArr]));
        // if (router.pathname === "/vendor/productAdd") {
        //     if (data.photos.length === 0) {
        //         setFileData((prev) => ([...prev, ...tempArr]));
        //     }
        //     else {
        //         setFileData(tempArr)
        //     }
        // }
        // else {
        //     setFileData((prev) => ([...prev, ...tempArr]));
        // }

    };

    function upload(e) {
        setButtonMsg("");
        e.preventDefault();
        let finalFile = fileData.map((f) => {
            return { data: f.data, url: f.url };
        });
        // file.forEach((f) => console.log(f.data));
        // console.log(finalFile);
        // setImage([finalFile]);
        setFileData(finalFile);
        setData((prev) => ({ ...prev, photos: finalFile }));
    }

    function deleteFile(e) {
        const s = fileData.filter((item, index) => index !== e);
        setFileData(s);
        setData((prev) => ({ ...prev, photos: s }));

        // console.log("s", s);
    }

    function deleteFileData(e) {
        const s = data.photos.filter((item, index) => index !== e);
        setFileData(s);
        setData((prev) => ({ ...prev, photos: s }));

        // console.log(s);
    }

    return (
        <>
            <div className="form-group">
                <input
                    type="file"
                    multiple
                    disabled={fileData.length >= 5}
                    className="form-control"
                    onChange={handleImageUpload}
                    accept="image/*"
                />
            </div>
            <div className="form-group preview">
                {fileData.length > 0 ? (
                    <div className="d-flex flex-wrap flex-row my-1">
                        {fileData.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="p-2 rounded-circle position-relative"
                                >
                                    <img
                                        className="rounded-circle"
                                        src={item.url}
                                        name="image"
                                        alt="Product Image"
                                        style={{
                                            height: "75px",
                                            width: "75px",
                                        }}
                                    />
                                    <button type="button" className="btn close">
                                        <span
                                            aria-hidden="true"
                                            onClick={() => deleteFile(index)}
                                        >
                                            ×
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>)
                    :
                    (<div className="d-flex flex-wrap flex-row my-1">
                        {data?.photos?.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="p-2 rounded-circle position-relative"
                                >
                                    <img
                                        className="rounded-circle"
                                        src={item.url}
                                        name="image"
                                        alt="Product Image"
                                        style={{
                                            height: "75px",
                                            width: "75px",
                                        }}
                                    />
                                    <button type="button" className="btn close">
                                        <span
                                            aria-hidden="true"
                                            onClick={() => deleteFileData(index)}
                                        >
                                            ×
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    )}
            </div>
            <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={upload}
            >
                Upload
            </button>
            {/* {console.log("Data", data.photos)}
            {console.log("fileData", router)} */}
        </>
    );
};

export default ImageUpload;
