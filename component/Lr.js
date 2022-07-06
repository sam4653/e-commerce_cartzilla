
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Spinner from "./Spinner";
import { getSession, signIn, signOut } from "next-auth/client";
import Timer from "./Times";
import * as Yup from "yup";
import axios from "axios";
import { add_user_detail } from "../Redux/User/userActions";
import { fetchWishlist } from "../Redux/Wishlist/wishListActions";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import {
    fetchAddress,
    fetchShippingMethod,
  } from "../Redux/Account/accountActions";
import { deleteCart, fetchCart, reset_cart } from "../Redux/Cart/cartActions";
const Lr = (props) => {
    
    const loginTab = useRef(null);
    const router = useRouter();
    const [dropdown, setDropdown] = useState(null);
    const [session, setSession] = useState({});
    const signInModalClose = useRef(null);
    const [wishlist, setWishlist] = useState(true);
    const [signUpData, setSignUpData] = useState({
        mobile: "",
        otp: "",
        password: "",
      });
      const [finalSignUpData, setFinalSignUpData] = useState({
        mobile: null,
        otp: "",
        password: "",
      });
      const [loginData, setLoginData] = useState({
        username: "",
        password: "",
      });
    
      const [otpExpired, setOtpExpired] = useState(true);
      const [expiredTime, setExpiredTime] = useState({
        initialMinute: 0,
        initialSeconds: 0,
      });
    const [registerStep, setRegisterStep] = useState(false);
    const [passworderror, setPassworderror] = useState("")
    const [loading, setLoading] = useState({ login: false, register: false });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [registerPasswordVisible, setRegisterPasswordVisible] = useState({
      password: false,
      confpass: false,
    });

    const regex = new RegExp(
        "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$|(^[6789][0-9]{9})+$"
      );
      const onlyEmail = new RegExp(
        "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$"
      );
      const otpRegex = new RegExp("^[0-9]{6}$");
      const spaceValidation = new RegExp(
        "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
      );
      const phoneRegex = new RegExp("(^[6789][0-9]{9})+$");
      const pwRegex = new RegExp("^(?=.*[A-Za-z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$");
      // const pwRegex = new RegExp("^[a-zA-z]{8,}$");
    
      const MobileSchema = Yup.object().shape({
        mobile: Yup.string()
          .matches(phoneRegex, "Invalid Mobile No.")
          .required("Mobile No. is required"),
      });
      const RegisterSchema = Yup.object().shape({
        mobile: Yup.string()
          .matches(phoneRegex, "Invalid Mobile No.")
          .required("Mobile No. is required"),
        otp: Yup.string()
          .matches(otpRegex, "Invalid OTP.")
          .required("OTP is required"),
        password: Yup.string()
          .matches(
            pwRegex,
            "Password must be 8 characters at minimum with includes 1 digit and 1 special character"
          ).matches(
            spaceValidation,
            "Spaces at the beginning and at the are not allowed"
          )
          // .min(8, "Password must be 8 characters at minimum with includes 1 digit and 1 special character")
          .required("Password is required"),
      });
      const OtpSchema = Yup.object().shape({});
      const LoginSchema = Yup.object().shape({
        username: Yup.string()
          .matches(phoneRegex, "Invalid  Mobile No.")
          .required("Mobile No. is required"),
        password: Yup.string()
          .matches(
            pwRegex,
            "Password must be 8 characters at minimum with includes 1 digit and 1 special character"
          ).matches(
            spaceValidation,
            "Spaces at the beginning and at the are not allowed"
          )
          // .min(8, "Password must be 8 characters at minimum with includes 1 digit and 1 special character")
          .required("Password is required"),
      });
    
      const login = async (e, { resetForm }) => {
        props.loginBtnRef.current.disabled = true;
        setLoading((prev) => ({ ...prev, login: true }));
        const res = await signIn("credentials", {
          username: e.username,
          password: e.password,
          redirect: false,
        });
        // console.log(res);
        if (res.status === 200 && res.error === null) {
          props.loginBtnRef.current.disabled = false;
          signInModalClose.current.click();
         
          setLoading((prev) => ({ ...prev, login: false }));
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
         
          setLoading((prev) => ({ ...prev, login: false }));
          props.loginBtnRef.current.disabled = false;
        }
      };

      const resetData = () => {
        setSignUpData({
          mobile: "",
          otp: "",
          password: "",
        });
        setFinalSignUpData({
          mobile: null,
          otp: "",
          password: "",
        });
      };
      const getOtp = async (e, { resetForm }) => {
        props.registerBtnRef.current.disabled = true;
        setLoading((prev) => ({ ...prev, register: true }));
        await axios
          .post(`${process.env.HOST}/auth/signup-otp`, {
            mobileNo: signUpData.mobile,
          })
          .then((res) => {
            props.registerBtnRef.current.disabled = false;
            setRegisterStep(true);
            setExpiredTime({ initialMinute: 1, initialSeconds: 0 });
            setOtpExpired(false);
            setLoading((prev) => ({ ...prev, register: false }));
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
            setLoading((prev) => ({ ...prev, register: false }));
            props.registerBtnRef.current.disabled = false;
            if (err.response.status === 302) {
              setRegisterStep(true);
            }
            if (err.response.status === 409) {
              setRegisterStep(false);
              resetData();
              resetForm();
              loginTab.current.click();
            }
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
    
      const resendOtp = async () => {
        await axios
          .post(`${process.env.HOST}/auth/signup-otp`, {
            mobileNo: signUpData.mobile,
          })
          .then((res) => {
            setExpiredTime({ initialMinute: 1, initialSeconds: 0 });
            setOtpExpired(false);
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
    
      const register = async (e, { resetForm }) => {
        props.registerBtnRef.current.disabled = true;
        setLoading((prev) => ({ ...prev, register: true }));
        await axios
          .post(`${process.env.HOST}/auth/signup`, {
            mobileNo: String(e.mobile),
            otp: String(e.otp),
            password: e.password,
            photo: "/avtar/avtar.png",
          })
          .then((res) => {
            props.registerBtnRef.current.disabled = false;
            setLoading((prev) => ({ ...prev, register: false }));
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
            resetData();
            resetForm();
            setRegisterStep(false);
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
            setLoading((prev) => ({ ...prev, register: false }));
            props.registerBtnRef.current.disabled = false;
          });
      };
      const inputChangeHandler = (e) => {
        const { name, value } = e.target;
        setSignUpData((prev) => ({ ...prev, [name]: value }));
      };

      const listenToScroll = () => {
        let heightToHideFrom = 15;
        const winScroll =
          document.body.scrollTop || document.documentElement.scrollTop;
    
        if (winScroll > heightToHideFrom) {
          setSticky(true);
        } else {
          setSticky(false);
        }
      };

      useEffect(() => {
          props.loginBtnRef.current.disabled = true;
          props.registerBtnRef.current.disabled = true;
        window.addEventListener("scroll", listenToScroll);
        return () => window.removeEventListener("scroll", listenToScroll);
      }, []);

      const sessionGet = async (status) => {
        const sess = await getSession();
        if (sess) {
          setSession(sess);
          let us = sess.user;
          await axios
            .get(`${process.env.HOST}/user`, {
              headers: {
                Authorization: sess.accessToken,
              },
            })
            .then((res) => {
              us.fullName =
                res.data.data.firstName + " " + res.data.data.lastName;
              us.photo = res.data.data.photo;
            })
            .catch((err) => {
              console.log(err);
            });
    
          if (us.fullName === "") {
            us.fullName = "No Name";
          }
          if (us.photo === null) {
            us.photo = "/avtar/avtar.png";
          }
          props.addUserDetail({ user: us, token: sess.accessToken });
    
          if (status) {
            if (us.role === "USER") {
              setDropdown(true);
              props.fetchCarts(sess.accessToken);
              props.fetchWishlist(sess.accessToken);
              props.fetchAddress(sess.accessToken);
              props.fetchShippingMethod(sess.accessToken);
              if (router.query.callback) {
                if (router.query.callback.includes("account")) {
                  router.push(router.query.callback);
                } else {
                  router.push("/");
                }
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
                if (
                  router.pathname.includes("/shop") ||
                  router.pathname.includes("/single")
                ) {
                  return;
                } else if (!router.pathname.includes("/vendor"))
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

      useEffect(async () => {
        if (router.pathname.startsWith("/vendor")) {
       
          setDropdown(false);
          setWishlist(false);
          sessionGet(false);
        }
        const sess = await getSession();
        if (sess) {
          sessionGet(true);
        }
      },[]);
    
    
  return (
    <>
         <div className="modal fade" id="signin-modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <ul className="nav nav-tabs card-header-tabs" role="tablist">
                <li className="nav-item">
                  <a
                    className={props.isSignIn ? "nav-link active" : "nav-link"}
                    href="#signin-tab"
                    data-toggle="tab"
                    role="tab"
                    ref={loginTab}
                    aria-selected={props.isSignIn}
                  >
                    <i className="czi-unlocked mr-2 mt-n1"></i>
                    Sign in
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={!props.isSignIn ? "nav-link active" : "nav-link"}
                    href="#signup-tab"
                    data-toggle="tab"
                    role="tab"
                    aria-selected={!props.isSignIn}
                  >
                    <i className="czi-user mr-2 mt-n1"></i>
                    Sign up
                  </a>
                </li>
              </ul>
              <button
                className="close"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
                ref={signInModalClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body tab-content py-4">
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
                  <Form
                    className={`needs-validation tab-pane fade ${props.isSignIn ? "show active" : ""}`}
                    id="signin-tab"
                  >

                    <div className="box-shadow-sm">


                      <div
                        className={`navbar-sticky bg-light ${props.sticky ? "navbar-stuck" : ""
                          }`}
                        autoComplete="off"
                        id="signin-tab"
                      >
                        <div className="form-group">
                          <label htmlFor="si-email">Email or Phone </label>
                          <Field
                            as="input"
                            className={`form-control ${touched.username && errors.username
                              ? "is-invalid"
                              : ""
                              }`}
                            name="username"
                            type="text"
                            id="si-email"
                            maxLength={10}
                            placeholder="Mobile No."
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
                        <div className="form-group">
                          <label htmlFor="si-password">Password</label>
                          <div className="password-toggle">
                            <Field
                              as="input"
                              className={`form-control ${touched.password && errors.password
                                ? "is-invalid"
                                : ""
                                }`}
                              placeholder="Password"
                              type={passwordVisible ? `text` : "password"}
                              id="si-password"
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
                                onChange={(e) =>
                                  setPasswordVisible(e.target.checked)
                                }
                              />
                              <i className="czi-eye password-toggle-indicator"></i>
                              <span className="sr-only">Show password</span>
                            </label>
                          </div>

                          <ErrorMessage
                            component="div"
                            name="password"
                            className={`invalid-feedback`}
                            style={{ display: "block" }}
                          />
                        </div>

                        <div className="form-group d-flex flex-wrap justify-content-end">
                          <a className="font-size-sm" href="/forgotPassword">
                            Forgot password?
                          </a>
                        </div>
                        <button
                          className="btn btn-primary btn-block btn-shadow"
                          type="submit"
                          disabled={!isValid}
                          ref={props.loginBtnRef}
                        >
                          {loading.login ? <Spinner /> : `Sign in`}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
              {registerStep}
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
                validationSchema={registerStep ? RegisterSchema : MobileSchema}
                onSubmit={registerStep ? register : getOtp}
              >
                {({ touched, errors, isValid, values, handleChange }) => (
                  <Form
                    className={`needs-validation tab-pane fade ${!props.isSignIn ? "show active" : ""
                      }`}
                    autoComplete="off"
                    noValidate
                    id="signup-tab"
                  >
                    <div className="form-group">
                      <label htmlFor="mobile">Mobile No.</label>
                      <Field
                        className={`form-control ${touched.mobile && errors.mobile ? "is-invalid" : ""
                          }`}
                        name="mobile"
                        type="number"
                        id="mobile"
                        maxLength={10}
                        placeholder="Mobile No."
                        onKeyDown={(e) =>
                          (e.keyCode === 69 || e.keyCode === 190) &&
                          e.preventDefault()
                        }
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
                            className="text-primary fs-6"
                            onClick={resendOtp}
                          >
                            <small>Resend Otp ?</small>
                          </button>
                        ) : (
                          <Timer
                            setOtpExpired={setOtpExpired}
                            initialMinute={expiredTime.initialMinute}
                            initialSeconds={expiredTime.initialSeconds}
                          />
                        )}
                      </div>
                    )}

                    {registerStep && (
                      <>
                        <div className="form-group">
                          <label htmlFor="otp">OTP</label>
                          <Field
                            className={`form-control ${touched.otp && errors.otp ? "is-invalid" : ""
                              }`}
                            name="otp"
                            type="text"
                            id="otp"
                            placeholder="OTP"
                            onChange={(e) => {
                              handleChange(e);
                              inputChangeHandler(e);
                            }}
                          />
                          <ErrorMessage
                            component="div"
                            name="otp"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="password">Password</label>
                          <div className="password-toggle">
                            <Field
                              className={`form-control ${touched.password && errors.password
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
                                inputChangeHandler(e);
                              }}
                            />

                            <label className="password-toggle-btn">
                              <input
                                className="custom-control-input"
                                type="checkbox"
                                value={registerPasswordVisible.password}
                                onChange={(e) =>
                                  setRegisterPasswordVisible((prev) => ({
                                    ...prev,
                                    password: e.target.checked,
                                  }))
                                }
                              />
                              <i className="czi-eye password-toggle-indicator"></i>
                              <span className="sr-only">Show password</span>
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
                      ref={props.registerBtnRef}
                      disabled={
                        !registerStep
                          ? !signUpData.mobile.match(phoneRegex) ||
                          signUpData.mobile === ""
                          : signUpData.password === "" ||
                          !isValid ||
                          signUpData.mobile === "" ||
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
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
  }

const mapDispatchToProps = (dispatch) => {
    return {
      fetchCarts: (token) => dispatch(fetchCart(token)),
      addUserDetail: (user) => dispatch(add_user_detail(user)),
      fetchWishlist: (token) => dispatch(fetchWishlist(token)),
      fetchAddress: (token) => dispatch(fetchAddress(token)),
      fetchShippingMethod: (token) => dispatch(fetchShippingMethod(token)),
    };
  };
  
  
export default connect(mapStateToProps, mapDispatchToProps)(Lr);

















