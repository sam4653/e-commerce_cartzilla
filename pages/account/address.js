import Portal from "../../component/Portal";
import dynamic from "next/dynamic";
const SignOut = dynamic(() => import("../../component/SignOut"));
const Spinner = dynamic(() => import("../../component/Spinner"));
const Pagination = dynamic(() => import("../../component/Pagination"));

// import Spinner from "../../component/Spinner";
import withAuth from "../../component/withAuth";
// import SignOut from "../../component/SignOut";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState, useRef } from "react";
import { getSession } from "next-auth/client";
import { connect } from "react-redux";
import Head from "next/head";
import {
    addAddress,
    removeAddress,
    updateAddress,
} from "../../Redux/Account/accountActions";

let dataLimit = 10;
const Address = (props) => {
    // console.log("add : ", props.address);
    const { address } = props.address.addresses;
    const [session, setSession] = useState();
    const [editForm, setEditForm] = useState(false);
    // const [addresses, setAddresses] = useState(props.address.addresses);
    const [loading, setLoading] = useState({ address: false, delete: false });
    const pinRegex = new RegExp("(^[0-9]{6})+$");
    const addAddressBtnRef = useRef(null);
    const closeModalBtnRef = useRef(null);
    const editModalBtnRef = useRef(null);
    const [finalData, setFinalData] = useState({
        firstName: "",
        lastName: "",
        company: "",
        line1: "",
        line2: "",
        mobileNo: "",
        pinCode: "",
        country: "India",
        state: "Gujarat",
        city: "",
        isPrimary: false,
    });

    const [data, setData] = useState(finalData);
    const [currentPage, setCurrentPage] = useState(1);

    const phoneRegex = new RegExp("(^[6789][0-9]{9})+$");
    const spaceValidation = new RegExp(
        "^[A-Za-z0-9\\S]*$|^[A-Za-z\\S][A-Za-z0-9\\S ]*[A-Za-z0-9\\S]$"
    );
    const AddressSchema = Yup.object().shape({
        firstName: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            )
            .required("FirstName is required").min(2,"Please enter more than 2 character")
            .min(2,"Please enter more than 2 character")
            .max(10,"please enter less than 10 character"),
        lastName: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            )
            .required("LastName is required")
            .min(2,"Please enter more than 2 character")
            .max(10,"please enter less than 10 character"),
        company: Yup.string().matches(
            spaceValidation,
            "Spaces at the beginning and at the are not allowed"
        ).min(2,"Please enter more than 2 character")
        .max(20,"please enter less than 20 character"),
        city: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            )
            .required("City is required"),
        mobileNo: Yup.string()
            .matches(phoneRegex, "Invalid Mobie No.")
            .required("Mobile Number is required"),
        line1: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            )
            .required("Line 1 is required")
            .min(2,"Please enter more than 10 character")
            .max(200,"please enter less than 200 character"),
        line2: Yup.string().matches(
            spaceValidation,
            "Spaces at the beginning and at the are not allowed"
        )
        .min(2,"Please enter more than 10 character")
        .max(200,"please enter less than 200 character"),
        state: Yup.string().matches(
            spaceValidation,
            "Spaces at the beginning and at the are not allowed"
        ),
        country: Yup.string().matches(
            spaceValidation,
            "Spaces at the beginning and at the are not allowed"
        ),
        pinCode: Yup.string()
            .matches(pinRegex, "Invalid PinCode.")
            .required("PinCode is required"),
    });

    useEffect(async () => {
        const sess = await getSession();
        setSession(sess.accessToken);
    }, []);

    const addAddress = async (e) => {
        setLoading((prev) => ({ ...prev, address: true }));
        addAddressBtnRef.current.disabled = true;
        let d = e;
        d.isPrimary = finalData.isPrimary;
        addAddressBtnRef.current.disabled = false;
        props.addAddress(d, session);
        setLoading((prev) => ({ ...prev, address: false }));
        closeModal();
    };
    const disableBtn = () => {
        // console.log(addAddressBtnRef.current.disabled);
        addAddressBtnRef.current.disabled = true;
    };

    const closeModal = () => {
        closeModalBtnRef.current.click();
        // setEditForm(false);
    };

    const deleteAddress = async (id) => {
        setLoading((prev) => ({ ...prev, delete: true }));
        props.removeAddress(id, session);
        setLoading((prev) => ({ ...prev, delete: false }));
    };

    const updateAddress = async (address) => {
        // console.log(addAddressBtnRef.current.disabled);
        addAddressBtnRef.current.disabled = false;
        editModalBtnRef.current.click();
        setEditForm(true);
        setFinalData(address);
    };

    const editAddress = async (e) => {
        setLoading((prev) => ({ ...prev, delete: true }));
        let d = e;
        d.isPrimary = finalData.isPrimary;
        d.pinCode = String(d.pinCode);
        addAddressBtnRef.current.disabled = false;
        props.updateAddress(finalData.id, d, session);
        setLoading((prev) => ({ ...prev, delete: false }));
        closeModal();
    };
    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Account Addresses</title>
            </Head>
            <Portal>
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        firstName: finalData.firstName,
                        lastName: finalData.lastName,
                        company: finalData.company,
                        line1: finalData.line1,
                        line2: finalData.line2,
                        pinCode: finalData.pinCode,
                        city: finalData.city,
                        mobileNo: finalData.mobileNo,
                        country: finalData.country,
                        state: finalData.state,
                    }}
                    validationSchema={AddressSchema}
                    onSubmit={editForm ? editAddress : addAddress}
                >
                    {({ touched, errors, isValid, values, handleChange }) => (
                        <Form
                            className="needs-validation modal fade"
                            method="post"
                            id="add-address"
                            tabIndex="-1"
                        >
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">
                                            {!editForm
                                                ? "Add a new address"
                                                : "Update Address"}
                                        </h5>
                                        {isValid}
                                        <button
                                            className="close"
                                            type="button"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                        >
                                            <span aria-hidden="true">
                                                &times;
                                            </span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="address-fn">
                                                        First name{" "}
                                                        <i className="text-danger">
                                                            *
                                                        </i>
                                                    </label>
                                                    <Field
                                                        className={`form-control ${
                                                            touched.firstName &&
                                                            errors.firstName
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        type="text"
                                                        id="address-fn"
                                                        name="firstName"
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="firstName"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="address-ln">
                                                        Last name{" "}
                                                        <i className="text-danger">
                                                            *
                                                        </i>
                                                    </label>
                                                    <Field
                                                        className={`form-control ${
                                                            touched.lastName &&
                                                            errors.lastName
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        type="text"
                                                        id="address-ln"
                                                        name="lastName"
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="lastName"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="address-company">
                                                        Company
                                                    </label>
                                                    <Field
                                                        className={`form-control ${
                                                            touched.company &&
                                                            errors.company
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        type="text"
                                                        name="company"
                                                        id="address-company"
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="company"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="address-mobileNo">
                                                        Mobile No.
                                                    </label>
                                                    <i className="text-danger">
                                                        *
                                                    </i>
                                                    <Field
                                                        className={`form-control ${
                                                            touched.mobileNo &&
                                                            errors.mobileNo
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        type="text"
                                                        name="mobileNo"
                                                        id="address-mobileNo"
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="mobileNo"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="address-country">
                                                        Country{" "}
                                                        <i className="text-danger">
                                                            *
                                                        </i>
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        className={`form-control ${
                                                            touched.country &&
                                                            errors.country
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        name="country"
                                                        disabled
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="country"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="address-country">
                                                        State{" "}
                                                        <i className="text-danger">
                                                            *
                                                        </i>
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        className={`form-control ${
                                                            touched.state &&
                                                            errors.state
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        name="state"
                                                        disabled
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="state"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="address-city">
                                                        City{" "}
                                                        <i className="text-danger">
                                                            *
                                                        </i>
                                                    </label>
                                                    <Field
                                                        as="select"
                                                        className={`form-control custom-select ${
                                                            touched.city &&
                                                            errors.city
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        name="city"
                                                    >
                                                        <option value="">
                                                            Choose City
                                                        </option>
                                                        <option value="porbandar">
                                                            Porbandar
                                                        </option>
                                                        <option value="ahmedabad">
                                                            Ahmedabad
                                                        </option>
                                                    </Field>
                                                    <ErrorMessage
                                                        component="div"
                                                        name="city"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="address-line1">
                                                        Line 1{" "}
                                                        <i className="text-danger">
                                                            *
                                                        </i>
                                                    </label>

                                                    <Field
                                                        className={`form-control ${
                                                            touched.line1 &&
                                                            errors.line1
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        type="text"
                                                        id="address-line1"
                                                        name="line1"
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="line1"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="address-line2">
                                                        Line 2
                                                        <i className="text-danger">
                                                            *
                                                        </i>
                                                    </label>
                                                    <Field
                                                        className={`form-control ${
                                                            touched.line2 &&
                                                            errors.line2
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        type="text"
                                                        id="address-line2"
                                                        name="line2"
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="line2"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="address-zip">
                                                        PinCode{" "}
                                                        <i className="text-danger">
                                                            *
                                                        </i>
                                                    </label>
                                                    <Field
                                                        className={`form-control ${
                                                            touched.pinCode &&
                                                            errors.pinCode
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        type="number"
                                                        id="address-zip"
                                                        name="pinCode"
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="pinCode"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="custom-control custom-checkbox">
                                                    <input
                                                        className="custom-control-input"
                                                        type="checkbox"
                                                        id="address-primary"
                                                        checked={
                                                            finalData.isPrimary
                                                        }
                                                        onChange={(e) => {
                                                            setFinalData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    isPrimary:
                                                                        e.target
                                                                            .checked,
                                                                })
                                                            );
                                                        }}
                                                    />
                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="address-primary"
                                                    >
                                                        Make this address
                                                        primary
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            className="btn btn-secondary"
                                            type="reset"
                                            onClick={() => closeModal()}
                                        >
                                            Close
                                            {/* Close */}
                                        </button>
                                        <button
                                            className="d-none"
                                            data-dismiss="modal"
                                            ref={closeModalBtnRef}
                                        ></button>
                                        <button
                                            className="btn btn-primary btn-shadow"
                                            type="submit"
                                            disabled={!isValid}
                                            ref={addAddressBtnRef}
                                        >
                                            {loading.address ? (
                                                <Spinner />
                                            ) : !editForm ? (
                                                `Add Address`
                                            ) : (
                                                "Update Address"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Portal>
            <section className="col-lg-8">
                <div className="d-none d-lg-flex justify-content-between align-items-center pt-lg-3 mb-lg-4">
                    <h6 className="font-size-base text-dark mb-0">
                        List of your registered addresses:
                    </h6>
                    <SignOut label="Sign Out" />
                </div>
                <div className="table-responsive font-size-md">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th className="col-10">Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.address.addresses.map((address) => {
                                return (
                                    <tr key={address.id}>
                                        <td className="py-3 align-middle">
                                            {`${address.line1}, ${address.line2} , ${address.city}, ${address.state}, ${address.country}, - ${address.pinCode}`}
                                            {address.isPrimary && (
                                                <span className="align-middle badge badge-info ml-2">
                                                    Primary
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 align-middle d-flex">
                                            <button
                                                className="nav-link-style mr-2"
                                                data-toggle="tooltip"
                                                onClick={() =>
                                                    updateAddress(address)
                                                }
                                                title="Edit"
                                            >
                                                <i className="czi-edit" />
                                            </button>
                                            {loading.delete ? (
                                                <Spinner />
                                            ) : (
                                                <button
                                                    className="nav-link-style text-danger"
                                                    onClick={() =>
                                                        deleteAddress(
                                                            address.id
                                                        )
                                                    }
                                                    data-toggle="tooltip"
                                                    title="Remove"
                                                >
                                                    <div className="czi-trash" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <hr className="pb-4" />
                <div className="text-sm-right">
                    <a
                        className="btn btn-primary"
                        href="#add-address"
                        data-toggle="modal"
                        onClick={() => {
                            setEditForm(false);
                            disableBtn();
                            setFinalData(data);
                        }}
                        ref={editModalBtnRef}
                    >
                        Add new address
                    </a>
                </div>
                {!props.address.addresses?.length ? (
                    <h4>
                        <center>Loading Your Address. . . </center>
                    </h4>
                ) : (
                    address && (
                        <Pagination
                            currentPage={currentPage}
                            pages={Math.ceil(address.length / dataLimit)}
                            pageLimit={5}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    )
                )}
            </section>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        address: state.address,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addAddress: (data, token) => dispatch(addAddress(data, token)),
        removeAddress: (id, token) => dispatch(removeAddress(id, token)),
        updateAddress: (id, data, token) =>
            dispatch(updateAddress(id, data, token)),
    };
};

export default withAuth(connect(mapStateToProps, mapDispatchToProps)(Address));
