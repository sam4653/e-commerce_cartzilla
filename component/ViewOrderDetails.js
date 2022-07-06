import React, { useState } from "react";
import Portal from "../component/Portal";
import useSWR from "swr";
import axios from "axios";
import { getSession } from "next-auth/client";

const fetcher = async (url) => {
    const sess = await getSession();
    const data = await axios
        .get(url, {
            headers: {
                Authorization: sess.accessToken,
            },
        })
        .then((res) => res.data.data)
        .catch((err) => console.log(err));
    return data;
};
const convertPrice = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ViewOrderDetails = ({ orderId }) => {
    const { data, error } = useSWR(
        `${process.env.HOST}/order/${orderId}`,
        fetcher
    );
    return (
        <Portal>
            <div className="modal fade" id="order-details">
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Order No - {orderId}
                            </h5>
                            <button
                                className="close"
                                type="button"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body pb-0">
                            {data &&
                                data.productInfo?.map((p, i) => (
                                    //  {/* Item*/}
                                    <div
                                        className="row d-sm-flex mb-4 pb-3 pb-sm-2 border-bottom"
                                        key={i}
                                    >
                                        <div className="media d-block d-sm-flex text-center text-sm-left col-8">
                                            <a
                                                className="d-inline-block mx-auto mr-sm-4"
                                                href="#"
                                                style={{ width: "10rem" }}
                                            >
                                                <img
                                                    src={p.photos[0]}
                                                    alt="Product Image"
                                                />
                                            </a>
                                            <div className="media-body pt-2">
                                                <h3 className="product-title font-size-base mb-2">
                                                    <a href="#">
                                                        {p.productName}
                                                    </a>
                                                </h3>
                                                <div className="font-size-sm">
                                                    <span className="text-muted mr-2">
                                                        Size:
                                                    </span>
                                                    8.5
                                                </div>
                                                <div className="font-size-sm">
                                                    <span className="text-muted mr-2">
                                                        Color:
                                                    </span>
                                                    White &amp; Blue
                                                </div>
                                                <div className="font-size-lg text-accent pt-2">
                                                    ₹{p.price}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-2 pl-sm-3 mx-auto mx-sm-0 text-center col-2">
                                            <div className="text-muted mb-2">
                                                Quantity:
                                            </div>
                                            {p.quantity}
                                        </div>
                                        <div className="pt-2 pl-sm-3 mx-auto mx-sm-0 text-right col-2">
                                            <div className="text-muted mb-2">
                                                Subtotal
                                            </div>
                                            <span className="">
                                                ₹
                                                {(p.price * p.quantity).toFixed(
                                                    2
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        {/* Footer*/}
                        <div className="modal-footer flex-wrap justify-content-between bg-secondary font-size-md">
                            <div className="px-2 py-1">
                                <span className="text-muted">
                                    Subtotal:&nbsp;
                                </span>
                                <span>₹ {data?.subTotal}</span>
                            </div>
                            <div className="px-2 py-1">
                                <span className="text-muted">
                                    Shipping:&nbsp;
                                </span>
                                <span>
                                    ₹22.<small>50</small>
                                </span>
                            </div>
                            <div className="px-2 py-1">
                                <span className="text-muted">Tax:&nbsp;</span>
                                <span>
                                    ₹{" "}
                                    {(
                                        Number(data?.total) -
                                        Number(data?.subTotal)
                                    ).toFixed(2)}
                                </span>
                            </div>
                            <div className="px-2 py-1">
                                <span className="text-muted">Total:&nbsp;</span>
                                <span className="font-size-lg">
                                    ₹ {+data?.total + 22.5}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default ViewOrderDetails;
