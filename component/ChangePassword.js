import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Spinner from "../component/Spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";
import axios from "axios";
import Toast from "./Toast";
import Head from "next/head";

toast.configure();

const ChangePassword = () => {
    const [loading, setLoading] = useState(false);

    const [passwordVisible, setPasswordVisible] = useState({
        password: false,
        confPass: false,
    });
    const btnRef = useRef(null);
    const router = useRouter();
    const spaceValidation = new RegExp(
        "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
    );
    const passValidation = new RegExp(
        "^(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.*[!@#$%^&*_=+-]).{8,20}$"
    );

    const [data, setData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChangePassword = async (e, { resetForm }) => {
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
                Toast(res.data.message);
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
    };

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const ChangePasswordSchema = Yup.object().shape({
        oldPassword: Yup.string()
            .min(8, "Password must be 8 characters at minimum")
            .required("Old Password is required")
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the end are not allowed"
            ),
        // .matches(
        //     passValidation,
        //     "Password must Contain 1 Uppercase, 1 Lowercase, 1 Digit and 1 Special Character"
        // ),
        newPassword: Yup.string()
            .min(8, "Password must be 8 characters at minimum")
            .required("New Password is required")
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are end not allowed"
            )
            .matches(
                passValidation,
                "Password must Contain 1 Uppercase, 1 Lowercase, 1 Digit and 1 Special Character"
            ),
        confirmPassword: Yup.string()
            .min(8, "Password must be 8 characters at minimum")
            .required("New Password is required")
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are end not allowed"
            )
            .matches(
                passValidation,
                "Password must Contain 1 Uppercase, 1 Lowercase, 1 Digit and 1 Special Character"
            ),
    });

    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Change Password</title>
            </Head>
            <section className="col-lg-8">
                <div className="row">
                    <div className="col-md-12 p-3">
                        <div>
                            <h4 className="border-bottom pb-3">
                                Change Password
                            </h4>
                            <Formik
                                initialValues={{
                                    oldPassword: data.oldPassword,
                                    newPassword: data.newPassword,
                                    confirmPassword: data.confirmPassword,
                                }}
                                validationSchema={ChangePasswordSchema}
                                onSubmit={handleChangePassword}
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
                                        <div>
                                            <div className="col-md-8 mb-4">
                                                <label>Old Password</label>
                                                <span className="text-danger">
                                                    *
                                                </span>
                                                <Field
                                                    type="password"
                                                    placeholder="Old Password"
                                                    className={`form-control ${
                                                        touched.oldPassword &&
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
                                            <div className="col-md-8 mb-4 ">
                                                <label htmlFor="si-password">
                                                    New Password
                                                </label>
                                                <span className="text-danger">
                                                    *
                                                </span>
                                                <div className="password-toggle">
                                                    <Field
                                                        placeholder="New Password"
                                                        id="si-password"
                                                        className={`form-control ${
                                                            touched.newPassword &&
                                                            errors.newPassword
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        type={`${
                                                            passwordVisible.password
                                                                ? `text`
                                                                : `password`
                                                        }`}
                                                        name="newPassword"
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            inputChange(e);
                                                        }}
                                                    />
                                                    <label
                                                        className="password-toggle-btn"
                                                        style={{
                                                            right: "10px",
                                                            position:
                                                                "absolute",
                                                            top: "20px",
                                                        }}
                                                    >
                                                        <input
                                                            className="custom-control-input"
                                                            type="checkbox"
                                                            value={
                                                                passwordVisible.password
                                                            }
                                                            onChange={(e) =>
                                                                setPasswordVisible(
                                                                    (prev) => ({
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
                                                    <ErrorMessage
                                                        component="div"
                                                        name="newPassword"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-8 mb-4 ">
                                                <div className="form-group">
                                                    <label htmlFor="si-password">
                                                        Confirm Password
                                                    </label>
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                    <div className="password-toggle">
                                                        <Field
                                                            placeholder="Confirm Password"
                                                            id="cn-password"
                                                            className={`form-control ${
                                                                touched.confirmPassword &&
                                                                errors.confirmPassword
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            type={`${
                                                                passwordVisible.confPass
                                                                    ? `text`
                                                                    : `password`
                                                            }`}
                                                            name="confirmPassword"
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                inputChange(e);
                                                            }}
                                                        />
                                                        <label
                                                            className="password-toggle-btn"
                                                            style={{
                                                                right: "10px",
                                                                position:
                                                                    "absolute",
                                                                top: "20px",
                                                            }}
                                                        >
                                                            <input
                                                                className="custom-control-input"
                                                                type="checkbox"
                                                                value={
                                                                    passwordVisible.confPass
                                                                }
                                                                onChange={(e) =>
                                                                    setPasswordVisible(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            confPass:
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
                                                        <ErrorMessage
                                                            component="div"
                                                            name="confirmPassword"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
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
                                                        !isValid ||
                                                        data.newPassword !==
                                                            data.confirmPassword
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
            </section>
        </>
    );
};

export default ChangePassword;
