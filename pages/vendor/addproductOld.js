import React from "react";
import withAuth from "../../component/withAuth";
import axios from "axios";
import { getSession } from "next-auth/client";
import { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, FormikProvider } from "formik";
import * as Yup from "yup";
import { FaImage, FaTimes } from "react-icons/fa";
import { toast , Flip} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Spinner from "../../component/Spinner";
import Select from "react-select";
import Dropzone from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";
import Head from "next/head";

const RichEditor = dynamic(() => import("../../component/RichEditor"), {
    ssr: false,
});
const SunEditor = dynamic(() => import("suneditor-react"), {
    ssr: false,
});

const addproduct = () => {
    const [size, setSize] = useState([]);
    const [color, setColor] = useState([]);
    const [colorError, setColorError] = useState("");
    const [photoError, setPhotoError] = useState("");
    const [errorDesc, setErrorDesc] = useState({ description: "" });
    const [brand, setBrand] = useState([]);
    const [MainCate, setMainCate] = useState([]);
    const [subCate, setSubCate] = useState([]);
    const [getSubCate, setGetCate] = useState([]);
    const [cateV, setCateV] = useState(null);
    const [subCatV, setSubCatV] = useState(null);

    const getUploadParams = ({ meta }) => {
        return { url: "https://httpbin.org/post" };
    };

    const handleChangeStatus = ({ meta, file }, status) => {
        console.log(file);
    };

    const handleSubmit = (files, allFiles) => {
        allFiles.forEach((f) => f.remove());
        setData((prev) => ({ ...prev, photo: files.map((f) => f.file) }));
    };

    useEffect(async () => {
        await axios
            .get(`${process.env.VHOST}/brand`)
            .then((res) => {
                // console.log(res.data.data);
                setBrand(res.data.data);
            })
            .catch((err) => {
                toast.error("😢 " + err.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
            });
        await axios
            .get(`${process.env.VHOST}category/all`)
            .then((res) => {
                // console.log(res.data.data);
                setMainCate(res.data.data);
            })
            .catch((err) => {
                toast.error("😢 " + err.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
            });
    }, []);

    const router = useRouter();
    const btnRef = useRef();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        productName: "",
        description: "",
        stock: 0,
        minOrder: 1,
        maxOrder: 5,
        photo: [],
        videoLink: "",
        MRP: 0,
        sellingPrice: 0,
        cId: "",
        scId: "",
        scName: "",
        brand: "",
        status: "Active",
        discount: 0,
        offerPrice: 0,
        offerDetail: "",
        tax: 0,
        productDetail: { size: ["S", "M"] },
        additionalDetail: {
            localDeliveryCharge: 10,
            zonalDeliveryCharge: 20,
            packerDetail: { name: "abc" },
            countryOfOrigin: "india",
            manufacturerDetail: { address: "xyz" },
        },
        color: [],
    });

    // const handleSize = (event) => {
    //     let newArray = [...size, event.target.id];
    //     if (size.includes(event.target.id)) {
    //         newArray = newArray.filter((p) => p !== event.target.id);
    //     }
    //     setSize(newArray);
    //     setData((prev) => ({ ...prev, size: newArray }));
    // };

    const InputColor = (e) => {
        let newArray = [...color, e.target.value];
        if (color.includes(e.target.value)) {
            newArray = newArray.filter((p) => p !== e.target.value);
        }
        setColor(newArray);
        setData((prev) => ({ ...prev, color: newArray }));
        if (e.target.value === "") {
            setColorError("Product Color field is required.");
        } else {
            setColorError("");
        }
    };

    const customStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#fe696a",
            borderRadius: "5px",
            "&:hover": { backgroundColor: "#fe696a", cursor: "pointer" },
        }),
        placeholder: (styles) => ({
            ...styles,
            color: "white",
            "&:hover": { backgroundColor: "#fe696a" },
        }),
        dropdownIndicator: (styles) => ({
            ...styles,
            color: "white",
            "&:hover": { color: "white" },
        }),
        indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        menu: (styles) => ({
            ...styles,
            position: "absolute",
            top: "30px",
        }),
        singleValue: (styles) => ({ ...styles, color: "white" }),
        input: (styles) => ({ ...styles, color: "white" }),
    };

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };
    const spaceValidation = new RegExp(
        "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
    );

    const ProductSchema = Yup.object().shape({
        productName: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the end are not allowed"
            )
            .required("Product Name is required"),
        stock: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the end are not allowed"
            )
            .required("Product Quantity is required"),
        MRP: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the end are not allowed"
            )
            .required("Product MRP is required"),
        sellingPrice: Yup.string().required(
            "Product selling price is required"
        ),
        minOrder: Yup.number()
            .min(0)
            .required("Product Min Order Value is required"),
        maxOrder: Yup.number()
            .min(0)
            .required("Product Max Order Value is required"),
    });

    const addproduct = async () => {
        // console.log(data);
        setLoading(true);
        btnRef.current.disabled = true;
        const session = await getSession();
        const formdata = new FormData();
        formdata.append("productName", data.productName);
        formdata.append("description", data.description);
        for (let i = 0; i < data.photo.length; i++) {
            formdata.append("photo", data.photo[i]);
        }
        formdata.append("color", data.color[0]);
        formdata.append("stock", data.stock);
        formdata.append("minOrderValue", data.minOrder);
        formdata.append("maxOrderValue", data.maxOrder);
        formdata.append("MRP", data.MRP);
        formdata.append("sellingPrice", data.sellingPrice);
        formdata.append("status", data.status);
        formdata.append("discount", data.discount);
        formdata.append("offerPrice", data.offerPrice);
        formdata.append("offerDetails", data.offerDetail);
        formdata.append("tax", data.tax);
        formdata.append("productDetail", data.productDetail);
        formdata.append("additionalDetail", data.additionalDetail);

        formdata.append("cId", data.cId);
        formdata.append("scId", data.scId);
        formdata.append("scName", data.scName);
        formdata.append("brand", data.brand);
        // console.log(`url : ${process.env.VHOST}product`);
        // console.log("TOKEN : ", session.accessToken);
        for (var value of formdata.values()) {
            console.log(value);
        }
        await axios
            .post(`${process.env.VHOST}product`, formdata, {
                headers: {
                    Authorization: session.accessToken,
                },
            })
            .then((res) => {
                // console.log(res);
                setLoading(false);
                btnRef.current.disabled = false;
                toast.info("😊 " + res.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                    transition:Flip,
                    onClose: () => {
                        router.push("/vendor/products");
                    },
                });
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                btnRef.current.disabled = true;
                toast.error("😢 " + err.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
            });
    };

    const handleParentIdChange = async (e) => {
        setCateV(e);
        setData((prev) => ({ ...prev, cId: e.value }));
        await axios
            .get(`${process.env.VHOST}category/sub/${e.value}`)
            .then((res) => {
                toast.info(
                    "🎉 Please choose category from select sub category if you want!!!",
                    {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000,
                        transition:Flip,
                    }
                );
                // console.log(res.data.data);
                setGetCate(res.data.data);
                setSubCate(res.data.data);
            })
            .catch((err) => {
                toast.error("😢 " + err.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
                setGetCate([]);
                // if (err.response.data.message === "subCategory Not Found") {
                //     setSubCate([]);
                //     console.log("first", subCate);
                //     setGetCate([]);
                //     if (subCate.length != 0) {
                //         setCateV({
                //             value: subCate[0].id,
                //             label: subCate[0].name,
                //         });
                //     } else {
                //         setCateV(e);
                //     }
                // }
            });
    };

    return (
        <>
            <Head>
                <title>Vaistra E-commerce | Add Product</title>
            </Head>
            <section className="col-lg-8 margin-top-88">
                <div className="pt-2 px-4 pl-lg-0 pr-xl-5">
                    <Formik
                        initialValues={{
                            productName: data.productName,
                            quantity: data.quantity,
                            MRP: data.price,
                            minOrder: data.minOrder,
                            maxOrder: data.maxOrder,
                            photo: [],
                            videoLink: "",
                            MRP: data.MRP,
                            sellingPrice: data.sellingPrice,
                            brand: data.brand,
                            status: data.status,
                            discount: data.discount,
                            offerPrice: data.offerPrice,
                            offerDetail: data.offerDetail,
                            tax: data.tax,
                            // productDetail: {},
                            // additionalDetail: {},
                            // color: [],
                        }}
                        validationSchema={ProductSchema}
                        onSubmit={addproduct}
                    >
                        {({
                            touched,
                            errors,
                            isValid,
                            values,
                            handleChange,
                        }) => (
                            <Form>
                                <div className="row">
                                    <div className="col-md-4">
                                        <h2 className="h3 py-2">Add Product</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <Select
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            styles={customStyles}
                                            placeholder="Select Main Category"
                                            id="long-value-select"
                                            value={cateV}
                                            instanceId="long-value-select"
                                            options={MainCate?.map((m) => ({
                                                value: m.id,
                                                label: m.name,
                                            }))}
                                            key={MainCate?.map((m) => m.id)}
                                            onChange={(e) =>
                                                handleParentIdChange(e)
                                            }
                                            menuShouldBlockScroll={true}
                                        />
                                    </div>
                                    {getSubCate?.length > 0 && (
                                        <div className="col-md-4 d-flex mb-3">
                                            <Select
                                                className="react-select"
                                                classNamePrefix="react-select"
                                                styles={customStyles}
                                                // value={subCatV}
                                                placeholder="Select Sub Category"
                                                id="long-value-select"
                                                instanceId="long-value-select"
                                                options={subCate.map((s) => ({
                                                    value: s.id,
                                                    label: s.name,
                                                }))}
                                                key={subCate.map((s) => s.id)}
                                                onChange={(e) => {
                                                    // setSubCatV(e);
                                                    setData((prev) => ({
                                                        ...prev,
                                                        scId: e.value,
                                                        scName: e.label,
                                                    }));
                                                }}
                                                menuShouldBlockScroll={true}
                                            />
                                        </div>
                                    )}
                                    <div className="col-md-4 mb-3">
                                        <Select
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            styles={customStyles}
                                            placeholder="Select Brand"
                                            id="long-value-select"
                                            instanceId="long-value-select"
                                            options={brand.map((y) => ({
                                                value: y.name,
                                                label: y.name,
                                            }))}
                                            key={brand.map((y) => y.id)}
                                            onChange={(e) => {
                                                setData((prev) => ({
                                                    ...prev,
                                                    brand: e.value,
                                                }));
                                            }}
                                            menuShouldBlockScroll={true}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    {/* name */}
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Product Name</label>
                                            <span className="text-danger">
                                                *
                                            </span>
                                            <Field
                                                className={`form-control ${
                                                    touched.productName &&
                                                    errors.productName
                                                        ? "is-invalid"
                                                        : ""
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
                                            <span className="text-danger">
                                                *
                                            </span>
                                            <Field
                                                className={`form-control ${
                                                    touched.MRP && errors.MRP
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="MRP"
                                                placeholder="MRP of Product"
                                                type="number"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                                onKeyDown={(e) =>
                                                    (e.keyCode === 69 ||
                                                        e.keyCode === 190) &&
                                                    e.preventDefault()
                                                }
                                            />
                                            <ErrorMessage
                                                component="div"
                                                name="MRP"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>
                                    {/* Min Order */}
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Min Order Value</label>
                                            <span
                                                className="text-danger"
                                                title="Value Should be grater than 0"
                                            >
                                                *
                                            </span>
                                            <Field
                                                className={`form-control ${
                                                    touched.minOrder &&
                                                    errors.minOrder
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="minOrder"
                                                placeholder="Minimum Order Value"
                                                type="number"
                                                min={1}
                                                max={10}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                                onKeyDown={(e) =>
                                                    (e.keyCode === 69 ||
                                                        e.keyCode === 190) &&
                                                    e.preventDefault()
                                                }
                                            />
                                            <ErrorMessage
                                                component="div"
                                                name="minOrder"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>
                                    {/* Max Order */}
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Max Order Value</label>
                                            <span className="text-danger">
                                                *
                                            </span>
                                            <Field
                                                className={`form-control ${
                                                    touched.maxOrder &&
                                                    errors.maxOrder
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                min={1}
                                                max={5}
                                                name="maxOrder"
                                                placeholder="Maximum Order Value"
                                                type="number"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                                onKeyDown={(e) =>
                                                    (e.keyCode === 69 ||
                                                        e.keyCode === 190) &&
                                                    e.preventDefault()
                                                }
                                            />
                                            <ErrorMessage
                                                component="div"
                                                name="maxOrder"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>
                                    {/* Stock */}
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Stock</label>
                                            <span
                                                className="text-danger"
                                                title="Value Should be grater than 0"
                                            >
                                                *
                                            </span>
                                            <Field
                                                className={`form-control ${
                                                    touched.stock &&
                                                    errors.stock
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="stock"
                                                placeholder="Number of Quantity"
                                                type="number"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                                onKeyDown={(e) =>
                                                    (e.keyCode === 69 ||
                                                        e.keyCode === 190) &&
                                                    e.preventDefault()
                                                }
                                            />
                                            <ErrorMessage
                                                component="div"
                                                name="stock"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>
                                    {/* selling Price */}
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Selling Price</label>
                                            <span
                                                className="text-danger"
                                                title="Value Should be grater than Or equal to 0"
                                            >
                                                *
                                            </span>
                                            <Field
                                                className={`form-control ${
                                                    touched.sellingPrice &&
                                                    errors.sellingPrice
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="sellingPrice"
                                                placeholder="Selling Price"
                                                type="number"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                                onKeyDown={(e) =>
                                                    (e.keyCode === 69 ||
                                                        e.keyCode === 190) &&
                                                    e.preventDefault()
                                                }
                                            />
                                            <ErrorMessage
                                                component="div"
                                                name="stock"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>
                                    {/* Offer Price */}
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Offer Price</label>
                                            <span
                                                className="text-danger"
                                                title="Value Should be grater than Or equal to 0"
                                            >
                                                *
                                            </span>
                                            <Field
                                                className={`form-control ${
                                                    touched.offerPrice &&
                                                    errors.offerPrice
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="offerPrice"
                                                placeholder="Offer Price"
                                                type="number"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                                onKeyDown={(e) =>
                                                    (e.keyCode === 69 ||
                                                        e.keyCode === 190) &&
                                                    e.preventDefault()
                                                }
                                            />
                                            <ErrorMessage
                                                component="div"
                                                name="stock"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>
                                    {/* discount */}
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Discount</label>
                                            <span
                                                className="text-danger"
                                                title="Value Should be grater than Or equal to 0"
                                            >
                                                *
                                            </span>
                                            <Field
                                                className={`form-control ${
                                                    touched.discount &&
                                                    errors.discount
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="discount"
                                                placeholder="Discount"
                                                type="number"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                                onKeyDown={(e) =>
                                                    (e.keyCode === 69 ||
                                                        e.keyCode === 190) &&
                                                    e.preventDefault()
                                                }
                                            />
                                            <ErrorMessage
                                                component="div"
                                                name="stock"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>
                                    {/* tax */}
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Tax</label>
                                            <span
                                                className="text-danger"
                                                title="Value Should be grater than Or equal to 0"
                                            >
                                                *
                                            </span>
                                            <Field
                                                className={`form-control ${
                                                    touched.tax && errors.tax
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="tax"
                                                placeholder="Tax"
                                                type="number"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                                onKeyDown={(e) =>
                                                    (e.keyCode === 69 ||
                                                        e.keyCode === 190) &&
                                                    e.preventDefault()
                                                }
                                            />
                                            <ErrorMessage
                                                component="div"
                                                name="stock"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>
                                    {/* Offer Details */}
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label>Offer Detail</label>
                                            <span
                                                className="text-danger"
                                                title="Value Should be grater than Or equal to 0"
                                            >
                                                *
                                            </span>
                                            <Field
                                                className={`form-control ${
                                                    touched.offerDetail &&
                                                    errors.offerDetail
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="offerDetail"
                                                placeholder="Offer Description"
                                                type="text"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                            />
                                            <ErrorMessage
                                                component="div"
                                                name="stock"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>
                                    {/* color */}
                                    <div className="col-md-6">
                                        <label>Product Color</label>
                                        <span className="text-danger">*</span>
                                        <br />
                                        <div>
                                            <input
                                                type="color"
                                                onChange={(e) => {
                                                    InputColor(e);
                                                }}
                                            />
                                        </div>
                                        {colorError !== "" && (
                                            <span className="text-danger error">
                                                {colorError}
                                            </span>
                                        )}
                                        <div className="row">
                                            {color.map((c,i) => {
                                                return (
                                                   <>
                                                   <div className="col-md-3 mb-1" key={i}>
                                                        <div
                                                            style={{
                                                                background:c,
                                                                height: "30px",
                                                                width: "100%",
                                                            }}
                                                        ></div>
                                                    </div>
                                                   </>
                                                );
                                            })}
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
                                                        [e.value]: e.label,
                                                    }));
                                                }}
                                            >
                                                <option value="active">
                                                    Active
                                                </option>
                                                <option value="inactive">
                                                    In Active
                                                </option>
                                            </Field>
                                        </div>
                                    </div>
                                    {/* video link */}
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Video Link</label>
                                            <Field
                                                className={`form-control`}
                                                name="videoLink"
                                                placeholder="Video Link"
                                                type="text"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/* photo */}
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Photo
                                        </label>
                                        <span className="text-danger">*</span>
                                        <Dropzone
                                            getUploadParams={getUploadParams}
                                            onChangeStatus={handleChangeStatus}
                                            onSubmit={handleSubmit}
                                            accept="image/*"
                                            maxFiles={3}
                                            inputContent={(files, extra) =>
                                                extra.reject
                                                    ? "Only Image is allowed"
                                                    : "Select and Drop Multiple Files"
                                            }
                                            styles={{
                                                dropzoneReject: {
                                                    borderColor: "#F19373",
                                                    backgroundColor: "#F1BDAB",
                                                },
                                                inputLabel: (files, extra) =>
                                                    extra.reject
                                                        ? { color: "#A02800" }
                                                        : {},
                                            }}
                                        />
                                        {photoError !== "" && (
                                            <span className="text-danger error">
                                                {photoError}
                                            </span>
                                        )}
                                    </div>

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
                                            error={
                                                "Product Description is Required."
                                            }
                                        />
                                        {errorDesc.description !== "" && (
                                            <span className="text-danger error">
                                                {errorDesc.description}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* Variants */}
                                <div className="row">
                                    <div className="col-md-12">
                                        <h4 className="h3 py-2 my-3">
                                            Add Product Variants
                                        </h4>
                                    </div>
                                    {/* product Key */}
                                    <div className="col-md-5">
                                        <div className="form-group">
                                            <label>Product Key</label>
                                            <span className="text-danger">
                                                *
                                            </span>
                                            <Field
                                                className={`form-control ${
                                                    touched.productKey &&
                                                    errors.productKey
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="productKey"
                                                placeholder="Product Key"
                                                type="text"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/* Product Value */}
                                    <div className="col-md-5">
                                        <div className="form-group">
                                            <label>Product Value</label>
                                            <span className="text-danger">
                                                *
                                            </span>
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
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                            />
                                            <ErrorMessage
                                                component="div"
                                                name="productValue"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <hr className="mt-2 mb-3" />
                                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                                            <button
                                                className="btn btn-primary mt-3 mt-sm-0"
                                                type="submit"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Additional Details */}
                                <div className="row">
                                    <div className="col-md-12">
                                        <h4 className="h3 py-2 my-3">
                                            Additional Details
                                        </h4>
                                    </div>
                                    {/* local Delivery Charge*/}
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Local Delivery Charge</label>
                                            <span
                                                className="text-danger"
                                                title="Value Should be grater than 0"
                                            >
                                                *
                                            </span>
                                            <Field
                                                className={`form-control ${
                                                    touched.localDeliveryCharge &&
                                                    errors.localDeliveryCharge
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="localDeliveryCharge"
                                                placeholder="Local Delivery Charge"
                                                type="text"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                                onKeyDown={(e) =>
                                                    (e.keyCode === 69 ||
                                                        e.keyCode === 190) &&
                                                    e.preventDefault()
                                                }
                                            />
                                        </div>
                                    </div>
                                    {/* zonal Delivery Charge*/}
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Zonal Delivery Charge</label>
                                            <span
                                                className="text-danger"
                                                title="Value Should be grater than 0"
                                            >
                                                *
                                            </span>
                                            <Field
                                                className={`form-control ${
                                                    touched.zonalDeliveryCharge &&
                                                    errors.zonalDeliveryCharge
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="zonalDeliveryCharge"
                                                placeholder="Zonal Delivery Charge"
                                                type="text"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                                onKeyDown={(e) =>
                                                    (e.keyCode === 69 ||
                                                        e.keyCode === 190) &&
                                                    e.preventDefault()
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* country of Origin */}
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Country of Origin</label>
                                            <span className="text-danger">
                                                *
                                            </span>
                                            <Field
                                                className={`form-control`}
                                                name="countryOfOrigin"
                                                placeholder="Country Name"
                                                type="text"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/* Packer Details */}
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Packer Details</label>
                                            <span className="text-danger">
                                                *
                                            </span>
                                            <Field
                                                className={`form-control`}
                                                name="packerDetails"
                                                placeholder="Packer Details"
                                                type="text"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/*  Manufacturer Details */}
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Manufacturer Details</label>
                                            <span className="text-danger">
                                                *
                                            </span>
                                            <Field
                                                className={`form-control`}
                                                name="manufacturerDetails"
                                                placeholder="Manufacturer Details"
                                                type="text"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    inputChange(e);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    {/* Submit Button */}
                                    <div className="col-12">
                                        <hr className="mt-2 mb-3" />
                                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                                            <button
                                                className="btn btn-primary mt-3 mt-sm-0"
                                                type="submit"
                                                disabled={
                                                    !Object.values(values).some(
                                                        (x) =>
                                                            x !== null &&
                                                            x !== ""
                                                    ) ||
                                                    !isValid ||
                                                    data.cId === "" ||
                                                    data.brand === "" ||
                                                    data.description ===
                                                        "<p><br></p>" ||
                                                    data.description === "" ||
                                                    data.photo.length === 0 ||
                                                    data.color.length === 0
                                                }
                                                ref={btnRef}
                                            >
                                                Add product
                                                {loading && <Spinner />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
        </>
    );
};

export default withAuth(addproduct);
