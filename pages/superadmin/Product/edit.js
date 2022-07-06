import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useRouter } from "next/router";
import withAuth from '../../../component/withAuth';
import Spinner from '../../../component/Spinner';
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { getSession } from "next-auth/client";
import Select from "react-select";
import BackButton from "../../../component/BackButton";
import { FaImage } from "react-icons/fa";
import AdminContentHeading from "../../../component/AdminContentHeading";
import { FaHome } from 'react-icons/fa'
import dynamic from "next/dynamic";
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import { update } from 'lodash';
import Loader from '../../../component/Loader';
import Head from "next/head"

const RichEditor = dynamic(() => import("../../../component/RichEditor"), {
  ssr: false,
});
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

toast.configure();

const edit = () => {

  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [colorError, setColorError] = useState("");
  const [photoError, setPhotoError] = useState("")
  const [errorDesc, setErrorDesc] = useState({ description: "" });
  const [brand, setBrand] = useState([]);
  const [mainCate, setMainCate] = useState([]);
  const [subCate, setSubCate] = useState([]);
  const [getSubCate, setGetCate] = useState([]);
  const router = useRouter();
  const btnRef = useRef();
  const [loading, setLoading] = useState(false);
  const [cateV, setCateV] = useState(null);
  const [brandV, setBrandV] = useState(null);
  const [mainLoader, setMainLoader] = useState(false);
  const [checkedS, setCheckedS] = useState(false);
  const [checkedM, setCheckedM] = useState(false);
  const [checkedL, setCheckedL] = useState(false);
  const [checkedXL, setCheckedXL] = useState(false);
  const [checkedXXL, setCheckedXXL] = useState(false);

  const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }

  const handleChangeStatus = (
    { meta, file }, status) => {
    console.log(file)
  }

  const handleSubmit = (files, allFiles) => {
    allFiles.forEach(f => f.remove())
    setData((prev) => ({ ...prev, photo: files.map(f => f.file) }));
  }

  useEffect(async () => {

    // Main Api get of single product
    setMainLoader(true);
    const productEditId = localStorage.getItem("productEditId");
    await axios
      .get(`${process.env.HOST}/product/${productEditId}`)
      .then((res) => {
        setMainLoader(false)
        // console.log("RData", res.data.data)
        setData(res.data.data);
        const checkS = res.data.data.size.filter(f => f === "S")
        if (checkS.length !== 0) {
          setCheckedS(true)
        }
        else if (checkS.length === 0) {
          setCheckedS(false)
        }

        const checkM = res.data.data.size.filter(f => f === "M")
        if (checkM.length !== 0) {
          setCheckedM(true)
        }
        else if (checkM.length === 0) {
          setCheckedM(false)
        }

        const checkL = res.data.data.size.filter(f => f === "L")
        if (checkL.length !== 0) {
          setCheckedL(true)
        }
        else if (checkL.length === 0) {
          setCheckedL(false)
        }

        const checkXL = res.data.data.size.filter(f => f === "XL")
        if (checkXL.length !== 0) {
          setCheckedXL(true)
        }
        else if (checkXL.length === 0) {
          setCheckedXL(false)
        }

        const checkXXL = res.data.data.size.filter(f => f === "XXL")
        if (checkXXL.length !== 0) {
          setCheckedXXL(true)
        }
        else if (checkXXL.length === 0) {
          setCheckedXXL(false)
        }

        setCateV({
          value: res.data.data.cId,
          label: res.data.data.catName,
        });
        setBrandV({
          value: res.data.data.brand,
          label: res.data.data.brand,
        });
      })
      .catch((err) => {
        setMainLoader(false);
        toast.error("😢 " + err.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        if (err.response.status === 404) {
          setMainLoader(false);
        }
      });


    // Main Categories Get API
    await axios
      .get(`${process.env.HOST}/category/root`)
      .then((res) => {
        setMainCate(res.data.data);
      })
      .catch((err) => {
        toast.error("😢 " + err.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });

    // Brand Get Api
    await axios
      .get(`${process.env.HOST}/brand`)
      .then((res) => {
        // console.log(res.data.data);
        setBrand(res.data.data);
      })
      .catch((err) => {
        toast.error("😢 " + err.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose:1000,
        });
      });
  }, []);

  const handleSize = (event) => {
    let newArray = [...size, event.target.value];
    if (size.includes(event.target.value)) {
      newArray = newArray.filter((p) => p !== event.target.value);
    }
    setSize(newArray);
    setData((prev) => ({ ...prev, size: newArray }));
  }

  const InputColor = (e) => {
    let newArray = [...color, e.target.value];
    if (color.includes(e.target.value)) {
      newArray = newArray.filter((p) => p !== e.target.value);
    }
    setColor(newArray);
    setData((prev) => ({ ...prev, color: newArray }));
    if (e.target.value === "") {
      setColorError("Product Color field is required.")
    }
    else {
      setColorError("")
    }
  }

  const fileSelect = (e) => {
    if (e.target.files.length !== 0) {
      if (
        e.target.files[0].type === "image/jpeg" ||
        e.target.files[0].type === "image/jpg" ||
        e.target.files[0].type === "image/png"
      ) {
        if (e.target.files[0].size <= 1000000) {
          setData((prev) => ({ ...prev, photo: e.target.files[0] }));
          setFileName(e.target.files[0].name);
          setPhotoError("");
          const file = URL.createObjectURL(e.target.files[0]);
          setUrl(file);
        } else {
          setPhotoError("Only 1 MB size photo is accepted");
          setFileName("Photo");
          setData((prev) => ({ ...prev, photo: "" }));
          setUrl("/avtar/no-image.png");
        }
      } else {
        setPhotoError("Only jpg,png accepted");
        setFileName("Photo");
        setData((prev) => ({ ...prev, photo: "" }));
        setUrl("/avtar/no-image.png");
      }
    } else {
      setPhotoError("Photo is Required");
      setData((prev) => ({ ...prev, photo: "" }));
      setFileName("Photo");
      setUrl("/avtar/no-image.png");
    }
  };

  const spaceValidation = new RegExp(
    "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
  );

  const inputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const ProductSchema = Yup.object().shape({
    productName: Yup.string()
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the end are not allowed"
      )
      .required("Product Name is required"),
    quantity: Yup.string()
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the end are not allowed"
      )
      .required("Product Quantity is required"),
    price: Yup.string()
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the end are not allowed"
      )
      .required("Product Size is required"),
  });
  const customStyles = {
    control: (styles) => ({
      ...styles,
      borderRadius: "5px",
      "&:hover": { cursor: "pointer" },
    }),
    placeholder: (styles) => ({
      ...styles,
    }),
    indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
    menu: (styles) => ({
      ...styles,
      position: "absolute",
      top: "30px",
    }),
  };

  const [data, setData] = useState({
    productName: "",
    description: "",
    photo: [],
    price: "",
    quantity: "",
    cId: "",
    brand: "",
    color: [],
    size: []
  });

  const handleParentIdChange = async (e) => {
    setCateV(e)
    setData((prev) => ({ ...prev, cId: e.value }));
    const session = await getSession();
    await axios
      .get(`${process.env.HOST}/category/sub/${e.value}`, {
        headers: {
          Authorization: session.accessToken,
        },
      })
      .then((res) => {
        // console.log("Rdata", res.data.data)
        toast.info("🎉 Please choose category from select sub category if you want!!!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          transition:Flip
        });
        if (res.data.length !== 0) {
          setGetCate((oldArray) => [...oldArray, ""])
          setSubCate(res.data.data);
        }
        else if (res.status !== 200) {
          setSubCate([]);
        }
      })
      .catch((err) => {
        toast.error("😢 " + err.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        if (err.response.data.message === "subCategory Not Found") {
          setSubCate([]);
          // console.log("first", subCate)
          setGetCate([]);
          if (subCate.length != 0) {
            setCateV({
              value: subCate[0].id,
              label: subCate[0].name,
            });
          }
          else {
            setCateV(e)
          }
        }
      });
  }

  const updateProduct = () => {
  }

  return <Main>
    <Head>
      <title>Vaistra Ecommerce | Edit Product</title>
    </Head>
    <AdminContentHeading
      heading={
        <a href="/superadmin/dashboard">
          <FaHome />
        </a>
      }
      subheading=" / <a href='/superadmin/Product'>Product Lists</a> / <a href='/superadmin/Product/add'>Add</a> / Edit"
    />
    {
      mainLoader ? (
        <Loader />
      ) : <div className="container">
        <div className="row" style={{ marginTop: `90px` }}>
          {JSON.stringify(data)}
          <div className="form-design">
            <h4 className="mb-5 text-center">Update Product</h4>
            <div className=" px-3 d-flex justify-content-end">
              <BackButton />
            </div>
            <Formik
              enableReinitialize={true}
              initialValues={{
                productName: data.productName,
                quantity: data.quantity,
                price: data.price,
              }}
              validationSchema={ProductSchema}
              onSubmit={updateProduct}
            >
              {({ touched, errors, isValid, values, handleChange }) => (
                <Form className="needs-validation" autoComplete="off">
                  <div className="row">
                    {
                      getSubCate.length === 0 ?
                        <div className="col-md-6 mb-2">
                          <div className="form-group">
                            <label htmlFor="account-fn">Select Category</label><span className='text-danger'>*</span>
                            <Select
                              className="react-select"
                              classNamePrefix="react-select"
                              styles={customStyles}
                              placeholder="Select Category"
                              id="long-value-select"
                              instanceId="long-value-select"
                              value={cateV}
                              options={mainCate.map((m) => ({ value: m.id, label: m.name }))}
                              key={mainCate.map((m) => m.id)}
                              onChange={(e) => handleParentIdChange(e)}
                              menuShouldBlockScroll={true}
                            />
                          </div>
                        </div> : <div className="col-md-3 mb-2">
                          <div className="form-group">
                            <label htmlFor="account-fn">Select Category</label><span className='text-danger'>*</span>
                            <Select
                              className="react-select"
                              classNamePrefix="react-select"
                              styles={customStyles}
                              placeholder="Select Category"
                              id="long-value-select"
                              instanceId="long-value-select"
                              value={cateV}
                              options={mainCate.map((m) => ({ value: m.id, label: m.name }))}
                              onChange={(e) => handleParentIdChange(e)}
                              menuShouldBlockScroll={true}
                            />
                          </div>
                        </div>
                    }

                    {
                      getSubCate.length !== 0 ? <div className="col-md-3 mb-3">
                        {
                          getSubCate.map((g, i) => (
                            i === 0 ?
                              <div className="form-group">
                                <label htmlFor="account-fn">Select Sub Category</label>
                                <Select
                                  className="react-select"
                                  classNamePrefix="react-select"
                                  styles={customStyles}
                                  placeholder="Select Sub Category"
                                  id="long-value-select"
                                  instanceId="long-value-select"
                                  options={subCate.map((s) => ({ value: s.id, label: s.name }))}
                                  key={subCate.map((s) => s.id)}
                                  onChange={(e) => handleParentIdChange(e)}
                                  menuShouldBlockScroll={true}
                                /> </div> : ""
                          ))
                        }
                      </div> : ""
                    }

                    <div className="col-md-6 mb-2">
                      <div className="form-group">
                        <label htmlFor="account-fn">Select Brand</label><span className='text-danger'>*</span>
                        <Select
                          className="react-select"
                          classNamePrefix="react-select"
                          styles={customStyles}
                          placeholder="Select Brand"
                          id="long-value-select"
                          instanceId="long-value-select"
                          value={brandV}
                          options={brand.map((y) => ({ value: y.name, label: y.name }))}
                          key={brand.map((y) => y.id)}
                          onChange={(e) => {
                            setBrandV(e)
                            setData((prev) => ({
                              ...prev,
                              brand: e.value,
                            }));
                          }}
                          menuShouldBlockScroll={true}
                        />
                      </div>
                    </div>

                    <div className='col-md-4 mb-2'>
                      <div className='form-group'>
                        <label htmlFor="account-fn">Product Name</label><span className='text-danger'>*</span>
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

                    <div className='col-md-4 mb-2'>
                      <div className='form-group margin-bottom-8px'>
                        <label htmlFor="account-fn">Product Size</label><span className='text-danger'>*</span>
                      </div>

                      <div className="form-check form-check-inline ml-1">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="S"
                          value="S"
                          onChange={(e) => {
                            handleSize(e);
                            setCheckedS(!checkedS)
                          }}
                          checked={checkedS}
                        />
                        <label className="form-check-label" htmlFor="S">
                          S
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="M"
                          value="M"
                          checked={checkedM}
                          onChange={(e) => {
                            handleSize(e);
                            setCheckedM(!checkedM)
                          }}
                        />
                        <label className="form-check-label" htmlFor="M">
                          M
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="L"
                          value="L"
                          checked={checkedL}
                          onChange={(e) => {
                            handleSize(e);
                            setCheckedL(!checkedL)
                          }}
                        />
                        <label className="form-check-label" htmlFor="L">
                          L
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="XL"
                          value="XL"
                          checked={checkedXL}
                          onChange={(e) => {
                            handleSize(e);
                            setCheckedXL(!checkedXL)
                          }}
                        />
                        <label className="form-check-label" htmlFor="XL">
                          XL
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="XXL"
                          value="XXL"
                          checked={checkedXXL}
                          onChange={(e) => {
                            handleSize(e);
                            setCheckedXXL(!checkedXXL)
                          }}
                        />
                        <label className="form-check-label" htmlFor="XXL">
                          XXL
                        </label>
                      </div>
                    </div>

                    <div className='col-md-4 mb-2'>
                      <div className="form-group">
                        <label htmlFor="account-fn">No. Of Quantity</label><span className='text-danger'>*</span>
                        <Field
                          className={`form-control ${touched.quantity && errors.quantity ? "is-invalid" : ""
                            }`}
                          name="quantity"
                          placeholder="Number of Quantity"
                          type="number"
                          onChange={(e) => {
                            handleChange(e);
                            inputChange(e);
                          }}
                          onKeyDown={(e) =>
                            (e.keyCode === 69 || e.keyCode === 190) &&
                            e.preventDefault()
                          }
                        />
                        <ErrorMessage
                          component="div"
                          name="quantity"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Product Price</label><span className="text-danger">*</span>
                        <Field
                          className={`form-control ${touched.price && errors.price ? "is-invalid" : ""
                            }`}
                          name="price"
                          placeholder="Price of Product"
                          type="number"
                          onChange={(e) => {
                            handleChange(e);
                            inputChange(e);
                          }}
                          onKeyDown={(e) =>
                            (e.keyCode === 69 || e.keyCode === 190) &&
                            e.preventDefault()
                          }
                        />
                        <ErrorMessage
                          component="div"
                          name="price"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Product Color</label><span className="text-danger">*</span>
                        <input type="color" onChange={e => { InputColor(e) }} />
                        {colorError !== "" && (
                          <span className="text-danger error">
                            {colorError}
                          </span>
                        )}
                        <div className="row">
                          {
                            color.map((c,i) => {
                              return (

                             <>
                             <div className="col-md-3 mb-1" key={i}>
                                  <div style={{ background:c, height: "30px", width: "100%" }}></div>
                                </div>
                             </>

                              )
                            })
                          }
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Photo</label><span className="text-danger">*</span>
                        <Dropzone
                          getUploadParams={getUploadParams}
                          onChangeStatus={handleChangeStatus}
                          onSubmit={handleSubmit}
                          accept="image/*"
                          maxFiles={3}
                          inputContent={(files, extra) => (extra.reject ? 'Only Image is allowed' : 'Select and Drop Multiple Files')}
                          styles={{
                            dropzoneReject: { borderColor: '#F19373', backgroundColor: '#F1BDAB' },
                            inputLabel: (files, extra) => (extra.reject ? { color: '#A02800' } : {}),
                          }}
                        />
                        {photoError !== "" && (
                          <span className="text-danger error">
                            {photoError}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Product Description</label><span className="text-danger">*</span>
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

                    <div className="col-md-12">
                      <button
                        className="btn btn-primary mt-3 mt-sm-0"
                        type="submit"
                        disabled={
                          !Object.values(values).every(
                            (x) => x !== null && x !== ""
                          ) ||
                          !isValid ||
                          data.cId === "" ||
                          data.brand === "" ||
                          data.size.length === 0 ||
                          data.description === "<p><br></p>" ||
                          data.description === "" ||
                          data.photo.length === 0 ||
                          data.color.length === 0
                        }
                        ref={btnRef}
                      >
                        Update product
                        {loading && (
                          <Spinner />
                        )}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    }

  </Main>
};

const Main = styled.div`
    margin-top: 20px;
    .margin-bottom-8px{
      margin-bottom: 8px !important;
    }
`;
export default withAuth(edit);
