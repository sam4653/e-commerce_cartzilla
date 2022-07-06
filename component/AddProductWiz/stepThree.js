import React, { useEffect, useRef, useState } from "react";
import { Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StepThree = ({ touched, errors, setData, data, setAllowNextStep }) => {
    // console.log("Step Three : ", data);

    const [variants, setVariants] = useState(
        data.productDetail?.length >= 1
            ? data.productDetail
            : [{ productKey: "", productValue: "" }]
    );

    const [addDisabled, setAddDisabled] = useState(
        false
        // Object.values(variants).some(
        //     (v) => v.productKey === "" || v.productValue === ""
        // )
    );

    setAllowNextStep(
        Object.values(variants).some(
            (v) => v.productKey === "" || v.productValue === ""
        )
    );
    // );

    useEffect(() => {
        if (data.productDetail?.length > 1) {
            const filtered = data.productDetail.filter(
                (v) => v.productKey !== "" || v.productValue !== ""
            );
            setVariants(filtered);
            setData((prev) => ({ ...prev, ["productDetail"]: filtered }));
        }
    }, []);
    const handleBlur = () => {
        setAddDisabled(
            Object.values(variants).some(
                (v) => v.productKey === "" || v.productValue === ""
            )
        );
    };

    const handleVariantChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...variants];
        list[index][name] = value;
        setVariants(list);
        setData((prev) => ({ ...prev, ["productDetail"]: variants }));
    };

    const onRemoveVariant = (index) => {
        const list = [...variants];
        list.splice(index, 1);
        setVariants(list);
        setData((prev) => ({ ...prev, ["productDetail"]: list }));
    };
    const onAddVariant = () => {
        setVariants([...variants, { productKey: "", productValue: "" }]);
        setAddDisabled(true);
    };

    return (
        <>
            {/* <div className="col-md-12">
                <h4 className="h3 py-2 my-3">Add Product Variants</h4>
            </div> */}
            {/* <Variant {...props} /> */}
            {variants?.map((variant, index) => {
                return (
                    <div className="row" key={index}>
                        {/* product Key */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label>Key</label>
                                <span className="text-danger">*</span>
                                <Field
                                    className={`form-control ${
                                        touched.productKey && errors.productKey
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    name="productKey"
                                    placeholder="Product Key"
                                    type="text"
                                    value={variant.productKey}
                                    onChange={(e) =>
                                        handleVariantChange(e, index)
                                    }
                                    onBlur={handleBlur}
                                    onInput={(e)=>{
                                                    // e.target.value.includes("-") ?  ( toast.error("😢 " + "please enter positive value", {position: toast.POSITION.TOP_RIGHT,autoClose: 1000,}), e.target.value = ""): e.target.value
                                                    e.target.value.length >100 ?  ( toast.error("😢 " + "please enter less than 100 character", {position: toast.POSITION.TOP_RIGHT,autoClose: 1000,}), e.target.value = ""): e.target.value
                                    }}
                                />
                            </div>
                        </div>
                        {/* Product Value */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label>Product Value</label>
                                <span className="text-danger">*</span>
                                <Field
                                    className={`form-control ${
                                        touched.productValue &&
                                        errors.productValue
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    name="productValue"
                                    placeholder="Product Value"
                                    type="text"
                                    value={variant.productValue}
                                    onChange={(e) =>
                                        handleVariantChange(e, index)
                                    }
                                    onBlur={handleBlur}
                                    onInput={(e)=>{
                                            //  e.target.value.includes("-") ?  ( toast.error("😢 " + "please enter positive value", {position: toast.POSITION.TOP_RIGHT,autoClose: 1000,}), e.target.value = ""): e.target.value
                                             e.target.value.length >100 ?  ( toast.error("😢 " + "please enter less than 100 character", {position: toast.POSITION.TOP_RIGHT,autoClose: 1000,}), e.target.value = ""): e.target.value
                                       }}
                                />
                                <ErrorMessage
                                    component="div"
                                    name="productValue"
                                    className="invalid-feedback"
                                />
                            </div>
                        </div>
                        {variants.length > 1 && (
                            <div className="col-md-1">
                                <div
                                    className="d-flex flex-wrap justify-content-center align-items-center"
                                    style={{ marginTop: "29px" }}
                                >
                                    <button
                                        className="btn btn-primary mt-3 mt-sm-0"
                                        type="button"
                                        onClick={() => onRemoveVariant(index)}
                                    >
                                        -
                                    </button>
                                </div>
                            </div>
                        )}
                        {variants.length - 1 === index && (
                            <div className="col-md-1">
                                <div
                                    className="d-flex flex-wrap justify-content-center align-items-center"
                                    style={{ marginTop: "29px" }}
                                >
                                    <button
                                        className="btn btn-primary mt-3 mt-sm-0"
                                        type="button"
                                        // ref={addButtonRef}
                                        disabled={addDisabled}
                                        onClick={onAddVariant}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default StepThree;
