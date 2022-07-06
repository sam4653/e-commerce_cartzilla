import React from "react";
import withAuth from "../../component/withAuth";
import axios from "axios";
import { getSession } from "next-auth/client";
import { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaImage, FaTimes } from "react-icons/fa";
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Spinner from "../../component/Spinner";
import {
  fetchTicket,
} from "../../Redux/Account/accountActions";
import { connect } from "react-redux";
const addTicket = (props) => {
  const router = useRouter();
  const btnRef = useRef();
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("Attachment");
  const [photoError, setPhotoError] = useState("");
  const [url, setUrl] = useState("/avtar/no-image.png");
  const [user, setUser] = useState({
    subject: "",
    type: "",
    issue: "",
    attachment: "",
    priority: "",
    // status: "",
  });

  const fileSelect = (e) => {
    if (e.target.files.length !== 0) {
      if (
        e.target.files[0].type === "image/jpeg" ||
        e.target.files[0].type === "image/jpg" ||
        e.target.files[0].type === "image/png"
      ) {
        if (e.target.files[0].size <= 1000000) {
          setUser((prev) => ({ ...prev, attachment: e.target.files[0].name }));
          setFileName(e.target.files[0].name);
          setPhotoError("");
          const file = URL.createObjectURL(e.target.files[0]);
          setUrl(file);
        } else {
          setPhotoError("Only 1 MB size image is accepted");
          setFileName("Attachment");
          setUser((prev) => ({ ...prev, attachment: "" }));
          setUrl("/avtar/avtar.png");
        }
      } else {
        setPhotoError("Only jpg,png accepted");
        setFileName("Attachment");
        setUser((prev) => ({ ...prev, attachment: "" }));
        setUrl("/avtar/no-image.png");
      }
    } else {
      setPhotoError("Attachment is Required");
      setUser((prev) => ({ ...prev, attachment: "" }));
      setFileName("Attachment");
      setUrl("/avtar/no-image.png");
    }
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const spaceValidation = new RegExp(
    "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
  );

  const TicketSchema = Yup.object().shape({
    subject: Yup.string()
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the are not allowed"
      )
      .required("Subject is required")
      .min(5, "Please enter more than 5 character")
      .max(50, "please enter less than 50 character"),
    type: Yup.string()
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the are not allowed"
      )
      .required("Type is required")
      .min(5, "Please enter more than 5 character")
      .max(50, "please enter less than 50 character"),
    priority: Yup.string()
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the are not allowed"
      )
      .required("priority is required")
      .min(3, "Please enter more than 2 character")
      .max(50, "please enter less than 50 character"),
    // status: Yup.string() 
    //     .required("priority is required"),
    issue: Yup.string()
      .matches(
        spaceValidation,
        "Spaces at the beginning and at the are not allowed"
      )
      .required("Issue is required")
      .min(5, "Please enter more than 5 character")
      .max(50, "please enter less than 50 character"),
  });

  const Update = async () => {
    setLoading(true);
    btnRef.current.disabled = true;
    const session = await getSession();
    const formdata = new FormData();
    formdata.append("subject", user.subject);
    formdata.append("priority", user.priority);
    // formdata.append("status", user.status);
    formdata.append("type", user.type);
    formdata.append("issue", user.issue);
    formdata.append("attachment", user.attachment);
    // console.log("add tickeet", user)
    await axios
      .post(`${process.env.HOST}/ticket`, user, {
        headers: {
          Authorization: session.accessToken,
        },
      })
      .then((res) => {
        setLoading(false);
        // console.log(res);
        btnRef.current.disabled = false;
        props.fetchTicket(session.accessToken);
        toast.info("😊 " + res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          transition: Flip,
          onClose: () => {
            router.push("/account/tickets");
          },
        });
      })
      .catch((err) => {
        setLoading(false);
        btnRef.current.disabled = false;
        toast.error("😢 " + err.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });
  };

  return (
    <>
      <section className="col-lg-8">
        <div className="pt-2 px-4 pl-lg-0 pr-xl-5">
          <h2 className="h3 py-2 text-center text-sm-left">Add New Ticket</h2>
          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="profile"
              role="tabpanel"
            >
              <Formik
                initialValues={{
                  subject: user.subject,
                  type: user.type,
                  issue: user.issue,
                  priority: user.priority,
                  // status: user.status,
                }}
                validationSchema={TicketSchema}
                onSubmit={Update}
              >
                {({ touched, errors, isValid, values, handleChange }) => (
                  <Form>
                    <div className="row">

                      {/* Subject */}
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label htmlFor="account-fn">Subject</label>
                          <span className="text-danger">*</span>
                          <Field
                            className={`form-control ${touched.subject && errors.subject
                                ? "is-invalid"
                                : ""
                              }`}
                            name="subject"
                            type="text"
                            placeholder="Subject"
                            id="account-fn"
                            onChange={(e) => {
                              handleChange(e);
                              inputChange(e);
                            }}
                          />
                          <ErrorMessage
                            component="div"
                            name="subject"
                            className="invalid-feedback"
                          />
                        </div>
                      </div>

                      {/* Type */}
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label htmlFor="account-ln">Type</label>
                          <span className="text-danger">*</span>
                          <Field
                            className={`form-control ${touched.type && errors.type ? "is-invalid" : ""
                              }`}
                            type="text"
                            id="account-ln"
                            name="type"
                            placeholder="Type"
                            onChange={(e) => {
                              handleChange(e);
                              inputChange(e);
                            }}
                          />
                          <ErrorMessage
                            component="div"
                            name="type"
                            className="invalid-feedback"
                          />
                        </div>
                      </div>

                      {/* Old priority code */}
                      {/* <div className="col-sm-6">
                        <div className="form-group">
                          <label htmlFor="priority">Priority</label>
                          <span className="text-danger">*</span>
                          <Field
                            className={`form-control ${
                              touched.priority && errors.priority ? "is-invalid" : ""
                            }`}
                            type="text"
                            id="priority"
                            name="priority"
                            placeholder="Priority"
                            onChange={(e) => {
                              handleChange(e);
                              inputChange(e);
                            }}
                          />
                          <ErrorMessage
                            component="div"
                            name="priority"
                            className="invalid-feedback"
                          />
                        </div>
                      </div> */}

                      {/* priority */}
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label htmlFor="priority">Priority</label>
                          <span className="text-danger">*</span>
                          <Field as="select" name="priority" id="priority" className="form-control" onChange={(e) => {
                            handleChange(e);
                            inputChange(e);
                          }}>
                            <option value="" disabled={false}>Select Priority</option>
                            <option value="Urgent">Urgent</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </Field>
                          <ErrorMessage
                            component="div"
                            name="priority"
                            className="invalid-feedback"
                          />
                        </div>
                      </div>

                      {/* Status */}
                      {/* <div className="col-sm-6">
                        <div className="form-group">
                          <label htmlFor="status">Status</label>
                          <span className="text-danger">*</span>
                          <Field as="select" name="status" id="status" className="form-control"  onChange={(e) => {
                              handleChange(e);
                              inputChange(e);
                            }}>
                            <option value="" disabled={false}>Select Status</option>
                            <option value="All">All</option>
                            <option value="Open">Open</option>
                            <option value="Close">close</option>
                          </Field>
                          <ErrorMessage
                            component="div"
                            name="status"
                            className="invalid-feedback"
                          />
                        </div>
                      </div> */}

                      {/* Issue */}
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label htmlFor="account-email">Issue</label>
                          <span className="text-danger">*</span>
                          <Field
                            className={`form-control ${touched.issue && errors.issue ? "is-invalid" : ""
                              }`}
                            type="text"
                            id="account-email"
                            placeholder="Issue"
                            name="issue"
                            onChange={(e) => {
                              handleChange(e);
                              inputChange(e);
                            }}
                          />
                          <ErrorMessage
                            component="div"
                            name="issue"
                            className="invalid-feedback"
                          />
                        </div>
                      </div>

                      {/* Attachment */}
                      <div className="col-md-4">
                        <label className="form-label">
                          Attachment<span className="text-danger">*</span>
                        </label>
                        <input
                          type="file"
                          className="d-none form-control"
                          ref={fileRef}
                          onChange={fileSelect}
                        />
                        <button
                          type="button"
                          className="uploadBtn border w-100 d-flex justify-content-between text-muted align-items-center"
                          onClick={() => fileRef.current.click()}
                        >
                          {fileName}
                          <i className="fs-5">
                            <FaImage />
                          </i>
                        </button>
                        {photoError !== "" && (
                          <span className="text-danger error">
                            {photoError}
                          </span>
                        )}
                      </div>
                      <div className="col-sm-2 mt-4">
                        <img src={url} width={90} alt="Avtar" />
                      </div>
                      <div className="col-12">
                        <hr className="mt-2 mb-3" />
                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                          <button
                            className="btn btn-primary mt-3 mt-sm-0"
                            type="submit"
                            disabled={
                              !Object.values(values).every(
                                (x) => x !== null && x !== ""
                              ) ||
                              !isValid ||
                              fileName === "Attachment"
                            }
                            ref={btnRef}
                          >
                            Add Ticket
                            {loading && <Spinner />}
                          </button>
                        </div>
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
  );
};

const mapStateToProps = (state) => {
  return {
    tickets: state.tickets,
    // paymentMethods: state.paymentMethods,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    fetchTicket: (token) => dispatch(fetchTicket(token)),
  };
};


export default withAuth(
  connect(mapStateToProps, mapDispatchToProps)(addTicket)
);
