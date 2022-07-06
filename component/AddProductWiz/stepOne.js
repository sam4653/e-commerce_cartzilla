import axios from "axios";
import React, { useState } from "react";
import Select from "react-select";
import { getSession } from "next-auth/client";
import { Button, Modal } from "react-bootstrap";
import Portal from "../Portal";
import Spinner from "../Spinner";
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const stepOne = ({
  customStyles,
  cateV,
  subCateV,
  setSubCateV,
  handleSecLevel,
  setCateSec,
  setCateSecV,
  cateSecV,
  cateSec,
  MainCate,
  handleParentIdChange,
  handleSubCategoryChange,
  subCate,
  brand,
  brandV,
  setBrandV,
  setAllowNextStep,
  setData,
  data,
}) => {
  // console.log("first", data);
  // console.log("data",data);
  setAllowNextStep(
    data.cId === "" || data.scId === "" || data.sscId === ""  || data.brand === "" ? true : false
  );

  const [brandname, setBrandname] = useState("");
  const [loading, setLoading] = useState(false);
  const addnewbrand = async () => {
    const sess = await getSession();
    // console.log(sess);
    await axios
      .post(
        `${process.env.HOST}/brand`,
        {
          name: brandname,
          category_id: data.cId,
          subcategory_id: data.scId,
        },
        {
          headers: { Authorization: sess.accessToken },
        }
      )
      .then((res) => {
        // console.log("res", res);
        toast.info("😊" + res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          transition: Flip,
        });
        setShow(false);
        setBrandname("");
        data.brand = "";
        setAllowNextStep(
          data.cId === "" || data.scId === "" || data.sscId === ""  || data.brand === "" ? true : false
        );
       
      })
      .catch(function (error) {
        console.log(error);
        toast.error("😢 " + error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        setShow(false);
        setBrandname("")
      });
  };
  const [show, setShow] = useState(false);
  const handleClose = () => {
       setShow(false);
        // setAllowNextStep(
        //   data.cId === "" || data.scId === "" || data.sscId === ""  || data.brand === "" ? true : false)
     }
  

   const  handlecheck=(e)=>{
   
   }

  return (
    <>
      <Portal>
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add New Brand :</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-12 mb-md-3 d-flex justify-content-center align-content-center flex-column">
                <label className="h6 py-md-2">Enter Brand Name</label>

                <input
                  type="text"
                  className="form-control"
                  value={brandname}
                  name="name"
                  placeholder="Enter Brand Name"
                  onChange={(e) => {
                    setBrandV(e);
                   
                    setBrandname(e.target.value);
                  }}
                />
                {/*  setData((prev) => ({ ...prev,brand: e.target.value})) */}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={addnewbrand}>
              {loading ? <Spinner /> : "Submit"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Portal>
      <div className="row">
        <div className="clo-md-6 mb-lg-3 pl-4" style={{ minWidth: "50%" }}>
          <label className="h6 py-lg-2">Select Category Name</label>
        </div>
        <div className="col-md-6 mb-lg-3 " style={{ minWidth: "50%" }}>
          <Select
            className="react-select text-capitalize"
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
            onChange={(e) => handleSecLevel(e)}
            menuShouldBlockScroll={true}
          />
        </div>
      </div>
      {/* 2 */}
      <div className="row py-2 py-lg-0 ">
        <div className="clo-md-6 mb-lg-3 pl-4" style={{ minWidth: "50%" }}>
          <label className="h6 py-lg-2">Select sub Category Name</label>
        </div>
        <div className="col-md-6 mb-lg-3" style={{ minWidth: "50%" }}>
          <Select
            className="react-select text-capitalize"
            classNamePrefix="react-select"
            styles={customStyles}
            value={cateSecV}
            placeholder="Select Sub Category"
            id="long-value-select"
            instanceId="long-value-select"
            options={cateSec.map((s) => ({
              value: s.id,
              label: s.name,
            }))}
            key={cateSec.map((s) => s.id)}
            onChange={(e) => {
              setCateSecV(e);
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
      </div>

      {/* 3 {getSubCate?.length > 0 && ( */}
      <div className="row py-2 py-lg-0 ">
        <div className="clo-md-6 mb-lg-3 pl-4" style={{ minWidth: "50%" }}>
          <label className="h6 py-lg-2">Select level three Sub-Category Name</label>
        </div>
        <div className="col-md-6 mb-lg-3" style={{ minWidth: "50%" }}>
          <Select
            className="react-select text-capitalize"
            classNamePrefix="react-select"
            styles={customStyles}
            value={subCateV}
            placeholder="Select Sub Category"
            id="long-value-select"
            instanceId="long-value-select"
            options={subCate.map((s) => ({
              value: s.id,
              label: s.name,
            }))}
            key={subCate.map((s) => s.id)}
            onChange={(e) => {
              setSubCateV(e);
              handleSubCategoryChange(e);
              // setData((prev) => ({
              //     ...prev,
              //     scId: e.value,
              //     scName: e.label,
              // }));
            }}
            menuShouldBlockScroll={true}
          />
        </div>
      </div>
      {/* )} */}
      {/* 4 */}
      <div className="row py-2 py-lg-0">
        <div className="col-md-6 mb-lg-3 pl-4" style={{ minWidth: "50%" }}>
          <label className="h6 py-lg-2">Select Brand</label>
        </div>
        <div className="col-md-6 mb-lg-3" style={{ minWidth: "50%" }}>
          <Select
            className="react-select text-capitalize"
            classNamePrefix="react-select"
            styles={customStyles}
            placeholder="Select Brand"
            value={brandV}
            defaultValue="Select Brand"
            id="long-value-select"
            instanceId="long-value-select"
            options={brand?.map((y) => ({
              value: y.name,
              label: y.name,
            }))}
            key={brand?.map((y) => y.id)}
            onChange={(e) => {
              setBrandV(e);
              handlecheck(e);
              setData((prev) => ({
                ...prev,
                brand: e.value,
              }));
             
            }}
            menuShouldBlockScroll={true}
          />

          <div className="d-flex justify-content-end ">
            {data.cId && data.scId &&  data.sscId && (
              <button
                className="text-primary"
                type="button"
                onClick={() => {
                  // setBrandV("");
                  setShow(true);
                }}
              >
                Add New Brand ?
              </button>
            )}
          </div>
          {/* {
                         show ? <></> : (<>
                             <div>
                                 <button className="text-primary btn btn-primary" onClick={addnewbrand}>add new brand</button>
                             </div>
                         </>)
                     } */}
        </div>
      </div>
    </>
  );
};

export default stepOne;
