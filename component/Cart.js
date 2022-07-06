import React, { useEffect, useState } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import axios from "axios";
import {
    deleteCart,
    fetchCart,
    update_quantity,
} from "../Redux/Cart/cartActions";
import { getSession } from "next-auth/client";
const Cart = (props) => {
    // console.log("IN Cart :", props);
    // alert("ptops ",props)

    const [session, setSession] = useState();

    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [country, setCountry] = useState();
    const [state, setState] = useState();
   alert("components")
    useEffect(async () => {
        const sess = await getSession();
        if (sess) {
            setSession(sess.accessToken);
        }
        // props.fetchCarts(sess.accessToken);
    }, []);
    const quantityChange = async (e, id) => {
        const value = e.target.value;
        if (value !== "" && +value !== 0) {
            return props.updateQuantity({
                token: session,
                quantity: value,
                pid: id,
            });
        }
        props.deleteCart({ pid: id, token: session });
    };

    const countryHandleChange = async (e) => {
        const selectedCountry = e.target.value;

        const countryName = e.target.options[e.target.selectedIndex].text;

        setCountry(countryName);

        await axios
            .get(
                `https://country-states-city.herokuapp.com/api/states/${selectedCountry}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                setStateList(response.data.data);
            })
            .catch((err) => {
                console.log(err.response.data);
            });
        // console.log(state);
    };

    const stateHandleChange = async (e) => {
        const selectedState = e.target.value;
        // var index = e.nativeEvent.target.selectedIndex;
        const stateName = e.target.options[e.target.selectedIndex].text;

        setState(stateName);

        // console.log(e.target.value);
        await axios
            .get(
                `https://country-states-city.herokuapp.com/api/city/${selectedState}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                setCityList(response.data.data);
            })
            .catch((err) => {
                console.log(err.response.data);
            });
        // console.log(state);
    };

    const onCalculateSubmit = () => {
        // console.log("Form Data :", country, state);
    };
    return (
        <>
            {/* Page Title*/}
            <div className="position-relative bg-dark pt-4">
                <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
                    <div className="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-light flex-lg-nowrap justify-content-center justify-content-lg-start">
                                <li className="breadcrumb-item">
                                    <Link href="/">
                                        <a className="text-nowrap">
                                            <i className="czi-home" />
                                            Home
                                        </a>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item text-nowrap">
                                    <Link href="/shop">
                                        <a>Shop</a>
                                    </Link>
                                </li>
                                <li
                                    className="breadcrumb-item text-nowrap active"
                                    aria-current="page"
                                >
                                    Cart
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="order-lg-1 pr-lg-4 text-center text-lg-left">
                        <h1 className="h3 text-light mb-0">Your cart</h1>
                    </div>
                </div>
            </div>
            {/* Page Content*/}
            <div className="container pb-5 mb-2 mb-md-4">
                <div className="row">
                    {/* List of items*/}
                    <section className="col-lg-8">
                        <div className="d-flex justify-content-between align-items-center pt-3 pb-2 pb-sm-5 mt-1">
                            <h2 className="h6 text-light mb-0">Products</h2>
                            <Link href="shop">
                                <a className="btn btn-outline-primary btn-sm pl-2">
                                    <i className="czi-arrow-left mr-2" />
                                    Continue shopping
                                </a>
                            </Link>
                        </div>
                        {}
                        {/* Item*/}
                        {props.carts.carts.map((cart) => {
                            return (
                            
                                <div
                                    className="d-sm-flex justify-content-between align-items-center my-4 pb-3 border-bottom"
                                    key={cart.pId}
                                >
                                {/* {console.log("proce",cart.price)} */}
                                    <div className="media media-ie-fix d-block d-sm-flex align-items-center text-center text-sm-left">
                                        <a
                                            className="d-inline-block mx-auto mr-sm-4"
                                            href="#"
                                            // style={{ width: "10rem" }}
                                        >
                                            <img
                                                src={cart.photos[0]}
                                                alt={cart.photos[0]}
                                                style={{
                                                    height: "10vh",
                                                    width: "10vw",
                                                }}
                                            />
                                        </a>
                                        <div className="media-body pt-2">
                                            <h3 className="product-title font-size-base mb-2">
                                                <a
                                                    href={`/single/${cart.name}?id=${cart.pId}`}
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                >
                                                    {cart.name}
                                                </a>
                                            </h3>
                                            {cart.size !== null && (
                                                <div className="font-size-sm">
                                                    <span className="text-muted mr-2">
                                                        Size:
                                                    </span>
                                                    {/* {cart.size[0]} */}
                                                </div>
                                            )}
                                            {cart.color !== null && (
                                                <div className="font-size-sm">
                                                    <span className="text-muted mr-2">
                                                        Color:
                                                    </span>
                                                    {/* {cart.color[0]} */}
                                                    {/* &amp; Blue */}
                                                </div>
                                            )}
                                            <div className="font-size-lg text-accent pt-2">
                                                ₹ {cart.price}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="pt-2 pt-sm-0 pl-sm-3 mx-auto mx-sm-0 text-center text-sm-left"
                                        style={{ maxWidth: "9rem" }}
                                    >
                                        <div className="form-group mb-0">
                                            <label
                                                className="font-weight-medium"
                                                htmlFor="quantity1"
                                            >
                                                Quantity
                                            </label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                id="quantity1"
                                                min="0"
                                                defaultValue={cart.quantity}
                                                onChange={(e) => {
                                                    quantityChange(e, cart.pId);
                                                }}
                                                // onKeyPress={(e) => {
                                                //   if (e.target.value.length === 0 && e.which == 48) {
                                                //     return false;
                                                //   }
                                                // }}
                                                onKeyDown={(e) => {
                                                    (e.keyCode === 69 ||
                                                        e.keyCode === 190) &&
                                                        e.preventDefault();
                                                }}
                                            />
                                        </div>
                                        <button
                                            className="btn btn-link px-0 text-danger"
                                            type="button"
                                            onClick={() =>
                                                props.deleteCart({
                                                    pid: cart.pId,
                                                    token: session,
                                                })
                                            }
                                        >
                                            <i className="czi-close-circle mr-2" />
                                            <span className="font-size-sm">
                                                Remove
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            className="btn btn-outline-accent btn-block"
                            type="button"
                        >
                            <i className="czi-loading font-size-base mr-2" />
                            Update cart
                        </button>
                    </section>
                    {/* Sidebar*/}
                    <aside className="col-lg-3 pt-4 pt-lg-0">
                        <div className="cz-sidebar-static rounded-lg box-shadow-lg ml-lg-auto">
                            <div className="text-center mb-4 pb-3 border-bottom">
                                <h2 className="h6 mb-3 pb-1">Subtotal</h2>
                                <h3 className="font-weight-normal">
                                    {props.carts.total}
                                </h3>
                            </div>
                            <div className="form-group mb-4">
                                <label
                                    className="mb-3"
                                    htmlFor="order-comments"
                                >
                                    <span className="badge badge-info font-size-xs mr-2">
                                        Note
                                    </span>
                                    <span className="font-weight-medium">
                                        Additional comments
                                    </span>
                                </label>
                                <textarea
                                    className="form-control"
                                    rows={6}
                                    id="order-comments"
                                    defaultValue={""}
                                />
                            </div>
                            <div className="accordion" id="order-options">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="accordion-heading">
                                            <a
                                                href="#promo-code"
                                                role="button"
                                                data-toggle="collapse"
                                                aria-expanded="true"
                                                aria-controls="promo-code"
                                            >
                                                Apply promo code
                                                <span className="accordion-indicator" />
                                            </a>
                                        </h3>
                                    </div>
                                    <div
                                        className="collapse show"
                                        id="promo-code"
                                        data-parent="#order-options"
                                    >
                                        <form
                                            className="card-body needs-validation"
                                            method="post"
                                            noValidate
                                        >
                                            <div className="form-group">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Promo code"
                                                    required
                                                    maxLength={10}
                                                />
                                                <div className="invalid-feedback">
                                                    Please provide promo code.
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-outline-primary btn-block"
                                                type="submit"
                                            >
                                                Apply promo code
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="accordion-heading">
                                            <a
                                                className="collapsed"
                                                href="#shipping-estimates"
                                                role="button"
                                                data-toggle="collapse"
                                                aria-expanded="true"
                                                aria-controls="shipping-estimates"
                                            >
                                                Shipping estimates
                                                <span className="accordion-indicator" />
                                            </a>
                                        </h3>
                                    </div>
                                    <div
                                        className="collapse"
                                        id="shipping-estimates"
                                        data-parent="#order-options"
                                    >
                                        <div className="card-body">
                                            <form
                                                className="needs-validation"
                                                noValidate
                                            >
                                                <div className="form-group">
                                                    <select
                                                        className="form-control custom-select"
                                                        onChange={
                                                            countryHandleChange
                                                        }
                                                        required
                                                    >
                                                        <option
                                                            value
                                                            disabled={true}
                                                            defaultValue="---- Choose your country ----"
                                                        >
                                                            ---- Choose your
                                                            country ----
                                                        </option>
                                                        <option value="IN">
                                                            India
                                                        </option>
                                                        <option value="IN">
                                                            Select India
                                                        </option>
                                                        {/* <option value="Belgium">Belgium</option>
                            <option value="Canada">Canada</option>
                            <option value="Finland">Finland</option>
                            <option value="Mexico">Mexico</option>
                            <option value="New Zealand">New Zealand</option>
                            <option value="Switzerland">Switzerland</option>
                            <option value="United States">United States</option> */}
                                                    </select>
                                                    <div className="invalid-feedback">
                                                        Please choose your
                                                        country!
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <select
                                                        className="form-control custom-select"
                                                        onChange={
                                                            stateHandleChange
                                                        }
                                                        required
                                                    >
                                                        <option
                                                            value="city"
                                                            disabled={true}
                                                        >
                                                            ---- Choose your
                                                            city ----
                                                        </option>
                                                        {stateList &&
                                                            stateList.map(
                                                                (s) => {
                                                                    return (
                                                                        <option
                                                                            value={
                                                                                s.key
                                                                            }
                                                                            key={
                                                                                s.key
                                                                            }
                                                                        >
                                                                            {
                                                                                s.name
                                                                            }
                                                                        </option>
                                                                    );
                                                                }
                                                            )}
                                                        {/* <option value="Brussels">Brussels</option>
                            <option value="Canberra">Canberra</option>
                            <option value="Helsinki">Helsinki</option>
                            <option value="Mexico City">Mexico City</option>
                            <option value="Ottawa">Ottawa</option>
                            <option value="Washington D.C.">
                              Washington D.C.
                            </option>
                            <option value="Wellington">Wellington</option> */}
                                                    </select>
                                                    <div className="invalid-feedback">
                                                        Please choose your city!
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder="ZIP / Postal code"
                                                        required
                                                    />
                                                    <div className="invalid-feedback">
                                                        Please provide a valid
                                                        zip!
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn btn-outline-primary btn-block"
                                                    type="submit"
                                                    onClick={onCalculateSubmit}
                                                >
                                                    Calculate shipping
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {session ? (
                                props.carts.carts.length ? (
                                    <Link href="/checkout/detail">
                                        <a className="btn btn-primary btn-shadow btn-block mt-4">
                                            <i className="czi-card font-size-lg mr-2" />
                                            Proceed to Checkout
                                        </a>
                                    </Link>
                                ) : (
                                    <Link href="/shop">
                                        <a className="btn btn-primary btn-shadow btn-block mt-4">
                                            <i className="czi-card font-size-lg mr-2" />
                                            Go For Shopping
                                        </a>
                                    </Link>
                                )
                            ) : (
                                <a
                                    className="btn btn-primary btn-sm btn-block"
                                    href="#signin-modal"
                                    data-toggle="modal"
                                >
                                    <i className="czi-card mr-2 font-size-base align-middle"></i>
                                    Checkout
                                </a>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
};

export default Cart;
