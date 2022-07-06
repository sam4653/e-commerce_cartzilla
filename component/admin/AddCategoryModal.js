import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

const AddCategoryModal = (props) => {
  const categoryBtnRef = useRef();
  const [img, setImg] = useState({ url: "", filename: "Photo" });
  const [photoError, setPhotoError] = useState("");
  const allValidation = new RegExp(
    `^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$`
  );
  const CategorySchema = Yup.object().shape({
    name: Yup.string()
      .max(255, "It's too long only allow 255 character.")
      .matches(
        allValidation,
        "Spaces at the beginning and at the are not allowed"
      )
      .required("Category Name is required"),
    desc: Yup.string()
      .max(255, "It's too long only allow 255 character.")
      .matches(
        allValidation,
        "Spaces at the beginning and at the are not allowed"
      )
      .required("Category Description is required"),
  });
  const fileSelect = (e) => {
    if (e.target.files.length !== 0) {
      if (
        e.target.files[0].type === "image/jpeg" ||
        e.target.files[0].type === "image/jpg" ||
        e.target.files[0].type === "image/png"
      ) {
        if (e.target.files[0].size <= 1000000) {
          setImg((prev) => ({
            ...prev,
            filename: e.target.files[0].name,
          }));
          setPhotoError("");
          const file = URL.createObjectURL(e.target.files[0]);
          setImg((prev) => ({ ...prev, url: file }));
        } else {
          setPhotoError("Only 1 MB size image is accepted");
          setImg((prev) => ({
            ...prev,
            filename: "Photo",
          }));
          setImg((prev) => ({ ...prev, url: "" }));
        }
      } else {
        setPhotoError("Only jpg,png accepted");
        setImg((prev) => ({
          ...prev,
          filename: "Photo",
        }));
        setImg((prev) => ({ ...prev, url: "" }));
      }
    } else {
      setPhotoError("Photo is Required");
      setImg((prev) => ({
        ...prev,
        filename: "Photo",
      }));
      setImg((prev) => ({ ...prev, url: "" }));
    }
  };
  useEffect(() => {
    categoryBtnRef.current.disabled = true;
  }, []);

  const resetData = () => {
    setPhotoError("");
    setImg({ filename: "Photo", url: "" });
  };
  return (
    <>
      <div className="modal fade" role="dialog" id="categoryModal">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{props.title}</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Formik
                initialValues={{
                  name: "",
                  desc: "",
                }}
                validationSchema={CategorySchema}
                // onSubmit={addproduct}
              >
                {({ touched, errors, isValid, values, handleChange }) => (
                  <Form className="">
                    <div className="container">
                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <label className="form-label">
                            Category Name <span className="text-danger">*</span>
                          </label>
                          <Field
                            type="text"
                            className={`form-control ${
                              touched.name && errors.name ? "is-invalid" : ""
                            }`}
                            name="name"
                            placeholder="Category Name"
                            onChange={(e) => {
                              handleChange(e);
                            }}
                          />
                          <ErrorMessage
                            component="div"
                            name="name"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="col-md-12 mb-3">
                          <label className="form-label">
                            Category Description
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            as="textarea"
                            className={`form-control ${
                              touched.desc && errors.desc ? "is-invalid" : ""
                            }`}
                            name="desc"
                            placeholder="Category Description"
                            onChange={(e) => {
                              handleChange(e);
                            }}
                          />
                          <ErrorMessage
                            component="div"
                            name="desc"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">
                            Photo <span className="text-danger">*</span>
                          </label>
                          <div className="form-group">
                            <div className="custom-file">
                              <input
                                className="custom-file-input"
                                type="file"
                                id="file-input"
                                onChange={fileSelect}
                                accept="image/jpeg,image/jpg,image/png"
                                multiple
                              />
                              <label
                                className="custom-file-label"
                                htmlFor="file-input"
                                style={{ overflow: `hidden` }}
                              >
                                {img.filename}
                              </label>
                            </div>
                            <p className="text-danger m-0">
                              <small>{photoError}</small>
                            </p>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <button
                            type="reset"
                            className="btn btn-secondary btn-sm"
                            onClick={resetData}
                          >
                            Cancle
                          </button>
                          <button
                            type="submit"
                            ref={categoryBtnRef}
                            disabled={
                              !isValid ||
                              photoError !== "" ||
                              img.filename === "Photo"
                            }
                            className="btn btn-primary btn-sm ml-4 px-4"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      {/* <BackButton /> */}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategoryModal;
