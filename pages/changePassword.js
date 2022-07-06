import styles from "../styles/Rutvik.module.css";
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Spinner from "../component/Spinner";
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";
import axios from "axios";
import Head from "next/head";
toast.configure();

const changePassword = () => {
    const [loading, setLoading] = useState(false);
    const btnRef = useRef(null);
    const router = useRouter();
    const spaceValidation = new RegExp(
        "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
    );

    const [data, setData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const changePassword = async (e, { resetForm }) => {
        if (data.newPassword === data.confirmPassword) {
            btnRef.current.disabled = true;
            setLoading(true);
            const sess = await getSession();
            await axios
                .put(`${process.env.HOST}/auth/change-password`, data, {
                    headers: {
                        Authorization: sess.accessToken,
                    },
                })
                .then((res) => {
                    btnRef.current.disabled = false;
                    setLoading(false);
                    toast.info("😊 " + res.data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000,
                        transition: Flip,
                    });
                    resetForm();
                })
                .catch((err) => {
                    setLoading(false);
                    resetForm();
                    toast.error("😢 " + err.response.data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000,
                    });
                });
        } else {
            toast.error("😢 " + "please check your new password or confirm password", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            });
        }
    };

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const ChangePasswordSchema = Yup.object().shape({
        oldPassword: Yup.string()
            .min(3, "Password must be 3 characters at minimum")
            .required("Old Password is required")
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the end are not allowed"
            ),
        newPassword: Yup.string()
            .min(3, "Password must be 3 characters at minimum")
            .required("New Password is required")
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are end not allowed"
            ),
        confirmPassword: Yup.string()
            .min(3, "Password must be 3 characters at minimum")
            .required("New Password is required")
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are end not allowed"
            ),
    });

    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Change Password</title>
            </Head>
            <div className={`${styles.containerbg}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 offset-md-3  d-flex justify-content-center align-items-center min-vh-100">
                            <div className="form-design bg-faded-danger">
                                <h4 className="mb-5 text-center text-white">
                                    Change Password
                                </h4>
                                <Formik
                                    initialValues={{
                                        oldPassword: data.oldPassword,
                                        newPassword: data.newPassword,
                                        confirmPassword: data.confirmPassword,
                                    }}
                                    validationSchema={ChangePasswordSchema}
                                    onSubmit={changePassword}
                                >
                                    {({
                                        touched,
                                        errors,
                                        isValid,
                                        values,
                                        handleChange,
                                    }) => (
                                        <Form
                                            className="needs-validation"
                                            autoComplete="off"
                                        >
                                            <div className="row">
                                                <div className="col-md-12 mb-4">
                                                    <label className="text-white">Old Password</label>
                                                    <span className="text-danger">*</span>
                                                    <Field
                                                        type="password"
                                                        placeholder="Old Password"
                                                        className={`form-control ${touched.oldPassword &&
                                                            errors.oldPassword
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        name="oldPassword"
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            inputChange(e);
                                                        }}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="oldPassword"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                                <div className="col-md-12 mb-4 ">
                                                    <label htmlFor="si-password " className="text-white">
                                                        New Password
                                                    </label>
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                    <div className="password-toggle">
                                                        <Field
                                                            placeholder="New Password"
                                                            id="si-password"
                                                            className={`form-control ${touched.newPassword &&
                                                                errors.newPassword
                                                                ? "is-invalid"
                                                                : ""
                                                                }`}
                                                            type="password"
                                                            name="newPassword"
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                inputChange(e);
                                                            }}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="newPassword"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 mb-4 ">
                                                    <div className="form-group">
                                                        <label htmlFor="si-password" className="text-white">
                                                            Confirm Password
                                                        </label>
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                        <div className="password-toggle">
                                                            <Field
                                                                placeholder="Confirm Password"
                                                                id="cn-password"
                                                                className={`form-control ${touched.confirmPassword &&
                                                                    errors.confirmPassword
                                                                    ? "is-invalid"
                                                                    : ""
                                                                    }`}
                                                                type="password"
                                                                name="confirmPassword"
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    inputChange(e);
                                                                }}
                                                            />
                                                            <ErrorMessage
                                                                component="div"
                                                                name="confirmPassword"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                        ref={btnRef}
                                                        disabled={
                                                            !Object.values(
                                                                values
                                                            ).every(
                                                                (x) =>
                                                                    x !== null &&
                                                                    x !== ""
                                                            ) ||
                                                            !isValid
                                                        }
                                                    >
                                                        Change Password
                                                        {loading && <Spinner />}
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
            </div>
        </>
    );
};

export default changePassword;
