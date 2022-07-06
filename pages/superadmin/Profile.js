import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Link from "next/link";
import * as Yup from "yup";
import Spinner from "../../component/Spinner";
import { connect } from "react-redux";
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";
import axios from "axios"
import withAuth from "../../component/withAuth";
import { FaImage } from "react-icons/fa";
import Head from "next/head";

toast.configure();

const Profile = () => {

    const [loading, setLoading] = useState(false)
    const btnRef = useRef(null);
    const router = useRouter();
    const fileRef = useRef();
    const [fileName, setFileName] = useState("image");
    const [photoError, setPhotoError] = useState("");
    const [url, setUrl] = useState("/avtar/avtar.png");

    const phoneRegex = new RegExp("(^[6789][0-9]{9})+$");
    const onlyEmail = new RegExp(
        "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$"
    );
    const spaceValidation = new RegExp(
        "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
    );
    const ProfileSchema = Yup.object().shape({
        firstName: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            )
            .required("FirstName is required"),
        lastName: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            )
            .required("LastName is required"),
        email: Yup.string()
            .matches(onlyEmail, "Invalid Email.")
            .required("Email is required"),
        phoneNo: Yup.string()
            .matches(phoneRegex, "Invalid Phone Number.")
            .required("Phone Number is required"),
    });

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        phoneNo: "",
        photo: "",
        email: "",
    });

    useEffect(async () => {
        const session = await getSession();
        await axios
            .get(`${process.env.HOST}/user`, {
                headers: {
                    Authorization: session.accessToken,
                },
            })
            .then((res) => {
                setData(res.data.data);
                if (res.data.data.photo === null) {
                    setFileName("image");
                    setUrl("/avtar/avtar.png")
                }
                else {
                    setFileName(String(res.data.data.photo));
                    setUrl(res.data.data.photo);
                }
            })
            .catch((err) => {
                console.log(err);
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
                    setPhotoError("Only 1 MB size image is accepted");
                    setFileName("image");
                    setData((prev) => ({ ...prev, photo: "" }));
                    setUrl("/avtar/avtar.png");
                }
            } else {
                setPhotoError("Only jpg,png accepted");
                setFileName("image");
                setData((prev) => ({ ...prev, photo: "" }));
                setUrl("/avtar/avtar.png");
            }
        } else {
            setPhotoError("Image is Required");
            setData((prev) => ({ ...prev, photo: "" }));
            setFileName("image");
            setUrl("/avtar/avtar.png");
        }
    };

    const Update = async () => {
        setLoading(true);
        btnRef.current.disabled = true;
        const session = await getSession();
        const formdata = new FormData();
        formdata.append("firstName", data.firstName);
        formdata.append("lastName", data.lastName);
        formdata.append("email", data.email);
        formdata.append("photo", data.photo);

        await axios
            .put(`${process.env.HOST}/user`, formdata, {
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
    };

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };


    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Profile</title>
            </Head>
            <div className="container">
                <div className="row" style={{ marginTop: `90px` }}>
                    <div className="col-md-6 offset-md-3">
                        <div className="form-design">
                            <h4 className="mb-5 text-center">Update Profile</h4>
                            <Formik
                                enableReinitialize={true}
                                initialValues={{
                                    firstName: data.firstName === null ? data.firstName = "" : data.firstName = data.firstName,
                                    lastName: data.lastName === null ? data.lastName = "" : data.lastName = data.lastName,
                                    phoneNo: data.phoneNo,
                                    email: data.email === null ? data.email = "" : data.email = data.email,
                                }}
                                validationSchema={ProfileSchema}
                                onSubmit={Update}
                            >
                                {({ touched, errors, isValid, values, handleChange }) => (
                                    <Form className="needs-validation" autoComplete="off">
                                        <div className="row">
                                            <div className="col-md-12 mb-4">
                                                <div className="form-group">
                                                    <label htmlFor="account-fn">First Name</label><span className="text-danger">*</span>
                                                    <Field
                                                        className={`form-control ${touched.firstName && errors.firstName ? "is-invalid" : ""
                                                            }`}
                                                        name="firstName"
                                                        type="text"
                                                        placeholder="First Name"
                                                        id="account-fn"
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            inputChange(e);
                                                        }}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="firstName"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12 mb-4 ">
                                                <div className="form-group">
                                                    <label htmlFor="account-ln">Last Name</label><span className="text-danger">*</span>
                                                    <Field
                                                        className={`form-control ${touched.lastName && errors.lastName ? "is-invalid" : ""
                                                            }`}
                                                        type="text"
                                                        id="account-ln"
                                                        name="lastName"
                                                        placeholder="Last Name"
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            inputChange(e);
                                                        }}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="lastName"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12 mb-4">
                                                <div className="form-group">
                                                    <label htmlFor="account-email">Email Address</label><span className="text-danger">*</span>
                                                    <Field
                                                        className={`form-control ${touched.email && errors.email ? "is-invalid" : ""
                                                            }`}
                                                        type="email"
                                                        id="account-email"
                                                        // disabled
                                                        placeholder="Email"
                                                        name="email"
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            inputChange(e);
                                                        }}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="email"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-10 mb-4">
                                                <label className="form-label">
                                                    Image<span className="text-danger">*</span>
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
                                                    className="btn btn-primary"
                                                    ref={btnRef}
                                                    disabled={
                                                        !Object.values(values).every(
                                                            (x) => x !== null && x !== ""
                                                        ) || !isValid
                                                    }
                                                >
                                                    Update Profile
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
        </>
    );
};




export default withAuth(Profile);
