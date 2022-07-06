import React, { useRef, useState } from "react";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getSession } from "next-auth/client";
import { toast, Flip } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Head from "next/head";

toast.configure();

export default function bankDetails() {
    const btnRef = useRef();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        bankName: "",
        holderName: "",
        accountNumber: "",
        IFSC: ""
    });
    const resetData = () => {
        setData({
            bankName: "",
            holderName: "",
            accountNumber: "",
            IFSC: ""
        });
    };

    const spaceValidation = new RegExp(
        "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
    );

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const bankSchema = Yup.object().shape({
        bankName: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            ).required("Bank Name is required")
            .min(3, "Please enter more than 2 character")
            .max(20, "Please enter less than 20 character"),
        holderName: Yup.string()
        .matches(
            spaceValidation,
            "Spaces at the beginning and at the are not allowed"
        ).required("Holder Name is required"),
        accountNumber: Yup.string()
            .required("Account Number is required")
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            ).min(11, "Please enter more than 11 character")
            .max(15, "Please enter less than 15 character"),
        IFSC: Yup.string()
            .required("IFSC Code is required")
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            ).min(11, "Please Enter only 11 character")
            .max(11, "Please Enter only 11 character"),
    });

    const addBankDetail = async (e, { resetForm }) => {
        setLoading(true);
        btnRef.current.disabled = true;
        const session = await getSession();
        await axios
            .post(`${process.env.HOST}/bank-detail`, data, {
                headers: {
                    Authorization: session.accessToken,
                },
            })
            .then((res) => {
                setLoading(false);
                // console.log("Bank Details data::", res.data);
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
                <title>Vaistra Ecommerce | Bank Details</title>
            </Head>
            <section className="col-lg-8">
                <div className="row">
                    <div className="col-md-12 p-3">
                        <div>
                            <h4 className="border-bottom pb-3">
                                Bank Details
                            </h4>
                            <div className="alert alert-warning col-md-10" role="alert">
                            Please provide a bank account with same name as the business/trade name of GSTIN : 24AAHCV2212M1ZD
                            </div>
                            <Formik
                                initialValues={{
                                    bankName: data.bankName,
                                    holderName: data.holderName,
                                    accountNumber: data.accountNumber,
                                    IFSC: data.IFSC,
                                }}
                                validationSchema={bankSchema}
                                onSubmit={addBankDetail}
                            >
                                {({ touched, errors, isValid, values, handleChange }) => (
                                    <Form className="needs-validation" autoComplete="off">
                                        <div>
                                            <div className="col-md-10 mb-4">
                                                <label>Bank Name</label>
                                                <span className="text-danger">*</span>
                                                <Field type="text" placeholder="Enter Bank Name"
                                                    className={`form-control name ${touched.bankName && errors.bankName ?
                                                        "is-invalid" : ""
                                                        }`}
                                                    name="bankName"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        inputChange(e);
                                                    }}
                                                />
                                                <ErrorMessage component="div" name="bankName" className="invalid-feedback" />
                                            </div>
                                            <div className="col-md-10 mb-4">
                                                <label>Holder Name</label>
                                                <span className="text-danger">*</span>
                                                <Field type="text" placeholder="Enter Acoount Holder Name"
                                                    className={`form-control name ${touched.holderName && errors.holderName ?
                                                        "is-invalid" : ""
                                                        }`}
                                                    name="holderName"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        inputChange(e);
                                                    }}
                                                />
                                                <ErrorMessage component="div" name="holderName" className="invalid-feedback" />
                                            </div>
                                            <div className="col-md-10 mb-4">
                                                <label>Account Number</label>
                                                <span className="text-danger">*</span>
                                                <Field type="number" placeholder="Account Number"
                                                    className={`form-control name ${touched.accountNumber && errors.accountNumber ?
                                                        "is-invalid" : ""
                                                        }`}
                                                    name="accountNumber"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        inputChange(e);
                                                    }}
                                                />
                                                <ErrorMessage component="div" name="accountNumber" className="invalid-feedback" />
                                            </div>
                                            <div className="col-md-10 mb-4">
                                                <label>IFSC Code</label>
                                                <span className="text-danger">*</span>
                                                <Field type="text" placeholder="IFSC Code"
                                                    className={`form-control name ${touched.IFSC && errors.IFSC ?
                                                        "is-invalid" : ""
                                                        }`}
                                                    name="IFSC"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        inputChange(e);
                                                    }}
                                                />
                                                <ErrorMessage component="div" name="IFSC" className="invalid-feedback" />
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
                                                    Add Bank Details
                                                    {loading &&
                                                        <span className="spinner-border spinner-border-sm ml-1" role="status" aria-hidden="true"></span>
                                                    }
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
    )
}
