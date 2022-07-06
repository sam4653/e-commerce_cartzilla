import React, { useEffect, useRef, useState } from "react";
import { toast, Flip } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Spinner from "../component/Spinner";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Timer from "../component/Times";
import { useRouter } from "next/router";
import { FaBuffer, FaInfoCircle } from "react-icons/fa";
import Head from "next/head";
import styles from "../styles/Rutvik.module.css";

toast.configure();
const verifyOTP = () => {
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
        const verifyOtp = localStorage.getItem("verifyOtp");
        setMobileGet(verifyOtp);
        setData((prev) => ({ ...prev, ["username"]: verifyOtp }));
        if (verifyOtp === null) {
            router.push("/forgotPassword");
        }
    }, []);

    const otpRegex = new RegExp("^[0-9]{6}$");

    const [data, setData] = useState({
        username: "",
        otp: "",
    });

    const verifyotpschema = Yup.object().shape({
        otp: Yup.string()
            .matches(otpRegex, "OTP must be of 6 digits.")
            .required("OTP is required"),
    });

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const verifyOTPSubmit = async (e, { resetForm }) => {
        btnref.current.disabled = true;
        setLoading(true);

        await axios
            .put(`${process.env.HOST}/auth/otp-verify`, data)
            .then((res) => {
                btnref.current.disabled = false;
                setLoading(false);
                toast.info("😊 " + res.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                    transition: Flip,
                });
                localStorage.setItem("verifyOtpText", data.username);
                router.push("/ResetPassword");
            })
            .catch((err) => {
                btnref.current.disabled = false;
                setLoading(false);
                toast.error("😢 " + err.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
                resetForm();
            });
    };

    const resend = async () => {
        // console.log("mob",mobileGet);
        await axios
          .post(`${process.env.HOST}/auth/send-otp`, {
            mobileNo:mobileGet,
          })
          .then((res) => {
            toast(res.data.message, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              transition: Flip,
              progress: undefined,
            });
          })
          .catch((err) => {
            toast(err.response.data.message, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              transition: Flip,
              progress: undefined,
            });
          });
      };

    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Verify OTP</title>
            </Head>
            <div className={`${styles.containerbg}`}>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3" style={{display:"flex" , justifyContent:"center",alignItems:"center" , height:"100vh"}}>
                        <div className="form-design bg-faded-danger">
                            <h4 className="mb-5 text-center text-white">Verify OTP</h4>
                            <Formik
                                initialValues={{
                                    username: data.username,
                                    otp: data.otp,
                                }}
                                validationSchema={verifyotpschema}
                                onSubmit={verifyOTPSubmit}
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
                                            <div className="col-md-12 mb-1 ">
                                                <div className="form-group">
                                                    <label htmlFor="otp" className="text-white">
                                                        OTP
                                                    </label>
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                    <Field
                                                        className={`form-control ${
                                                            touched.otp &&
                                                            errors.otp
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        name="otp"
                                                        type="text"
                                                        id="otp"
                                                        placeholder="OTP"
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            inputChange(e);
                                                        }}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="otp"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                                <div className="mb-3 text-white">
                                                  <p onClick={resend} style={{cursor:"pointer"}}>Resend Otp ? </p>
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
                                                        ) || !isValid
                                                    }
                                                >
                                                    Verify OTP
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

export default verifyOTP;
