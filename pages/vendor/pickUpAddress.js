import React, { useRef, useState } from "react";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getSession } from "next-auth/client";
import { toast, Flip } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Head from "next/head";

toast.configure();
export default function pickUpAddress() {
    const btnRef = useRef();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        address: {
            address: "",
            town: "",
        },
        state: "",
        city: "",
        pinCode: ""
    });
    const resetData = () => {
        setData({
            address: "",
            town: "",
            state: "",
            city: "",
            pinCode: "",
        });
    };

    const spaceValidation = new RegExp(
        "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
    );

    const [addressDetail, setAddressDetail] = useState({});
    const inputAddressDetailChange = (e) => {
        const { name, value } = e.target;
        const list = addressDetail;
        list[name] = value;
        // setAddressDetail(list);
        setData((prev) => ({
            ...prev,
            ["address"]: list,
        }));
    };

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const pickUpAddressSchema = Yup.object().shape({
        address: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            ).required("Address is required"),
        town: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            ).required("Town is required"),
        state: Yup.string()
            .required("State is required")
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            ),
        city: Yup.string()
            .required("City is required")
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            ),
        pinCode: Yup.string()
            .required("Pin Code is required")
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            ).max(6, "Please Enter only 6 character"),
    });

    const addPickUpAddressDetail = async (e, { resetForm }) => {
        setLoading(true);
        btnRef.current.disabled = true;
        const session = await getSession();
        await axios
            .post(`${process.env.HOST}/pickup-address`, data, {
                headers: {
                    Authorization: session.accessToken,
                },
            })
            .then((res) => {
                setLoading(false);
                // console.log("pick up Address details::", res.data);
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
                <title>Vaistra Ecommerce | Pick Up Address</title>
            </Head>
            <section className="col-lg-8">
                <div className="row">
                    <div className="col-md-12 p-3">
                        <div>
                            <h4 className="border-bottom pb-3">
                                Pick Up Address
                            </h4>
                            <div className="alert alert-warning" role="alert">
                                Product will picked up from this address.
                            </div>
                            <Formik
                                initialValues={{
                                    address: data.address.address,
                                    town: data.address.town,
                                    state: data.state,
                                    city: data.city,
                                    pinCode: data.pinCode,
                                }}
                                validationSchema={pickUpAddressSchema}
                                onSubmit={addPickUpAddressDetail}
                            >
                                {({ touched, errors, isValid, values, handleChange }) => (
                                    <Form className="needs-validation" autoComplete="off">

                                        <div className="row">
                                            <div className="col-md-10 mb-4">
                                                <label>Address</label>
                                                <span className="text-danger">*</span>
                                                <Field type="text" placeholder="Enter Address"
                                                    className={`form-control name ${touched.address?.address && errors.address?.address ?
                                                        "is-invalid" : ""
                                                        }`}
                                                    name="address"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        inputAddressDetailChange(e);
                                                    }}
                                                />
                                                <ErrorMessage component="div" name="address" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-5 mb-4">
                                                <label>Town</label>
                                                <span className="text-danger">*</span>
                                                <Field type="text" placeholder="Enter Town Name"
                                                    className={`form-control name ${touched.address?.town && errors.address?.town ?
                                                        "is-invalid" : ""
                                                        }`}
                                                    name="town"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        inputAddressDetailChange(e);
                                                    }}
                                                />
                                                <ErrorMessage component="div" name="town" className="invalid-feedback" />
                                            </div>
                                            <div className="col-md-5 mb-4">
                                                <label>State</label>
                                                <span className="text-danger">*</span>
                                                <Field type="text" placeholder="Enter State Name"
                                                    className={`form-control name ${touched.state && errors.state ?
                                                        "is-invalid" : ""
                                                        }`}
                                                    name="state"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        inputChange(e);
                                                    }}
                                                />
                                                <ErrorMessage component="div" name="state" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-5 mb-4">
                                                <label>City</label>
                                                <span className="text-danger">*</span>
                                                <Field type="text" placeholder="Enter City"
                                                    className={`form-control name ${touched.city && errors.city ?
                                                        "is-invalid" : ""
                                                        }`}
                                                    name="city"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        inputChange(e);
                                                    }}
                                                />
                                                <ErrorMessage component="div" name="city" className="invalid-feedback" />
                                            </div>
                                            <div className="col-md-5 mb-4">
                                                <label>Pin Code</label>
                                                <span className="text-danger">*</span>
                                                <Field type="number" placeholder="Enter Pin Code"
                                                    className={`form-control name ${touched.pinCode && errors.pinCode ?
                                                        "is-invalid" : ""
                                                        }`}
                                                    name="pinCode"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        inputChange(e);
                                                    }}
                                                />
                                                <ErrorMessage component="div" name="pinCode" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                ref={btnRef}
                                                disabled={
                                                    !Object.values(values).some(
                                                        (x) => x !== null && x !== ""
                                                    ) || !isValid
                                                }>
                                                Add Address
                                                {loading &&
                                                    <span className="spinner-border spinner-border-sm ml-1" role="status" aria-hidden="true"></span>
                                                }
                                            </button>
                                        </div>

                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
