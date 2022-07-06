import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "../../styles/Rutvik.module.css";
import dynamic from "next/dynamic";
import Link from "next/link";
const Spinner = dynamic(() => import("../../component/Spinner"));
const Timer = dynamic(() => import("../../component/Times"));
// const Toast = dynamic(() => import("../../component/Toast"));
import Toast from "../../component/Toast";

const index = () => {
    const [registerPasswordVisible, setRegisterPasswordVisible] =
        useState(false);
    const [otpExpired, setOtpExpired] = useState(false);
    const [expiredTime, setExpiredTime] = useState({
        initialMinute: 0,
        initialSeconds: 0,
    });
    const [registerStep, setRegisterStep] = useState(false);
    const [loading, setLoading] = useState(false);
    const registerBtnRef = useRef(null);
    const phoneRegex = new RegExp("(^[6789][0-9]{9})+$");
    const [signUpData, setSignUpData] = useState({
        mobile: "",
        otp: "",
        password: "",
    });
    const MobileSchema = Yup.object().shape({
        mobile: Yup.string()
            .matches(phoneRegex, "Invalid Mobile No.")
            .required("Mobile No. is required"),
    });

    const otpRegex = new RegExp("^[0-9]{6}$");
    const spaceValidation = new RegExp(
        "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
    );
    const RegisterSchema = Yup.object().shape({
        mobile: Yup.string()
            .matches(phoneRegex, "Invalid Mobile No.")
            .required("Mobile No. is required"),
        otp: Yup.string()
            .matches(otpRegex, "Invalid OTP.")
            .required("OTP is required"),
        password: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            )
            .min(8, "Password must be 8 characters at minimum")
            .required("Password is required"),
    });

    const router = useRouter();

    const inputChangeHandler = (e) => {
        const { name, value } = e.target;
        setSignUpData((prev) => ({ ...prev, [name]: value }));
    };

    const getOtp = async (e, { resetForm }) => {
        registerBtnRef.current.disabled = true;
        setLoading((prev) => ({ ...prev, register: true }));
        await axios
            .post(`${process.env.HOST}/auth/signup-otp`, {
                mobileNo: signUpData.mobile,
                role: "VENDOR",
            })
            .then((res) => {
                registerBtnRef.current.disabled = false;
                setOtpExpired(false);
                setExpiredTime({ initialMinute: 1, initialSeconds: 0 });
                setRegisterStep(true);
                setLoading((prev) => ({ ...prev, register: false }));
                Toast(res.data.message);
            })
            .catch((err) => {
                setLoading((prev) => ({ ...prev, register: false }));
                registerBtnRef.current.disabled = false;
                if (err.response.status === 302) {
                    setRegisterStep(true);
                }
                if (err.response.status === 409) {
                    setRegisterStep(false);
                    resetForm();
                }
                Toast(err.response.data.message);
            });
    };
    const resendOtp = async () => {
        await axios
            .post(`${process.env.HOST}/auth/signup-otp`, {
                mobileNo: signUpData.mobile,
                role: "VENDOR",
            })
            .then((res) => {
                setExpiredTime({ initialMinute: 1, initialSeconds: 0 });
                setOtpExpired(false);
                Toast(res.data.message);
            })
            .catch((err) => {
                Toast(err.response.data.message);
            });
    };
    const register = async (e, { resetForm }) => {
        registerBtnRef.current.disabled = true;
        setLoading((prev) => ({ ...prev, register: true }));
        await axios
            .post(`${process.env.HOST}/auth/signup`, {
                mobileNo: e.mobile,
                otp: String(e.otp),
                password: e.password,
                photo: "/avtaravtar.png",
                role: "VENDOR",
            })
            .then((res) => {
                registerBtnRef.current.disabled = false;

                setLoading((prev) => ({ ...prev, register: false }));

                Toast(res.data.message);
                // toast.info("😊 " + res.data.message, {
                //     position: toast.POSITION.TOP_RIGHT,
                //     autoClose: 3000,
                //     onClose: () => {
                //         router.push("/vendor");
                //     },
                // });
                router.push("/vendor");
                // resetForm();
                // setRegisterStep(false);
            })
            .catch((err) => {
                Toast(err.response.data.message);
                setLoading((prev) => ({ ...prev, register: false }));
                registerBtnRef.current.disabled = false;
            });
    };

    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Register</title>
            </Head>
            <div className={`${styles.containerbg}`} >
                <div className={`container`}>
                    <div className="row" style={{}}>
                        <div className="col-md-6 offset-md-3  " style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                            <div className="form-design w-100 bg-faded-danger shadow-lg" >
                                <h4 className="mb-5 text-center text-white">
                                    Vendor Register
                                </h4>
                                <Formik
                                    validateOnBlur={!registerStep ? false : true}
                                    initialValues={
                                        registerStep
                                            ? {
                                                mobile: "",
                                                otp: "",
                                                password: "",
                                            }
                                            : { mobile: "" }
                                    }
                                    validationSchema={
                                        registerStep ? RegisterSchema : MobileSchema
                                    }
                                    onSubmit={registerStep ? register : getOtp}
                                >
                                    {({
                                        touched,
                                        errors,
                                        isValid,
                                        values,
                                        handleChange,
                                    }) => (
                                        <Form
                                            className={`needs-validation `}
                                            autoComplete="off"
                                            noValidate
                                        >
                                            <div className={`form-group`}>
                                                <label htmlFor="mobile " className="text-white">
                                                    Mobile No.
                                                </label>
                                                <Field
                                                    className={`form-control ${touched.mobile &&
                                                        errors.mobile
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    name="mobile"
                                                    type="text"
                                                    id="mobile"
                                                    maxLength={10}
                                                    placeholder="Mobile No."
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        inputChangeHandler(e);
                                                    }}
                                                    disabled={registerStep}
                                                />
                                                <ErrorMessage
                                                    component="div"
                                                    name="mobile"
                                                    className="invalid-feedback"
                                                />
                                            </div>
                                            {registerStep && (
                                                <div className="d-flex justify-content-end">
                                                    {otpExpired ? (
                                                        <button
                                                            type="button"
                                                            className="text-white fs-6"
                                                            onClick={resendOtp}
                                                        >
                                                            <small>
                                                                Resend Otp ?
                                                            </small>
                                                        </button>
                                                    ) : (
                                                        <Timer
                                                            setOtpExpired={
                                                                setOtpExpired
                                                            }
                                                            initialMinute={
                                                                expiredTime.initialMinute
                                                            }
                                                            initialSeconds={
                                                                expiredTime.initialSeconds
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            {registerStep && (
                                                <>
                                                    <div className="form-group text-white">
                                                        <label htmlFor="otp" className="text-white">
                                                            OTP
                                                        </label>
                                                        <Field
                                                            className={`form-control ${touched.otp &&
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
                                                                inputChangeHandler(
                                                                    e
                                                                );
                                                            }}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="otp"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="password" className="text-white">
                                                            Password
                                                        </label>
                                                        <div className="password-toggle">
                                                            <Field
                                                                className={`form-control ${touched.password &&
                                                                    errors.password
                                                                    ? "is-invalid"
                                                                    : ""
                                                                    }`}
                                                                type={`${registerPasswordVisible.password
                                                                    ? `text`
                                                                    : `password`
                                                                    }`}
                                                                id="password"
                                                                name="password"
                                                                placeholder="Password"
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    inputChangeHandler(
                                                                        e
                                                                    );
                                                                }}
                                                            />

                                                            <label className="password-toggle-btn">
                                                                <input
                                                                    className="custom-control-input"
                                                                    type="checkbox"
                                                                    value={
                                                                        registerPasswordVisible.password
                                                                    }
                                                                    onChange={(e) =>
                                                                        setRegisterPasswordVisible(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                password:
                                                                                    e
                                                                                        .target
                                                                                        .checked,
                                                                            })
                                                                        )
                                                                    }
                                                                />
                                                                <i className="czi-eye password-toggle-indicator"></i>
                                                                <span className="sr-only">
                                                                    Show password
                                                                </span>
                                                            </label>
                                                        </div>
                                                        <ErrorMessage
                                                            component="div"
                                                            name="password"
                                                            className={`invalid-feedback`}
                                                            style={{
                                                                display: "block",
                                                            }}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            <button
                                                className="btn btn-primary btn-block btn-shadow"
                                                type="submit"
                                                ref={registerBtnRef}
                                                disabled={
                                                    !registerStep
                                                        ? !signUpData.mobile.match(
                                                            phoneRegex
                                                        ) ||
                                                        signUpData.mobile === ""
                                                        : signUpData.password ===
                                                        "" ||
                                                        !isValid ||
                                                        signUpData.mobile ===
                                                        "" ||
                                                        signUpData.otp === ""
                                                }
                                            >
                                                {loading.register ? (
                                                    <Spinner />
                                                ) : registerStep ? (
                                                    `Register`
                                                ) : (
                                                    `Get OTP`
                                                )}
                                            </button>
                                            <div className="col-md-12 text-white mt-3 text-right">
                                                <Link href="/vendor">
                                                    Already have an account ?
                                                </Link>
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

export default index;
