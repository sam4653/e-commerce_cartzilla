import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Breadcrumb from "../component/Breadcrumb";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getSession } from "next-auth/client";
import { toast ,Flip} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from 'next/head';
import styles from "../styles/Rutvik.module.css";
toast.configure();

const Contact = () => {
  const btnRef = useRef();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const resetData = () => {
    setData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
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
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const mailsSchema = Yup.object().shape({
    name: Yup.string()
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the are not allowed"
      ).required("Name is required")
      .min(2, "Please enter more than 2 character")
      .max(20, "Please enter less than 20 character")
    ,
    email: Yup.string()
      .required("Email is required")
      .matches(onlyEmail, "Invalid Email"),
    subject: Yup.string()
      .required("Subject is required")
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the are not allowed"
      ).min(10, "Please enter more than 10 character")
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
  });

  const addMails = async (e, { resetForm }) => {
    setLoading(true);
    btnRef.current.disabled = true;
    const session = await getSession();
    await axios
      .post(`${process.env.HOST}/contactUs`, data, {
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
        <title>Vaistra Ecommerce | Contact Us</title>
      </Head>
      <div className= "bg-dark py-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
            <Breadcrumb />
          </div>
          <div className="order-lg-1 pr-lg-4 text-center text-lg-left ">
            <h1 className="h3 mb-0 text-dark">Contacts</h1>
          </div>
        </div>
      </div>

      <section className="container-fluid pt-grid-gutter">
        <div className="row">
          <div className="col-xl-3 col-md-6 mb-grid-gutter">
            <a className="card hoverCard" href="#map" data-scroll>
              <div className="card-body text-center">
                <i className="czi-location h3 mt-2 mb-4 text-primary"></i>
                <h3 className="h6 mb-2">Main store address</h3>
                {/* <p className="fw-bold">Vaistra Technologies Private Limited</p> */}
                <p className="font-size-sm text-muted">
                2nd Floor, "Cholera Arcked, above Manappuram Bank, opp. Kansar Restaurant, Porbandar, Gujarat 360575
                </p>
                {/* <div className="font-size-sm text-primary">
                  Click to see map
                  <i className="czi-arrow-right align-middle ml-1"></i>
                </div> */}
              </div>
            </a>
          </div>
          <div className="col-xl-3 col-md-6 mb-grid-gutter">
            <div className="card hoverCard">
              <div className="card-body text-center">
                <i className="czi-time h3 mt-2 mb-4 text-primary"></i>
                <h3 className="h6 mb-3">Working hours</h3>
                <ul className="list-unstyled font-size-sm text-muted mb-0">
                  <li>Mon - Fri: 10AM - 7PM</li>
                  <li className="mb-0">Sat: 11AM - 5PM</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6 mb-grid-gutter">
            <div className="card hoverCard">
              <div className="card-body text-center">
                <i className="czi-phone h3 mt-2 mb-4 text-primary"></i>
                <h3 className="h6 mb-3">Phone numbers</h3>
                <ul className="list-unstyled font-size-sm mb-0">
                  <li>
                    <span className="text-muted mr-1">For customers:</span>
                    <a className="nav-link-style" href="tel:+108044357260">
                      (0286) 22 45 67
                    </a>
                  </li>
                  <li className="mb-0">
                    <span className="text-muted mr-1">Tech support:</span>
                    <a className="nav-link-style" href="tel:+100331697720">
                    (0286) 11 85 60
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6 mb-grid-gutter">
            <div className="card hoverCard">
              <div className="card-body text-center">
                <i className="czi-mail h3 mt-2 mb-4 text-primary"></i>
                <h3 className="h6 mb-3">Email addresses</h3>
                <ul className="list-unstyled font-size-sm mb-0">
                  <li>
                    <span className="text-muted mr-1">For customers:</span>
                    <a className="nav-link-style" href="mailto:+108044357260">
                      vaistra@gmail.com
                    </a>
                  </li>
                  <li className="mb-0">
                    <span className="text-muted mr-1">Tech support:</span>
                    <a
                      className="nav-link-style"
                      href="mailto:support@example.com"
                    >
                      vaistra.technologies@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-fluid px-0" id="map">
        <div className="row no-gutters">
          <div className="col-lg-6 iframe-full-height-wrap">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3708.6522792844403!2d69.61750441494304!3d21.638469285671302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39563459767c0001%3A0xdf35e951e69e8134!2sVaistra%20Technologies!5e0!3m2!1sen!2sin!4v1642073044179!5m2!1sen!2sin"
              width="600"
              height="450"
              // allowfullscreen=""
              loading="lazy"
            ></iframe>
          </div>
          <div className="col-lg-6 px-4 px-xl-5 py-5 border-top">
            <h2 className="h4 mb-4">Drop us a line</h2>
            <Formik
              initialValues={{
                name: data.name,
                email: data.email,
                phone: data.phone,
                subject: data.subject,
                message: data.message,
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
                    <div className="col-sm-6">
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
                    <div className="col-sm-6">
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
                    <div className="col-sm-12">
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
                          className="spinner-border spinner-border-sm ml-1"
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

export default Contact;
