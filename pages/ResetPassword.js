import React, { useEffect, useRef, useState } from "react";
import { toast, Flip } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Spinner from "../component/Spinner";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/router";
import { FaBuffer, FaInfoCircle } from "react-icons/fa";
import Head from "next/head";
import styles from "../styles/Rutvik.module.css";
toast.configure();
const ResetPassword = () => {
    const router = useRouter();
    const btnref = useRef(null);
    const [mobileGet, setMobileGet] = useState("");
    const [otpExpired, setOtpExpired] = useState(true);
    const [expiredTime, setExpiredTime] = useState({
        initialMinute: 0,
        initialSeconds: 0,
    });

    const [loading, setLoading] = useState(false);

    const [isSignIn, setIsSignIn] = useState(true);

    useEffect(() => {
        btnref.current.disabled = true;
        const verifyOtpText = localStorage.getItem("verifyOtp");
        setMobileGet(verifyOtpText);
        setData((prev) => ({ ...prev, ["username"]: verifyOtpText }));
        if (verifyOtpText === null) {
            router.push("/forgotPassword");
        }
    }, []);

    const otpRegex = new RegExp("^[0-9]{6}$");
    const pwRegex = new RegExp("^(?=.*[A-Za-z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$");
    const [data, setData] = useState({
        username: "",
        password: "",
        conpass: "",
    });

    const ResetPasswordSchema = Yup.object().shape({
        password: Yup.string()
            .matches(
               pwRegex,
                "Password must be 8 characters at minimum with includes 1 digit and 1 special character"
             )
            .required("New Password is required."),
        conpass: Yup.string()
        .matches(
            pwRegex,
             "Password must be 8 characters at minimum with includes 1 digit and 1 special character"
          )
            .required("New Password is required.")
            .oneOf([Yup.ref("password"), null], "Passwords must be match."),
    });

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const resetPassword = async (e) => {
        btnref.current.disabled = true;
        setLoading(true);

        // data.conpass = "";

        await axios
            .put(`${process.env.HOST}/auth/reset-password`, data)
            .then((res) => {
                btnref.current.disabled = false;
                setLoading(false);
                toast.info("😊 " + res.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                    transition: Flip,
                    onClose: () => {
                        router.push("/");
                    },
                });
                localStorage.removeItem("verifyOtp");
                localStorage.removeItem("verifyOtpText");
            })
            .catch((err) => {
                setLoading(false);
                toast.error("😢 " + err.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose:1000,
                    // onClose: () => {
                    //     btnref.current.disabled = false;
                    // },
                });
                btnref.current.disabled = false;
                // resetForm();
            });
    };

    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Reset Password</title>
            </Head>
            <div className={`${styles.containerbg}`}>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3" style={{display:"flex" , justifyContent:"center",alignItems:"center" , height:"100vh"}}>
                        <div className="form-design bg-faded-danger">
                            <h4 className="mb-5 text-center text-white">Reset Password</h4>
                            <Formik
                                initialValues={{
                                    username: data.username,
                                    password: data.password,
                                }}
                                validationSchema={ResetPasswordSchema}
                                onSubmit={resetPassword}
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
                                        {/* {JSON.stringify(data)} */}
                                        <div className="row">
                                            <div className="col-md-12 mb-4">
                                                <label className="text-white">
                                                    Mobile Number or Email
                                                </label>
                                                <span className="text-danger">
                                                    *
                                                </span>
                                                <Field
                                                    type="text"
                                                    placeholder="Mobile or Email"
                                                    className="form-control"
                                                    name="username"
                                                    maxLength={10}
                                                    value={mobileGet}
                                                    disabled={true}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        inputChange(e);
                                                    }}
                                                />
                                                <ErrorMessage
                                                    component="div"
                                                    name="username"
                                                    className="invalid-feedback"
                                                />
                                            </div>
                                            <div className="col-md-12 mb-4 ">
                                                <div className="form-group">
                                                    <label htmlFor="otp" className="text-white">
                                                        New Password
                                                    </label>
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                    <Field
                                                        className={`form-control ${
                                                            touched.password &&
                                                            errors.password
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        name="password"
                                                        type="password"
                                                        id="password"
                                                        placeholder="New Password"
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            inputChange(e);
                                                        }}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="password"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-12 mb-4 ">
                                                <div className="form-group">
                                                    <label htmlFor="otp" className="text-white">
                                                        New Confirm Password
                                                    </label>
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                    <Field
                                                        className={`form-control ${
                                                            touched.conpass &&
                                                            errors.conpass
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        name="conpass"
                                                        type="password"
                                                        id="conpass"
                                                        placeholder="Confirm New Password"
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            inputChange(e);
                                                        }}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="conpass"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-12">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                    ref={btnref}
                                                    disabled={
                                                        !Object.values(
                                                            values
                                                        ).some(
                                                            (x) =>
                                                                x !== null &&
                                                                x !== ""
                                                        )
                                                    }
                                                >
                                                    Reset Password
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

export default ResetPassword;
