import React, { useState } from "react";
import { Field } from "formik";
import Spinner from "../Spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const StepFour = ({
    values,
    isValid,
    setData,
    data,
    loading,
    btnRef,
    btnName,
}) => {
    console.log("Step Four : ", data);
    const [additionalDetail, setAdditionalDetail] = useState(
        data.additionalDetail
    );

    const verifydata = (e) => {
        if (e.target.name === "manufacturerDetails") {
            e.target.value.length > 100 ? (toast.error("😢 " + "Please enter less than 100 chraracter", { position: toast.POSITION.TOP_RIGHT, autoClose: 1000, }), e.target.value = "") : e.target.value
        } else if (e.target.name === "localDeliveryCharge") {
            e.target.value.length > 4 ? (toast.error("😢 " + "Please enter less than 4 chraracter", { position: toast.POSITION.TOP_RIGHT, autoClose: 1000, }), e.target.value = "") : e.target.value
        } else if (e.target.name === "zonalDeliveryCharge") {
            e.target.value.length > 4 ? (toast.error("😢 " + "Please enter less than 4 chraracter", { position: toast.POSITION.TOP_RIGHT, autoClose: 1000, }), e.target.value = "") : e.target.value
        }
        else if (e.target.name === "packerDetails") {
            e.target.value.length > 100 ? (toast.error("😢 " + "Please enter less than 100 chraracter", { position: toast.POSITION.TOP_RIGHT, autoClose: 1000, }), e.target.value = "") : e.target.value
        }
        else if (e.target.name === "countryOfOrigin") {
            e.target.value.length > 100 ? (toast.error("😢 " + "Please enter less than 100 chraracter", { position: toast.POSITION.TOP_RIGHT, autoClose: 1000, }), e.target.value = "") : e.target.value
        }
    }

    const handleAdditionalDetailChange = (e) => {
        const { name, value } = e.target;
        const list = additionalDetail;
        list[name] = value;
        setAdditionalDetail(list);
        setData((prev) => ({
            ...prev,
            ["additionalDetail"]: list,
        }));
    };

    return (
        <>
            {/* Additional Details */}
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Local Delivery Charge</label>
                        <Field
                            className="form-control"
                            name="localDeliveryCharge"
                            placeholder="0"
                            type="text"
                            value={data.additionalDetail.localDeliveryCharge}
                            onChange={(e) => {
                                handleAdditionalDetailChange(e);
                            }}
                            onKeyDown={(e) =>
                                (e.keyCode === 69 || e.keyCode === 190) &&
                                e.preventDefault()
                            }
                            onInput={(e) => {
                                e.target.value.includes("-") ? (toast.error("😢 " + "Please enter positive value", { position: toast.POSITION.TOP_RIGHT, autoClose: 1000, }), e.target.value = "") : e.target.value; verifydata(e)
                            }}
                        />

                    </div>
                </div>
                {/* zonal Delivery Charge*/}
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Zonal Delivery Charge</label>
                        <Field
                            className="form-control"
                            name="zonalDeliveryCharge"
                            placeholder="0"
                            type="text"
                            value={data.additionalDetail.zonalDeliveryCharge}
                            onChange={(e) => {
                                handleAdditionalDetailChange(e);
                            }}
                            onKeyDown={(e) =>
                                (e.keyCode === 69 || e.keyCode === 190) &&
                                e.preventDefault()
                            }
                            onInput={(e) => {
                                e.target.value.includes("-") ? (toast.error("😢 " + "Please enter positive value", { position: toast.POSITION.TOP_RIGHT, autoClose: 1000, }), e.target.value = "") : e.target.value; verifydata(e)
                            }}


                        />

                    </div>
                </div>

                {/* country of Origin */}
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Country of Origin</label>
                        <Field
                            as="input"
                            className="form-control"
                            name="countryOfOrigin"
                            placeholder="Country Name"
                            type="text"
                            value={data.additionalDetail.countryOfOrigin}
                            onChange={(e) => {
                                handleAdditionalDetailChange(e);

                            }}
                            onInput={(e) => {
                                verifydata(e)
                            }}
                        />

                    </div>
                </div>
                {/* Packer Details */}
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Packer Details</label>
                        <Field
                            className="form-control"
                            name="packerDetails"
                            placeholder="Packer Details"
                            type="text"
                            value={data.additionalDetail.packerDetails}
                            onChange={(e) => {
                                handleAdditionalDetailChange(e);

                            }}
                            onInput={(e) => {
                                verifydata(e)
                            }}
                        />

                    </div>
                </div>
                {/*  Manufacturer Details */}
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Manufacturer Details</label>
                        <Field
                            className="form-control"
                            name="manufacturerDetails"
                            placeholder="Manufacturer Details"
                            type="text"
                            value={data.additionalDetail.manufacturerDetails}
                            onChange={(e) => {
                                handleAdditionalDetailChange(e);

                            }}
                            onInput={(e) => {
                                verifydata(e)
                            }}
                        />

                    </div>
                </div>
            </div>
            <button
                className="next btn btn-primary float-right" style={{ marginTop: "28px" }}
                type="submit"
                // name="submit"
                ref={btnRef}
                disabled={
                    !Object.values(values).some(
                        (x) => x !== null && x !== ""
                    ) ||
                    !isValid ||
                    data.cId === "" ||
                    data.brand === "" ||
                    data.description === "<p><br></p>" ||
                    data.description === "" ||
                    data.photos?.length === 0
                    // data.color.length === 0
                }
            >
                {btnName}
                {loading && <Spinner />}
            </button>
        </>
    );
};

export default StepFour;
