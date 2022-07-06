import React from "react";
import { getSession, signOut } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchWishlist } from "../../Redux/Wishlist/wishListActions";
import { fetchOrder } from "../../Redux/Order/orderAction";
import { fetchVendorProduct } from "../../Redux/Product/productAction";
import withAuth from "../withAuth";
import { remove_user_detail } from "../../Redux/User/userActions";
import styled from "styled-components";
import { FaBuffer, FaInfoCircle, FaQuestionCircle } from "react-icons/fa";
import axios from "axios";
import {
    FaAngleDoubleUp,
    FaAngleDoubleDown,
} from "react-icons/fa";

import {
    update_user_detail,
} from "../../Redux/User/userActions";

import Head from "next/head";
import Spinner from "../Spinner";
import { toast } from "react-toastify";

import { Button, Modal } from "react-bootstrap";
import Portal from "../Portal";
const VProfileHeader = (props) => {
    const router = useRouter();
    const [session, setSession] = useState("");
    const [totalSales, setTotalSales] = useState(0);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        props.fetchOrder(props.token);
        props.fetchVendorProduct(props.token);
        const getTotalSales = async () => {
            axios
                .get(`${process.env.HOST}/order/total`, {
                    headers: {
                        Authorization: props.token,
                    },
                })
                .then((res) => {
                    // console.log("ProductResponse", res.data.data)
                    setTotalSales(res.data.data[0].totalrevenue);
                })
                .catch((err) => {
                    console.log(err.response);
                });
        };
        getTotalSales();
    }, []);

    const logout = async () => {
        await signOut({ redirect: false });
        router.replace("/vendor");
        props.removeUserDetail();
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleAccountStatus = async () => {
        setLoading(true);
        const sess = await getSession();
        const updateVendorStatus = async () => {
            await axios
                .patch(`${process.env.HOST}/vendor/status`, "", {
                    headers: {
                        Authorization: sess.accessToken,
                    },
                })
                .then((res) => {
                    const data = {
                        status:
                            props.user.status === "Active"
                                ? "Inactive"
                                : "Active",
                    };
                    props.updateUser({ user: data });
                    props.fetchVendorProduct(props.token);
                    toast.info("🎉 " + res.data.data, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000,
                    });
                    // console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(
                        "😢 " + "Something Went Wrong. Please, Try Again...!",
                        {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 1000,
                        }
                    );
                });
        };
        await updateVendorStatus();
        setLoading(false);
        setShow(false);
    };

    return (
        <>
            <Head></Head>
            <Portal>
                {/* <Button variant="primary" onClick={handleShow}>
                Launch demo modal
            </Button> */}

                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {" "}
                            To Confirm{" "}
                            {props.user.status === "Active"
                                ? "Deactivate "
                                : "Active "}
                            Account
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are Your Sure To{" "}
                        {props.user.status === "Active"
                            ? "Deactivate"
                            : "Active"}{" "}
                        Your Vendor Account?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleAccountStatus}>
                            {loading ? <Spinner /> : "Yes"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Portal>

            <Main>
                <div className="position-relative bg-accent">
                    <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
                        <div className="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                            <div className="d-flex">
                                <div className="text-sm-right mr-5">
                                    <div className="text-light font-size-base">
                                        Total sales
                                    </div>
                                    <h3 className="text-light">₹ {totalSales ? totalSales : 0}</h3>
                                </div>
                                {/* <div className="text-sm-right">
                                <div className="text-light font-size-base">
                                    Seller rating
                                </div>
                                <div className="star-rating">
                                    <i className="sr-star czi-star-filled active"></i>
                                    <i className="sr-star czi-star-filled active"></i>
                                    <i className="sr-star czi-star-filled active"></i>
                                    <i className="sr-star czi-star-filled active"></i>
                                    <i className="sr-star czi-star"></i>
                                </div>
                                <div className="text-light opacity-60 font-size-xs">
                                    Based on 98 reviews
                                </div>
                            </div> */}
                            </div>
                        </div>
                        <div className="order-lg-1 pr-lg-4 text-lg-left d-flex align-items-center">
                            {props.user.photo ? (
                                <img
                                    src={
                                        !(
                                            props.user.photo === "null" ||
                                            props.user.photo === ""
                                        )
                                            ? props.user.photo
                                            : "/avtar/avtar.png"
                                    }
                                    style={{ width: "70px", height: "70px" }}
                                    className="rounded-circle mr-3"
                                />
                            ) : (
                                <i className="navbar-tool-icon czi-user"></i>
                            )}
                            <h1 className="h3 text-light mb-0">
                                {props.user.fullName !== "null null"
                                    ? props.user.fullName
                                    : "No Name"}
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="container pb-5 mb-2 mb-md-3">
                    <div className="row">
                        <aside className="col-lg-3 pt-4 pt-lg-0">
                            <div className="cz-sidebar-static rounded-lg box-shadow-lg px-0 pb-0 mb-5 mb-lg-0">
                                <div className="bg-secondary px-4 py-3 margin-top-27">
                                    <h3 className="font-size-sm mb-0 text-muted">
                                        Account
                                    </h3>
                                </div>
                                <ul className="list-unstyled mb-0">
                                    <li className="border-bottom mb-0">
                                        <Link href="/vendor/profile">
                                            <a
                                                className={`nav-link-style d-flex align-items-center px-4 py-3 ${router.pathname ===
                                                        "/vendor/profile"
                                                        ? "active"
                                                        : ""
                                                    }`}
                                            >
                                                <i className="czi-settings opacity-60 mr-2"></i>
                                                Settings
                                            </a>
                                        </Link>
                                    </li>
                                    <li className="border-bottom mb-0">
                                        <Link href="/vendor/sales">
                                            <a
                                                className={`nav-link-style d-flex align-items-center px-4 py-3 ${router.pathname ===
                                                        "/vendor/sales"
                                                        ? "active"
                                                        : ""
                                                    }`}
                                            >
                                                <i className="czi-dollar opacity-60 mr-2"></i>
                                                Sales
                                            </a>
                                        </Link>
                                    </li>
                                    <li className="border-bottom mb-0">
                                        <Link href="/vendor/products">
                                            <a
                                                className={`nav-link-style d-flex align-items-center px-4 py-3 ${router.pathname ===
                                                        "/vendor/products"
                                                        ? "active"
                                                        : ""
                                                    }`}
                                            >
                                                <i className="czi-package opacity-60 mr-2"></i>
                                                Products
                                                <span className="font-size-sm text-muted ml-auto">
                                                    {props.products.products.length}
                                                </span>
                                            </a>
                                        </Link>
                                    </li>
                                    <li className="border-bottom mb-0">
                                        <Link href="/vendor/productAdd">
                                            <a
                                                className={`nav-link-style d-flex align-items-center px-4 py-3 ${router.pathname ===
                                                        "/vendor/productAdd"
                                                        ? "active"
                                                        : ""
                                                    }`}
                                            >
                                                <i className="czi-cloud-upload opacity-60 mr-2"></i>
                                                Add New Product
                                            </a>
                                        </Link>
                                    </li>
                                    <li className="border-bottom mb-0">
                                        <Link href="/vendor/gstVerify">
                                            <a
                                                className={`nav-link-style d-flex align-items-center px-4 py-3 ${router.pathname ===
                                                        "/vendor/gstVerify"
                                                        ? "active"
                                                        : ""
                                                    }`}
                                            >
                                                <i className="czi-document opacity-60 mr-2" />
                                                GST Verify
                                            </a>
                                        </Link>
                                    </li>
                                    <li className="border-bottom mb-0">
                                        <Link href="/vendor/bankDetails">
                                            <a
                                                className={`nav-link-style d-flex align-items-center px-4 py-3 ${router.pathname ===
                                                        "/vendor/bankDetails"
                                                        ? "active"
                                                        : ""
                                                    }`}
                                            >
                                                <i className="czi-money-bag opacity-60 mr-2" />
                                                Bank Details
                                            </a>
                                        </Link>
                                    </li>
                                    <li className="border-bottom mb-0">
                                        <Link href="/vendor/pickUpAddress">
                                            <a
                                                className={`nav-link-style d-flex align-items-center px-4 py-3 ${router.pathname ===
                                                        "/vendor/pickUpAddress"
                                                        ? "active"
                                                        : ""
                                                    }`}
                                            >
                                                <i className="czi-location opacity-60 mr-2" />
                                                PickUp Address
                                            </a>
                                        </Link>
                                    </li>
                                    <li className="border-bottom mb-0">
                                        <Link href="/vendor/order">
                                            <a
                                                className={`nav-link-style d-flex align-items-center px-4 py-3 ${router.pathname ===
                                                        "/vendor/order"
                                                        ? "active"
                                                        : ""
                                                    }`}
                                            >
                                                <i className="opacity-60 mr-2">
                                                    <FaBuffer />
                                                </i>
                                                Orders
                                                <span className="font-size-sm text-muted ml-auto">
                                                    {props.orders.orders.length}
                                                </span>
                                            </a>
                                        </Link>
                                    </li>

                                    <li className="border-bottom mb-0">
                                        <Link href="/vendor/changePassword">
                                            <a
                                                className={`nav-link-style d-flex align-items-center px-4 py-3 ${router.pathname ===
                                                        "/changePassword"
                                                        ? "active"
                                                        : ""
                                                    }`}
                                            >
                                                <i className="opacity-60 mr-2">
                                                    <FaInfoCircle />
                                                </i>
                                                Change Password
                                            </a>
                                        </Link>
                                    </li>
                                    <li
                                        className="border-bottom mb-0"
                                        title="Remove Your Products From Listing"
                                    >
                                        <button
                                            className={`nav-link-style d-flex align-items-center px-4 py-3`}
                                            onClick={() => setShow(true)}
                                        >
                                            <i
                                                className="opacity-60 mr-2"
                                                style={{
                                                    color:
                                                        props.user.status ===
                                                            "Active"
                                                            ? "red"
                                                            : "darkGreen",
                                                }}
                                            >
                                                {props.user.status ===
                                                    "Active" ? (
                                                    <FaAngleDoubleDown />
                                                ) : (
                                                    <FaAngleDoubleUp />
                                                )}
                                            </i>
                                            {props.user.status === "Active"
                                                ? "Deactivate Account"
                                                : "Active Account"}
                                        </button>
                                    </li>
                                    <li className="border-top mb-0">
                                        <button
                                            className="nav-link-style d-flex align-items-center px-4 py-3"
                                            onClick={logout}
                                        >
                                            <i className="czi-sign-out opacity-60 mr-2"></i>
                                            Sign out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </aside>
                        {React.cloneElement(props.children, {
                            token: session,
                        })}
                    </div>
                </div>
            </Main>
        </>
    );
};

const Main = styled.div`
    .margin-top-27 {
        margin-top: -27px !important;
        border-radius: 0.4375rem !important;
    }
`;

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        wishlists: state.wishlists,
        products: state.products,
        orders: state.orders,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // fetchWishlist: (token) => dispatch(fetchWishlist(token)),
        fetchOrder: (token) => dispatch(fetchOrder(token)),
        fetchVendorProduct: (token) => dispatch(fetchVendorProduct(token)),
        removeUserDetail: () => dispatch(remove_user_detail()),
        updateUser: (data) => dispatch(update_user_detail(data)),
    };
};

export default withAuth(
    connect(mapStateToProps, mapDispatchToProps)(VProfileHeader)
);
