import React from "react";
import withAuth from "../../component/withAuth";
import axios from "axios";
import { getSession } from "next-auth/client";
import { useEffect, useState, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Head from "next/head";

import StepOne from "../../component/AddProductWiz/stepOne";
import StepTwo from "../../component/AddProductWiz/stepTwo";
import StepThree from "../../component/AddProductWiz/stepThree";
import StepFour from "../../component/AddProductWiz/stepFour";
import useSWR from "swr";
import { connect } from "react-redux";
import { fetchVendorProduct } from "../../Redux/Product/productAction";
// const fetcher = async (url) => {
//     console.log(url);
//     await axios.get(`${url}/brand`).then((res) => res.data.data);
// };

const addproduct = ({ brands, category, fetchVendorProduct, token }) => {
    // const [value, error] = useSWR(process.env.HOST, fetcher);
    // console.log("ADd Props : ", fetchVendorProduct, token);
    // const [color, setColor] = useState("");
    // const [colorError, setColorError] = useState("");
    const [brand, setBrand] = useState(brands);
    const [brandV, setBrandV] = useState([]);
    const [MainCate, setMainCate] = useState(category);
    const [subCate, setSubCate] = useState([]);
    const [subCateV, setSubCateV] = useState("");
    const [cateSec, setCateSec] = useState([]);
    const [cateSecV, setCateSecV] = useState([]);
    const [cateV, setCateV] = useState([]);
    const [allowNextStep, setAllowNextStep] = useState(true);
    const [loading, setLoading] = useState(false);
    const [colorList, setColorList] = useState([]);
    const [sizeList, SetsizeList] = useState([]);
    // const [attributes, setAttribute] = useState([{ color: "", size: "", qty: 0 }]);
    const [attributes, setAttribute] = useState([{ color: "", size: "", qty: "" }]);
    const [stockValue, setStockValue] = useState([]);

    const router = useRouter();
    const btnRef = useRef();
    const [data, setData] = useState({
        productName: "",
        description: "",
        qty: "",
        minOrder: "",
        maxOrder: "",
        photos: [],
        videoLink: "",
        MRP: "",
        sellingPrice: "",
        cId: "",
        scId: "",
        stock: "",
        sscId: "",
        sscName: "",
        scName: "",
        brand: "",
        status: "Active",
        discount: "",
        offerPrice: "",
        offerDetails: "",
        tax: "",
        productDetail: [],
        additionalDetail: {
            localDeliveryCharge: "",
            zonalDeliveryCharge: "",
            packerDetails: "",
            countryOfOrigin: "",
            manufacturerDetails: "",
        },
    });

    // useEffect(() => {
    //     attribute.some((val) => {
    //         if (val.color === "" || val.size === "" || val.stock === "") {
    //             return setAddDisabled(true)
    //         } else {
    //             return setAddDisabled(false)
    //         }
    //     })
    // }, [])
    const [addDisabled, setAddDisabled] = useState(
        false
        // Object.values(variants).some(
        //     (v) => v.productKey === "" || v.productValue === ""
        // )
    );
    // const InputColor = (e) => {
    //     let newArray = [...color, e.target.value];
    //     if (color.includes(e.target.value)) {
    //         newArray = newArray.filter((p) => p !== e.target.value);
    //     }
    //     setColor(newArray);
    //     setData((prev) => ({ ...prev, color: newArray }));
    //     if (e.target.value === "") {
    //         setColorError("Product Color field is required.");
    //     } else {
    //         setColorError("");
    //     }
    // };
    // setInputList((prev) => ({ ...prev, ["asspost"]: list[index] }));

    // 	const list = [...inputList];
    // 	list[index]["asspost"] = e;
    // 	setInputList(list);
    // 	setData((prev) => ({ ...prev, ["assarray"]: list }));


    const onRemoveAttribute = (index) => {
        const list = [...attributes];
        list.splice(index, 1);
        setAttribute(list);
        setData((prev) => ({ ...prev, ["attributes"]: list }));

        const minusTotal = list.reduce((totalValue, k) => totalValue - parseInt(k.qty, 10), 0);
        setStockValue(Math.abs(minusTotal));
        // console.log("check remove",Math.abs(minusTotal))
        // console.log("check Total",stockValue)
    }

    const clickChnage = (e, ind) => {
        const { innerText } = e.target;
        setAttribute((prev) => ({ ...prev, ["attributes"]: list[ind] }));
        const list = [...attributes];
        list[ind]["color"] = innerText;
        setAttribute(list);
        setData((prev) => ({ ...prev, ["attributes"]: list }));

        // console.log("List", qty)

        // if (colorList.includes(e.target.innerText)) return;
        // else {
        //     let list = [...colorList, e.target.innerText];
        //     setColorList(list);
        //     setData((prev) => ({ ...prev, ["color"]: list }));
        // }
    }
    const handleAttributeChange = (e, index) => {
        // const { name, value } = e.target;
        // const list = [...attributes];
        // list[index][name] = value;
        // setAttribute(list);
        // setData((prev) => ({ ...prev, ["attributes"]: list }))


        const { name, value } = e.target;
        const list = [...attributes];
        list[index][name] = value;
        const total = list.reduce((totalValue, k) => totalValue + parseInt(k.qty, 10), 0);
        // console.log("Total", total)
        setStockValue(total);
        setAttribute(list);
        setData((prev) => ({ ...prev, ["attributes"]: list }))
    };


    const clicksize = (e) => {
        if (sizeList.includes(e.target.innerText)) return;
        else {
            let list = [...clicksize, e.target.innerText];
            SetsizeList(list);
            setData((prev) => ({ ...prev, ["size"]: list }));
        }
    }

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

    const onAddAttribute = () => {

        attributes.some((val) => {
            if (sizeList === undefined) {
                if (val.color && val.qty) {
                    setAddDisabled(true);
                    setAttribute([...attributes, { color: "", size: "", qty: 0 }]);
                } else {
                    return setAddDisabled(false)
                }
            }
            else {
                if (val.color && val.size && val.qty) {
                    setAddDisabled(true);
                    setAttribute([...attributes, { color: "", size: "", qty: 0 }]);
                } else {
                    return setAddDisabled(false)
                }
            }

        })

    };
    const handleBlur = () => {
        // setAddDisabled(
        //     Object.values(attribute).some(
        //         (v) => v.color=== "" || v.size === "" ||  v.qty === ""
        //     )
        // );
        attributes.some((val) => {
            if (val.color === "" || val.size === "" || val.qty === "") {
                return setAddDisabled(true)
            } else {
                return setAddDisabled(false)
            }
        })
    };

    useEffect(() => {
        attributes.some((val) => {
            if (val.color === "" || val.size === "" || val.qty === "") {
                return setAddDisabled(true)
            } else {
                return setAddDisabled(false)
            }
        })
    }, [])


    const spaceValidation = new RegExp(
        "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
    );
    const videoValidation = new RegExp(
        "((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=\\S]{2,256}\\.[a-z\\S]{2,6}\\b\\S([-a-zA-Z0-9@:%._\\+~#?&//=\\S]\\S*\\S*$)"
    );
    const ProductSchema = Yup.object().shape({
        productName: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the end are not allowed"
            )
            .required("Product Name is required"),
        qty: Yup.number()
            .min(0, "please enter valid value")
            .required("Product Quantity is required in number"),
        MRP: Yup.number()
            .min(0, "please enter valid value")
            .required("Product MRP is required"),

        // localDeliveryCharge:Yup.number()
        // .min(0,"please enter valid value")
        // .required("localDeliveryCharge is required"),

        // productValue:Yup.number()
        // .min(0,"please enter valid value")
        // .required("productValue is required"),

        // productKey:Yup.number()
        // .min(0,"please enter valid value")
        // .required("productKey is required"),

        // zonalDeliveryCharge:Yup.number()
        // .min(0,"please enter valid value")
        // .required("zonalDeliveryCharge is required"),

        // discount: Yup.number()
        // .required(
        //     "Product selling price is required"
        // ).min(0, "please enter valid value"),

        tax: Yup.number().required(
            "Product tax is required"
        ).min(0, "please enter valid value"),

        // offerDetails: Yup.string().required(
        //     "Offer detail is required"
        // ),

        // offerPrice: Yup.number().required(
        //     "Product selling price is required"
        // ).min(0, "please enter valid value"),

        sellingPrice: Yup.number().required(
            "Product selling price is required"
        ).min(0, "please enter valid value"),

        minOrder: Yup.number()
            .min(0)
            .required("Product Min Order Value is required in number"),
        maxOrder: Yup.number()
            .min(1)
            .max(5)
            .required("Product Max Order Value is required in number"),

        videoLink: Yup.string()
            .matches(
                videoValidation,
                "your link is not valid"
            ).matches(
                spaceValidation,
                "Spaces at the beginning and at the end are not allowed"
            )
            .min(10, "your link is not valid")
            .max(200, "your link is not valid")

    });

    const handleAddProduct = async () => {
        // console.log("attributes", attributes);
        setLoading(true);
        btnRef.current.disabled = true;
        const session = await getSession();
        const formData = new FormData();
        formData.append("productName", data.productName);
        formData.append("attributes", JSON.stringify(attributes));
        formData.append("description", data.description);
        for (let i = 0; i < data.photos.length; i++) {
            formData.append("photo", data.photos[i].data);
        }
        // formData.append("color", "red");
        // formData.append("size",sizeList);
        formData.append("stock",stockValue);
        formData.append("minOrderValue", data.minOrder);
        formData.append("maxOrderValue", data.maxOrder);
        formData.append("MRP", data.MRP);
        formData.append("sellingPrice", Number(data.sellingPrice));
        formData.append("status", data.status);
        formData.append("discount", data.discount);
        formData.append("offerPrice", data.offerPrice);
        formData.append("offerDetails", data.offerDetails);
        formData.append("tax", data.tax);
        formData.append("videoLink", data.videoLink);
        formData.append("productDetail", JSON.stringify(data.productDetail));
        formData.append("additionalDetail", JSON.stringify(data.additionalDetail));
        formData.append("cId", data.cId);
        formData.append("scId", data.scId);
        formData.append("scName", data.scName);
        formData.append("sscId", data.sscId);
        formData.append("sscName", data.sscName);
        formData.append("brand", data.brand);
        // console.log(`url : ${process.env.VHOST}product`);
        // console.log("TOKEN : ", formData);

        await axios
            .post(`${process.env.HOST}/product`, formData, {
                headers: {
                    Authorization: session.accessToken,
                },
            })
            .then((res) => {
                // console.log("data", res);
                setLoading(false);
                // console.log(loading);
                fetchVendorProduct(token);
                toast.info("😊 " + res.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                    onClose: () => {
                        router.push("/vendor/products");
                    },
                });
                btnRef.current.disabled = false;
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                // console.log(loading);
                btnRef.current.disabled = true;
                toast.error("😢 " + err.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            });
    };


    // 2
    const handleSecLevel = async (e) => {
        setCateV(e);
        if (e.value === data.cId) return;
        setCateSecV([]);
        setBrandV([]);
        setSubCateV([]);
        setData((prev) => ({
            ...prev,
            cId: e.value,
            sscId: "",
            scId: "",
            scName: "",
            sscName: "",
            brand: "",
        }));
        await axios
            .get(`${process.env.HOST}/category/sub/${e.value}`)
            .then((res) => {
                toast.info(
                    "🎉 Please choose category from select sub category if you want!!!",
                    {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000,
                    }
                );
                // console.log("subcate", res.data.data);

                // setGetCate(res.data.data);
                setCateSec(res.data.data);

            })
            .catch((err) => {
                toast.error("😢 " + err.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
                // setGetCate([]);
                setCateSec([]);
            });
    };
    // 3
    const handleParentIdChange = async (e) => {
        setCateSecV(e);
        if (e.value === data.scId) return;
        setSubCateV([]);
        setBrandV([]);
        setData((prev) => ({
            ...prev,
            scId: e.value,
            scName: e.label,
            sscId: "",
            sscName: "",
            brand: "",
        }));
        await axios
            .get(`${process.env.HOST}/category/sub/${e.value}`)
            .then((res) => {
                toast.info(
                    "🎉 Please choose category from select sub category if you want!!!",
                    {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000,
                    }
                );
                // console.log("subcate", res.data.data);

                // setGetCate(res.data.data);
                setSubCate(res.data.data);

            })
            .catch((err) => {
                toast.error("😢 " + err.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
                // setGetCate([]);
                setSubCate([]);
            });
    };

    // 4
    const handleSubCategoryChange = async (e) => {
        setSubCateV(e);
        setBrandV([]);
        if (e.value === data.scName) return;
        setData((prev) => ({
            ...prev,
            sscId: e.value,
            sscName: e.label,
            brand: "",
        }));
        await axios
            .get(`${process.env.HOST}/brand/${data.cId}/${data.scId}`)
            .then((res) => {
                toast.info("🎉 Please choose brand !", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
                // console.log(res.data.data);
                // setGetCate(res.data.data);
                setBrand(res.data.data);
            })
            .catch((err) => {
                toast.error("😢 " + err.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
                // setGetCate([]);
                setBrand([]);
            });
    };

    const [currentStep, setCurrentStep] = useState(1);
    const _next = () => {
        const step = currentStep >= 3 ? 4 : currentStep + 1;
        setCurrentStep(step);
    };

    const _prev = () => {
        const step = currentStep <= 1 ? 1 : currentStep - 1;
        setCurrentStep(step);
    };

    /*
     * the functions for our button
     */
    // const previousButton = () => {
    //     if (currentStep !== 1) {
    //         return (
    //             <button
    //                 className="btn btn-secondary"
    //                 type="button"
    //                 onClick={_prev}
    //             >
    //                 Previous
    //             </button>
    //         );
    //     }
    //     return null;
    // };

    // const nextButton = () => {
    //     if (currentStep < 4) {
    //         return (
    //             <button
    //                 className="btn btn-primary float-right"
    //                 type="button"
    //                 onClick={_next}
    //             >
    //                 Next
    //             </button>
    //         );
    //     }
    //     return null;
    // };

    return (
        <>
            <Head>
                <title>Vaistra E-commerce | Add Product</title>
            </Head>
            <section className="col-lg-8">
                <h2 className="h3 py-2 text-center text-lg-center">
                    <strong>Add a New Product</strong>
                </h2>
                <p className="text-center">
                    Fill all form field to go to next step
                </p>
                <Formik
                    initialValues={{
                        productName: data.productName,
                        quantity: data.quantity,
                        MRP: data.price,
                        attributes: attributes,
                        minOrder: data.minOrder,
                        maxOrder: data.maxOrder,
                        photos: data.photos,
                        videoLink: data.videoLink,
                        MRP: data.MRP,
                        stock: data.stock,
                        sellingPrice: data.sellingPrice,
                        brand: data.brand,
                        status: data.status,
                        discount: data.discount,
                        offerPrice: data.offerPrice,
                        offerDetails: data.offerDetails,
                        tax: data.tax,
                    }}
                    validationSchema={ProductSchema}
                    onSubmit={handleAddProduct}
                >
                    {({ touched, errors, isValid, values, handleChange }) => (
                        <Form className="px-4">
                            {/* <!-- progressbar --> */}
                            <ul className="steps steps-light pt-2 pb-3 mb-5 px-4">
                                <li
                                    className={`step-item ${currentStep > 0 ? "active" : ""
                                        // currentStep == 1 ? "active" : ""
                                        }`}
                                >
                                    <div className="step-progress">
                                        <span className="step-count">1</span>
                                    </div>
                                    <div
                                        className="step-label"
                                        style={{ color: "#fe696a" }}
                                    >
                                        Select Category
                                    </div>
                                </li>
                                <li
                                    className={`step-item ${currentStep > 1 ? "active" : ""
                                        // currentStep == 2 ? "active" : ""
                                        }`}
                                >
                                    <div className="step-progress">
                                        <span className="step-count">2</span>
                                    </div>
                                    <div
                                        className="step-label"
                                        style={{ color: "#fe696a" }}
                                    >
                                        Add Product Details
                                    </div>
                                </li>
                                <li
                                    className={`step-item ${currentStep > 2 ? "active" : ""
                                        // currentStep == 3 ? "active" : ""
                                        }`}
                                >
                                    <div className="step-progress">
                                        <span className="step-count">3</span>
                                    </div>
                                    <div
                                        className="step-label"
                                        style={{ color: "#fe696a" }}
                                    >
                                        Add Variants
                                    </div>
                                </li>
                                <li
                                    className={`step-item ${currentStep > 3 ? "active" : ""
                                        // currentStep == 4 ? "active" : ""
                                        }`}
                                >
                                    <div className="step-progress">
                                        <span className="step-count">4</span>
                                    </div>
                                    <div
                                        className="step-label"
                                        style={{ color: "#fe696a" }}
                                    >
                                        Additional Details
                                    </div>
                                </li>
                            </ul>
                            {currentStep == 1 && (
                                <StepOne
                                    customStyles={customStyles}
                                    cateV={cateV}
                                    subCateV={subCateV}
                                    setSubCateV={setSubCateV}
                                    setCateSec={setCateSec}
                                    setCateSecV={setCateSecV}
                                    MainCate={MainCate}
                                    handleParentIdChange={handleParentIdChange}
                                    handleSubCategoryChange={
                                        handleSubCategoryChange
                                    }
                                    handleSecLevel={handleSecLevel}
                                    subCate={subCate}
                                    brand={brand}
                                    cateSec={cateSec}
                                    cateSecV={cateSecV}
                                    brandV={brandV}
                                    setBrandV={setBrandV}
                                    setData={setData}
                                    data={data}
                                    setAllowNextStep={setAllowNextStep}
                                />
                            )}
                            {currentStep == 2 && (
                                <StepTwo
                                    setData={setData}
                                    handleChange={handleChange}
                                    inputChange={inputChange}
                                    touched={touched}
                                    errors={errors}
                                    colorList={colorList}
                                    sizeList={sizeList}
                                    setColorList={setColorList}
                                    setSizeList={SetsizeList}
                                    // InputColor={InputColor}
                                    data={data}
                                    stockValue={stockValue}
                                    handleBlur={handleBlur}
                                    addDisabled={addDisabled}
                                    setAddDisabled={setAddDisabled}
                                    onAddAttribute={onAddAttribute}
                                    attribute={attributes}
                                    sscId={data.sscId}
                                    allowNextStep={allowNextStep}
                                    onRemoveAttribute={onRemoveAttribute}
                                    handleAttributeChange={handleAttributeChange}
                                    clickChnage={clickChnage}
                                    // clicksize={clicksize}
                                    setAllowNextStep={setAllowNextStep}
                                />
                            )}

                            {currentStep == 3 && (
                                <StepThree
                                    touched={touched}
                                    errors={errors}
                                    setData={setData}
                                    data={data}
                                    setAllowNextStep={setAllowNextStep}
                                />
                            )}
                            {currentStep == 4 && (
                                <StepFour
                                    values={values}
                                    isValid={isValid}
                                    setData={setData}
                                    data={data}
                                    loading={loading}
                                    btnRef={btnRef}
                                    btnName="Add Product"
                                />
                            )}

                            <hr className="mt-2 mb-3" />

                            {currentStep !== 1 && (
                                <button
                                    className="btn btn-secondary"
                                    type="button"
                                    onClick={_prev}
                                >
                                    Previous
                                </button>
                            )}
                            {/* {previousButton()} */}
                            {/* {nextButton()} */}
                            {currentStep < 4 && (
                                <button
                                    className="btn btn-primary float-right"
                                    type="button"
                                    onClick={_next}
                                    disabled={allowNextStep}
                                >
                                    Next
                                </button>
                            )}
                        </Form>
                    )}
                </Formik>
            </section>
        </>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchVendorProduct: (token) => dispatch(fetchVendorProduct(token)),
    };
};
export async function getStaticProps() {
    const category = await axios.get(`${process.env.HOST}/category/root`);
    // const brands = await axios.get(`${process.env.HOST}/brand`);

    return {
        props: {
            category: category.data.data,
            // brands: brands.data.data,
        },
    };
}

export default withAuth(connect(null, mapDispatchToProps)(addproduct));
