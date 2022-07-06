import React from "react";
import withAuth from "../../component/withAuth";
import axios from "axios";
import { getSession } from "next-auth/client";
import { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaImage } from "react-icons/fa";
import { Flip, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Spinner from "../../component/Spinner";
import Head from "next/head";
import { connect } from "react-redux";
import { update_user_detail } from "../../Redux/User/userActions";
import ReactLoading from "react-loading";

const setting = ({ updateUser }) => {
    // const { data, error } = useSWR(`${process.env.HOST}/user`, fetcher);
    const router = useRouter();
    const btnRef = useRef();
    const fileRef = useRef();
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState("Image");
    const [photoError, setPhotoError] = useState("");
    const [url, setUrl] = useState("/avtar/avtar.png");
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({
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
                setUser(res.data.data);
                // console.log("Res",res.data.data)
                if (res.data.data.photo === "null" || res.data.data.photo === "") {
                    setFileName("Image");
                    setUrl("/avtar/avtar.png");
                } else {
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
                    setUser((prev) => ({ ...prev, photo: e.target.files[0] }));
                    setFileName(e.target.files[0].name);
                    setPhotoError("");
                    const file = URL.createObjectURL(e.target.files[0]);
                    setUrl(file);
                } else {
                    setPhotoError("Only 1 MB size image is accepted");
                    setFileName("Image");
                    setUser((prev) => ({ ...prev, photo: "" }));
                    setUrl("/avtar/avtar.png");
                }
            } else {
                setPhotoError("Only jpg,png accepted");
                setFileName("Image");
                setUser((prev) => ({ ...prev, photo: "" }));
                setUrl("/avtar/avtar.png");
            }
        } else {
            setPhotoError("");
            setUser((prev) => ({ ...prev, photo: "" }));
            setFileName("image");
            setUrl("/avtar/avtar.png");
        }
    };

    const inputChange = (e) => {
        const { name, value } = e.target;
        //   if(user.firstName.length >10){
        //       alert("invalid name")
        //       setUser((prev) => ({ ...prev , firstName:"" , lastName:""}));
        //   }else if(user.lastName.length>10){
        //       alert("invalid Lastname")
        //       setUser((prev) => ({ ...prev , lastName:"" , firstName:""}));
        //   }
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const phoneRegex = new RegExp("(^[6789][0-9]{9})+$");
    const onlyEmail = new RegExp(
        "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$"
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
            .required("FirstName is required")
            .min(2, "Please enter more than 2 character")
            .max(10, "please enter less than 10 character"),
        lastName: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            )
            .required("LastName is required")
            .min(1, "Please enter more than 2 character")
            .max(10, "Please enter less than 10 character"),
        email: Yup.string()
            .matches(onlyEmail, "Invalid Email.")
            .required("Email is required"),
        phoneNo: Yup.string()
            .matches(phoneRegex, "Invalid Phone Number.")
            .required("Phone Number is required"),
    });

    const Update = async () => {
        setLoading(true);
        btnRef.current.disabled = true;
        const session = await getSession();
        const formdata = new FormData();
        formdata.append("firstName", user.firstName);
        formdata.append("lastName", user.lastName);
        formdata.append("email", user.email);
        formdata.append("photo", user.photo);
        formdata.append("phoneNo", user.phoneNo);

        await axios
            .put(`${process.env.HOST}/user`, formdata, {
                headers: {
                    Authorization: session.accessToken,
                },
            })
            .then((res) => {
                setLoading(false);
                btnRef.current.disabled = false;
                const data = {
                    fullName:
                        user.firstName.trim() + " " + user.lastName.trim(),
                    photo:
                        res.data.photo?.trim().length > 0
                            ? res.data.photo
                            : "/avtar/avtar.png",
                };
                updateUser({ user: data });
                toast.info("🎉 " + res.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    transition: Flip,
                    autoClose: 1000,
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

    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Account Settings</title>
            </Head>
            <section className="col-lg-8">
                {!isLoading ? (<div className="pt-2 px-4 pl-lg-0 pr-xl-5">
                    <h2 className="h3 py-2 text-center text-sm-left">
                        Settings
                    </h2>
                    <div className="tab-content">
                        <div
                            className="tab-pane fade show active"
                            id="profile"
                            role="tabpanel"
                        >
                            <Formik
                                enableReinitialize={true}
                                initialValues={{
                                    firstName: user.firstName === null ? user.firstName = "" : user.firstName = user.firstName,
                                    lastName: user.lastName === null ? user.lastName = "" : user.lastName = user.lastName,
                                    phoneNo: user.phoneNo === null ? user.phoneNo = "" : user.phoneNo = user.phoneNo,
                                    email: user.email === null ? user.email = "" : user.email = user.email,
                                }}
                                validationSchema={ProfileSchema}
                                onSubmit={Update}
                            >
                                {({
                                    touched,
                                    errors,
                                    isValid,
                                    values,
                                    handleChange,
                                }) => (
                                    <Form>
                                        <div className="bg-secondary rounded-lg p-4 mb-4 text-center">
                                            <div className="media align-items-center imgSet">
                                                {url ? (
                                                    <img
                                                        src={!(
                                                            url === "null" ||
                                                            url === ""
                                                        )
                                                            ? url
                                                            : "/avtar/avtar.png"}
                                                        style={{ width: "90px", height: "90px" }}
                                                        className="rounded-circle mr-3"
                                                    />
                                                ) : (
                                                    <img src="/avtar/avtar.png" width={90} />
                                                )}
                                                <div className="media-body pl-3">
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Image
                                                        </label>
                                                        <input
                                                            type="file"
                                                            className="d-none"
                                                            ref={fileRef}
                                                            onChange={
                                                                fileSelect
                                                            }
                                                        />
                                                        <button
                                                            type="button"
                                                            className="uploadBtn border w-100 d-flex justify-content-between text-muted align-items-center"
                                                            onClick={() =>
                                                                fileRef.current.click()
                                                            }
                                                        >
                                                            {fileName === "null" ? "image"
                                                                : fileName
                                                            }
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
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="account-fn">
                                                        First Name
                                                    </label>
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                    <Field
                                                        className={`form-control ${touched.firstName &&
                                                            errors.firstName
                                                            ? "is-invalid"
                                                            : ""
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
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="account-ln">
                                                        Last Name
                                                    </label>
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                    <Field
                                                        className={`form-control ${touched.lastName &&
                                                            errors.lastName
                                                            ? "is-invalid"
                                                            : ""
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
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="account-email">
                                                        Email Address
                                                    </label>
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                    <Field
                                                        className={`form-control ${touched.email &&
                                                            errors.email
                                                            ? "is-invalid"
                                                            : ""
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
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="account-phone">
                                                        Phone Number
                                                    </label>
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                    <Field
                                                        className={`form-control ${touched.phoneNo &&
                                                            errors.phoneNo
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        type="text"
                                                        id="account-phone"
                                                        placeholder="Phone Number"
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            inputChange(e);
                                                        }}
                                                        name="phoneNo"
                                                        disabled
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="phoneNo"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <hr className="mt-2 mb-3" />
                                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                    <button
                                                        className="btn btn-primary mt-3 mt-sm-0"
                                                        type="submit"
                                                        disabled={
                                                            !Object.values(
                                                                values
                                                            ).some(
                                                                (x) =>
                                                                    x !==
                                                                    null &&
                                                                    x !== ""
                                                            ) ||
                                                            !isValid ||
                                                            photoError !== ""
                                                        }
                                                        ref={btnRef}
                                                    >
                                                        Update profile
                                                        {loading && <Spinner />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>) : (
                    <div className="d-flex justify-content-center ">
                        <ReactLoading type="bars" color="#666362"
                            height={100} width={70} />
                    </div>
                )}
            </section>
        </>
    );
};

export const mapDispatchedToProps = (dispatch) => {
    return {
        updateUser: (data) => dispatch(update_user_detail(data)),
    };
};
export default withAuth(connect(null, mapDispatchedToProps)(setting));
