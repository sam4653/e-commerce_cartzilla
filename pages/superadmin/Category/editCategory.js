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
import BackButton from "../../../component/BackButton";
import { FaImage, FaHome } from "react-icons/fa";
import Loader from "../../../component/Loader";
import { getSession } from "next-auth/client";
import AdminContentHeading from "../../../component/AdminContentHeading";
import Head from "next/head"

toast.configure();

const editCategory = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [mainLoader, setMainLoader] = useState(false);
    const btnRef = useRef(null);
    const fileRef = useRef();
    const [fileName, setFileName] = useState("Photo");
    const [url, setUrl] = useState("/avtar/no-image.png");
    const [photoError, setPhotoError] = useState("");

    useEffect(async () => {

        setMainLoader(true);

        const categoryEditId = localStorage.getItem("categoryEditId");
        const session = await getSession();

        if (categoryEditId == null) {
            router.push("/superadmin/Category")
        }

        await axios
            .get(`${process.env.HOST}/category/` + categoryEditId, {
                headers: {
                    Authorization: session.accessToken,
                },
            })
            .then((res) => {
                setMainLoader(false);
                setData(res.data.data);
                setFileName(String(res.data.data.photo));
                setUrl(res.data.data.photo);
            })
            .catch((err) => {
                setMainLoader(false);
                if (err.response.status === 404) {
                    setMainLoader(false);
                }
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

    const [data, setData] = useState({
        name: "",
        desc: "",
        photo: "",
    })

    const updateCategory = async () => {

        const categoryEditId = localStorage.getItem("categoryEditId");
        setLoading(true);
        btnRef.current.disabled = true;
        const session = await getSession();
        const formdata = new FormData();

        formdata.append("name", data.name);
        formdata.append("desc", data.desc);
        formdata.append("photo", data.photo);


        await axios
            .put(`${process.env.HOST}/category/${categoryEditId}`, formdata, {
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
                    transition:Flip,
                    onClose: () => {
                        router.push("/superadmin/Category");
                    },
                });
                localStorage.removeItem("categoryEditId")
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

    return <Main>
        <Head>
            <title>Vaistra Ecommerce | Edit Category</title>
        </Head>
        <AdminContentHeading
            heading={
                <a href="/superadmin/dashboard">
                    <FaHome />
                </a>
            }
            subheading=" / <a href='/superadmin/Category'>Categories List</a> / <a href='/superadmin/Category/ManageCategory'>Add</a> / Edit Category"
        />
        <div className="container">
            {
                mainLoader ? (
                    <Loader />
                ) : <div className="row" style={{ marginTop: `90px` }}>
                    <div className="col-md-6 offset-md-3">
                        <div className="form-design">
                            <h4 className="mb-5 text-center">Update Category</h4>
                            <div className=" px-3 d-flex justify-content-end">
                                <BackButton />
                            </div>
                            <Formik
                                enableReinitialize={true}
                                initialValues={{
                                    name: data.name ? data.name : "",
                                    desc: data.desc ? data.desc : "",
                                }}
                                validationSchema={CategorySchema}
                                onSubmit={updateCategory}
                            >
                                {({ touched, errors, isValid, values, handleChange }) => (
                                    <Form className="needs-validation" autoComplete="off">
                                        <div className="row">
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
                                                    Update Category
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
            }

        </div>
    </Main>;
};

const Main = styled.div`
    margin-top: 20px;
`;
export default withAuth(editCategory);
