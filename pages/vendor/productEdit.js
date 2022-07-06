import React, { useEffect, useState, useRef } from "react";
import withAuth from "../../component/withAuth";
import axios from "axios";
import { getSession } from "next-auth/client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaImage, FaTimes } from "react-icons/fa";
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Spinner from "../../component/Spinner";
import Select from "react-select";
import "react-dropzone-uploader/dist/styles.css";
import Head from "next/head";
import { connect } from "react-redux";

import SimpleDropZone from "../../component/DropzoneUploader";
import ImageUpload from "../../component/ImageUpload";
import colorAll from "../../component/ColorPicker";
import { fetchVendorProduct } from "../../Redux/Product/productAction";
import Loader from "../../component/Loader";
import { months } from "moment";

const RichEditor = dynamic(() => import("../../component/RichEditor"), {
  ssr: false,
});

const editProduct = ({ brands, category, fetchVendorProduct }) => {
  const router = useRouter();

  const [sizeList, setsizeList] = useState([]);
  console.log(sizeList,"sizeList");
  const [allowNextStep, setAllowNextStep] = useState(false);
  const [errorDesc, setErrorDesc] = useState({ description: "" });
  const [mainCate, setMainCate] = useState([]);
  const [cateV, setCateV] = useState();
  const [count, setCount] = useState(0)
  const [subCate, setSubCate] = useState([]);
  const [getSubCate, setGetCate] = useState([]);
  const [cateSec, setCateSec] = useState([]);
  const [cateSecV, setCateSecV] = useState([]);
  const [brand, setBrand] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [colorList, setColorList] = useState([]);
  const [colorError, setColorError] = useState("");
  const [addDisabled, setAddDisabled] = useState(false);
  const [variants, setVariants] = useState();
  const [attribute, setAttribute] = useState();
  const [fileData, setFileData] = useState([]);
  const [brandV, setBrandV] = useState("");
  const [brandname, setBrandname] = useState("");
  const [show, setShow] = useState(true);
  const btnRef = useRef();
  const [buttonMsg, setButtonMsg] = useState("");
  const [stockValue, setStockValue] = useState([]);


  useEffect(async () => {
    // get Single Product
    const productId = localStorage.getItem("productId");
    let productData;
    await axios
      .get(`${process.env.HOST}/product/${productId}`)
      .then((res) => {
        !Object.keys(res.data.data)?.length && router.push("/vendor/products");
        productData = { ...res.data.data };
        // console.log("data", productData)
        setData(productData);
        setBrandV(productData.brand);
        // console.log(productData);
      })
      .catch((err) => {
        toast.error("😢 " + err.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          onClose: () => {
            router.push("/vendor/products");
          },
        });
      });

    setVariants(productData?.productDetail);
    setAttribute(productData?.attributes);
    setMainCate(category);
    const cateData = category.find((v) => v.id == productData.cId);
    setCateV({ value: cateData.id, label: cateData.name });

    // setBrand(brands);
    setFileData(
      productData?.photos?.map((p) => {
        return {
          data: p,
          url: p,
        };
      })
    );
    setColorList(productData?.color?.split(","));
  }, []);

  const cId = data?.cId;

  useEffect(async () => {
    // {console.log("attribute",data.attributes)}
    cId &&
      (await axios
        .get(`${process.env.HOST}/category/sub/${cId}`)
        .then((res) => {
          setCateSec(res.data.data);
        })
        .catch((err) => {
          toast.error("😢 " + err.response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }));

    const scId = data?.scId;
    cId && scId &&
      (await axios
        .get(`${process.env.HOST}/category/sub/${scId}`)
        .then((res) => {
          setSubCate(res.data.data);
          // console.log("sub",res.data.data);
        })
        .catch((err) => {
          toast.error("😢 " + err.response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }));
    const sscId = data?.sscId;

    cId &&
      scId &&
      sscId &&
      (await axios
        .get(`${process.env.HOST}/brand/${cId}/${scId}`)
        .then((res) => {
          setBrand(res.data.data);
        })
        .catch((err) => {
          toast.error("😢 " + err.response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }));
    cId &&
      scId &&
      sscId &&
      (await axios
        .get(`${process.env.HOST}/category/${sscId}`)
        .then((res) => {
          // console.log("CSIze", res.data.da ta.size);
          setsizeList(res.data.data.size);
        })
        .catch((eror) => {
          console.log(eror);
        }));
  }, [cId]);

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

  // const handleColorChange = (e) => {
  //     if (color.includes(e.target.value)) return;
  //     else {
  //         let list = [...color, e.target.value];
  //         setColor(list);
  //     }
  // };
  const clickChnage = (e, ind) => {
    const { innerText } = e.target;
    setAttribute((prev) => ({ ...prev, ["attributes"]: list[ind] }));
    const list = [...attribute];
    list[ind]["color"] = innerText;
    setAttribute(list);
    // console.log("List", list)
    setData((prev) => ({ ...prev, ["attributes"]: list }));
    // if (colorList.includes(e.target.innerText)) return;
    // else {
    //   let list = [...colorList, e.target.innerText];
    //   setColorList(list);
    // }
  };

  // const handleRemoveColor = (i) => {
  //   const list = [...colorList];
  //   list.splice(i, 1);
  //   setColorList(list);
  // };
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
      Number(e.target.value) === 0 ? (toast.error("😢 " + "you can't enter 0", { position: toast.POSITION.TOP_RIGHT, autoClose: 1000, }), e.target.value = "") : e.target.value
    } else if (e.target.name === "maxOrderValue") {
      Number(e.target.value) > data.stock
        ? (toast.error("😢 " + "Max Order is not more than Stock", {
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
    } else if (e.target.name === "minOrderValue") {
      Number(e.target.value) > data.maxOrderValue
        ? (toast.error("😢 " + "Min Order is not more than maxOrder", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
    }
    if (e.target.name === "manufacturerDetails") {
      e.target.value.length > 100
        ? (toast.error("😢 " + "Please enter less than 100 chraracter", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
    } else if (e.target.name === "localDeliveryCharge") {
      e.target.value.length > 4
        ? (toast.error("😢 " + "Please enter less than 4 chraracter", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
    } else if (e.target.name === "zonalDeliveryCharge") {
      e.target.value.length > 4
        ? (toast.error("😢 " + "Please enter less than 4 chraracter", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
    } else if (e.target.name === "packerDetails") {
      e.target.value.length > 100
        ? (toast.error("😢 " + "Please enter less than 100 chraracter", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
    } else if (e.target.name === "countryOfOrigin") {
      e.target.value.length > 100
        ? (toast.error("😢 " + "Please enter less than 100 chraracter", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
    } else if (e.target.name === "qty") {
      Number(e.target.value) === 0
        ? (toast.error("😢 " + "Please enter Value", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }),
          (e.target.value = ""))
        : e.target.value;
    }
  };

  // 2
  const handleSecLevel = async (e) => {
    setCateV(e);
    setCateSecV([]);
    setBrandV([]);
    setData((prev) => ({ ...prev, cId: e.value, scId: "", scName: "", sscId: "", sscName: "" }));
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
    // setCateV(e);
    setBrandV("");
    setData((prev) => ({ ...prev, scId: e.value, scName: e.label, sscId: "", sscName: "" }));
    const session = await getSession();
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
        if (res.data.length !== 0) {
          setGetCate((oldArray) => [...oldArray, ""]);
          setSubCate(res.data.data);
          setBrand(brands);
        } else if (res.status !== 200) {
          setSubCate([]);
        }
      })
      .catch((err) => {
        toast.error("😢 " + err.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        setSubCate([]);
      });
  };

  const handleSubCategoryChange = async (e) => {
    // setSubCateV(e);
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
        // 
        setBrand([]);
      });
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
    stock: Yup.number()
      .min(0, "please enter valid value")
      .required("Product Quantity is required"),
    MRP: Yup.number()
      .min(0, "please enter valid value")
      .required("Product MRP is required"),

    // discount: Yup.number()
    //   .required("Product selling price is required")
    //   .min(0, "please enter valid value"),

    tax: Yup.number()
      .required("Product tax is required")
      .min(0, "please enter valid value"),

    // offerDetails: Yup.string()
    //   .required("Offer detail is required")
    //   .min(10, "Please enter more than 10 character")
    //   .max(200, "Please enter less than 200 character"),

    sellingPrice: Yup.number()
      .required("Product selling price is required")
      .min(0, "please enter valid value"),

    // offerPrice: Yup.number()
    //   .required("Product selling price is required")
    //   .min(0, "please enter valid value"),

    minOrderValue: Yup.number()
      .min(0)
      .required("Product Min Order Value is required"),
    maxOrderValue: Yup.number()
      .min(0)
      .required("Product Max Order Value is required"),
  });

  const updateProduct = async (e) => {
    // console.log("Updated data",data)
    setLoading(true);
    btnRef.current.disabled = true;
    const session = await getSession();
    // console.log(session);
    const formData = new FormData();
    formData.append("productName", data.productName);
    formData.append("description", data.description);
    for (let i = 0; i < fileData.length; i++) {
      formData.append("photos", fileData[i].data);
    }
    // formData.append("color", colorList.toString());
    formData.append("stock", data.stock);
    formData.append("minOrderValue", data.minOrderValue);
    formData.append("maxOrderValue", data.maxOrderValue);
    formData.append("MRP", data.MRP);
    formData.append("sellingPrice", data.sellingPrice);
    formData.append("status", data.status);
    formData.append("discount", data.discount);
    formData.append("offerPrice", data.offerPrice);
    formData.append("offerDetails", data.offerDetails);
    formData.append("tax", data.tax);
    formData.append("videoLink", data.videoLink);
    formData.append("productDetail", JSON.stringify(data.productDetail));
    formData.append("attributes", JSON.stringify(data.attributes));
    formData.append("additionalDetail", JSON.stringify(data.additionalDetail));
    formData.append("cId", data.cId);
    formData.append("scId", data.scId);
    formData.append("scName", data.scName);
    formData.append("sscId", data.sscId);
    formData.append("sscName", data.sscName);
    formData.append("brand", data.brand);
    // console.log(`url : ${process.env.VHOST}product`);
    // console.log("TOKEN : ", formData);

    // console.log("Data", data)
    await axios
      .put(`${process.env.HOST}/product/${data.id}`, formData, {
        headers: {
          Authorization: session.accessToken,
        },
      })
      .then((res) => {
        // console.log(res);
        fetchVendorProduct(session.accessToken);
        setLoading(false);
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
        btnRef.current.disabled = false;
        toast.error("😢 " + err.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });
  };
  const handleAdditionalDetailChange = (e) => {
    const { name, value } = e.target;
    const list = data.additionalDetail;
    list[name] = value;
    // setAdditionalDetail(list);
    setData((prev) => ({
      ...prev,
      ["additionalDetail"]: list,
    }));
  };

  // Product Details
  const handleBlur = () => {
    setAddDisabled(
      Object.values(variants).some(
        (v) => v.productKey === "" || v.productValue === ""
      )
    );

    
  };
  const handleVariantChange = (e, index) => {
    // console.log("variants",variants);
    setAddDisabled(
      Object.values(variants).some(
        (v) => v.productKey === "" || v.productValue === ""
      )
    );
    setAllowNextStep(
      Object.values(variants).some(
        (v) => v.productKey === "" || v.productValue === ""
      )
    );
    const { name, value } = e.target;
    const list = [...variants];
    list[index][name] = value;
    setVariants(list);
    setData((prev) => ({ ...prev, ["productDetail"]: variants }));
  };

  const onRemoveVariant = (index) => {
    const variants = data.productDetail;
    const list = [...variants];
    list.splice(index, 1);
    setVariants(list);
    setData((prev) => ({ ...prev, ["productDetail"]: list }));
  };
  const onAddVariant = () => {
    const variants = data.productDetail;
    setVariants([...variants, { productKey: "", productValue: "" }]);
    setAddDisabled(true);
    setAllowNextStep(true);
  };

  // Attributes
  const handleAttributeChange = (e, index) => {
    setAddDisabled(
      Object.values(attribute).some(
        (v) => v.color === "" || v.size === "" || v.qty === ""
      )
    );

    const { name, value } = e.target;
    const list = [...attribute];
    list[index][name] = value;
    setAttribute(list);
    setData((prev) => ({ ...prev, ["attributes"]: attribute }));

    const total = list.reduce((totalValue, k) => totalValue + parseInt(k.qty, 10), 0);
    console.log("Total", total)
    setStockValue(total);
    data.stock = total
  };

  const onRemoveAttribute = (index) => {
    const attr = data.attributes;
    const list = [...attr];
    list.splice(index, 1);
    setAttribute(list);
    setData((prev) => ({ ...prev, ["attributes"]: list }));

    const minusTotal = list.reduce((totalValue, k) => totalValue - parseInt(k.qty, 10), 0);
    setStockValue(Math.abs(minusTotal));
    data.stock = Math.abs(minusTotal)
  };
 
  const onAddAttribute = () => {
    // setCount(count+1);
    setAllowNextStep(true)
    const attr = data.attributes;
    attr.some((val) => {
      if(sizeList === undefined || sizeList.length === 0 ){
          if (val.color && val.qty) {
              setAddDisabled(true);
              setAttribute([...attr, { color: "", size: "", qty: 0 }]);
          } else {
              return setAddDisabled(false)
          }
      }
      else{
          if (val.color && val.size && val.qty) {
              setAddDisabled(true);
              setAttribute([...attr, { color: "", size: "", qty: 0 }]);
          } else {
              return setAddDisabled(false)
          }
      }
      
  })

  };


  // Product Size
  const clicksize = (e) => {
    if (sizeList.includes(e.target.innerText)) return;
    else {
      let list = [...clicksize, e.target.innerText];
      setsizeList(list);
      setData((prev) => ({ ...prev, ["size"]: list }));
    }
  }

  // useEffect(() => {
  //   const getSize = async () => {
  //     if (e.value === data.scName) return;
  //       setData((prev) => ({
  //           ...prev,
  //           sscId: e.value,
  //           sscName: e.label,
  //       }));
  //     await axios
  //       .get(`${process.env.HOST}/category/${sscId}`)
  //       .then((res) => {
  //         console.log(res.data);  
  //         setsizeList(res.data.data.size);
  //       })
  //       .catch((eror) => {
  //         console.log(eror);
  //       });
  //   };

  //   getSize();
  // }, []);
 useEffect(() => {

  console.log("variants",variants);
  console.log("data.variants",data.productDetail);
  if (
    data?.productName === "" ||
    data?.scName === "" ||
    data?.cId === "" ||
    data?.brand === "" ||
    data?.MRP === "" ||
    data?.minOrderValue === "" ||
    data?.maxOrderValue === "" ||
    data?.sellingPrice === "" ||
    data?.tax === "" ||
    data?.stock === "" ||
    data?.status === "" ||
    data?.description === "<p><br></p>" ||
    data?.description === "  " ||
    data?.photos?.length < 1 ||
    data?.productDetail?.some((x) => x.productKey === "" || x.productValue === "")
  ) {
    setAllowNextStep(true);
  }else if (sizeList === undefined || sizeList.length === 0) {
    setAllowNextStep(data.attributes?.some((x) => x.color === "" || x.qty === ""));
    
  } else if (sizeList !== undefined || sizeList.length !== 0) {
    setAllowNextStep(
      data.attributes?.some((x) => x.color === "" || x.qty === "" || x.size === "")
   );
  }  else {
    setAllowNextStep(false);
  }
 }, [data])
 
  // console.log("DATA : ", data);
  return (
    Object.keys(data)?.length ? (
      <>
        <Head>
          <title>Vaistra E-Commerce | Edit Product</title>
        </Head>
        <section className="col-lg-8">
          <div className="d-none d-lg-flex justify-content-between align-items-center pt-lg-3 mb-lg-3">
            <h2 className="h3 pt-2 mb-0 text-center text-sm-left">
              Edit Product
            </h2>
          </div>
          <hr />
          <Formik
            initialValues={{
              productName: data.productName,
              stock: data.stock,
              minOrderValue: data.minOrderValue,
              maxOrderValue: data.maxOrderValue,
              videoLink: data.videoLink,
              MRP: data.MRP,
              sellingPrice: data.sellingPrice,
              brand: data.brand,
              status: data.status,
              discount: data.discount,
              offerPrice: data.offerPrice,
              offerDetails: data.offerDetails,
              tax: data.tax,
              // color: data.color,
            }}
            validationSchema={ProductSchema}
            onSubmit={updateProduct}
          >
            {({ touched, errors, isValid, values, handleChange }) => (
              <Form className="px-4 mt-3">
                {/* {currentStep == 1 && ( */}
                <div className="row">
                  {/* Main-Category */}
                  <div className="col-md-3 mb-3 ">
                    <Select
                      className="react-select text-capitalize"
                      classNamePrefix="react-select"
                      styles={customStyles}
                      placeholder="Select Main Category"
                      id="long-value-select"
                      value={cateV}
                      instanceId="long-value-select"
                      options={mainCate?.map((m) => ({
                        value: m.id,
                        label: m.name,
                      }))}
                      key={mainCate?.map((m) => m.id)}
                      onChange={(e) => handleSecLevel(e)}
                      menuShouldBlockScroll={true}
                    />
                  </div>
                  {/* Sub-Category 2*/}
                  <div className="col-md-3 mb-3">
                    <Select
                      className="react-select text-capitalize"
                      classNamePrefix="react-select"
                      styles={customStyles}
                      value={{ label: data?.scName }}
                      placeholder="Select Sub Category"
                      id="long-value-select"
                      instanceId="long-value-select"
                      options={cateSec.map((s) => ({
                        value: s.id,
                        label: s.name,
                      }))}
                      key={cateSec.map((s) => s.id)}
                      onChange={(e) => {
                        // setCateSecV(e);
                        handleParentIdChange(e);
                        // setData((prev) => ({
                        //     ...prev,
                        //     scId: e.value,
                        //     scName: e.label,
                        // }));
                      }}
                      menuShouldBlockScroll={true}
                    />
                  </div>
                  {/* Sub-Category 3*/}
                  <div className="col-md-3 mb-3">
                    <Select
                      className="react-select text-capitalize"
                      classNamePrefix="react-select"
                      styles={customStyles}
                      value={{ label: data?.sscName }}
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
                        handleSubCategoryChange(e);
                        // setData((prev) => ({
                        //     ...prev,
                        //     scId: e.value,
                        //     scName: e.label,
                        // }));
                        clicksize(e)
                      }}
                      menuShouldBlockScroll={true}
                    />
                  </div>
                  {/* Brand */}
                  <div className="col-md-3 mb-3">
                    <Select
                      className="react-select text-capitalize"
                      classNamePrefix="react-select"
                      styles={customStyles}
                      value={{ label: brandV }}
                      placeholder="Select Brand"
                      id="long-value-select"
                      instanceId="long-value-select"
                      options={brand?.map((y) => ({
                        value: y.name,
                        label: y.name,
                      }))}
                      key={brand?.map((y) => y.id)}
                      onChange={(e) => {
                        setBrandV(e.value);
                        setData((prev) => ({
                          ...prev,
                          brand: e.value,
                        }));
                      }}
                      menuShouldBlockScroll={true}
                    />
                  </div>
                  <hr className="my-3" />
                  <div className="h4 text-left">Product Details :-</div>
                  <hr className="my-3" />
                  <div className="row">
                    {/* name */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Product Name</label>
                        <span className="text-danger">*</span>
                        <Field
                          className={`form-control ${touched.productName && errors.productName
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
                        <span className="text-danger">*</span>
                        <Field
                          className={`form-control ${touched.MRP && errors.MRP ? "is-invalid" : ""
                            }`}
                          name="MRP"
                          placeholder="MRP of Product"
                          type="number"
                          onChange={(e) => {
                            handleChange(e);
                            inputChange(e);
                          }}
                          onKeyDown={(e) =>
                            (e.keyCode === 69 || e.keyCode === 190) &&
                            e.preventDefault()
                          }
                          onInput={(e) => {
                            e.target.value.includes("-")
                              ? (alert("Please Enter Valid Value"),
                                (e.target.value = 0))
                              : e.target.value;
                            checkamount(e);
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
                        <span className="text-danger" title="Value Should be grater than Or equal to 0">*</span>
                        <Field
                          className={`form-control ${touched.sellingPrice &&
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
                          onInput={(e) => {
                            e.target.value.includes("-") ? (alert("Please Enter Valid Value"), e.target.value = 0) : e.target.value; checkamount(e)
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
                        {/* <span className="text-danger"title="Value Should be grater than Or equal to 0">*</span> */}
                        <Field
                          className={`form-control ${touched.offerPrice &&
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
                          onInput={(e) => {
                            e.target.value.includes("-") ? (alert("Please Enter Valid Value"), e.target.value = "") : e.target.value; checkamount(e)
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
                        <label>Discount</label>
                        {/* <span className="text-danger"title="Value Should be grater than Or equal to 0">*</span> */}
                        <Field
                          className={`form-control ${touched.discount && errors.discount
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
                          onInput={(e) => {
                            e.target.value.includes("-") ? (alert("Please Enter Valid Value"), e.target.value = 0) : e.target.value; checkamount(e)
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
                        <span className="text-danger" title="Value Should be grater than Or equal to 0">*</span>
                        <Field
                          className={`form-control`}
                          name="tax"
                          as="select"
                          onChange={(e) => {
                            handleChange(e);
                            setData((prev) => ({
                              ...prev,
                              [e.target.name]:
                                e.target.value,
                            }));
                          }}
                        >
                          <option value="0">
                            0%
                          </option>
                          <option value="5">
                            5%
                          </option>
                          <option value="12">
                            12%
                          </option>
                          <option value="18">
                            18%
                          </option>
                          <option value="28">
                            28%
                          </option>
                        </Field>
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
                        {/* <span className="text-danger"title="Value Should be grater than Or equal to 0">*</span> */}
                        <Field
                          className={`form-control ${touched.offerDetails &&
                            errors.offerDetails
                            ? "is-invalid"
                            : ""
                            }`}
                          name="offerDetails"
                          placeholder="Offer Description"
                          type="text"
                          onChange={(e) => {
                            handleChange(e);
                            inputChange(e);
                          }}
                          onInput={(e) => {
                            e.target.value.length > 150 ? (toast.error("😢 " + "Please Enter less than 150 character", { position: toast.POSITION.TOP_RIGHT, autoClose: 1000, }), e.target.value = "") : e.target.value;
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
                              [e.target.name]:
                                e.target.value,
                            }));
                          }}
                        >
                          <option value="Active">
                            Active
                          </option>
                          <option value="In Active">
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
                    {/* color */}
                    {attribute?.map((a, index) => {
                      return (
                        <div className="row w-100" key={index}>
                          {/* Color */}
                          <div className="col-md-5">
                            <div className="form-group">
                              <label>Product Color</label>
                              <span className="text-danger">*</span>
                              {/* <Field
                              className={`form-control ${touched.productKey && errors.productKey
                                ? "is-invalid"
                                : ""
                                }`}
                              name="productKey"
                              placeholder="Product Key"
                              type="text"
                              value={variant.productKey}
                              onChange={(e) => handleVariantChange(e, index)}
                              onInput={(e) => {
                                e.target.value.includes("-")
                                  ? (toast.error(
                                    "😢 " + "please enter positive value",
                                    {
                                      position: toast.POSITION.TOP_RIGHT,
                                      autoClose: 1000,
                                    }
                                  ),
                                    (e.target.value = ""))
                                  : e.target.value;
                                e.target.value.length > 100
                                  ? (toast.error(
                                    "😢 " +
                                    "please enter less than 100 character",
                                    {
                                      position: toast.POSITION.TOP_RIGHT,
                                      autoClose: 1000,
                                    }
                                  ),
                                    (e.target.value = ""))
                                  : e.target.value;
                              }}
                            
                            /> */}
                              <div className="btn-group w-100">
                                <button
                                  type="button"
                                  name="color"
                                  className="btn btn-primary dropdown-toggle px-lg-5"
                                  data-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                >
                                  {a.color ? a.color : "Select color"}
                                </button>
                                <div
                                  className="dropdown-menu"
                                  style={{ height: "30vh", overflowY: "scroll" }}
                                >
                                  {colorAll?.map((c, ind) => {
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
                                          <p
                                            onClick={(e) => clickChnage(e, index)}
                                          >
                                            {c.name}
                                          </p>
                                        </div>
                                      </>
                                    );
                                  })}
                                </div>
                              </div>
                              <ErrorMessage
                                component="div"
                                name="productKey"
                                className="invalid-feedback"
                              />
                            </div>
                          </div>
                          {/* Size */}
                          {/* Size Select */}
                          <div className="col-md-3">
                            <div className="form-group">
                              <label>Size</label>
                              <span className="text-danger">*</span>
                              {/* <Field
                                className={`form-control ${touched.size && errors.size
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                name="size"
                                placeholder="Size"
                                type="text"
                                value={a.size}
                                onChange={(e) => {
                                  handleAttributeChange(e, index);
                                  setData((prev) => ({
                                    ...prev,
                                    [e.target.name]:
                                      e.target.value,
                                  }));
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

                              </Field> */}
                              <select
                                name="size"
                                id="size"
                                onChange={(e) => { handleAttributeChange(e, index); }}
                                disabled={sizeList === undefined && true}
                                className={`form-control ${touched.size && errors.size
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                aria-label="Default select example"
                              >
                                <option value={`${a.size ? a.size : "Select Size"}`}>{a.size ? a.size : "Select Size"}</option>
                                {sizeList?.map((val, ind) => {
                                  return (
                                    <>
                                      <option value={val}>{val}</option>
                                    </>
                                  );
                                })}
                              </select>
                              <ErrorMessage
                                component="div"
                                name="size"
                                className="invalid-feedback"
                              />
                            </div>
                          </div>
                          {/* Quantity */}
                          <div className="col-md-2">
                            <div className="form-group">
                              <label>Quantity</label>
                              <span className="text-danger">*</span>
                              <Field
                                className={`form-control ${touched.qty && errors.qty
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                name="qty"
                                placeholder="Quantity"
                                type="number"
                                value={a.qty}
                                onChange={(e) => handleAttributeChange(e, index)}
                                // onInput={(e) => {
                                //   e.target.value.includes("-")
                                //     ? (toast.error(
                                //       "😢 " + "please enter positive value",
                                //       {
                                //         position: toast.POSITION.TOP_RIGHT,
                                //         autoClose: 1000,
                                //       }
                                //     ),
                                //       (e.target.value = ""))
                                //     : e.target.value;
                                //   e.target.value.length > 100
                                //     ? (toast.error(
                                //       "😢 " +
                                //       "please enter less than 100 character",
                                //       {
                                //         position: toast.POSITION.TOP_RIGHT,
                                //         autoClose: 1000,
                                //       }
                                //     ),
                                //       (e.target.value = ""))
                                //     : e.target.value;
                                // }}
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
                              // onBlur={handleBlur}
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
                                style={{
                                  marginTop: "29px",
                                }}
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
                          )}
                          {attribute.length - 1 === index && (
                            <div className="col-md-1">
                              <div
                                className="d-flex flex-wrap justify-content-center align-items-center"
                                style={{
                                  marginTop: "29px",
                                }}
                              >
                                <button
                                  className="btn btn-primary mt-3 mt-sm-0"
                                  type="button"
                                  disabled={
                                    sizeList === undefined ?
                                      attribute.some(
                                        (x) => x.color === "" || x.qty === ""
                                      ) :
                                      attribute.some(
                                        (x) => x.color === "" || x.size === "" || x.qty === ""
                                      )
                                  }
                                  // ref={addButtonRef}
                                  // disabled={addDisabled}
                                  onClick={onAddAttribute}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {/* Old Color */}
                    {/* <div className="col-md-6">
                      <div className="form-group">
                        <label>Product Color</label>
                        <span className="text-danger">
                          *
                        </span>
                        <br /> */}
                    {/* <Field
                                                className={`form-control`}
                                                name="color"
                                                as="select"
                                                defaultValue="Select Color"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    handleColorChange(e);
                                                }}
                                            >
                                                {colorAll.map((c) => (
                                                    <option value={c.name} key={c.id} style={{backgroundColor:c.code}}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </Field> */}
                    {/* <div className="btn-group w-100">
                          <button
                            type="button"
                            className="btn btn-primary dropdown-toggle px-lg-5 my-lg-2"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            Select color
                          </button>

                          <div
                            className="dropdown-menu"
                            style={{ height: "30vh", overflowY: "scroll" }}
                          >
                            {colorAll.map((c, i) => {
                              return (
                                <>
                                  <div
                                    className="dropdown-item d-flex"
                                    href="#"
                                    key={i}
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
                                    <p
                                      onClick={clickChnage}
                                      style={{ cursor: "pointer" }}
                                    >
                                      {c.name}
                                    </p>
                                  </div>
                                </>
                              );
                            })}
                          </div>
                        </div>
                        {colorList.length > 0 && (
                          <div className="d-flex flex-wrap flex-row m-1">
                            {colorList.map((c, i) => {
                              return (
                                <>
                                  <div
                                    className="p-2 mx-1 rounded-circle position-relative"
                                    style={{
                                      background: `${c}`,
                                      height: "50px",
                                      width: "50px",
                                    }}
                                    key={i}
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
                                </>
                              );
                            })}
                          </div>
                        )}
                      </div> */}

                    {/* <ColorPicker /> */}
                    {/* <div>
                                            <input
                                                type="color"
                                                onChange={(e) => {
                                                    InputColor(e);
                                                }}
                                            />
                                        </div>
                                        <div className="row">
                                            {color.map((c) => {
                                                return (
                                                    <div className="col-md-3 mb-1">
                                                        <div
                                                            style={{
                                                                background: c,
                                                                height: "30px",
                                                                width: "100%",
                                                            }}
                                                        ></div>
                                                    </div>
                                                );
                                            })}
                                        </div> */}
                    {/* </div> */}

                    {/* Stock */}
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Stock</label>
                        <span className="text-danger" title="Value Should be grater than 0">*</span>
                        <Field
                          className={`form-control ${touched.stock && errors.stock ? "is-invalid" : ""
                            }`}
                          name="stock"
                          value={data.stock ? data.stock : 0}
                          placeholder="Number of Quantity"
                          type="text"
                          onChange={(e) => {
                            handleChange(e);
                            inputChange(e);
                          }}
                          onKeyDown={(e) =>
                            (e.keyCode === 69 || e.keyCode === 190) &&
                            e.preventDefault()
                          }
                          // onInput={(e) => {
                          //   e.target.value.includes("-")
                          //     ? (alert("Please Enter Valid Value"),
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
                        <span className="text-danger" title="Value Should be grater than 0">*</span>
                        <Field
                          className={`form-control ${touched.minOrderValue &&
                            errors.minOrderValue
                            ? "is-invalid"
                            : ""
                            }`}
                          name="minOrderValue"
                          placeholder="Minimum Order Value"
                          type="number"
                          min={1}
                          max={5}
                          onChange={(e) => {
                            handleChange(e);
                            inputChange(e);
                          }}
                          onKeyDown={(e) =>
                            (e.keyCode === 69 ||
                              e.keyCode === 190) &&
                            e.preventDefault()
                          }
                          onInput={(e) => {
                            e.target.value.includes("-") ? 
                            (toast.error("😢 " + "Please Enter Positive Value", {
                              position: toast.POSITION.TOP_RIGHT,
                              autoClose: 1000,
                            }),
                              (e.target.value = 0))
                              : e.target.value; checkamount(e)
                          }}
                        />
                        <ErrorMessage
                          component="div"
                          name="minOrderValue"
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
                          className={`form-control ${touched.maxOrderValue &&
                            errors.maxOrderValue
                            ? "is-invalid"
                            : ""
                            }`}
                          min={1}
                          max={5}
                          name="maxOrderValue"
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
                          onInput={(e) => {
                            e.target.value.includes("-") ? (toast.error("😢 " + "Please Enter Positive Value", {
                              position: toast.POSITION.TOP_RIGHT,
                              autoClose: 1000,
                            }),
                              (e.target.value = 0))
                            : e.target.value; checkamount(e)
                          }}
                        />
                        <ErrorMessage
                          component="div"
                          name="maxOrderValue"
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
                      <div className="pt-2 text-danger" >
                        <p>{buttonMsg}</p>
                      </div>
                    </div>

                    {/* Color Field now Required But optional */}
                    {/* <div className="col-md-6">
                      <div className="form-group">
                        <label>Color</label>
                        <span
                          className="text-danger"
                          title="Value Should be grater than Or equal to 0"
                        >
                          *
                        </span>
                        <Field
                          className={`form-control`}
                          name="color"
                          as="select"
                          onChange={(e) => {
                            handleChange(e);
                           
                          }}
                        >
                          <option value="" selected disabled>
                            Select color
                          </option>
                          <option value="Red">
                            Red
                          </option>
                          <option value="Green">
                           Green
                          </option>
                          <option value="Blue">
                           Blue
                          </option>
                        </Field>
                      </div>
                    </div> */}

                    {/* Description */}
                    <div className="col-md-12 my-3">
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
                        <span className="text-danger error">
                          {errorDesc.description}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* )} */}
                  <hr className="my-3" />
                  <div className="h4 text-left ">Product Variants :-</div>
                  <hr className="my-3" />
                  {/* {currentStep == 3 && ( */}
                  {/* <StepThree
                                    touched={touched}
                                    errors={errors}
                                    setData={setData}
                                    data={data}
                                    // data={{
                                    //     ...data,
                                    //     productDetail: JSON.parse(
                                    //         JSON.stringify(
                                    //             data.productDetail
                                    //         )
                                    //     ),
                                    // }}
                                    setAllowNextStep={setAllowNextStep}
                                /> */}
                  {/* )} */}
                  {variants?.map((variant, index) => {
                    return (
                      <div className="row w-100" key={index}>
                        {/* product Key */}
                        <div className="col-md-5">
                          <div className="form-group">
                            <label>Key</label>
                            <span className="text-danger">*</span>
                            <Field
                              className={`form-control ${touched.productKey && errors.productKey
                                ? "is-invalid"
                                : ""
                                }`}
                              name="productKey"
                              placeholder="Product Key"
                              type="text"
                              value={variant.productKey}
                              onChange={(e) => handleVariantChange(e, index)}
                              onInput={(e) => {
                                e.target.value.includes("-")
                                  ? (toast.error(
                                    "😢 " + "please enter positive value",
                                    {
                                      position: toast.POSITION.TOP_RIGHT,
                                      autoClose: 1000,
                                    }
                                  ),
                                    (e.target.value = ""))
                                  : e.target.value;
                                e.target.value.length > 100
                                  ? (toast.error(
                                    "😢 " +
                                    "please enter less than 100 character",
                                    {
                                      position: toast.POSITION.TOP_RIGHT,
                                      autoClose: 1000,
                                    }
                                  ),
                                    (e.target.value = ""))
                                  : e.target.value;
                              }}
                            // onBlur={handleBlur}
                            />
                            <ErrorMessage
                              component="div"
                              name="productKey"
                              className="invalid-feedback"
                            />
                          </div>
                        </div>
                        {/* Product Value */}
                        <div className="col-md-5">
                          <div className="form-group">
                            <label>Product Value</label>
                            <span className="text-danger">*</span>
                            <Field
                              className={`form-control ${touched.productValue && errors.productValue
                                ? "is-invalid"
                                : ""
                                }`}
                              name="productValue"
                              placeholder="Product Value"
                              type="text"
                              value={variant.productValue}
                              onChange={(e) => handleVariantChange(e, index)}
                              onInput={(e) => {
                                e.target.value.includes("-")
                                  ? (toast.error(
                                    "😢 " + "please enter positive value",
                                    {
                                      position: toast.POSITION.TOP_RIGHT,
                                      autoClose: 1000,
                                    }
                                  ),
                                    (e.target.value = ""))
                                  : e.target.value;
                                e.target.value.length > 100
                                  ? (toast.error(
                                    "😢 " +
                                    "please enter less than 100 character",
                                    {
                                      position: toast.POSITION.TOP_RIGHT,
                                      autoClose: 1000,
                                    }
                                  ),
                                    (e.target.value = ""))
                                  : e.target.value;
                              }}
                            // onBlur={handleBlur}
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
                              style={{
                                marginTop: "29px",
                              }}
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
                              style={{
                                marginTop: "29px",
                              }}
                            >
                              <button
                                className="btn btn-primary mt-3 mt-sm-0"
                                type="button"
                                // ref={addButtonRef}
                                // disabled={addDisabled}
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
                  <hr className="my-3" />
                  <div className="h4 text-left">Additional Details :-</div>
                  <hr className="my-3" />
                  {/* {currentStep == 4 && ( */}
                  {/* <StepFour
                                    values={values}
                                    isValid={isValid}
                                    setData={setData}
                                    data={data}
                                    loading={loading}
                                    setLoading={setLoading}
                                    btnRef={btnRef}
                                    btnName="Edit Product"
                                /> */}
                  {/* )} */}
                  {/* Additional Details */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Local Delivery Charge</label>
                        <input
                          className="form-control"
                          name="localDeliveryCharge"
                          placeholder="Local Delivery Charge"
                          type="text"
                          value={data.additionalDetail?.localDeliveryCharge}
                          onChange={(e) => {
                            handleAdditionalDetailChange(e);
                          }}
                          onKeyDown={(e) =>
                            (e.keyCode === 69 || e.keyCode === 190) &&
                            e.preventDefault()
                          }
                          onInput={(e) => {
                            e.target.value.includes("-")
                              ? (toast.error(
                                "😢 " + "Please enter positive value",
                                {
                                  position: toast.POSITION.TOP_RIGHT,
                                  autoClose: 1000,
                                }
                              ),
                                (e.target.value = ""))
                              : e.target.value;
                            checkamount(e);
                          }}
                        />
                      </div>
                    </div>
                    {/* zonal Delivery Charge*/}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Zonal Delivery Charge</label>
                        <Field
                          className={`form-control ${touched.zonalDeliveryCharge &&
                            errors.zonalDeliveryCharge
                            ? "is-invalid"
                            : ""
                            }`}
                          name="zonalDeliveryCharge"
                          placeholder="Zonal Delivery Charge"
                          type="text"
                          value={data.additionalDetail?.zonalDeliveryCharge}
                          onChange={(e) => {
                            handleAdditionalDetailChange(e);
                          }}
                          onKeyDown={(e) =>
                            (e.keyCode === 69 || e.keyCode === 190) &&
                            e.preventDefault()
                          }
                          onInput={(e) => {
                            e.target.value.includes("-")
                              ? (toast.error(
                                "😢 " + "Please enter positive value",
                                {
                                  position: toast.POSITION.TOP_RIGHT,
                                  autoClose: 1000,
                                }
                              ),
                                (e.target.value = ""))
                              : e.target.value;
                            checkamount(e);
                          }}
                        />
                      </div>
                    </div>

                    {/* country of Origin */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Country of Origin</label>
                        <Field
                          className="form-control"
                          name="countryOfOrigin"
                          placeholder="Country Name"
                          type="text"
                          value={data.additionalDetail?.countryOfOrigin}
                          onChange={(e) => {
                            handleAdditionalDetailChange(e);
                          }}
                          onInput={(e) => {
                            checkamount(e);
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
                          value={data.additionalDetail?.packerDetails}
                          onChange={(e) => {
                            handleAdditionalDetailChange(e);
                          }}
                          onInput={(e) => {
                            checkamount(e);
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
                          value={data.additionalDetail?.manufacturerDetails}
                          onChange={(e) => {
                            handleAdditionalDetailChange(e);
                          }}
                          onInput={(e) => {
                            checkamount(e);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="mt-2 mb-3" />
                  <div>{isValid}</div>
                  <div className="col-12">
                    {/* <hr className="mt-2 mb-3" /> */}
                    <div className="d-flex flex-wrap justify-content-end align-items-center">
                      <button
                        className="next btn btn-primary mt-3 mt-sm-0"
                        type="submit"
                        // name="submit"
                        ref={btnRef}
                        // disabled={allowNextStep}
                        disabled={allowNextStep}
                      >
                        Update Product
                        {loading && <Spinner />}
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </section>
      </>
    ) : (
      // <Spinner/>
      <Loader />
    )
  )
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

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVendorProduct: (token) => dispatch(fetchVendorProduct(token)),
  };
};

export default withAuth(connect(null, mapDispatchToProps)(editProduct));
