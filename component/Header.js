import React, { useEffect, useRef, useState } from "react";
import { toast, Flip } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getSession, signIn, signOut } from "next-auth/client";
import * as Yup from "yup";
import Spinner from "./Spinner";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { deleteCart, fetchCart, reset_cart } from "../Redux/Cart/cartActions";
import { fetchWishlist } from "../Redux/Wishlist/wishListActions";
import { connect } from "react-redux";
import axios from "axios";
import Timer from "./Times";
import { useRouter } from "next/router";
import { add_user_detail, remove_user_detail } from "../Redux/User/userActions";

import {
  fetchAddress,
  fetchShippingMethod,
  fetch_advertisement,
  search_Product,
} from "../Redux/Account/accountActions";
import SignOut from "./SignOut";
import LevelOne from "./LevelOne";
import SubType from "./SubType";
import { FaBuffer, FaInfoCircle, FaStore, FaStoreAlt } from "react-icons/fa";
import CartItem from "./Cart/CartItem";
import styles from "../styles/Rutvik.module.css"


toast.configure();
const Header = (props) => {
  // console.log("props", props)
  const router = useRouter();
  const loginBtnRef = useRef(null);
  const registerBtnRef = useRef(null);
  const loginTab = useRef(null);
  const clickexpand = useRef();
  const signInModalClose = useRef(null);
  const [session, setSession] = useState({});
  const [user, setUser] = useState({});
  const searchRef = useRef("");
  const [searchVal, setsearch] = useState("")
  const [mainHeader, setMainHeader] = useState(true);
  const [dropdown, setDropdown] = useState(null);
  const [myCart, setMyCart] = useState(true);
  const [footer, setFooter] = useState(true);
  const [searchPla, setSearchPla] = useState(true);
  const [wishlist, setWishlist] = useState(true);
  const [mainMenu, setMainMenu] = useState(true);
  const [expandMenu, setExpandMenu] = useState(true);
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

  const [sticky, setSticky] = useState(false);
  const [menu, setMenu] = useState(false);
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


  const [isSignIn, setIsSignIn] = useState(true);
  useEffect(() => {
    loginBtnRef.current.disabled = true;
    registerBtnRef.current.disabled = true;
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
    await axios
      .get(`${process.env.HOST}/advertisements`)
      .then((res) => {
        props.fetchAdvertisements(res.data.data);
      })
      .catch((err) => {
        console.log(err?.response?.data?.message);
      });
  }, []);


  const [category, setCategory] = useState([]);
  useEffect(() => {
    const getCategory = async () => {
      await axios
        .get(`${process.env.HOST}/category/root`)
        .then((res) => setCategory(res.data.data))
        .catch((err) => {
          console.log(err);
          console.log(err.response.data.message);
        });
    };
    getCategory();
    // return () => setCategory([]);
  }, []);

  useEffect(async () => {
    if (router.pathname.startsWith("/vendor")) {
      setMainHeader(false);
      setDropdown(false);
      setMyCart(false);
      setFooter(false);
      setSearchPla(false);
      setMainMenu(false);
      setWishlist(false);
      setExpandMenu(false);
    }
    sessionGet(false);
    const sess = await getSession();
    if (sess) {
      sessionGet(true);
    }
  }, []);


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

  const regex = new RegExp('^[a-z0-9]+@[a-z]+.+[a-z.]{2,3}|(^[6789][0-9]{9})+$');

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .matches(regex, "Invalid Email or Phone.")
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
      .required("Password is required"),
  });

  const login = async (e, { resetForm }) => {
    loginBtnRef.current.disabled = true;
    setLoading((prev) => ({ ...prev, login: true }));
    const res = await signIn("credentials", {
      username: e.username,
      password: e.password,
      redirect: false,
    });

    if (res.status === 200 && res.error === null) {
      loginBtnRef.current.disabled = false;
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
      // router.push("/shop")
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
      loginBtnRef.current.disabled = false;
    }
  };

  useEffect(async () => {
    await axios
      .get(`${process.env.HOST}/advertisements`)
      .then((res) => {
        props.fetchAdvertisements(res.data.data);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  }, []);
  useEffect(async () => {
    if (router.pathname.startsWith("/vendor")) {
      setMainHeader(false);
      setDropdown(false);
      setMyCart(false);
      setFooter(false);
      setSearchPla(false);
      setMainMenu(false);
      setWishlist(false);
      setExpandMenu(false);
    }
    sessionGet(false);
    const sess = await getSession();
    if (sess) {
      sessionGet(true);
    }
  }, []);

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
    registerBtnRef.current.disabled = true;
    setLoading((prev) => ({ ...prev, register: true }));
    await axios
      .post(`${process.env.HOST}/auth/signup-otp`, {
        mobileNo: signUpData.mobile,
      })
      .then((res) => {
        registerBtnRef.current.disabled = false;
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
        registerBtnRef.current.disabled = false;
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
    registerBtnRef.current.disabled = true;
    setLoading((prev) => ({ ...prev, register: true }));
    await axios
      .post(`${process.env.HOST}/auth/signup`, {
        mobileNo: String(e.mobile),
        otp: String(e.otp),
        password: e.password,
        photo: "/avtar/avtar.png",
      })
      .then((res) => {
        registerBtnRef.current.disabled = false;
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
        registerBtnRef.current.disabled = false;
      });
  };
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  const logout = async () => {
    return <SignOut />;
  };

  const handleSearch = async (e) => {
    // e.preventDefault();
    // const searchValue = searchRef.current.value;
    // console.log("handle", router.pathname);
    await axios
      .get(`${process.env.HOST}/products/search?name=${searchVal}`)
      .then((result) => {
        props.searchProduct(result.data.data);
        setMainMenu(!mainMenu);
        // clickexpand.current.close();
        // if (
        //     router.pathname === "/" ||
        //     router.pathname === "/productNotFound" ||
        //     router.pathname === "/404"
        // )

        router.push("/shop");

      })
      .catch((err) => {
        if (err?.response?.status === 404)
          return router.push("/productNotFound");
        console.log(err.response);
      });
  };

  const [productsCount, setProductsCount] = useState("")
  useEffect(async () => {
    await axios
      .get(`${process.env.HOST}/products`)
      .then((res) => {
        // console.log("products count : ", res.data)
        setProductsCount(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [])

  const [customerCount, setCustomerCount] = useState("")
  useEffect(async () => {
    const sess = await getSession();
    if (sess) {
      const sess = await getSession();
      await axios
        .get(`${process.env.HOST}/customers`, {
          headers: {
            Authorization: sess.accessToken,
          },
        })
        .then((res) => {
          // console.log("Customer count : ", res.data)
          setCustomerCount(res.data);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  }, [])

  const [vendorCount, setVendorCount] = useState("")
  useEffect(async () => {
    const sess = await getSession();
    if (sess) {
      await axios
        .get(`${process.env.HOST}/vendors`, {
          headers: {
            Authorization: sess.accessToken,
          },
        })
        .then((res) => {
          // console.log("Vendor count : ", res.data)
          setVendorCount(res.data);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  }, [])



  return (
    <>
      <div className="modal fade" id="signin-modal" tabIndex="-1" role="dialog" >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header" >
              <ul className="nav nav-tabs card-header-tabs" role="tablist" >
                <li className="nav-item">
                  <a
                    className={isSignIn ? "nav-link active" : "nav-link"}
                    href="#signin-tab"
                    data-toggle="tab"
                    role="tab"
                    ref={loginTab}
                    aria-selected={isSignIn}
                  >
                    <i className="czi-unlocked mr-2 mt-n1"></i>
                    Sign in
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={!isSignIn ? "nav-link active" : "nav-link"}
                    href="#signup-tab"
                    data-toggle="tab"
                    role="tab"
                    aria-selected={!isSignIn}
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
                    className={`needs-validation tab-pane fade ${isSignIn ? "show active" : ""}`}
                    id="signin-tab"
                  >

                    <div className="box-shadow-sm">


                      <div
                        className={`navbar-fixed bg-light ${sticky ? "navbar-stuck" : ""
                          }`}
                        autoComplete="off"
                        id="signin-tab"
                      >
                        <div className="form-group">
                          <label htmlFor="si-email">Email or Phone{" "}<span className="text-danger">*</span></label>
                          <Field
                            as="input"
                            className={`form-control ${touched.username && errors.username
                              ? "is-invalid"
                              : ""
                              }`}
                            name="username"
                            type="text"
                            id="si-email"
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
                          <label htmlFor="si-password">Password{" "}<span className="text-danger">*</span></label>
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
                          ref={loginBtnRef}
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
                    className={`needs-validation tab-pane fade ${!isSignIn ? "show active" : ""
                      }`}
                    autoComplete="off"
                    noValidate
                    id="signup-tab"
                  >
                    <div className="form-group">
                      <label htmlFor="mobile">Mobile No.{" "}<span className="text-danger">*</span></label>
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
                      ref={registerBtnRef}
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

      <header className="box-shadow-sm">
        {mainHeader === true ? (
          <div className="topbar topbar-dark bg-dark">
            <div className="container">
              <div className="topbar-text dropdown d-md-none">
                <a
                  className="topbar-link dropdown-toggle"
                  href="#"
                  data-toggle="dropdown"
                >
                  Useful links
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="tel:00331697720">
                      <i className="czi-support text-muted mr-2"></i>
                      (00) 33 169 7720
                    </a>
                  </li>
                  <li>
                    <Link href="/order-tracking">
                      <a className="dropdown-item">
                        <i className="czi-location text-muted mr-2"></i>
                        Order tracking
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="topbar-text text-nowrap d-none d-md-inline-block">
                <i className="czi-support"></i>
                <span className="text-muted mr-1">Support</span>
                <a className="topbar-link" href="tel:00331697720">
                  (0286) 22 13 50
                </a>
              </div>
              {/* <div className="cz-carousel cz-controls-static d-none d-md-block">
                <div
                  className="cz-carousel-inner"
                  data-carousel-options='{"mode": "gallery", "nav": false}'
                >
                  <div className="topbar-text" style={{ color: `#fff` }}>
                    Free shipping for order over $200
                  </div>
                  <div className="topbar-text">
                    We return money within 30 days
                  </div>
                  <div className="topbar-text">
                    Friendly 24/7 customer support
                  </div>
                </div>
              </div> */}

              <div className="ml-3 text-nowrap">
                {props.user?.token ? (
                  <Link href="/order-tracking">
                    <a className="topbar-link mr-4 d-none d-md-inline-block">
                      <i className="czi-location"></i>
                      Order tracking
                    </a>
                  </Link>
                ) : (
                  <Link href="/vendor/register">
                    <a
                      className="mb-1 primary h5"
                      style={{
                        textShadow:
                          "0px 2px 2px rgba(0, 0, 0, 0.4)",
                        color: "whitesmoke",
                      }}
                    >
                      <i className="opacity-60 mr-2 mb-1">
                        <FaStoreAlt />
                      </i>
                      Become a Seller
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>


        ) : (
          ""
        )}

        <div
          className={`navbar-sticky bg-light ${sticky ? "navbar-stuck" : ""}`}
        >
          <div className="navbar navbar-expand-lg navbar-light ">
            <div className="container">
              <Link href="/">
                <a
                  className="navbar-brand  d-sm-block mr-3 flex-shrink-0"
                  style={{ minWidth: `7rem` }}
                >
                  <div className="d-flex h-100 align-items-center justify-content-center ">
                    <img
                      // width="100"
                      src="/img/logo.png"
                      alt="Logo"
                      // height="50"
                      // width="50"
                      // style={{ width: "50px", height: " 50px" }}
                      className={`bio-image-wrapper ${styles.logoSize}`}
                    />
                    <h3 className={`m-0 ${styles.logoText}`}>VAISTRA</h3>
                  </div>
                </a>
              </Link>
              {/* <a
                                className="navbar-brand d-sm-none mr-2"
                                href="/"
                                style={{ minWidth: `4.625rem` }}
                            >
                                <img
                                    width="74"
                                    src="/img/logo-icon.png"
                                    alt="addproduct"
                                />
                            </a> */}
              {searchPla === true ? (
                <div className="input-group-overlay d-none d-lg-flex mx-4">
                  <input
                    className="form-control appended-form-control"
                    type="text"
                    placeholder="Search for products"
                    // ref={searchRef}
                    onChange={(e) => { setsearch(e.target.value) }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                  // onChange={
                  //     router.pathname === "/"
                  //         ? ""
                  //         : handleSearch
                  // }
                  />
                  <div
                    className="input-group-append-overlay"
                    onClick={handleSearch}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="input-group-text">
                      <i className="czi-search"></i>
                    </span>
                  </div>
                </div>
              ) : (
                ""
              )}

              <div className="navbar-toolbar d-flex flex-shrink-0 align-items-center" >
                {expandMenu === true ? (
                  <>
                    <button
                      className="navbar-toggler"
                      type="button"
                      data-toggle="collapse"
                      data-target="#navbarCollapse"
                    >
                      <span className="navbar-toggler-icon"></span>
                    </button>
                    <button
                      className="navbar-tool navbar-stuck-toggler"
                      style={{
                        border: `none`,
                        outline: "none",
                        background: "none",
                      }}
                    >
                      <span className="navbar-tool-tooltip">Expand menu</span>
                      <div
                        className="navbar-tool-icon-box"

                        onClick={() => setMenu(!menu)}
                      >
                        <i className="navbar-tool-icon czi-menu"></i>
                      </div>
                    </button>
                  </>
                ) : (
                  ""
                )}
                {wishlist === true ? (
                  !session.user ? <a
                    className="navbar-tool d-none d-lg-flex" href="#signin-modal" data-toggle="modal" ><span className="navbar-tool-tooltip">Wishlist</span>
                    <div className="navbar-tool-icon-box mr">
                      <i className="navbar-tool-icon czi-heart mx-lg-2"></i>
                    </div>
                  </a> :
                    (<Link href="/account/wishlist">
                      <a className="navbar-tool d-none d-lg-flex">
                        <span className="navbar-tool-tooltip">Wishlist</span>
                        <div className="navbar-tool-icon-box mr">
                          <i className="navbar-tool-icon czi-heart mx-lg-2"></i>
                        </div>
                      </a>
                    </Link>)
                ) : (
                  ""
                )}

                <div className="dropdown navbar-tool">
                  <div className="navbar-tool-icon-box">
                    {props.user.user.photo ? (
                      <img
                        src={
                          !(
                            props.user.user.photo ===
                            "null" ||
                            props.user.user.photo === ""
                          )
                            ? props.user.user.photo
                            : "/avtar/avtar.png"
                        }
                        style={{
                          width: "30px",
                          height: "30px",
                          border: "4px solid #A7E9FC",
                        }}
                        className="rounded-circle"
                      />
                    ) : (
                      <a
                        className=" ml-1 ml-lg-0 mr-n1 mx-lg-2"
                        href="#signin-modal"
                        data-toggle="modal"
                        onClick={() => setIsSignIn(true)}
                      >
                        <i className="navbar-tool-icon czi-user"></i>
                      </a>
                    )}
                  </div>

                  <div
                    className="navbar-tool-text ml-n3 d-flex justify-content-center align-items-center dropdown-toggle "
                    data-toggle="dropdown"
                  >
                    <small style={{ fontSize: "12px" }}>Hello</small>
                    <span className="ml-1"> {props.user.user.fullName !== "null null"
                      ? props.user.user.fullName
                      : "No Name"} </span>

                  </div>
                  {!props.user.user.fullName ? (
                    <>
                    </>

                  ) : (dropdown ? (<ul className="dropdown-menu">
                    <li>
                      <Link href="/account/order">
                        <a className="dropdown-item">
                          Orders History
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/account/setting">
                        <a className="dropdown-item">
                          Account Settings
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/account/address">
                        <a className="dropdown-item">
                          Account Addresses
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/account/wishlist">
                        <a className="dropdown-item">
                          Wishlist
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/account/tickets">
                        <a className="dropdown-item">
                          My Tickets
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/account/changePassword">
                        <a className="dropdown-item">
                          Change Password
                        </a>
                      </Link>
                    </li>
                    {props.user.token && (
                      <li>
                        <SignOut
                          type="link"
                          label="Sign out"
                        />
                        {/* <button
                                                        className="dropdown-item"
                                                        onClick={async () => {
                                                            await signOut({
                                                                redirect: false,
                                                            });
                                                            router.replace("/");
                                                            props.removeUserDetail();
                                                        }}
                                                    >
                                                        <i className="czi-sign-out opacity-60 mr-2"></i>
                                                        Logout
                                                    </button> */}
                      </li>
                    )}
                  </ul>) : (<ul className="dropdown-menu">
                    <li className="dropdown-heading">
                      Account
                    </li>
                    <hr />
                    <li>
                      <Link href="/vendor/profile">
                        <a className="dropdown-item">
                          <i className="czi-settings opacity-60 mr-2"></i>
                          Settings
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/vendor/sales">
                        <a className="dropdown-item">
                          <i className="czi-dollar opacity-60 mr-2"></i>
                          Sales
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/vendor/products">
                        <a className="dropdown-item">
                          <i className="czi-package opacity-60 mr-2"></i>
                          Products
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/vendor/productAdd">
                        <a className="dropdown-item">
                          <i className="czi-cloud-upload opacity-60 mr-2"></i>
                          Add New Product
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/vendor/order">
                        <a className="dropdown-item">
                          <i className="opacity-60 mr-2">
                            <FaBuffer />
                          </i>
                          Orders
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/vendor/changePassword">
                        <a className="dropdown-item">
                          <i className="opacity-60 mr-2">
                            <FaInfoCircle />
                          </i>
                          Change Password
                        </a>
                      </Link>
                    </li>
                    {props.user.token && (
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={async () => {
                            await signOut({
                              redirect: false,
                            });
                            router.replace(
                              "/vendor"
                            );
                            props.removeUserDetail();
                          }}
                        >
                          <i className="czi-sign-out opacity-60 mr-2"></i>
                          Logout
                        </button>
                      </li>
                    )}
                  </ul>)

                  )}
                </div>
                <div className="navbar-tool dropdown ml-3 mr-lg-5" >
                  {myCart === true ? (
                    <>
                      <a className="navbar-tool-icon-box bg-secondary dropdown-toggle" data-toggle="dropdown" href="#collapseExample" >
                        <span className="navbar-tool-label">
                          {props.carts.carts.length}
                        </span>
                        <i className="navbar-tool-icon czi-cart"></i>
                      </a>
                      <Link href="/cart">
                        <a className="navbar-tool-text">
                          <small>My Cart</small>₹{Number(props?.carts?.total)?.toFixed(2)}
                        </a>
                      </Link>
                    </>
                  ) : (
                    ""
                  )}

                  <div
                    className="dropdown-menu dropdown-menu-right mr-n4" id="collapseExample"
                    style={{ width: `18rem` }}
                  >
                    <div className="widget widget-cart px-3 pt-2 pb-3">
                      <div
                        style={{ height: `15rem` }}
                        data-simplebar="init"
                        data-simplebar-auto-hide="false"
                      >
                        <div
                          className="simplebar-wrapper"
                          style={{
                            margin: `0px -16px 0px 0px`,
                          }}
                        >
                          <div className="simplebar-height-auto-observer-wrapper">
                            <div className="simplebar-height-auto-observer"></div>
                          </div>
                          <div className="simplebar-mask">
                            <div
                              className="simplebar-offset"
                              style={{
                                right: `0px`,
                                bottom: `0px`,
                              }}
                            >
                              <div
                                className="simplebar-content-wrapper"
                                style={{
                                  height: "auto",
                                  overflow: "scroll",
                                }}
                              >
                                <div
                                  className="simplebar-content"
                                  style={{
                                    padding: `0px 16px 0px 0px`,
                                  }}
                                >
                                  {props.carts.carts.map((cart, i) => {
                                    return (
                                      <div
                                        key={i}
                                        className="widget-cart-item py-2 border-bottom"
                                      >
                                        <button
                                          className="close text-danger"
                                          type="button"
                                          aria-label="Remove"
                                          onClick={() => {
                                            props.deleteCart({
                                              pid: cart.pId,
                                              token: props.user.token,
                                            });
                                          }}
                                        >
                                          <span aria-hidden="true">×</span>
                                        </button>
                                        <CartItem cart={cart} />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="simplebar-placeholder"
                            style={{
                              width: `286px`,
                              height: `316px`,
                            }}
                          ></div>
                        </div>
                        <div
                          className="simplebar-track simplebar-horizontal"
                          style={{
                            visibility: `hidden`,
                          }}
                        >
                          <div
                            className="simplebar-scrollbar simplebar-visible"
                            style={{
                              width: `0px`,
                              display: `none`,
                            }}
                          ></div>
                        </div>
                        <div
                          className="simplebar-track simplebar-vertical"
                          style={{
                            visibility: `visible`,
                          }}
                        >
                          <div
                            className="simplebar-scrollbar simplebar-visible"
                            style={{
                              height: `182px`,
                              display: `block`,
                              transform: `translate3d(0px, 0px, 0px)`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="d-flex flex-wrap justify-content-between align-items-center py-3">
                        <div className="font-size-sm mr-1 py-2">
                          <span className="text-muted">Subtotal:</span>
                          <span className="text-accent font-size-base ml-1">
                            ₹{Number(props?.carts?.total).toFixed(2)}
                          </span>
                        </div>
                        {props.user?.token ? (
                          <Link href="/cart" >
                            {/* {console.log("Sign or not", isSignIn)} */}
                            <a className="btn btn-outline-secondary btn-sm">
                              {/* <a className="btn btn-outline-secondary btn-sm"> */}
                              Expand cart
                              <i className="czi-arrow-right ml-1 mr-n1"></i>
                              {/* </a> */}
                            </ a>
                          </Link>
                        ) : (
                          <a className="btn btn-outline-secondary btn-sm" href={isSignIn ? "#signin-modal" : " "} data-toggle="modal" > Expand cart</a>
                        )}
                      </div>
                      {props.user.token ? (
                        props.carts.carts.length ? (
                          <Link href="/checkout/detail">
                            <a className="btn btn-primary btn-sm btn-block">
                              <i className="czi-card mr-2 font-size-base align-middle"></i>
                              Checkout
                            </a>
                          </Link>
                        ) : (
                          <Link href="/shop">
                            <a className="btn btn-primary btn-sm btn-block">
                              <i className="czi-card mr-2 font-size-base align-middle"></i>
                              Go For Shopping
                            </a>
                          </Link>
                        )
                      ) : (
                        <a
                          className="btn btn-primary btn-sm btn-block"
                          href="#signin-modal"
                          data-toggle="modal"
                          onClick={() => setIsSignIn(false)}
                        >
                          <i className="czi-card mr-2 font-size-base align-middle"></i>
                          Checkout
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`navbar navbar-expand-lg navbar-light navbar-stuck-menu mt-n2 pt-0 pb-2 ${menu ? "show" : ""
              }`}
          >
            <div className="container">
              <div className="collapse navbar-collapse" id="navbarCollapse">
                {searchPla === true ? (
                  <div className="input-group-overlay d-lg-none my-3 d-flex justify-content-end">

                    <input
                      className="form-control appended-form-control"
                      type="text"
                      placeholder="Search for products"
                      // ref={searchRef}
                      onChange={(e) => { setsearch(e.target.value) }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                    // onChange={
                    //     router.pathname === "/"
                    //         ? ""
                    //         : handleSearch
                    // }
                    />
                    <div className="input-group-prepend-overlay">
                      <span className="input-group-text">
                        <i className="czi-search"></i>
                      </span>
                    </div>
                  </div>) : (
                  ""
                )}
                {mainMenu === true ? (
                  <>
                    <ul className="navbar-nav">
                      <li className="nav-item ">
                        <Link href="/">
                          <a className="nav-link" href="/">
                            Home
                          </a>
                        </Link>
                      </li>
                      {/* <li className="nav-item dropdown text-capitalize" >
                        <Link href="/shop">
                          <a className="nav-link dropdown-toggle">Shop</a>
                        </Link>
                        <LevelOne />
                      </li> */}
                      {category &&
                        category.map((sc, i) => {
                          return (
                            <li className="nav-item dropdown text-capitalize" key={i}>
                              <Link href={`/category/${sc.name.replace(' & ', 'And')}`}
                                key={i}>
                                <a className="nav-link dropdown-toggle" >{sc.name}</a>
                              </Link>
                              <SubType menuId={sc.id} menuName={sc.name} />
                            </li>
                          );
                        })}

                      <li className="nav-item dropdown text-capitalize" >
                        <Link href="/">
                          <a className="nav-link dropdown-toggle f-left">More</a>
                        </Link>
                        <div className="dropdown-menu">
                          <ul className="py-2 px-3">
                            <li className="widget-list-item pb-1 list-unstyled"><Link href="/about"><a className="widget-list-link">About Us</a></Link> </li>
                            <li className="widget-list-item pb-1 list-unstyled"><Link href="/contact"><a className="widget-list-link">Contact Us</a></Link></li>
                            <li className="widget-list-item pb-1 list-unstyled"><Link href="/help"><a className="widget-list-link">Help Center</a></Link></li>
                            <li className="widget-list-item pb-1 list-unstyled"><Link href="/promoCode"><a className="widget-list-link">Promo Code</a></Link></li>
                            <li className="widget-list-item pb-1 list-unstyled"><Link href="/faq"><a className="widget-list-link">FAQS</a></Link></li>
                            <li className="widget-list-item pb-1 list-unstyled"><Link href="/blog"><a className="widget-list-link">Blog</a></Link></li>
                          </ul>
                        </div>
                      </li>

                    </ul>
                  </>
                ) : (
                  ""

                )}

              </div>
            </div>
          </div>
        </div>
      </header>
      <div style={{ minHeight: "80vh" }}>
        {props.children}
        <div className="cz-handheld-toolbar">
          <div className="d-table table-fixed w-100">
            <Link href="/account/wishlist">
              <a className="d-table-cell cz-handheld-toolbar-item">
                <span className="cz-handheld-toolbar-icon">
                  <i className="czi-heart"></i>
                </span>
                <span className="cz-handheld-toolbar-label">Wishlist</span>
              </a>
            </Link>
            <a
              className="d-table-cell cz-handheld-toolbar-item"
              href="#navbarCollapse"
              data-toggle="collapse"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
            >
              <span className="cz-handheld-toolbar-icon">
                <i className="czi-menu"></i>
              </span>
              <span className="cz-handheld-toolbar-label">Menu</span>
            </a>
            <Link href="/cart">
              <a className="d-table-cell cz-handheld-toolbar-item">
                <span className="cz-handheld-toolbar-icon">
                  <i className="czi-cart"></i>
                  <span className="badge badge-primary badge-pill ml-1">
                    {props.carts.carts.length}
                  </span>
                </span>
                <span className="cz-handheld-toolbar-label">
                  ₹{props.carts.total}
                </span>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <a
        className={`btn-scroll-top ${sticky ? "show" : ""}`}
        href="#top"
        data-scroll
      >
        <span className="btn-scroll-top-tooltip text-muted font-size-sm mr-2">
          Top
        </span>
        <i className="btn-scroll-top-icon czi-arrow-up"> </i>
      </a>

      {
        footer === false ? (
          <footer className="bg-dark pt-5">
            <div className="container pt-2 pb-3">
              <div className="row">
                <div className="col-md-6 text-center text-md-left mb-4">
                  <div className="text-nowrap mb-3">
                    <a
                      className="d-inline-block align-middle mt-n2 mr-2"
                      href="#"
                    >
                      <img
                        className="d-block"
                        style={{ width: "70px", height: "60px" }}
                        src="/img/logo.png"
                        alt="Cartzilla"
                      />
                    </a>
                    <span className="d-inline-block align-middle h5 font-weight-light text-white mb-0">
                      Marketplace
                    </span>
                  </div>
                  <p className="font-size-sm text-white opacity-70 pb-1">
                    High quality items created by our global community.
                  </p>
                  <h6 className="d-inline-block pr-3 mr-3 border-right border-light">
                    <span className="text-primary">{productsCount.totalProducts ? productsCount.totalProducts : 0} </span>
                    <span className="font-weight-normal text-white">
                      Products
                    </span>
                  </h6>
                  <h6 className="d-inline-block pr-3 mr-3 border-right border-light">
                    <span className="text-primary">{customerCount.data ? customerCount.data : 0}  </span>
                    <span className="font-weight-normal text-white">Members</span>
                  </h6>
                  <h6 className="d-inline-block mr-3">
                    <span className="text-primary">{vendorCount.data ? vendorCount.data : 0}  </span>
                    <span className="font-weight-normal text-white">Vendors</span>
                  </h6>
                  {/* <div className="widget mt-4 text-md-nowrap text-center text-md-left">
                    <a
                      className="social-btn sb-light sb-twitter mr-2 mb-2"
                      href="#"
                    >
                      <i className="czi-twitter"></i>
                    </a>
                    <a
                      className="social-btn sb-light sb-facebook mr-2 mb-2"
                      href="#"
                    >
                      <i className="czi-facebook"></i>
                    </a>
                    <a
                      className="social-btn sb-light sb-dribbble mr-2 mb-2"
                      href="#"
                    >
                      <i className="czi-dribbble"></i>
                    </a>
                    <a
                      className="social-btn sb-light sb-behance mr-2 mb-2"
                      href="#"
                    >
                      <i className="czi-behance"></i>
                    </a>
                    <a
                      className="social-btn sb-light sb-pinterest mr-2 mb-2"
                      href="#"
                    >
                      <i className="czi-pinterest"></i>
                    </a>
                  </div> */}
                </div>
                <div className="col-12 d-md-none text-center mb-4 pb-2">
                  <div className="btn-group dropdown d-block mx-auto mb-3">
                    <button
                      className="btn btn-outline-light border-light dropdown-toggle"
                      type="button"
                      data-toggle="dropdown"
                    >
                      Categories
                    </button>
                    <ul className="dropdown-menu">
                      <li>

                        <a className="dropdown-item" href="#">
                          Women
                        </a>

                      </li>
                      <li>

                        <a className="dropdown-item" href="#">
                          Shoes & Bags
                        </a>

                      </li>
                      <li>

                        <a className="dropdown-item" href="#">
                          Mens
                        </a>

                      </li>
                      <li>

                        <a className="dropdown-item" href="#">
                          Kids
                        </a>
                      </li>
                      <li>
                      
                          <a className="dropdown-item" href="#">
                            Beauty
                          </a>
                      
                      </li>

                    </ul>
                  </div>
                  <div className="btn-group dropdown d-block mx-auto ">
                    <button
                      className="btn btn-outline-light border-light dropdown-toggle "
                      type="button"
                      data-toggle="dropdown"

                    >
                      For members
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          Sales
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Products
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Add new Products
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Help center
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Support
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Terms & Conditions
                        </a>
                      </li>

                    </ul>
                  </div>
                </div>
                <div className="col-md-3 d-none d-md-block text-center text-md-left mb-4">
                  <div className="widget widget-links widget-light pb-2">
                    <h3 className="widget-title text-light">Products</h3>
                    <ul className="widget-list">
                    <li>
                        <Link href="/category/Women">
                          <a className="dropdown-item" href="#">
                            Women
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/ShoesAndBags">
                          <a className="dropdown-item" href="#">
                            Shoes & Bags
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/Men">
                          <a className="dropdown-item" href="#">
                            Mens
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/Kids">
                          <a className="dropdown-item" href="#">
                            Kids
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/Beauty">
                          <a className="dropdown-item" href="#">
                            Beauty
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-3 d-none d-md-block text-center text-md-left mb-4">
                  <div className="widget widget-links widget-light pb-2">
                    <h3 className="widget-title text-light">For Vendors</h3>
                    <ul className="widget-list">
                      <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Sales
                        </a>
                      </li>
                      <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Products
                        </a>
                      </li>
                      <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Orders List
                        </a>
                      </li>
                      <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Add new Products
                        </a>
                      </li>
                      <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Help center
                        </a>
                      </li>
                      <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Support
                        </a>
                      </li>
                      <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Terms & Conditions
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="pt-5 bg-darker">
           <div className="container">
             <hr className="hr-light pb-4 mb-3" />
             <div className="d-md-flex justify-content-between">
               <div className="pb-4 font-size-xs text-light opacity-50 text-center text-md-left">
                 © All rights reserved. Made by
                 <a
                   className="text-light"
                   href="https://createx.studio/"
                   target="_blank"
                   rel="noopener"
                 >
                   Vaistra Technologies
                 </a>
               </div>
               <div className="widget widget-links widget-light pb-4">
                 <div className="widget w-100 mb-4 pb-3 text-center mx-auto">
                   <h3 className="widget-title text-light pb-1">
                     Subscribe to newsletter
                   </h3>
                   <form
                     className="cz-subscribe-form validate"
                     action="https://studio.us12.list-manage.com/subscribe/post?u=c7103e2c981361a6639545bd5&amp;amp;id=29ca296126"
                     method="post"
                     name="mc-embedded-subscribe-form"
                     target="_blank"
                     noValidate
                   >
                     <div className="input-group input-group-overlay flex-nowrap">
                       <div className="input-group-prepend-overlay">
                         <span className="input-group-text text-muted font-size-base">
                           <i className="czi-mail"></i>
                         </span>
                       </div>
                       <input
                         className="form-control prepended-form-control"
                         type="email"
                         name="EMAIL"
                         placeholder="Your email"
                         required
                       />
                       <div className="input-group-append">
                         <button
                           className="btn btn-primary"
                           type="submit"
                           name="subscribe"
                         >
                           Subscribe*
                         </button>
                       </div>
                     </div>

                     <small className="form-text text-light opacity-50">
                       *Receive early discount offers, updates and new products
                       info.
                     </small>
                     <div className="subscribe-status"></div>
                   </form>
                 </div>
               </div>
             </div>
           </div>
         </div> */}
          </footer>
          // <footer className="bg-dark pt-3">
          //   <div className="container">
          //     <div className="row pb-2 pt-4">
          //       <div className="col-md-3 col-sm-6">
          //         <div className="widget widget-links widget-light pb-2 mb-4">
          //           <h3 className="widget-title text-light">Shop departments</h3>
          //           <ul className="widget-list">
          //           <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                  Clothing
          //               </a>
          //             </li>
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 Watch
          //               </a>
          //             </li>
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 Shoes
          //               </a>
          //             </li>
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 Toys
          //               </a>
          //             </li>

          //           </ul>
          //         </div>
          //       </div>
          //       <div className="col-md-3 col-sm-6">
          //       <div className="widget widget-links widget-light pb-2 mb-4">
          //           <h3 className="widget-title text-light">About us</h3>
          //           <ul className="widget-list">
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 About company
          //               </a>
          //             </li>
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 Our team
          //               </a>
          //             </li>
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 Careers
          //               </a>
          //             </li>
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 News
          //               </a>
          //             </li>
          //             <li className="widget-list-item">
          //               <Link href="/contact">
          //                 <a className="widget-list-link">Contact</a>
          //               </Link>
          //             </li>
          //           </ul>
          //         </div>
          //       </div>
          //       <div className="col-md-3 col-sm-6">
          //         <div className="widget widget-links widget-light pb-2 mb-4">
          //           <h3 className="widget-title text-light">
          //             Account &amp; shipping info
          //           </h3>
          //           <ul className="widget-list">
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 Your account
          //               </a>
          //             </li>
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 Shipping rates &amp; policies
          //               </a>
          //             </li>
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 Refunds &amp; replacements
          //               </a>
          //             </li>
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 Order tracking
          //               </a>
          //             </li>
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 Delivery info
          //               </a>
          //             </li>
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 Taxes &amp; fees
          //               </a>
          //             </li>
          //           </ul>
          //         </div>
          //         {/* <div className="widget widget-links widget-light pb-2 mb-4">
          //           <h3 className="widget-title text-light">About us</h3>
          //           <ul className="widget-list">
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 About company
          //               </a>
          //             </li>
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 Our team
          //               </a>
          //             </li>
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 Careers
          //               </a>
          //             </li>
          //             <li className="widget-list-item">
          //               <a className="widget-list-link" href="#">
          //                 News
          //               </a>
          //             </li>
          //             <li className="widget-list-item">
          //               <Link href="/contact">
          //                 <a className="widget-list-link">Contact</a>
          //               </Link>
          //             </li>
          //           </ul>
          //         </div> */}
          //       </div>
          //       <div className="col-md-3">
          //         <div className="widget pb-2 mb-4">
          //           <h3 className="widget-title text-light pb-1">
          //             Stay informed
          //           </h3>
          //           <form
          //             className="cz-subscribe-form validate"
          //             action="https://studio.us12.list-manage.com/subscribe/post?u=c7103e2c981361a6639545bd5&amp;amp;id=29ca296126"
          //             method="post"
          //             name="mc-embedded-subscribe-form"
          //             target="_blank"
          //             noValidate
          //           >
          //             <div className="input-group input-group-overlay flex-nowrap">
          //               <div className="input-group-prepend-overlay">
          //                 <span className="input-group-text text-muted font-size-base">
          //                   <i className="czi-mail"></i>
          //                 </span>
          //               </div>
          //               <input
          //                 className="form-control prepended-form-control"
          //                 type="email"
          //                 name="EMAIL"
          //                 placeholder="Your email"
          //                 required
          //               />
          //               <div className="input-group-append">
          //                 <button
          //                   className="btn btn-primary"
          //                   type="submit"
          //                   name="subscribe"
          //                 >
          //                   &#8594;
          //                 </button>
          //               </div>
          //             </div>
          //             {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */}

          //             <div
          //               style={{
          //                 position: `absolute`,
          //                 left: `-5000px`,
          //               }}
          //               aria-hidden="true"
          //             >
          //               <input
          //                 className="cz-subscribe-form-antispam"
          //                 type="text"
          //                 name="b_c7103e2c981361a6639545bd5_29ca296126"
          //                 tabIndex="-1"
          //               />
          //             </div>
          //             <small className="form-text text-light opacity-50">
          //               *Subscribe to our newsletter to receive early discount
          //               offers, updates and new products info.
          //             </small>
          //             <div className="subscribe-status"></div>
          //           </form>
          //         </div>
          //       </div>
          //     </div>
          //   </div>
          //   <div className="pt-5 bg-darker">
          //     <div className="container">
          //       <div className="row pb-3">
          //         <div className="col-md-3 col-sm-6 mb-4">
          //           <div className="media">
          //             <i
          //               className="czi-rocket text-primary"
          //               style={{ fontSize: `2.25rem` }}
          //             ></i>
          //             <div className="media-body pl-3">
          //               <h6 className="font-size-base text-light mb-1">
          //                 Fast and free delivery
          //               </h6>
          //               <p className="mb-0 font-size-ms text-light opacity-50">
          //                 Free delivery for all orders over $200
          //               </p>
          //             </div>
          //           </div>
          //         </div>
          //         <div className="col-md-3 col-sm-6 mb-4">
          //           <div className="media">
          //             <i
          //               className="czi-currency-exchange text-primary"
          //               style={{ fontSize: `2.25rem` }}
          //             ></i>
          //             <div className="media-body pl-3">
          //               <h6 className="font-size-base text-light mb-1">
          //                 Money back guarantee
          //               </h6>
          //               <p className="mb-0 font-size-ms text-light opacity-50">
          //                 We return money within 30 days
          //               </p>
          //             </div>
          //           </div>
          //         </div>
          //         <div className="col-md-3 col-sm-6 mb-4">
          //           <div className="media">
          //             <i
          //               className="czi-support text-primary"
          //               style={{ fontSize: `2.25rem` }}
          //             ></i>
          //             <div className="media-body pl-3">
          //               <h6 className="font-size-base text-light mb-1">
          //                 24/7 customer support
          //               </h6>
          //               <p className="mb-0 font-size-ms text-light opacity-50">
          //                 Friendly 24/7 customer support
          //               </p>
          //             </div>
          //           </div>
          //         </div>
          //         <div className="col-md-3 col-sm-6 mb-4">
          //           <div className="media">
          //             <i
          //               className="czi-card text-primary"
          //               style={{ fontSize: `2.25rem` }}
          //             ></i>
          //             <div className="media-body pl-3">
          //               <h6 className="font-size-base text-light mb-1">
          //                 Secure online payment
          //               </h6>
          //               <p className="mb-0 font-size-ms text-light opacity-50">
          //                 We possess SSL / Secure сertificate
          //               </p>
          //             </div>
          //           </div>
          //         </div>
          //       </div>
          //       <hr className="hr-light pb-4 mb-3" />
          //       <div className="row pb-2">
          //         <div className="col-md-6 text-center text-md-left mb-4">

          //           <div className="widget widget-links widget-light">
          //             <ul className="widget-list d-flex flex-wrap justify-content-center justify-content-md-start">
          //               <li className="widget-list-item mr-4">
          //                 <a className="widget-list-link" href="#">
          //                   Outlets
          //                 </a>
          //               </li>
          //               <li className="widget-list-item mr-4">
          //                 <a className="widget-list-link" href="#">
          //                   Affiliates
          //                 </a>
          //               </li>
          //               <li className="widget-list-item mr-4">
          //                 <a className="widget-list-link" href="#">
          //                   Support
          //                 </a>
          //               </li>
          //               <li className="widget-list-item mr-4">
          //                 <a className="widget-list-link" href="#">
          //                   Privacy
          //                 </a>
          //               </li>
          //               <li className="widget-list-item mr-4">
          //                 <a className="widget-list-link" href="#">
          //                   Terms of use
          //                 </a>
          //               </li>
          //             </ul>
          //           </div>
          //         </div>
          //         <div className="col-md-6 text-center text-md-right mb-4">
          //           <div className="mb-3">
          //             <a
          //               className="social-btn sb-light sb-twitter ml-2 mb-2"
          //               href="#"
          //             >
          //               <i className="czi-twitter"></i>
          //             </a>
          //             <a
          //               className="social-btn sb-light sb-facebook ml-2 mb-2"
          //               href="#"
          //             >
          //               <i className="czi-facebook"></i>
          //             </a>
          //             <a
          //               className="social-btn sb-light sb-instagram ml-2 mb-2"
          //               href="#"
          //             >
          //               <i className="czi-instagram"></i>
          //             </a>
          //             <a
          //               className="social-btn sb-light sb-pinterest ml-2 mb-2"
          //               href="#"
          //             >
          //               <i className="czi-pinterest"></i>
          //             </a>
          //             <a
          //               className="social-btn sb-light sb-youtube ml-2 mb-2"
          //               href="#"
          //             >
          //               <i className="czi-youtube"></i>
          //             </a>
          //           </div>
          //           <img
          //             className="d-inline-block"
          //             width="187"
          //             src="/img/cards-alt.png"
          //             alt="Payment methods"
          //           />
          //         </div>
          //       </div>
          //       <div className="pb-4 font-size-xs text-light opacity-50 text-center text-md-left">
          //         © All rights reserved. Made by{" "}
          //         <a
          //           className="text-light"
          //           href="http://vaistratechnologies.com/"
          //           target="_blank"
          //           rel="noopener"
          //         >
          //           Vaistra Technologies
          //         </a>
          //       </div>
          //     </div>
          //   </div>
          // </footer>
        ) : (
          <footer className="bg-dark pt-5">
            <div className="container pt-2 pb-3">
              <div className="row">
                <div className="col-md-5 text-center text-md-left mb-4">
                  <div className="text-nowrap mb-3">
                    <a
                      className="d-inline-block align-middle mt-n2 mr-2"
                      href="#"
                    >
                      <img
                        className="d-block"
                        style={{ width: "70px", height: "60px" }}
                        src="/img/logo.png"
                        alt="Cartzilla"
                      />
                    </a>
                    <span className="d-inline-block align-middle h5 font-weight-light text-white mb-0">
                      Marketplace
                    </span>
                  </div>
                  <p className="font-size-sm text-white opacity-70 pb-1">
                    High quality items created by our global community.
                  </p>
                  <h6 className="d-inline-block pr-3 mr-3 border-right border-light">
                    <span className="text-primary">{productsCount.totalProducts ? productsCount.totalProducts : 0} </span>
                    <span className="font-weight-normal text-white">
                      Products
                    </span>
                  </h6>
                  <h6 className="d-inline-block pr-3 mr-3 border-right border-light">
                    <span className="text-primary">{customerCount.data ? customerCount.data : 0} </span>
                    <span className="font-weight-normal text-white">Members</span>
                  </h6>
                  <h6 className="d-inline-block mr-3">
                    <span className="text-primary">{vendorCount.data ? vendorCount.data : 0} </span>
                    <span className="font-weight-normal text-white">Vendors</span>
                  </h6>
                  {/* <div className="widget mt-4 text-md-nowrap text-center text-md-left">
                    <a
                      className="social-btn sb-light sb-twitter mr-2 mb-2"
                      href="#"
                    >
                      <i className="czi-twitter"></i>
                    </a>
                    <a
                      className="social-btn sb-light sb-facebook mr-2 mb-2"
                      href="#"
                    >
                      <i className="czi-facebook"></i>
                    </a>
                    <a
                      className="social-btn sb-light sb-dribbble mr-2 mb-2"
                      href="#"
                    >
                      <i className="czi-dribbble"></i>
                    </a>
                    <a
                      className="social-btn sb-light sb-behance mr-2 mb-2"
                      href="#"
                    >
                      <i className="czi-behance"></i>
                    </a>
                    <a
                      className="social-btn sb-light sb-pinterest mr-2 mb-2"
                      href="#"
                    >
                      <i className="czi-pinterest"></i>
                    </a>
                  </div> */}
                </div>
                <div className="col-12 d-md-none text-center mb-4 pb-2">
                  <div className="btn-group dropdown d-block mx-auto mb-3">
                    <button
                      className="btn btn-outline-light border-light dropdown-toggle  "
                      type="button"
                      data-toggle="dropdown"
                    >
                      Categories
                    </button>
                    <ul className="dropdown-menu">
                    <li>
                        <Link href="/category/Women">
                          <a className="dropdown-item" href="/category/Women">
                            Women
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/ShoesAndBags">
                          <a className="dropdown-item" href="/category/ShoesAndBags">
                            Shoes & Bags
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/Men">
                          <a className="dropdown-item" href="/category/Men">
                            Mens
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/Kids">
                          <a className="dropdown-item" href="/category/Kids">
                            Kids
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/Beauty">
                          <a className="dropdown-item" href="/category/Beauty">
                            Beauty
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="btn-group dropdown d-block mx-auto">
                    <button
                      className="btn btn-outline-light border-light dropdown-toggle mb-5 mb-lg-0"
                      type="button"
                      data-toggle="dropdown"
                    >
                      For members
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                        Payment methods
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                        Become a vendor
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                        Help center
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                        Support
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                        Terms & Conditions
                        </a>
                      </li>
                      
                    </ul>
                  </div>
                </div>
                <div className="col-md-3 d-none d-md-block text-center text-md-left mb-4">
                  <div className="widget widget-links widget-light pb-2">
                    <h3 className="widget-title text-light">Categories</h3>
                    <ul className="widget-list">
                      <li className="widget-list-item">
                        <Link href="/category/Women">
                          <a className="widget-list-link" href="/category/Women">
                            Womens
                          </a>
                        </Link>
                      </li>
                      <li className="widget-list-item">
                        <Link href="/category/ShoesAndBags">
                          <a className="widget-list-link" href="/category/ShoesAndBags">
                            Shoes & Bags
                          </a>
                        </Link>
                      </li>
                      <li className="widget-list-item">
                        <Link href="/category/Men">
                          <a className="widget-list-link" href="/category/Men">
                            Mens
                          </a>
                        </Link>
                      </li>
                      <li className="widget-list-item">
                        <Link href="/category/Kids">
                          <a className="widget-list-link" href="/category/Kids">
                            Kids
                          </a>
                        </Link>
                      </li>
                      <li className="widget-list-item">
                        <Link href="/category/Beauty">
                          <a className="widget-list-link" href="/category/Beauty">
                            Beauty
                          </a>
                        </Link>
                      </li>
                      {/* <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Fonts
                        </a>
                      </li>
                      <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Grocery
                        </a>
                      </li>
                      <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Moblie
                        </a>
                      </li>
                      <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Electronic
                        </a>
                      </li>
                      <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Shoes
                        </a>
                      </li> */}
                    </ul>
                  </div>
                </div>
                <div className="col-md-3 d-none d-md-block text-center text-md-left mb-4">
                  <div className="widget widget-links widget-light pb-2">
                    <h3 className="widget-title text-light">For members</h3>
                    <ul className="widget-list">
                      {/* <li className="widget-list-item">
                      <a className="widget-list-link" href="#">
                        Licenses
                      </a>
                    </li>
                    <li className="widget-list-item">
                      <a className="widget-list-link" href="#">
                        Return policy
                      </a>
                    </li> */}
                      <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Payment methods
                        </a>
                      </li>
                      <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Become a vendor
                        </a>
                      </li>
                      {/* <li className="widget-list-item">
                      <a className="widget-list-link" href="#">
                        Become an affiliate
                      </a>
                    </li> */}
                      <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Help center
                        </a>
                      </li>
                      {/* <li className="widget-list-item">
                      <a className="widget-list-link" href="#">
                        Affiliate
                      </a>
                    </li> */}
                      <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Support
                        </a>
                      </li>
                      {/* <li className="widget-list-item">
                      <a className="widget-list-link" href="#">
                        Marketplace benefits
                      </a>
                    </li> */}
                      <li className="widget-list-item">
                        <a className="widget-list-link" href="#">
                          Terms & Conditions
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="pt-5 bg-darker">
            <div className="container">
              <hr className="hr-light pb-4 mb-3" /> 
              <div className="d-md-flex justify-content-between">
                <div className="pb-4 font-size-xs text-light opacity-50 text-center text-md-left">
                  © All rights reserved. Made by
                  <a
                    className="text-light"
                    href="https://createx.studio/"
                    target="_blank"
                    rel="noopener"
                  >
                    Vaistra Technologies
                  </a>
                </div>
                <div className="widget widget-links widget-light pb-4">
                  <div className="widget w-100 mb-4 pb-3 text-center mx-auto">
                    <h3 className="widget-title text-light pb-1">
                      Subscribe to newsletter
                    </h3>
                    <form
                      className="cz-subscribe-form validate"
                      action="https://studio.us12.list-manage.com/subscribe/post?u=c7103e2c981361a6639545bd5&amp;amp;id=29ca296126"
                      method="post"
                      name="mc-embedded-subscribe-form"
                      target="_blank"
                      noValidate
                    >
                      <div className="input-group input-group-overlay flex-nowrap">
                        <div className="input-group-prepend-overlay">
                          <span className="input-group-text text-muted font-size-base">
                            <i className="czi-mail"></i>
                          </span>
                        </div>
                        <input
                          className="form-control prepended-form-control"
                          type="email"
                          name="EMAIL"
                          placeholder="Your email"
                          required
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-primary"
                            type="submit"
                            name="subscribe"
                          >
                            Subscribe*
                          </button>
                        </div>
                      </div>

                      <small className="form-text text-light opacity-50">
                        *Receive early discount offers, updates and new products
                        info.
                      </small>
                      <div className="subscribe-status"></div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          </footer>
        )
      }
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    carts: state.carts,
    wishlists: state.wishlists,
    user: state.user,
    searchProducts: state.searchProducts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCarts: (token) => dispatch(fetchCart(token)),
    deleteCart: (id) => dispatch(deleteCart(id)),
    fetchWishlist: (token) => dispatch(fetchWishlist(token)),
    addUserDetail: (user) => dispatch(add_user_detail(user)),
    removeUserDetail: () => dispatch(remove_user_detail()),
    fetchAddress: (token) => dispatch(fetchAddress(token)),
    fetchShippingMethod: (token) => dispatch(fetchShippingMethod(token)),
    searchProduct: (products) => dispatch(search_Product(products)),
    fetchAdvertisements: (advertisements) =>
      dispatch(fetch_advertisement(advertisements)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
