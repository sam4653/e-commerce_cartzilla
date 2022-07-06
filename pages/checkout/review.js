import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

toast.configure();

import Toast from "../../component/Toast";
import {
    deleteCart,
    fetchCart,
    resetCart,
    reset_cart,
    update_quantity,
} from "../../Redux/Cart/cartActions";

const Review = (props) => {
    // console.log("review Cart", props.carts.carts)
    const router = useRouter();
    const [taxesamt, setTaxesAmt] = useState("");
    const { checkout } = props;

    const [shippingTo, setShippingTo] = useState([]);
    useEffect(() => {
        if (!props.carts.carts) {
            router.replace("/cart");
            return null;
        }

        const { details, shippingMethodId, payment } = checkout;
        if (!details) {
            Toast("Please, Select Address Details!");
            router.replace("/checkout/detail");
        } else if (!shippingMethodId) {
            Toast("Please, Select Shipping Method Details!");
            router.replace("/checkout/shipping");
        }
        //  else if (
        //     !payment.name ||
        //     !payment.number ||
        //     !payment.cvc ||
        //     !payment.expiry
        // ) {
        //     Toast("Please, Fill Payment Method Details!");
        //     router.replace("/checkout/payment");
        // }
    }, [checkout]);

    useEffect(async () => {
        const productId = localStorage.getItem("productId");
        await axios
            .get(`${process.env.HOST}/product/${productId}`)
            .then((res) => {
                // console.log("Find Tax", res.data.data)
                setTaxesAmt(res.data.data);
            }).catch((error) => {
                console.log(error);
            })
    }, [])

    const addressId = checkout.details;
    useEffect(async () => {
        const token = props.user.token;

        await axios
            .get(`${process.env.HOST}/address/${addressId}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                setShippingTo(res.data.data);
            })
            .catch((err) => {
                console.log(err.response);
            });
    }, [addressId]);

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }



    const handleCompleteOrder = async () => {
        try {
            const res = await loadScript(
                props.carts.carts.length === 0 ? (
                    Toast("No product found in Add to Cart !!")
                ) : (
                    "https://checkout.razorpay.com/v1/checkout.js"
                )
            );

            // if (!res) {
            //     alert(
            //         "Razorpay Payment Gateway failed to load. Check your Internet Connection"
            //     );
            //     return;
            // }

            const products = props.carts.carts.map((c) => {
                return {
                    pId: c.pId,
                    quantity: c.quantity,
                    attributes: c.attributes,
                    total: c.total,
                };
            });

            // const taxes = (props.carts.total * taxesamt.tax) / 100;
            const taxes = localStorage.getItem("Taxv")
            const gtotal = (Number(props.carts.total) + Number(taxes) + Number(props.checkout.shippingMethodId.fee));
            console.log("", gtotal)
            const iData = {
                total: gtotal,
                products,
            };

            const result = await axios.post(
                `${process.env.HOST}/order`,
                iData,
                {
                    headers: { Authorization: props.user.token },
                }
            );

            if (!result) {
                alert(
                    "Network Error. Please Check Your Connection and Try Again...!"
                );
                return;
            }

            // console.log("Order Result :", result);
            const { amount, id, currency, orderId } =
                result.data.data.paymentInfo;

            // console.log("Notes : ", notes);

            const options = {
                key: process.env.RP_KEY_ID,
                amount: amount.toString(),
                currency: currency,
                name: checkout.payment.name,
                description: "Test Transaction",
                image: "/img/logo.png",
                order_id: id,
                handler: async function (response) {
                    const data = {
                        razorpayPaymentId: response.razorpay_payment_id,
                        orderCreationId: id,
                        razorpaySignature: response.razorpay_signature,
                    };

                    const result = await axios.post(
                        `${process.env.HOST}/payment/verify`,
                        data,
                        {
                            headers: { Authorization: props.user.token },
                        }
                    );
                    if (result) {
                        toast.success("Order Placed Successfully!", {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 1000,
                            onClose: () => {
                                router.replace({
                                    pathname: "/order-complete/[orderId]",
                                    query: { orderId },
                                });
                            },
                            closeOnClick: true,
                            pauseOnHover: true,
                            transition: Flip,
                        });
                        await props.resetCart({ token: props.user.token });
                        // await products.map((m) => {
                        //     props.deleteCart({
                        //         pid: m.pId,
                        //         token: props.user.token,
                        //     });
                        // });
                        // router.replace({
                        //     pathname: "/order-complete/[orderId]",
                        //     query: { orderId: id },
                        // });
                    }
                },
                prefill: {
                    name: props.user.user.fullName,
                    email: "test@gmail.com",
                    contact: shippingTo.mobileNo,
                },

                notes: { receive_from: "E-Commerce payment" },
            };
            const paymentObject = new Razorpay(options);
            await paymentObject.open();
        } catch (err) {
            console.log(err.response);
            Toast(err?.response?.data?.message);
        }
    };

    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Review</title>
            </Head>
            <div>
                <h2 className="h6 pt-1 pb-3 mb-3 border-bottom">
                    Review your order
                </h2>
                {props.carts.carts.map((cart) => {
                    return (
                        <div
                            className="d-sm-flex justify-content-between my-4 pb-3 border-bottom"
                            key={cart.id}
                        >
                            <div
                                className="media media-ie-fix d-block d-sm-flex text-center text-sm-left"
                                key={cart.id}
                            >
                                <a
                                    className="d-inline-block mx-auto mr-sm-4"
                                    href="#"
                                    style={{ width: "10rem" }}
                                >
                                    <img src={cart.photos[0]} alt={cart.name} />
                                </a>
                                <div className="media-body pt-2">
                                    <h3 className="product-title font-size-base mb-2">
                                        <a href="#">
                                            {cart.name}
                                        </a>
                                    </h3>
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                {/* <th scope="col"></th> */}
                                                <th scope="col">Size</th>
                                                <th scope="col">Color</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cart.attributes?.map((a, k) => {
                                                return (
                                                    <>
                                                        {/* <div className="font-size-sm">
                                                <span className="text-muted mr-2">
                                                    Size:
                                                </span>
                                                {a.size}
                                            </div>
                                            <div className="font-size-sm">
                                                <span className="text-muted mr-2">
                                                    Color:
                                                </span>
                                                {a.color}
                                            </div> */}
                                                        <tr>
                                                            <td>{a.size}</td>
                                                            <td>{a.color}</td>
                                                        </tr>
                                                    </>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                    {/* {cart.size !== null && (
                                        <div className="font-size-sm">
                                            <span className="text-muted mr-2">
                                                Size:
                                            </span>
                                            
                                            {cart?.size?.split(",")[0]}
                                        </div>
                                    )}
                                    <div className="font-size-sm">
                                        <span className="text-muted mr-2">
                                            Color:
                                        </span>
                                        {cart?.color?.split(",")[0]}
                                    </div> */}
                                    <div className="font-size-lg text-accent pt-2">
                                        {/* ₹{(cart.sellingPrice ? cart.sellingPrice : cart.sellingPrice).toString().split(".")[0]} */}
                                        ₹{(cart.sellingPrice ? cart.sellingPrice.toFixed(2) : cart.offerPrice.toFixed(2))}
                                        {/*.
                                        {/* <small>
                                            {
                                                (cart.sellingPrice ? cart.sellingPrice : cart.sellingPrice)
                                                    .toString()
                                                    .split(".")[2]
                                            }
                                        </small> */}
                                    </div>
                                </div>
                            </div>
                            <div
                                className="pt-2 pt-sm-0 pl-sm-3 mx-auto mx-sm-0 text-center text-sm-right"
                                style={{ maxWidth: "9rem" }}
                                key={cart.id}
                            >
                                <p className="mb-0">
                                    <span className="text-muted font-size-sm">
                                        Quantity:
                                    </span>
                                    <span>&nbsp;{cart.quantity}</span>
                                </p>
                                <Link href="/cart">
                                    <button
                                        className="btn btn-link px-0"
                                        type="button"
                                    >
                                        <i className="czi-edit mr-2" />
                                        <span className="font-size-sm">
                                            Edit
                                        </span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    );
                })}

                <div className="bg-secondary rounded-lg px-4 pt-4 pb-2">
                    <div className="row">
                        <div className="col-sm-6">
                            <h4 className="h6">Shipping to:</h4>
                            <ul className="list-unstyled font-size-sm">
                                <li>
                                    <span className="text-muted">
                                        Client:&nbsp;
                                    </span>
                                    {shippingTo.firstName} {shippingTo.lastName}
                                </li>
                                <li>
                                    <span className="text-muted">
                                        Address:&nbsp;
                                    </span>
                                    {shippingTo.line1},{shippingTo.line2},
                                    {shippingTo.city},{shippingTo.state},
                                    {shippingTo.country} - {shippingTo.pinCode}
                                </li>
                                <li>
                                    <span className="text-muted">
                                        Phone:&nbsp;
                                    </span>
                                    +91 {shippingTo?.mobileNo?.replace(/\B(?=(\d{5})+(?!\d))/g, " ")}
                                </li>
                            </ul>
                        </div>
                        <div className="col-sm-6">
                            {/* <h4 className="h6">Payment method:</h4>
                            <ul className="list-unstyled font-size-sm">
                                <li>
                                    <span className="text-muted">
                                        Credit Card:&nbsp;
                                    </span>
                                    **** **** ****{" "}
                                    {checkout.payment.number &&
                                        checkout.payment.number
                                            .toString()
                                            .split(" ")
                                            .slice(-1)}
                                </li>
                            </ul> */}
                        </div>
                    </div>
                </div>
                <div className=" d-flex pt-4">
                    <div className="w-50 pr-3">
                        <Link href="/checkout/shipping">
                            <a className="btn btn-secondary btn-block">
                                <i className="czi-arrow-left mt-sm-0 mr-1" />
                                <span className="d-none d-sm-inline">
                                    Back to Shipping
                                </span>
                                <span className="d-inline d-sm-none">Back</span>
                            </a>
                        </Link>
                    </div>
                    <div className="w-50 pl-2">
                        <button
                            type="button"
                            style={{ width: "100%" }}
                            onClick={handleCompleteOrder}
                        >
                            <a className="btn btn-primary btn-block">
                                <span className="d-none d-sm-inline">
                                    Complete order
                                </span>
                                <span className="d-inline d-sm-none">
                                    Complete
                                </span>
                                <i className="czi-arrow-right mt-sm-0 ml-1" />
                            </a>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        carts: state.carts,
        checkout: state.checkout,
        user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchCarts: () => dispatch(fetchCart()),
        deleteCart: (id) => dispatch(deleteCart(id)),
        resetCart: (token) => dispatch(resetCart(token)),
        updateQuantity: ({ token, quantity, pid }) =>
            dispatch(update_quantity({ token, quantity, pid })),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Review);
