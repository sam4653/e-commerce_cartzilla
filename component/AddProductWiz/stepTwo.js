import React, { useState, useEffect } from "react";
import { Field, ErrorMessage } from "formik";
import SimpleDropZone from "../DropzoneUploader";
import color from "../../component/ColorPicker";
import dynamic from "next/dynamic";
import ImageUpload from "../ImageUpload";
import { number } from "yup/lib/locale";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const RichEditor = dynamic(() => import("../../component/RichEditor"), {
  ssr: false,
});

export default function StepTwo({
  setData,
  handleChange,
  inputChange,
  sscId,
  touched,
  errors,
  colorList,
  setColorList,
  setSizeList,
  sizeList,
  clicksize,
  handleBlur,
  attribute,
  allowNextStep,
  // InputColor,
  stockValue,
  data,
  onRemoveAttribute,
  handleAttributeChange,
  clickChnage,
  onAddAttribute,
  setAllowNextStep,
  setAddDisabled,
  addDisabled,
}) {
  const [errorDesc, setErrorDesc] = useState({ description: "" });
  const [fileData, setFileData] = useState([]);
  const [buttonMsg, setButtonMsg] = useState("");
  const [colorname, setColorName] = useState("");
  // const [stockValue, setStockValue] = useState("");
  // const handleColorChange = (e) => {
  //     if (colorList.includes(e.target.value)) return;
  //     else {
  //         let list = [...colorList, e.target.value];
  //         setColorList(list);
  //         setData((prev) => ({ ...prev, ["color"]: list }));
  //     }
  // };

  // const handleBlur = () => {
  //     setAddDisabled(
  //         Object.values(attribute).some(
  //             (v) => v.color === "" || v.size === "" || v.qty === ""
  //         )
  //     );
  // };

  const handleRemoveColor = (i) => {
    const list = [...colorList];
    list.splice(i, 1);
    setColorList(list);
    setData((prev) => ({ ...prev, ["color"]: list }));
  };
  const checkamount = (e) => {
    // Number(e.target.value) > data.MRP ? (alert("Please Enter Valid Value") , e.target.value=0 ) : e.target.value
    // Number(e.target.value) > data.offerPrice ? (alert("Please Enter Valid Value") , e.target.value=0 ) : e.target.value
    if (e.target.name === "sellingPrice") {
      Number(e.target.value) > data.MRP
        ? (toast.error("😢 " + "Selling prize is not more than MRP", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
      Number(e.target.value) === 0
        ? (toast.error("😢 " + "you can't enter 0", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
    } else if (e.target.name === "discount") {
      Number(e.target.value) > data.offerPrice
        ? (toast.error("😢 " + "Discount is not more than Selling price", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
    } else if (e.target.name === "offerPrice") {
      Number(e.target.value) >= data.sellingPrice
        ? (toast.error("😢 " + "Offer Price is not more than Selling price", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
      Number(e.target.value) === 0
        ? (toast.error("😢 " + "you can't enter 0", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
    } else if (e.target.name === "maxOrder") {
      Number(e.target.value) < data.minOrder
        ? (toast.error("😢 " + "Max Order is not less than Min Order", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
      Number(e.target.value) > 5
        ? (toast.error("😢 " + "Maximum Order limit is 5", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
      Number(e.target.value) > stockValue
        ? (toast.error("😢 " + "Max Order is not more than qty", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
    } else if (e.target.name === "minOrder") {
      Number(e.target.value) > stockValue
        ? (toast.error("😢 " + "Min Order is not more than Stock", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
      Number(e.target.value) > 5
        ? (toast.error("😢 " + "Minimum Order limit is 5", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
    } else if (e.target.name === "qty") {
      Number(e.target.value) === 0
        ? (toast.error("😢 " + "Please Enter value", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
      // Number(e.target.value) > 50
      //   ? (toast.error("😢 " + "THis is the limit", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 1000,
      //   }),
      //     (e.target.value = ""))
      //   : e.target.value;
    }
  };

  // console.log("sizeList", sizeList);
  setAllowNextStep();
  // data.productName === "" ||
  //   data.MRP === "" ||
  //   data.minOrder === "" ||
  //   data.maxOrder === "" ||
  //   attribute.qty === "" ||
  //   attribute.size === "" ||
  //   attribute.color === "" ||
  //   data.sellingPrice === "" ||
  //   // data.offerPrice === "" ||
  //   // data.discount === "" ||
  //   data.tax === "" ||
  //   data.stock === "" ||
  //   data.status === "" ||
  //   data.description === "<p><br></p>" ||
  //   data.description === "" ||
  //   data.photos?.length < 1

  //     ? sizeList === undefined ?
  //     attribute.some(
  //         (x) => x.color === "" || x.qty === ""
  //     ) : attribute.some(
  //         (x) => x.color === "" || x.size === "" || x.qty === ""
  //     )
  //     ? true : false
  // attribute.some(
  //           (x) => x.color === "" || x.qty === ""
  //      ) : attribute.some(
  //          (x) => x.color === "" || x.size === "" || x.qty === ""
  //     )

  if (
    data.productName === "" ||
    data.MRP === "" ||
    data.minOrder === "" ||
    data.maxOrder === "" ||
    data.sellingPrice === "" ||
    data.tax === "" ||
    data.status === "" ||
    data.description === "<p><br></p>" ||
    data.description === "" ||
    data.photos?.length < 1
  ) {
    setAllowNextStep(true);
  } else if (sizeList === undefined) {
    setAllowNextStep(attribute.some((x) => x.color === "" || x.qty === ""));
  } else if (sizeList !== undefined) {
    setAllowNextStep(
      attribute.some((x) => x.color === "" || x.qty === "" || x.size === "")
    );
  } else {
    setAllowNextStep(false);
  }

  useEffect(() => {
    const getSize = async () => {
      await axios
        .get(`${process.env.HOST}/category/${sscId}`)
        .then((res) => {
          // console.log(res.data);
          setSizeList(res.data.data.size);
        })
        .catch((eror) => {
          console.log(eror);
        });
    };

    getSize();
  }, []);
  return (
    <>
      <div className="row">
        {/* name */}
        <div className="col-md-6">
          <div className="form-group">
            <label>Product Name</label>
            <span className="text-danger">*</span>
            <Field
              className={`form-control ${touched.productName && errors.productName ? "is-invalid" : ""
                }`}
              name="productName"
              placeholder="Product Name"
              type="text"
              onChange={(e) => {
                handleChange(e);
                inputChange(e);
              }}
            />
            <ErrorMessage
              component="div"
              name="productName"
              className="invalid-feedback"
            />
          </div>
        </div>
        {/* MRP */}
        <div className="col-md-6">
          <div className="form-group">
            <label>Product MRP</label>
            <span className="text-danger">*</span>
            <Field
              className={`form-control ${touched.MRP && errors.MRP ? "is-invalid" : ""
                }`}
              name="MRP"
              placeholder="0"
              type="number"
              onChange={(e) => {
                handleChange(e);
                inputChange(e);
              }}
              onKeyDown={(e) =>
                (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()
              }
              onInput={(e) => {
                e.target.value.includes("-")
                  ? (toast.error("😢 " + "Please Enter Valid Value", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                  }),
                    (e.target.value = 0))
                  : e.target.value;
              }}
            />
            <ErrorMessage
              component="div"
              name="MRP"
              className="invalid-feedback"
            />
          </div>
        </div>

        {/* selling Price */}
        <div className="col-md-4">
          <div className="form-group">
            <label>Selling Price</label>
            <span
              className="text-danger"
              title="Value Should be grater than Or equal to 0"
            >
              *
            </span>
            <Field
              className={`form-control ${touched.sellingPrice && errors.sellingPrice ? "is-invalid" : ""
                }`}
              name="sellingPrice"
              placeholder="0"
              type="number"
              onChange={(e) => {
                handleChange(e);
                inputChange(e);
              }}
              onKeyDown={(e) =>
                (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()
              }
              onInput={(e) => {
                e.target.value.includes("-")
                  ? (toast.error("😢 " + "Please Enter Valid Value", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                  }),
                    (e.target.value = 0))
                  : e.target.value;
                checkamount(e);
              }}
            />
            <ErrorMessage
              component="div"
              name="sellingPrice"
              className="invalid-feedback"
            />
          </div>
        </div>
        {/* Offer Price */}
        <div className="col-md-4">
          <div className="form-group">
            <label>Offer Price</label>
            {/* <span
                            className="text-danger"
                            title="Value Should be grater than Or equal to 0"
                        >
                            *
                        </span> */}
            <Field
              className={`form-control ${touched.offerPrice && errors.offerPrice ? "is-invalid" : ""
                }`}
              name="offerPrice"
              placeholder="0"
              type="number"
              onChange={(e) => {
                handleChange(e);
                inputChange(e);
              }}
              onKeyDown={(e) =>
                (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()
              }
              onInput={(e) => {
                e.target.value.includes("-")
                  ? (toast.error("😢 " + "Please Enter Valid Value", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                  }),
                    (e.target.value = ""))
                  : e.target.value;
                checkamount(e);
              }}
            />
            <ErrorMessage
              component="div"
              name="offerPrice"
              className="invalid-feedback"
            />
          </div>
        </div>
        {/* discount */}
        <div className="col-md-4">
          <div className="form-group">
            <label>Discount&nbsp;</label>
            <span
              className="text-dark"
              title="Value Should be grater than Or equal to 0"
            >
              ( ₹ )
            </span>
            <Field
              className={`form-control ${touched.discount && errors.discount ? "is-invalid" : ""
                }`}
              name="discount"
              placeholder="0"
              type="number"
              onChange={(e) => {
                handleChange(e);
                inputChange(e);
              }}
              onKeyDown={(e) =>
                (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()
              }
              onInput={(e) => {
                e.target.value.includes("-")
                  ? (toast.error("😢 " + "Please Enter Valid Value", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                  }),
                    (e.target.value = 0))
                  : e.target.value;
                checkamount(e);
              }}
            />
            <ErrorMessage
              component="div"
              name="discount"
              className="invalid-feedback"
            />
          </div>
        </div>
        {/* tax */}
        <div className="col-md-4">
          <div className="form-group">
            <label>Tax</label>
            <span
              className="text-danger"
              title="Value Should be grater than Or equal to 0"
            >
              *
            </span>
            {/* <div
                            className="input-group-append-overlay"
                        >
                            <span className="input-group-text percentage">
                                %
                            </span>
                        </div> */}
            {/* <select
              className={`form-control ${
                touched.tax && errors.tax ? "is-invalid" : ""
              }`}
              aria-label="Default select example"
              onChange={(e) => {
                inputChange(e);
                handleChange(e);
                setData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
                
              }}
              onKeyDown={(e) =>
                (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()
              }
              name="tax"
            >
              <option yyyuu>
                Add Tax
              </option>
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select> */}
            <Field
              className={`form-control`}
              name="tax"
              as="select"
              onChange={(e) => {
                handleChange(e);
                setData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
            >
              <option value="">add tax</option>
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </Field>
            {/* <Field
                            className={`form-control ${touched.tax && errors.tax ? "is-invalid" : ""
                                }`}
                            name="tax"
                            placeholder="Tax"
                            type="number"
                            onChange={(e) => {
                                handleChange(e);
                                inputChange(e);
                            }}
                            onKeyDown={(e) =>
                                (e.keyCode === 69 || e.keyCode === 190) &&
                                e.preventDefault()
                            }
                            maxLength={2}
                            onInput={(e) => {
                                e.target.value.includes("-") ? (alert("Please Enter Valid Value"), e.target.value = 0) : e.target.value
                            }}
                        /> */}
            <ErrorMessage
              component="div"
              name="tax"
              className="invalid-feedback"
            />
          </div>
        </div>
        {/* Offer Details */}
        <div className="col-md-8">
          <div className="form-group">
            <label>Offer Detail</label>
            {/* <span
                            className="text-danger"
                            title="Value Should be grater than Or equal to 0"
                        >
                            *
                        </span> */}
            <Field
              className={`form-control ${touched.offerDetails && errors.offerDetails ? "is-invalid" : ""
                }`}
              name="offerDetails"
              placeholder="Offer Description"
              type="text"
              onChange={(e) => {
                handleChange(e);
                inputChange(e);
              }}
              onInput={(e) => {
                e.target.value.length > 150
                  ? (toast.error(
                    "😢 " + "Please Enter less than 150 character",
                    { position: toast.POSITION.TOP_RIGHT, autoClose: 1000 }
                  ),
                    (e.target.value = ""))
                  : e.target.value;
                e.target.value.length < 3
                  ? setAllowNextStep(true)
                  : e.target.value;
              }}
            />
            <ErrorMessage
              component="div"
              name="offerDetails"
              className="invalid-feedback"
            />
          </div>
        </div>
        {/* status */}
        <div className="col-md-6">
          <div className="form-group">
            <label>Status</label>
            <span
              className="text-danger"
              title="Value Should be grater than Or equal to 0"
            >
              *
            </span>
            <Field
              className={`form-control`}
              name="status"
              as="select"
              onChange={(e) => {
                handleChange(e);
                setData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
            >
              <option value="Active">Active</option>
              <option value="In Active">Inactive</option>
            </Field>
          </div>
        </div>

        {/* video link */}
        <div className="col-md-6">
          <div className="form-group">
            <label>Video Link</label>
            <span className="text-danger"></span>
            <Field
              className={`form-control ${touched.videoLink && errors.videoLink ? "is-invalid" : ""
                }`}
              name="videoLink"
              placeholder="https://example.com"
              type="url"
              onChange={(e) => {
                handleChange(e);
                inputChange(e);
              }}
            />
            <ErrorMessage
              component="div"
              name="videoLink"
              className="invalid-feedback"
            />
          </div>
        </div>

        {attribute.map((attributes, index) => {
          return (
            <>
              {/* Color */}
              <div className="col-md-5 mt-lg-2" key={index}>
                <div className="form-group">
                  <label>Product Color</label>
                  <span className="text-danger">*</span>
                  <br />
                  {/* <Field
                            className={`form-control`}
                            name="color"
                            as="select"
                            // value={color}
                            placeholder="Select Color"
                            onChange={(e) => {
                                handleChange(e);
                                handleColorChange(e);
                            }}
                        // style={{ border: `5px solid ${color}` }}
                        >
                            
                            {colorList.map((c) => (
                                <option value={c.name} key={c.id} style={{backgroundColor:c.code}}>  </option>

                            ))}
                           
                        </Field> */}
                  <div className="btn-group w-100">
                    <button
                      type="button"
                      className="btn btn-primary dropdown-toggle px-lg-5"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {attributes.color ? attributes.color : "Select color"}
                    </button>
                    <div
                      className="dropdown-menu"
                      style={{ height: "30vh", overflowY: "scroll" }}
                    >
                      {color?.map((c, ind) => {
                        return (
                          <>
                            <div
                              className="dropdown-item d-flex "
                              href="#"
                              key={ind}
                            >
                              <p
                                style={{
                                  backgroundColor: `${c.code}`,
                                  width: "20px",
                                  height: "20px",
                                  cursor: "pointer",
                                }}
                                className="mr-2"
                              ></p>
                              <p onClick={(e) => clickChnage(e, index)}>
                                {c.name}
                              </p>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>

                  {/* {colorList.length > 0 && (
                    <div className="d-flex flex-wrap flex-row m-1">
                      {colorList.map((c, i) => {
                        return (
                          <div
                            className="p-2 mx-1 rounded-circle position-relative"
                            key={i}
                            style={{
                              background: `${c}`,
                              height: "50px",
                              width: "50px",
                            }}
                          >
                            <button type="button" className="btn close">
                              <span
                                aria-hidden="true"
                                onClick={() => handleRemoveColor(i)}
                              >
                                ×
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )} */}
                </div>
              </div>

              {/* size */}
              {/* Size Select */}
              <div className="col-md-3">
                <div className="form-group">
                  <label>Size</label>
                  <span
                    className="text-danger"
                    title="Value Should be grater than Or equal to 0"
                  >
                    *
                  </span>
                  <Field
                  className={`form-control`}
                  name="size"
                  disabled={sizeList === undefined && true}
                  id="size"
                  as="select"
                  onChange={(e) => {
                    handleAttributeChange(e, index), handleBlur();
                   
                  }}
            >
            <option value="">select size</option>
            {sizeList?.map((val, ind) => {
                      return (
                        <>
                          <option value={val}>{val}</option>
                        </>
                      );
                    })}
                  </Field>
                  {/* <select
                    name="size"
                    id="size"
                    disabled={sizeList === undefined && true}
                    onChange={(e) => {
                      handleAttributeChange(e, index), handleBlur();
                    }}
                    className={`form-control`}
                    aria-label="Default select example"
                  >
                    <option value="">select size</option>
                    {sizeList?.map((val, ind) => {
                      return (
                        <>
                          <option value={val}>{val}</option>
                        </>
                      );
                    })}
                  </select> */}
                </div>
              </div>

              {/* Quantity */}
              <div className="col-md-2">
                <div className="form-group">
                  <label>Quantity</label>
                  <span
                    className="text-danger"
                    title="Value Should be grater than 0"
                  >
                    *
                  </span>
                  <Field
                    className={`form-control ${touched.qty && errors.qty ? "is-invalid" : ""
                      }`}
                    name="qty"
                    placeholder="0"
                    type="number"
                    value={attributes.qty}

                    onChange={(e) => {
                      handleChange(e);
                      inputChange(e);
                      handleAttributeChange(e, index);
                      handleBlur();
                    }}
                    onBlur={handleBlur}
                    onKeyDown={(e) =>
                      (e.keyCode === 69 || e.keyCode === 190) &&
                      e.preventDefault()
                    }
                    onInput={(e) => {
                      e.target.value.includes("-")
                        ? (toast.error("😢 " + "Please Enter Positive Value", {
                          position: toast.POSITION.TOP_RIGHT,
                          autoClose: 1000,
                        }),
                          (e.target.value = 0))
                        : e.target.value;
                      checkamount(e);
                    }}

                  />
                  <ErrorMessage
                    component="div"
                    name="qty"
                    className="invalid-feedback"
                  />
                </div>
              </div>
              {attribute.length > 1 && (
                <div className="col-md-1">
                  <div
                    className="d-flex flex-wrap justify-content-center align-items-center"
                    style={{ marginTop: "29px" }}
                  >
                    <button
                      className="btn btn-primary mt-3 mt-sm-0"
                      type="button"
                      onClick={() => onRemoveAttribute(index)}
                    >
                      -
                    </button>
                  </div>
                </div>
              )
              }

              {
                attribute.length - 1 === index && (
                  <div className="col-md-1">
                    <div
                      className="d-flex flex-wrap justify-content-center align-items-center"
                      style={{ marginTop: "29px" }}
                    >
                      <button
                        className="btn btn-primary mt-3 mt-sm-0"
                        type="button"
                        // ref={addButtonRef}
                        // disabled={addDisabled}
                        disabled={
                          sizeList === undefined
                            ? attribute.some(
                              (x) => x.color === "" || x.qty === ""
                            )
                            : attribute.some(
                              (x) =>
                                x.color === "" || x.size === "" || x.qty === ""
                            )
                        }
                        onClick={onAddAttribute}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              }
            </>
          );
        })}

        {/* stock */}
        <div className="col-md-4">
          <div className="form-group">
            <label>Stock</label>
            <span className="text-danger" title="Value Should be grater than 0">
              *
            </span>
            <Field
              className={`form-control ${touched.stock && errors.stock ? "is-invalid" : ""
                }`}
              name="stock"
              placeholder="Stock"
              type="text"
              max={5}
              onChange={(e) => {
                handleChange(e);
                inputChange(e);
              }}
              value={stockValue ? stockValue : 0}
              onKeyDown={(e) =>
                (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()
              }

              // onInput={(e) => {
              //   e.target.value.includes("-")
              //     ? (toast.error("😢 " + "Please Enter Valid Value", {
              //       position: toast.POSITION.TOP_RIGHT,
              //       autoClose: 1000,
              //     }),
              //       (e.target.value = 0))
              //     : e.target.value;
              //   checkamount(e);
              // }}
              readOnly={true}
            />
            <ErrorMessage
              component="div"
              name="stock"
              className="invalid-feedback"
            />
          </div>
        </div>

        {/* Min Order */}
        <div className="col-md-4">
          <div className="form-group">
            <label>Min Order Value</label>
            <span className="text-danger" title="Value Should be grater than 0">
              *
            </span>
            <Field
              className={`form-control ${touched.minOrder && errors.minOrder ? "is-invalid" : ""
                }`}
              name="minOrder"
              placeholder="Minimum Order Value"
              type="number"
              max={1}
              onChange={(e) => {
                handleChange(e);
                inputChange(e);
              }}
              onKeyDown={(e) =>
                (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()
              }
              onInput={(e) => {
                e.target.value.includes("-")
                  ? (toast.error("😢 " + "Please Enter Positive Value", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                  }),
                    (e.target.value = 0))
                  : e.target.value;
                checkamount(e);
              }}
            />
            <ErrorMessage
              component="div"
              name="minOrder"
              className="invalid-feedback"
            />
          </div>
        </div>

        {/* Max Order */}
        <div className="col-md-4">
          <div className="form-group">
            <label>Max Order Value</label>
            <span className="text-danger">*</span>
            <Field
              className={`form-control ${touched.maxOrder && errors.maxOrder ? "is-invalid" : ""
                }`}
              min={1}
              name="maxOrder"
              placeholder="Maximum Order Value"
              type="number"
              onChange={(e) => {
                handleChange(e);
                inputChange(e);
              }}
              onKeyDown={(e) =>
                (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()
              }
              onInput={(e) => {
                e.target.value.includes("-")
                  ? (toast.error("😢 " + "Please Enter Positive Value", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                  }),
                    (e.target.value = 0))
                  : e.target.value;
                checkamount(e);
              }}
            />
            <ErrorMessage
              component="div"
              name="maxOrder"
              className="invalid-feedback"
            />
          </div>
        </div>

        {/* <ImageUpload /> */}
        {/* photo */}

        <div className="col-md-6">
          <label className="form-label">Photo</label>
          <span className="text-danger">*</span>

          {/* <SimpleDropZone setData={setData} /> */}
          <ImageUpload
            setFileData={setFileData}
            fileData={fileData}
            setData={setData}
            data={data}
            setButtonMsg={setButtonMsg}
          />
          <div className="pt-2 text-danger">
            <p>{buttonMsg}</p>
          </div>
        </div>

        {/* <div className="col-md-6">
                    <label className="form-label">Photo</label>
                    <span className="text-danger">*</span>

                    <SimpleDropZone setData={setData} />
                </div> */}

        {/* Description */}
        <div className="col-md-12 mt-3">
          <label>Product Description</label>
          <span className="text-danger">*</span>
          <RichEditor
            // toolbar={["bold", "italic", "underline", "link"]}
            height={"225px"}
            data={data.description}
            name={"description"}
            setData={setData}
            setErrorDesc={setErrorDesc}
            image={false}
            error={"Product Description is Required."}
          />
          {errorDesc.description !== "" && (
            <span className="text-danger error">{errorDesc.description}</span>
          )}
        </div>
      </div>
    </>
  );
}
