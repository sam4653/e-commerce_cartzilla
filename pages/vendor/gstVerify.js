import React, { useRef, useState } from "react";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getSession } from "next-auth/client";
import { toast, Flip } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Head from "next/head";

toast.configure();

export default function gstVerify() {
    const btnRef = useRef();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        GSTIN: "",
    });
    const resetData = () => {
        setData({
            GSTIN: ""
        });
    };

    const spaceValidation = new RegExp(
        "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
    );

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const gstSchema = Yup.object().shape({
        GSTIN: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            ).required("GST Number is required")
            .min(15, "Please enter only 15 character")
            .max(15, "Please enter only 15 character"),
    });

    const gstVerify = async (e, { resetForm }) => {
        // console.log(data.GSTIN)
        setLoading(true);
        btnRef.current.disabled = true;
        const session = await getSession();
        await axios
            .get(`${process.env.HOST}/store/verify-gstin?GSTIN=${data.GSTIN}`, {
                headers: {
                    Authorization: session.accessToken,
                    "Content-Type": "application/json",
                },
            }
            )
            .then((res) => {
                setLoading(false);
                // console.log("GST Details::", res.data);
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
                // resetForm();
                resetData();
            });
    };

    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | GST Details</title>
            </Head>
            <section className="col-lg-8">
                <div className="row">
                    <div className="col-md-12 p-3">
                        <div>
                            <h4 className="border-bottom pb-3">
                                GST Verification
                            </h4>
                            <div className="alert alert-warning col-md-10" role="alert">
                                GSTIN is GST identification number or GST number. A GSTIN is a 15-digit PAN-based unique identification number allotted to every registered person under GST.
                            </div>
                            <Formik
                                initialValues={{
                                    GSTIN: data.GSTIN,
                                }}
                                validationSchema={gstSchema}
                                onSubmit={gstVerify}
                            >
                                {({ touched, errors, isValid, values, handleChange }) => (
                                    <Form className="needs-validation" autoComplete="off">
                                        <div>
                                            <div className="col-md-10 mb-4">
                                                <label>GST Number</label>
                                                <span className="text-danger">*</span>
                                                <Field type="text" placeholder="Enter GST Number"
                                                    className={`form-control name ${touched.GSTIN && errors.GSTIN ?
                                                        "is-invalid" : ""
                                                        }`}
                                                    name="GSTIN"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        inputChange(e);
                                                    }}
                                                />
                                                <ErrorMessage component="div" name="GSTIN" className="invalid-feedback" />
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
                                                    GST Verify
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
