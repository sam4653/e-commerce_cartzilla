import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import Confetti from "react-confetti";

function checkoutComplete() {
    const router = useRouter();
    const { orderId } = router.query;
    // console.log("Cmp Check : ", orderId);
    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Order Placed</title>
            </Head>
            {orderId && <Confetti />}
            <div className="container pb-5 mb-sm-4">
                <div className="pt-5">
                    <div className="card py-3 mt-sm-3">
                        <div className="card-body text-center">
                            <h2 className="h4 pb-3">
                                Thank you for your order!
                            </h2>
                            <p className="font-size-sm mb-2">
                                Your order has been placed and will be processed
                                as soon as possible.
                            </p>
                            <p className="font-size-sm mb-2">
                                Make sure you make note of your order number,
                                which is{" "}
                                <span className="font-weight-medium">
                                    {orderId}
                                </span>
                            </p>
                            <p className="font-size-sm">
                                You will be receiving an email shortly with
                                confirmation of your order. <u>You can now:</u>
                            </p>
                            <Link href="/shop">
                                <a className="btn btn-secondary mt-3 mr-3">
                                    Go back shopping
                                </a>
                            </Link>
                            <Link
                                href={{
                                    pathname: "/order-tracking",
                                    query: { orderId },
                                }}
                            >
                                <a className="btn btn-primary mt-3" href="">
                                    <i className="czi-location"></i>&nbsp;Track
                                    order
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default checkoutComplete;
