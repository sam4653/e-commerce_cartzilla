import Portal from "../../component/Portal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Link from "next/link";
import * as Yup from "yup";
import { useEffect, useState, useRef } from "react";
import { getSession } from "next-auth/client";
import Toast from "../../component/Toast";
import Spinner from "../../component/Spinner";
import withAuth from "../../component/withAuth";
import { connect } from "react-redux";
import { addCheckoutDetail } from "../../Redux/Checkout/checkoutActions";
import { useRouter } from "next/router";
import Head from "next/head";
import { addAddress } from "../../Redux/Account/accountActions";

const CheckoutDetails = (props) => {
    const { checkout } = props;
    const router = useRouter();

    const { addresses } = props.address;

    const [session, setSession] = useState();
    const [editForm, setEditForm] = useState(false);
    const [loading, setLoading] = useState({ address: false, delete: false });

    const radioValue = useRef();

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

    const pinRegex = new RegExp("(^[0-9]{6})+$");

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
            .required("FirstName is required"),
        lastName: Yup.string()
            .matches(
                spaceValidation,
                "Spaces at the beginning and at the are not allowed"
            )
            .required("LastName is required"),
        company: Yup.string().matches(
            spaceValidation,
            "Spaces at the beginning and at the are not allowed"
        ),
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
            .required("Line 1 is required"),
        line2: Yup.string().matches(
            spaceValidation,
            "Spaces at the beginning and at the are not allowed"
        ),
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

    const handleClick = async () => {
        if (radioValue.current === undefined) {
            return Toast("Please Pick Or Add Address for Delivery")
        }
        {props.carts.carts.length === 0 ? (
                Toast("No product found in Add to Cart !!")
            ) : (
                router.push("/checkout/shipping")
            )
        }
        props.addCheckoutDetail({
            data: radioValue.current.value,
        });


    };

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
        addAddressBtnRef.current.disabled = true;
    };

    const closeModal = () => {
        closeModalBtnRef.current.click();
        setEditForm(false);
    };

    return (
        <div>
            <Head>
                <title>Vaistra Ecommerce | Checkout</title>
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
                    // isInitialValid={editForm}
                    validationSchema={AddressSchema}
                    onSubmit={addAddress}
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
                                            Add a new address
                                        </h5>

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
                                                        className={`form-control ${touched.firstName &&
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
                                                        className={`form-control ${touched.lastName &&
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
                                                        className={`form-control ${touched.company &&
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
                                                        <i className="text-danger">
                                                            *
                                                        </i>
                                                    </label>
                                                    <Field
                                                        className={`form-control ${touched.mobileNo &&
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
                                                        className={`form-control ${touched.country &&
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
                                                        className={`form-control ${touched.state &&
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
                                                        className={`form-control custom-select ${touched.city &&
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
                                                        className={`form-control ${touched.line1 &&
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
                                                    </label>
                                                    <i className="text-danger">
                                                        *
                                                    </i>
                                                    <Field
                                                        className={`form-control ${touched.line2 &&
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
                                                        className={`form-control ${touched.pinCode &&
                                                            errors.pinCode
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        type="text"
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
                                            ) : (
                                                `Add address`
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Portal>
            {addresses?.length > 0 ? (
                <section className="col-lg-12">
                    <h2 className="h6 pb-3 mb-2">
                        List of Your Registered Addresses :
                    </h2>
                    <div className="table-responsive">
                        <table className="table table-hover font-size-sm border-bottom">
                            <thead>
                                <tr>
                                    <th />
                                    <th>Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {addresses?.map((address) => {
                                    return (
                                        <tr key={address.id}>
                                            <td>
                                                <div className="custom-control custom-radio">
                                                    <input
                                                        className="custom-control-input"
                                                        style={{ zIndex: 50 }}
                                                        type="radio"
                                                        ref={
                                                            !checkout.details
                                                                ? address.isPrimary
                                                                    ? radioValue
                                                                    : null
                                                                : checkout.details ===
                                                                    address.id
                                                                    ? radioValue
                                                                    : null
                                                        }
                                                        id={address.id}
                                                        value={address.id}
                                                        name="address"
                                                        onChange={(e) => {
                                                            props.addCheckoutDetail(
                                                                {
                                                                    data: e
                                                                        .target
                                                                        .value,
                                                                }
                                                            );
                                                        }}
                                                        defaultChecked={
                                                            !checkout.details
                                                                ? address.isPrimary
                                                                : checkout.details ===
                                                                address.id
                                                        }
                                                    />

                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor={
                                                            address.firstName
                                                        }
                                                    />
                                                    <span className="d-inline d-sm-none"></span>
                                                </div>
                                            </td>
                                            <td className="align-middle">
                                                {`${address.line1}, ${address.line2} , ${address.city}, ${address.state}, ${address.country}, - ${address.pinCode}`}
                                                {address.isPrimary && (
                                                    <span className="align-middle badge badge-info ml-2">
                                                        Primary
                                                    </span>
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
                </section>
            ) : (
                <center>
                    <Spinner />
                </center>
            )}
            <div className="d-none d-lg-flex pt-4">
                <div className="w-50 pr-3">
                    <Link href="/cart">
                        <a
                            className="btn btn-secondary btn-block"
                            href="/cart"
                        >
                            <i className="czi-arrow-left mt-sm-0 mr-1" />
                            <span className="d-none d-sm-inline">
                                Back to Cart
                            </span>
                            <span className="d-inline d-sm-none">Back</span>
                        </a>
                    </Link>
                </div>
                <div className="w-50 pl-2">
                    <button
                        type="button"
                        style={{ width: "100%" }}
                        onClick={handleClick}
                    >
                        <a className="btn btn-primary btn-block">
                            <span className="d-none d-sm-inline">
                                Proceed to Shipping
                            </span>
                            <span className="d-inline d-sm-none">Next</span>
                            <i className="czi-arrow-right mt-sm-0 ml-1" />
                        </a>
                    </button>
                </div>
            </div>
        </div>
    );
};
// export async function getServerSideProps({params,req,res,query,preview,previewData,resolvedUrl,locale,locales,defaultLocale}) {
//     console.log('Logging : '+res);
//     const data = await fetch('https://jsonplaceholder.typicode.com/users');
//     const users = await data.json();
//     return { props: { users } }
//   }

const mapStateToProps = (state) => {
    return {
        checkout: state.checkout,
        user: state.user,
        carts: state.carts,
        address: state.address,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addCheckoutDetail: (checkout) => dispatch(addCheckoutDetail(checkout)),
        addAddress: (data, token) => dispatch(addAddress(data, token)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withAuth(CheckoutDetails));
