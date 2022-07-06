import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Toast from "../../component/Toast";
import withAuth from "../../component/withAuth";
import { connect } from "react-redux";
import { addCheckoutShipping } from "../../Redux/Checkout/checkoutActions";
import Head from "next/head";

import Spinner from "../../component/Spinner";

const Shipping = (props) => {
    const { checkout } = props;
    const { shippingMethods } = props.shippingMethod;
    const router = useRouter();
    let checked = true;
// console.log("cart",props.carts)
    const radioValue = useRef(0);
    useEffect(async () => {
        if (checkout.details) {
            props.addCheckoutShipping({
                data: {
                    id: radioValue.current?.value,
                    fee: shippingMethods?.filter(
                        (s) => s.id === radioValue.current?.value
                    )[0].fee,
                },
            });
        } else {
            router.push("/checkout/detail");
            return null;
        }
    }, []);

    const handleProceed = async () => {
        props.addCheckoutShipping({
            data: {
                id: radioValue.current.value,
                fee: shippingMethods?.filter(
                    (s) => s.id === radioValue.current?.value
                )[0].fee,
            },
        });
        {props.carts.carts.length === 0 ? (
            Toast("No product found in Add to Cart !!")
        ) : (
                 router.push("/checkout/review")
        )
        }
    };

    return (
        <div>
            <Head>
                <title>Vaistra Ecommerce | Shipping</title>
            </Head>
            <h2 className="h6 pb-3 mb-2">Choose shipping method</h2>
            {shippingMethods.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-hover font-size-sm border-bottom">
                        <thead>
                            <tr>
                                <th className="align-middle" />
                                <th className="align-middle">
                                    Shipping method
                                </th>
                                <th className="align-middle">Delivery time</th>
                                <th className="align-middle">Handling fee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shippingMethods.map((m) => {
                                return (
                                    <tr key={m.id}>
                                        <td>
                                            <div className="custom-control custom-radio mb-4">
                                                <input
                                                    className="custom-control-input"
                                                    type="radio"
                                                    id={m.name}
                                                    value={m.id}
                                                    name="shippingMethod"
                                                    ref={
                                                        !checkout
                                                            .shippingMethodId.id
                                                            ? checked
                                                                ? radioValue
                                                                : null
                                                            : checkout
                                                                .shippingMethodId
                                                                .id == m.id
                                                                ? radioValue
                                                                : null
                                                    }
                                                    onChange={(e) => {
                                                        props.addCheckoutShipping(
                                                            {
                                                                data: {
                                                                    id: e.target
                                                                        .value,
                                                                    fee: m.fee,
                                                                },
                                                            }
                                                        );
                                                    }}
                                                    defaultChecked={
                                                        !checkout
                                                            .shippingMethodId.id
                                                            ? checked
                                                            : checkout
                                                                .shippingMethodId
                                                                .id == m.id
                                                    }
                                                />

                                                <label
                                                    className="custom-control-label"
                                                    htmlFor={m.name}
                                                />
                                                <span className="d-inline d-sm-none"></span>
                                                <span className="d-inline d-sm-none">
                                                    {(checked = false)}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="align-middle">
                                            <span className="text-dark font-weight-medium">
                                                {m.name}
                                            </span>
                                            <br />
                                            <span className="text-muted">
                                                {m.desc}
                                            </span>
                                        </td>
                                        <td className="align-middle">
                                            {m.deliveryTime}
                                        </td>
                                        <td className="align-middle">
                                            {m.fee}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <center>
                    <Spinner />
                </center>
            )}
            <div className="d-none d-lg-flex pt-4">
                <div className="w-50 pr-3">
                    <Link href="/checkout/detail">
                        <a
                            className="btn btn-secondary btn-block"
                            href="/checkout/detail"
                        >
                            <i className="czi-arrow-left mt-sm-0 mr-1" />
                            <span className="d-none d-sm-inline">
                                Back to Addresses
                            </span>
                            <span className="d-inline d-sm-none">Back</span>
                        </a>
                    </Link>
                </div>
                <div className="w-50 pl-2">
                    <button
                        type="button"
                        style={{ width: "100%" }}
                        onClick={handleProceed}
                    >
                        <a className="btn btn-primary btn-block">
                            <span className="d-none d-sm-inline">
                                Review your order
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

const mapStateToProps = (state) => {
    return {
        carts: state.carts,
        checkout: state.checkout,
        user: state.user,
        shippingMethod: state.shippingMethod,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addCheckoutShipping: (checkout) =>
            dispatch(addCheckoutShipping(checkout)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(Shipping));
