import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Link from "next/link";
import { getSession, signIn } from "next-auth/client";
import * as Yup from "yup";
import Spinner from "../../component/Spinner";
import { connect } from "react-redux";
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "../../styles/Rutvik.module.css";


toast.configure();

const index = () => {
    const router = useRouter();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [session, setSession] = useState({});
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const btnRef = useRef(null);

    const phoneRegex = new RegExp("(^[6789][0-9]{9})+$");
    const pwRegex = new RegExp("^(?=.*[A-Za-z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$");
    const spaceValidation = new RegExp(
        "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
    );

    const regex = new RegExp('^[a-z0-9]+@[a-z]+\.[a-z.]{2,3}|(^[6789][0-9]{9})+$');

    const LoginSchema = Yup.object().shape({
        username: Yup.string()
            .matches(regex, "Invalid  Email or Phone.")
            .required("Email or Phone is required."),
        password: Yup.string()
            .matches(
                pwRegex,
                "Password must be 8 characters at minimum with includes 1 digit and 1 special character"
            ).matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            )
            // .min(8, "Password must be 8 characters at minimum with includes 1 digit and 1 special character")
            .required("Password is required")
    });

    const sessionGet = async (status) => {
        const sess = await getSession();
        // console.log(sess);
        if (sess) {
            setSession(sess);
            setUser(sess.user);
            let us = sess.user;

            if (us.fullName === "") {
                us.fullName = "No Name";
            }
            if (us.photo === null) {
                us.photo = "/avtar/avtar.png";
            }
            if (status) {
                if (us.role === "USER") {
                    toast.error("Invalid credentials for vendor !!!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        transition: Flip,
                        progress: undefined,
                    });
                }
                if (us.role === "VENDOR") {
                    toast("You are Login Successfully", {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        transition: Flip,
                        progress: undefined,
                    });
                    if (router.query.callback) {
                        if (router.query.callback.includes("vendor")) {
                            router.push(router.query.callback);
                        } else {
                            router.push("/vendor/profile");
                        }
                    } else {
                        router.push("/vendor/profile");
                    }
                }
                if (us.role === "ADMIN") {
                    toast.error("Invalid credentials for vendor !!!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        transition: Flip,
                        progress: undefined,
                    });
                }
            }
        }
    };

    useEffect(() => {
        btnRef.current.disabled = true;
        sessionGet(true);
    }, []);

    const login = async (e, { resetForm }) => {
        btnRef.current.disabled = true;
        setLoading(true);
        const res = await signIn("credentials", {
            username: e.username,
            password: e.password,
            redirect: false,
        });
        if (res.status === 200 && res.error === null) {
            btnRef.current.disabled = false;
            setLoading(false);
            sessionGet(true);
            resetForm();
        } else {
            toast.error(res.error, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                transition: Flip,
                progress: undefined,
            });
            setLoading(false);
            resetForm();
            btnRef.current.disabled = false;
        }
    };

    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Login</title>
            </Head>
            <div className={`${styles.containerbg}`} >
                <div className={`container`}>
                    <div className="row" >
                        <div className="col-md-6 offset-md-3" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                            <div className="form-design bg-faded-danger">

                                <Link href="/">
                                    <a
                                        className="navbar-brand d-sm-block mr-3 flex-shrink-0"
                                        style={{ minWidth: `7rem` }}
                                    >
                                        <div className={`d-flex h-100 align-items-center  ${styles.vImage}`}>
                                            <img
                                                src="/img/logo.png"
                                                alt="Logo"
                                            />
                                            {/* <h3 className={`m-0 text-white ${styles.logoText}`}>VAISTRA TECHNOLOGIES</h3> */}
                                        </div>
                                    </a>
                                </Link>

                                <h4 className="mb-5 text-center text-white">Vendor Login</h4>
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={{
                                        username: "",
                                        password: "",
                                    }}
                                    validationSchema={LoginSchema}
                                    onSubmit={login}
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
                                                    <label className="text-white">Email or Phone{" "}<span className="text-danger">*</span></label>
                                                    <Field
                                                        type="text"
                                                        placeholder="Mobile No."
                                                        className={`form-control ${touched.username &&
                                                            errors.username
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        name="username"
                                                        onChange={(e) => {
                                                            handleChange(e);
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
                                                        <label htmlFor="si-password" className="text-white">
                                                            Password{" "}<span className="text-danger">*</span>
                                                        </label>
                                                        <div className="password-toggle">
                                                            <Field
                                                                placeholder="Password"
                                                                id="si-password"
                                                                type={
                                                                    passwordVisible
                                                                        ? "text"
                                                                        : "password"
                                                                }
                                                                className={`form-control ${touched.password &&
                                                                    errors.password
                                                                    ? "is-invalid"
                                                                    : ""
                                                                    }`}
                                                                name="password"
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                }}
                                                            />

                                                            <label className="password-toggle-btn d-flex justify-content-center align-items-center">
                                                                <input
                                                                    className="custom-control-input"
                                                                    type="checkbox"
                                                                    value={
                                                                        passwordVisible
                                                                    }
                                                                    onChange={() =>
                                                                        setPasswordVisible(
                                                                            !passwordVisible
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
                                                            className="invalid-feedback"
                                                            style={{
                                                                display: "block",
                                                            }}
                                                        />
                                                        <div className="pt-3 pl-1">
                                                            <Link href="/forgotPassword"><a className="mt-5 text-white">Forget Password?</a></Link>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>

                                                </div>
                                                <div className="col-md-12 d-flex justify-content-between align-items-center text-white">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                        ref={btnRef}
                                                        disabled={!isValid}
                                                    >
                                                        Login
                                                        {loading && <Spinner />}
                                                    </button>
                                                    <Link href="/vendor/register" >
                                                        Not have an Account ?
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

export default index;
