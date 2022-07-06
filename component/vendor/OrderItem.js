import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

const OrderItem = ({ order, key, pageNumber }) => {
    const { productInfo } = order;
    const [toggle, setToggle] = useState(false);
    //  console.log(productInfo);
    const orderDate = new Date(order.createdAt);
    const offset = orderDate.getTimezoneOffset();
    const date2 = orderDate.getMinutes() - offset;
    orderDate.setMinutes(date2);
    useEffect(() => {
      setToggle(false)
    }, [pageNumber])
    
    return (
        <div key={key}>
            <div className="d-sm-flex justify-content-between mb-2 pb-3 pb-sm-2 border-bottom">
                <div className="container-fluid py-1 mx-auto">
                    <div className="card order px-3">
                        <div className="row justify-content-start px-3 pt-3 pb-1 border-bottom">
                            {/* <div className="image-bg mr-3">
                                <img
                                    className="user-img fit-image rounded-circle"
                                    src="https://i.imgur.com/RCwPA3O.jpg"
                                    style={{ width: "50px", height: "50px" }}
                                />
                            </div> */}
                            <div
                                className="text-left"
                                style={{ lineHeight: "1" }}
                            >
                                <h4 className="m-0 text-capitalize">
                                    {order.userDetails.firstName +
                                        " " +
                                        order.userDetails.lastName}
                                </h4>
                                <small className="lh-s">
                                    E-Mail : {order.userDetails.email}
                                </small>
                                <br />
                                <small className="text-height-1 fa fa-star">
                                    Ordered Date :{" "}
                                    <span className="text-uppercase">

                                    {orderDate.toLocaleString("en-IN", {
                                        // weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                        hour12: true,
                                    })}
                                    </span>
                                </small>
                            </div>
                            <div className="ml-auto text-right w-100">
                                Order ID : {order.id} <br />
                                Total Amount : ₹ {order.total}
                            </div>
                        </div>
                        {toggle &&
                            productInfo?.map((product, i) => {
                                return (
                                    <div
                                        className="row d-flex justify-content-between px-3 pt-1"
                                        key={i}
                                    >
                                        <div className="media media-ie-fix d-block d-sm-flex text-center text-sm-left mb-1 w-100">
                                            <a
                                                className="d-inline-block mx-auto mr-sm-4"
                                                href={`/single/${product.productName}?id=${product.id}`}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                                style={{ width: "5rem" }}
                                            >
                                                <img
                                                    src={product?.photos[0]}
                                                    alt="Product"
                                                />
                                            </a>
                                            <div className="media-body pt-2">
                                                <h3 className="product-title font-size-base mb-0">
                                                    <a
                                                        href={`/single/${product.productName}?id=${product.id}`}
                                                        rel="noopener noreferrer"
                                                        target="_blank"
                                                    >
                                                        {/* {product.productName} */}
                                                        {product.productName}
                                                    </a>
                                                </h3>

                                                <div className="font-size-sm">
                                                    <span className="text-muted mr-2">
                                                        Quantity :
                                                    </span>
                                                    {product.quantity}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-auto text-right w-25">
                                            Product ID : {product.id} <br />
                                            price : ₹ {product.price}
                                        </div>
                                    </div>
                                );
                            })}
                        <a
                            className="nav-link-style btn ml-auto py-1 px-0"
                            onClick={() => setToggle(!toggle)}
                        >
                            {toggle ? "Show Less <<<" : "Show More >>>"}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
const mapStateToProps = (state) => {
    return {
        ordersLoading: state.orders.loading,
    };
};

export default connect(mapStateToProps)(OrderItem);
