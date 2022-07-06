import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useRouter } from "next/router";
import withAuth from '../../../component/withAuth';
import Spinner from '../../../component/Spinner';
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { getSession } from "next-auth/client";
import Select from "react-select";
import BackButton from "../../../component/BackButton";
import { FaImage } from "react-icons/fa";
import AdminContentHeading from "../../../component/AdminContentHeading";
import { FaHome } from 'react-icons/fa'
import Head from "next/head";

toast.configure();

const ManageCategory = () => {

    const [loading, setLoading] = useState(false)
    const btnRef = useRef(null);
    const [subCate, setSubCate] = useState([]);
    const [getSubCate, setGetCate] = useState([]);
    const [MainCate, setMainCate] = useState([]);
    const [cateV, setCateV] = useState(null);
    const fileRef = useRef();
    const [fileName, setFileName] = useState("Photo");
    const [url, setUrl] = useState("/avtar/no-image.png");
    const [photoError, setPhotoError] = useState("");

    useEffect(async () => {
        await axios
            .get(`${process.env.HOST}/category/root`)
            .then((res) => {
                // console.log(res.data.data);
                setMainCate(res.data.data);
            })
            .catch((err) => {
                toast.error("😢 " + err.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
            });
    }, []);

    const fileSelect = (e) => {
        if (e.target.files.length !== 0) {
            if (
                e.target.files[0].type === "image/jpeg" ||
                e.target.files[0].type === "image/jpg" ||
                e.target.files[0].type === "image/png"
            ) {
                if (e.target.files[0].size <= 1000000) {
                    setData((prev) => ({ ...prev, photo: e.target.files[0] }));
                    setFileName(e.target.files[0].name);
                    setPhotoError("");
                    const file = URL.createObjectURL(e.target.files[0]);
                    setUrl(file);
                } else {
                    setPhotoError("Only 1 MB size photo is accepted");
                    setFileName("Photo");
                    setData((prev) => ({ ...prev, photo: "" }));
                    setUrl("/avtar/no-image.png");
                }
            } else {
                setPhotoError("Only jpg,png accepted");
                setFileName("Photo");
                setData((prev) => ({ ...prev, photo: "" }));
                setUrl("/avtar/no-image.png");
            }
        } else {
            setPhotoError("Photo is Required");
            setData((prev) => ({ ...prev, photo: "" }));
            setFileName("Photo");
            setUrl("/avtar/no-image.png");
        }
    };

    const spaceValidation = new RegExp(
        "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
    );

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const CategorySchema = Yup.object().shape({
        name: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            )
            .required("Category Name is required"),
        desc: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            )
            .required("Description is required"),
    });

    const customStyles = {
        control: (styles) => ({
            ...styles,
            borderRadius: "5px",
            "&:hover": { cursor: "pointer" },
        }),
        placeholder: (styles) => ({
            ...styles,
        }),
        indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        menu: (styles) => ({
            ...styles,
            position: "absolute",
            top: "30px",
        }),
    };

    const [data, setData] = useState({
        name: "",
        desc: "",
        photo: "",
        parent_category_id: ""
    })

    const handleParentIdChange = async (e) => {
        setCateV(e)
        setData((prev) => ({ ...prev, cId: e.value }));
        const session = await getSession();
        await axios
            .get(`${process.env.HOST}/category/sub/${e.value}`, {
                headers: {
                    Authorization: session.accessToken,
                },
            })
            .then((res) => {
                toast.info("🎉 Please choose category from select sub category if you want!!!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                    transition:Flip,
                });
                if (res.data.length !== 0) {
                    setGetCate((oldArray) => [...oldArray, ""]);
                    setSubCate(res.data.data);
                }
                else if (res.status !== 200) {
                    setSubCate([]);
                }
            })
            .catch((err) => {
                toast.error("😢 " + err.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
                if (err.response.data.message === "subCategory Not Found") {
                    setSubCate([]);
                    setGetCate([]);
                    if (subCate.length != 0) {
                        setCateV({
                            value: subCate[0].id,
                            label: subCate[0].name,
                        });
                    }
                    else {
                        setCateV(e)
                    }
                }
            });
    }

    const addCategory = async () => {
        setLoading(true);
        btnRef.current.disabled = true;
        const session = await getSession();
        const formdata = new FormData();
        formdata.append("name", data.name);
        formdata.append("desc", data.desc);
        formdata.append("photo", data.photo);
        data.parent_category_id === "" ? "" : formdata.append("parent_category_id", data.parent_category_id);


        await axios
            .post(`${process.env.HOST}/category/all`, formdata, {
                headers: {
                    Authorization: session.accessToken,
                },
            })
            .then((res) => {
                setLoading(false);
                btnRef.current.disabled = false;
                toast.info("😊 " + res.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                    transition:Flip
                });
            })
            .catch((err) => {
                setLoading(false);
                btnRef.current.disabled = false;
                toast.error("😢 " + err.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
            });
    }

    return <>
        <Head>
            <title>Vaistra Ecommerce | Add Category</title>
        </Head>
        <Main>
            <AdminContentHeading
                heading={
                    <a href="/superadmin/dashboard">
                        <FaHome />
                    </a>
                }
                subheading=" / <a href='/superadmin/Category'>Categories List</a>"
            />
            <div className="container">
                <div className="row" style={{ marginTop: `90px` }}>
                    <div className="col-md-6 offset-md-3">
                        <div className="form-design">
                            <h4 className="mb-5 text-center">Add Category</h4>
                            <div className=" px-3 d-flex justify-content-end">
                                <BackButton />
                            </div>
                            <Formik
                                initialValues={{
                                    name: data.name,
                                    desc: data.desc,
                                }}
                                validationSchema={CategorySchema}
                                onSubmit={addCategory}
                            >
                                {({ touched, errors, isValid, values, handleChange }) => (
                                    <Form className="needs-validation" autoComplete="off">
                                        <div className="row">
                                            <div className="col-md-12 mb-2">
                                                <div className="form-group">
                                                    <label htmlFor="account-fn">Select Category</label>
                                                    <Select
                                                        className="react-select"
                                                        classNamePrefix="react-select"
                                                        styles={customStyles}
                                                        placeholder="Select Main Category"
                                                        id="long-value-select"
                                                        value={cateV}
                                                        instanceId="long-value-select"
                                                        options={MainCate.map((m) => ({ value: m.id, label: m.name }))}
                                                        key={MainCate.map((m) => m.id)}
                                                        onChange={(e) => handleParentIdChange(e)}
                                                        menuShouldBlockScroll={true}
                                                    />
                                                </div>
                                            </div>

                                            {
                                                getSubCate.length !== 0 ? <div className="col-md-12 mb-3">
                                                    <>
                                                        <label htmlFor="account-fn">Select SubCategory</label>
                                                        <Select
                                                            className="react-select"
                                                            classNamePrefix="react-select"
                                                            styles={customStyles}
                                                            placeholder="Select Sub Category"
                                                            id="long-value-select"
                                                            instanceId="long-value-select"
                                                            options={subCate.map((s) => ({ value: s.id, label: s.name }))}
                                                            key={subCate.map((s) => s.id)}
                                                            onChange={(e) => handleParentIdChange(e)}
                                                        />
                                                    </>
                                                </div> : ""
                                            }

                                            <div className="col-sm-12 mb-2">
                                                <div className="form-group">
                                                    <label htmlFor="account-fn">Category Name</label><span className="text-danger">*</span>
                                                    <Field
                                                        className={`form-control ${touched.name && errors.name ? "is-invalid" : ""
                                                            }`}
                                                        name="name"
                                                        type="text"
                                                        placeholder="Category Name"
                                                        id="account-fn"
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            inputChange(e);
                                                        }}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="name"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-sm-12 mb-2">
                                                <div className="form-group">
                                                    <label htmlFor="account-fn">Category Description</label><span className="text-danger">*</span>
                                                    <Field
                                                        className={`form-control ${touched.desc && errors.desc ? "is-invalid" : ""
                                                            }`}
                                                        name="desc"
                                                        type="text"
                                                        placeholder="Category Desciption"
                                                        id="account-fn"
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            inputChange(e);
                                                        }}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="desc"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-10 mb-4">
                                                <label className="form-label">
                                                    Photo<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    className="d-none"
                                                    ref={fileRef}
                                                    onChange={fileSelect}
                                                />
                                                <button
                                                    type="button"
                                                    className="uploadBtn border w-100 d-flex justify-content-between text-muted align-items-center"
                                                    onClick={() => fileRef.current.click()}
                                                >
                                                    {fileName}
                                                    <i className="fs-5">
                                                        <FaImage />
                                                    </i>
                                                </button>
                                                {photoError !== "" && (
                                                    <span className="text-danger error">
                                                        {photoError}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="col-md-2 mb-4 mt-4">
                                                <img
                                                    src={url}
                                                    width={90}
                                                    alt="Avtar"
                                                />
                                            </div>

                                            <div className="col-md-12">
                                                <button
                                                    type="submit"
                                                    className="btn btn-add-form"
                                                    ref={btnRef}
                                                    disabled={
                                                        !Object.values(values).every(
                                                            (x) => x !== null && x !== ""
                                                        ) || !isValid ||
                                                        fileName === "Photo"
                                                    }
                                                >
                                                    Add Category
                                                    {
                                                        loading && (
                                                            <Spinner />
                                                        )
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </Main>
    </>;
};

const Main = styled.div`
    margin-top: 20px;
`;
export default withAuth(ManageCategory);
