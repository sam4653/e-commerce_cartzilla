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
import Head from "next/head"

toast.configure();

const index = () => {

  const router = useRouter();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [session, setSession] = useState({});
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false)
  const btnRef = useRef(null);

  const phoneRegex = new RegExp("(^[6789][0-9]{9})+$");

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .matches(phoneRegex, "Invalid  Mobile No.")
      .required("Mobile No. is required"),
    password: Yup.string()
      .min(3, "Password must be 3 characters at minimum")
      .required("Password is required"),
  });

  const sessionGet = async (status) => {
    const sess = await getSession();

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
          if (router.query.callback) {
            if (router.query.callback.includes("account")) {
              router.push(router.query.callback);
            } else {
              router.push("/");
            }
          }
          else {
            router.push("/");
          }
        }
        if (us.role === "VENDOR") {
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
          if (router.query.callback) {
            if (router.query.callback.includes("superadmin")) {
              router.push(router.query.callback);
            } else {
              router.push("/superadmin/dashboard");
            }
          } else {
            router.push("/superadmin/dashboard");
          }
        }
      }
    }
  };

  useEffect(() => {
    btnRef.current.disabled = true;
    sessionGet(false);
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
      btnRef.current.disabled = false;
    }
  };

  return (
    <>
      <Head>
        <title>Vaistra Ecommerce | Login</title>
      </Head>
      <div className="container">
        <div className="row" style={{ marginTop: `200px` }}>
          <div className="col-md-6 offset-md-3">
            <div className="form-design">
              <h4 className="mb-5 text-center">Superadmin Login</h4>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  username: "",
                  password: "",
                }}
                validationSchema={LoginSchema}
                onSubmit={login}
              >
                {({ touched, errors, isValid, values, handleChange }) => (
                  <Form className="needs-validation" autoComplete="off">
                    <div className="row">
                      <div className="col-md-12 mb-4">
                        <label>Mobile No.</label>
                        <Field
                          type="text"
                          placeholder="Mobile No."
                          maxLength={10}
                          className={`form-control ${touched.username && errors.username
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
                          <label htmlFor="si-password">Password</label>
                          <div className="password-toggle">
                            <Field
                              placeholder="Password"
                              id="si-password"
                              type={passwordVisible ? "text" : "password"}
                              className={`form-control ${touched.password && errors.password
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
                                value={passwordVisible}
                                onChange={() =>
                                  setPasswordVisible(!passwordVisible)
                                }
                              />
                              <i className="czi-eye password-toggle-indicator"></i>
                              <span className="sr-only">Show password</span>
                            </label>
                          </div>
                          <ErrorMessage
                            component="div"
                            name="password"
                            className="invalid-feedback"
                            style={{ display: "block" }}
                          />
                        </div>
                      </div>
                      <div className="col-md-12 d-flex justify-content-between align-items-center">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          ref={btnRef}
                          disabled={!isValid}
                        >
                          Login
                          {
                            loading && (
                              <Spinner />
                            )
                          }
                        </button>
                        <Link href="/vendor/register">
                          Not Have An Account ?
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
    </>
  );
};




export default index;
