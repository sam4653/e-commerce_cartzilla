import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import * as Yup from "yup";
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSession } from "next-auth/client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Breadcrumb from "../component/Breadcrumb";
import styles from "../styles/Rutvik.module.css";
const help = () => {
  const btnRef = useRef();
  const [loading, setLoading] = useState(false);
  const [imageName, setImageName] = useState("");

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    orderNo: "",
    image: "",
    url: "",
    topic: "",
    message: ""
  });

  const resetData = () => {
    setData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      orderNo: "",
      image: "",
      url: "",
      topic: "",
      message: ""
    });
  };

  const spaceValidation = new RegExp(
    "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
  );

  const phoneRegex = new RegExp("(^[6789][0-9]{9})+$");

  const onlyEmail = new RegExp(
    "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$"
  );

  const inputChange = (e) => {
    const { name, value } = e.target;
    if (e.target.name === "image") {
      setImageName(e.target.files[0].name);
      setData((prev) => ({ ...prev, image: imageName, [name]: value }));
      // console.log(data);
    } else {
      setData((prev) => ({ ...prev, image: imageName, [name]: value }));
    }

  };

  const mailsSchema = Yup.object().shape({
    name: Yup.string()
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the are not allowed"
      )
      .required("Name is required")
      .min(2, "Please enter more than 2 character")
      .max(20, "Please enter less than 20 character"),
    email: Yup.string()
      .required("Email is required")
      .matches(onlyEmail, "Invalid Email"),

    subject: Yup.string()
      .required("Subject is required")
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the are not allowed"
      )
      .min(10, "Please enter more than 10 character")
      .max(50, "Please enter less than 50 character"),

    message: Yup.string()
      .required("Message is required")
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the are not allowed"
      ).min(25, "Please enter more than 25 character")
      .max(300, "Please enter less than 300 character"),

    phone: Yup.string()
      .required("Phone is required")
      .matches(phoneRegex, "Invalid Phone Number"),

    orderNo: Yup.string()
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the are not allowed"
      )
      .required("OrderNo is required")
      .min(2, "Please enter more than 2 character")
      .max(20, "Please enter less than 20 character"),

    topic: Yup.string()
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the are not allowed"
      )
      .required("Topic is required")
      .min(2, "Please enter more than 2 character")
      .max(30, "Please enter less than 30 character"),

    url: Yup.string()
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the are not allowed"
      )
      .min(2, "Please enter more than 2 character")
      .max(50, "Please enter less than 50 character"),

    image: Yup.string().required("Image is required")

  });

  const addMails = async (e, { resetForm }) => {
    setLoading(true);
    btnRef.current.disabled = true;
    const session = await getSession();
    await axios
      .post(`${process.env.HOST}/helpCenter/sendRequest`, data, {
        headers: {
          Authorization: session.accessToken,
        },
      })
      .then((res) => {
        setLoading(false);
        // console.log(res.data);
        toast.info("😊 " + res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          transition: Flip,
        });
        resetForm();
        resetData();
      })
      .catch((err) => {
        toast.error("😢 " + err.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        setLoading(false);
        resetForm();
        resetData();
      });
  };

  return (
    <>
      <Head>
        <title>Vaistra Ecommerce | Help Center</title>
      </Head>
      <div className="bg-dark py-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
            <Breadcrumb />
          </div>
          <div className="order-lg-1 pr-lg-4 text-center text-lg-left ">
            <h1 className="h3 mb-0 text-dark">Help Center</h1>
          </div>
        </div>
      </div>

      {/* page content */}
      <div className="container px-0" id="map">
        <div className="row no-gutters">
          <div className="col-lg-12 px-4 px-xl-5 py-5 border-top">
            <Formik
              initialValues={{
                name: data.name,
                email: data.email,
                phone: data.phone,
                subject: data.subject,
                orderNo: data.orderNo,
                image: data.image,
                url: data.url,
                topic: data.topic,
                message: data.message
              }}
              validationSchema={mailsSchema}
              onSubmit={addMails}
            >
              {({ touched, errors, isValid, values, handleChange }) => (
                <Form>
                  <div className="row">
                    <div className="col-sm-6">
                      <label htmlFor="cf-name">
                        Your name<span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className={`form-control name ${touched.name && errors.name ? "is-invalid" : ""
                          }`}
                        name="name"
                        placeholder="Your Name"
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
                    <div className="col-sm-6 pt-2 pt-md-0">
                      <label htmlFor="cf-name">
                        Email Address<span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className={`form-control name ${touched.email && errors.email ? "is-invalid" : ""
                          }`}
                        name="email"
                        placeholder="Email Address"
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
                  <div className="row mt-3">
                    <div className="col-sm-6">
                      <label htmlFor="cf-name">
                        Your Phone<span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className={`form-control name ${touched.phone && errors.phone ? "is-invalid" : ""
                          }`}
                        name="phone"
                        maxLength={10}
                        onKeyDown={(e) =>
                          (e.keyCode === 69 || e.keyCode === 190) &&
                          e.preventDefault()
                        }
                        placeholder="Your Phone Number"
                        onChange={(e) => {
                          handleChange(e);
                          inputChange(e);
                        }}
                      />
                      <ErrorMessage
                        component="div"
                        name="phone"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="col-sm-6 pt-2 pt-md-0">
                      <label htmlFor="cf-name">
                        Subject<span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className={`form-control name ${touched.subject && errors.subject ? "is-invalid" : ""
                          }`}
                        name="subject"
                        placeholder="Subject"
                        onChange={(e) => {
                          handleChange(e);
                          inputChange(e);
                        }}
                      />
                      <ErrorMessage
                        component="div"
                        name="subject"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-sm-6">
                      <label htmlFor="cf-name">
                        Your Order Number<span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className={`form-control name ${touched.orderNo && errors.orderNo ? "is-invalid" : ""
                          }`}
                        name="orderNo"
                        placeholder="Your Order Number"
                        onChange={(e) => {
                          handleChange(e);
                          inputChange(e);
                        }}
                      />
                      <ErrorMessage
                        component="div"
                        name="orderNo"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="col-sm-6 pt-2 pt-md-0">
                      <label htmlFor="cf-name">
                        Upload Image<span className="text-danger">*</span>
                      </label>
                      <Field
                        type="file"
                        className={`form-control name ${touched.image && errors.image ? "is-invalid" : ""
                          }`}
                        name="image"
                        onChange={(e) => {
                          handleChange(e);
                          inputChange(e);
                        }}
                      />
                      <ErrorMessage
                        component="div"
                        name="image"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-sm-6">
                      <label htmlFor="cf-name">
                        Enter Your Topic<span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className={`form-control name ${touched.topic && errors.topic ? "is-invalid" : ""
                          }`}
                        name="topic"

                        placeholder="Enter Your Topic"
                        onChange={(e) => {
                          handleChange(e);
                          inputChange(e);
                        }}
                      />
                      <ErrorMessage
                        component="div"
                        name="topic"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="col-sm-6 pt-2 pt-md-0">
                      <label htmlFor="cf-name">
                        Url<span className="text-danger"></span>
                      </label>
                      <Field
                        type="text"
                        className={`form-control name ${touched.url && errors.url ? "is-invalid" : ""
                          }`}
                        name="url"
                        placeholder="Enter Url"
                        onChange={(e) => {
                          handleChange(e);
                          inputChange(e);
                        }}
                      />
                      <ErrorMessage
                        component="div"
                        name="url"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-sm-12 ">
                      <label htmlFor="cf-name">
                        Message<span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className={`form-control name ${touched.message && errors.message ? "is-invalid" : ""
                          }`}
                        name="message"
                        placeholder="Please describe in detail your request"
                        onChange={(e) => {
                          handleChange(e);
                          inputChange(e);
                        }}
                        as="textarea"
                        rows="5"
                      />
                      <ErrorMessage
                        component="div"
                        name="message"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>


                  <div className="row mt-3">
                    <div className="col-sm-6">
                      <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={
                          !Object.values(values).some(
                            (x) => x !== null && x !== ""
                          ) || !isValid
                        }
                        ref={btnRef}
                      >
                        Send message{" "}
                        {loading && (
                          <span
                            className="spinner-border spinner-border-sm ms-3"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        )}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default help;
