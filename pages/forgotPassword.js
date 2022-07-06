import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Spinner from "../component/Spinner";
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Rutvik.module.css";
toast.configure();

const forgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const btnRef = useRef(null);
    const router = useRouter();

    const [data, setData] = useState({
        username: "",
    });

    const forgotPassword = async (e, { resetForm }) => {
        btnRef.current.disabled = true;
        setLoading(true);
        await axios
            .post(`${process.env.HOST}/auth/send-otp`, data)
            .then((res) => {
                btnRef.current.disabled = false;
                setLoading(false);
                toast.info("🎉 " + res.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                    transition: Flip,
                });
                localStorage.setItem("verifyOtp", data.username);
                router.push("/verifyOTP");
            })
            .catch((err) => {
                setLoading(false);
                toast.error("😢 " + err.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
                resetForm();
            });
    };

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const regex = new RegExp(
        "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$|(^[6789][0-9]{9})+$"
    );

    const ForgotPasswordSchema = Yup.object().shape({
        username: Yup.string()
            .matches(regex, "Invalid Email or Phone")
            .required("Email or Phone is required."),
    });

    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Forgot Password</title>
            </Head>
            <div className={`${styles.containerbg}`}>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-lg-12" style={{display:"flex" , justifyContent:"center",alignItems:"center" , height:"100vh"}}>
                    <div className="form-design bg-faded-danger">
                            <h4 className="mb-5 text-center text-white">
                                Forgot Password
                            </h4>
                            <Formik
                                initialValues={{
                                    username: "",
                                }}
                                validationSchema={ForgotPasswordSchema}
                                onSubmit={forgotPassword}
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
                                                <label className="text-white">Email or Phone</label>
                                                <span className="text-danger">
                                                    *
                                                </span>
                                                <Field
                                                    as="input"
                                                    type="text"
                                                    placeholder="Email or Phone"
                                                    className={`form-control ${
                                                        touched.username &&
                                                        errors.username
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    name="username"
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
                                            <div className="col-md-12 d-flex justify-content-between align-items-center text-white">
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
                                                        ) || !isValid
                                                    }
                                                >
                                                    Submit
                                                    {loading && <Spinner />}
                                                </button>
                                                <Link href="/vendor" >
                                                        Back to Login
                                                    </Link>
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

export default forgotPassword;
