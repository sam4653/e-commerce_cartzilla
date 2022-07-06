import React from "react";
import { getSession, signOut } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchWishlist } from "../Redux/Wishlist/wishListActions";
import withAuth from "./withAuth";
import { remove_user_detail } from "../Redux/User/userActions";
import {
    fetchAddress,
    fetchOrder,
    fetchTicket,
} from "../Redux/Account/accountActions";
import Breadcrumb from "./Breadcrumb";
import SignOut from "./SignOut";
import { FaInfoCircle } from "react-icons/fa";

const ProfileHeader = (props) => {
    const router = useRouter();
    const [session, setSession] = useState("");
    // console.log("profile tickets :",props.tickets.tickets);
   
    useEffect(async () => {
        const sess = await getSession();
        if (sess) {
            setSession(sess.accessToken);
            // setUser(sess.user);
            if (sess.user.role === "USER") {
                props.fetchWishlist(sess.accessToken);
                props.fetchOrder(sess.accessToken);
                props.fetchTicket(sess.accessToken);
                props.fetchAddress(sess.accessToken);
            }
            // props.fetchPaymentMethod(sess.accessToken);
        }
    }, []);

    // const logout = async () => {
    //   await signOut({ redirect: false });
    //   router.replace("/");
    //   props.removeUserDetail();
    // };

    return (
        <div>
            <div className="position-relative bg-dark py-2">
                <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
                    <div className="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                        {/* <nav aria-label="breadcrumb">
              <ol className="breadcrumb breadcrumb-light flex-lg-nowrap justify-content-center justify-content-lg-start">
                <li className="breadcrumb-item">
                  <a className="text-nowrap" href="index.html">
                    <i className="czi-home" />
                    Home
                  </a>
                </li>
                <li className="breadcrumb-item text-nowrap">
                  <a href="#">Account</a>
                </li>
                <li
                  className="breadcrumb-item text-nowrap active"
                  aria-current="page"
                >
                  Orders history
                </li>
              </ol>
            </nav> */}
                        <Breadcrumb />
                    </div>
                    <div className="order-lg-1 pr-lg-4 text-center text-lg-left">
                        <h1 className="h3 text-light mb-0">
                            {router.pathname.endsWith("order")
                                ? "My Orders"
                                : router.pathname.endsWith("wishlist")
                                    ? "My Wishlists"
                                    : router.pathname.endsWith("tickets")
                                        ? "Support Tickets"
                                        : router.pathname.endsWith("setting")
                                            ? "Profile Info"
                                            : router.pathname.endsWith("address")
                                                ? "My Addresses"
                                                : "Profile"}
                        </h1>
                    </div>
                </div>
            </div>
            {/* Page Content*/}
            <div className="container pb-5 mb-2 mb-md-3">
                <div className="row">
                    {/* Sidebar*/}
                    <aside className="col-lg-4 pt-4 pt-lg-0">
                        <div className="cz-sidebar-static rounded-lg box-shadow-lg px-0 pb-0 mb-5 mb-lg-0">
                            <div className="px-4 mb-4">
                                <div className="media align-items-center">
                                    <div
                                        className="img-thumbnail rounded-circle position-absolute mt-1 imgSetTop"
                                        style={{ width: "5.075rem", left: "27px",top:"6px" }}
                                    >
                                        {/* <span
                      className="badge badge-warning"
                      data-toggle="tooltip"
                      title="Reward points"
                    >
                      384
                    </span> */}
                                        <img
                                            className="rounded-circle"
                                            src={
                                                !(
                                                    props.user.photo ===
                                                    "null" ||
                                                    props.user.photo === ""
                                                )
                                                    ? props.user.photo
                                                    : "/avtar/avtar.png"
                                            }
                                            style={{
                                                height: "70px",
                                                width: "70px",
                                            }}
                                            alt="User Photo"
                                        />
                                    </div>
                                    <div className="media-body" style={{ paddingLeft: "5rem" }}>
                                        <h3 className="font-size-base mb-0">
                                            {props.user.fullName === "null null"
                                                ? "No Name"
                                                : props.user.fullName}
                                        </h3>
                                        <span className="text-accent font-size-sm">
                                            {/* s.gardner@example.com */}
                                            {props.user.email}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-secondary px-4 py-3">
                                <h3 className="font-size-sm mb-0 text-muted">
                                    Dashboard
                                </h3>
                            </div>
                            <ul className="list-unstyled mb-0">
                                <li className="border-bottom mb-0">
                                    <Link href="/account/order">
                                        <a
                                            className={`nav-link-style d-flex align-items-center px-4 py-3 ${router.pathname ===
                                                    "/account/order"
                                                    ? "active"
                                                    : ""
                                                }`}
                                            href="/account/order"
                                        >
                                            <i className="czi-bag opacity-60 mr-2" />
                                            Orders
                                            <span className="font-size-sm text-muted ml-auto">
                                                {props.orders.orders &&
                                                    props.orders.orders.length}
                                            </span>
                                        </a>
                                    </Link>
                                </li>
                                <li className="border-bottom mb-0">
                                    <Link href="/account/wishlist">
                                        <a
                                            className={`nav-link-style d-flex align-items-center px-4 py-3 ${router.pathname ===
                                                    "/account/wishlist"
                                                    ? "active"
                                                    : ""
                                                }`}
                                            href="/account/wishlist"
                                        >
                                            <i className="czi-heart opacity-60 mr-2" />
                                            Wishlist
                                            <span className="font-size-sm text-muted ml-auto">
                                                {
                                                    props.wishlists.wishlists
                                                        .length
                                                }
                                            </span>
                                        </a>
                                    </Link>
                                </li>
                                <li className="mb-0">
                                    <Link href="/account/tickets">
                                        <a
                                            className={`nav-link-style d-flex align-items-center px-4 py-3 ${router.pathname ===
                                                    "/account/tickets"
                                                    ? "active"
                                                    : ""
                                                }`}
                                            href="/account/tickets"
                                        >
                                            <i className="czi-help opacity-60 mr-2" />
                                            Support tickets
                                            <span className="font-size-sm text-muted ml-auto">
                                            {props.tickets.tickets &&
                                                props.tickets.tickets.length}
                                            </span>
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                            <div className="bg-secondary px-4 py-3">
                                <h3 className="font-size-sm mb-0 text-muted">
                                    Account settings
                                </h3>
                            </div>
                            <ul className="list-unstyled mb-0">
                                <li className="border-bottom mb-0">
                                    <Link href="/account/setting">
                                        <a
                                            className={`nav-link-style d-flex align-items-center px-4 py-3 ${router.pathname ===
                                                    "/account/setting"
                                                    ? "active"
                                                    : ""
                                                }`}
                                        >
                                            <i className="czi-user opacity-60 mr-2" />
                                            Profile info
                                        </a>
                                    </Link>
                                </li>
                                <li className="border-bottom mb-0">
                                    <Link href="/account/address">
                                        <a
                                            className={`nav-link-style d-flex align-items-center px-4 py-3 ${router.pathname ===
                                                    "/account/address"
                                                    ? "active"
                                                    : ""
                                                }`}
                                        >
                                            <i className="czi-location opacity-60 mr-2" />
                                            Addresses
                                        </a>
                                    </Link>
                                </li>
                                {/* <li className="mb-0">
                                    <Link href="/account/payment">
                                        <a
                                            className={`nav-link-style d-flex align-items-center px-4 py-3 ${
                                                router.pathname ===
                                                "/account/payment"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            href="/account/payment"
                                        >
                                            <i className="czi-card opacity-60 mr-2" />
                                            Payment methods
                                        </a>
                                    </Link>
                                </li> */}
                                <li className="border-bottom mb-0">
                                    <Link href="/account/changePassword">
                                        <a
                                            className={`nav-link-style d-flex align-items-center px-4 py-3 ${router.pathname ===
                                                    "/account/changePassword"
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
                                <li className="border-top mb-0">
                                    {/* <button
                    className="nav-link-style d-flex align-items-center px-4 py-3"
                    onClick={logout}
                  >
                    <i className="czi-sign-out opacity-60 mr-2" />
                    Sign out
                  </button> */}
                                    <SignOut type="label" label="Sign out" />
                                </li>
                            </ul>
                        </div>
                    </aside>
                    {React.cloneElement(props.children, {
                        token: session,
                    })}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        wishlists: state.wishlists,
        user: state.user.user,
        orders: state.orders,
        tickets: state.tickets,
        // paymentMethods: state.paymentMethods,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchWishlist: (token) => dispatch(fetchWishlist(token)),
        fetchOrder: (token) => dispatch(fetchOrder(token)),
        fetchTicket: (token) => dispatch(fetchTicket(token)),
        fetchAddress: (token) => dispatch(fetchAddress(token)),
        // fetchPaymentMethod: (token) => dispatch(fetchPaymentMethod(token)),
        removeUserDetail: () => dispatch(remove_user_detail()),
    };
};

export default withAuth(
    connect(mapStateToProps, mapDispatchToProps)(ProfileHeader)
);
