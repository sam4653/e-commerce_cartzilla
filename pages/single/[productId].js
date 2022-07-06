import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactImageMagnify from "react-image-magnify";
import { connect } from "react-redux";
import Breadcrumb from "../../component/Breadcrumb";
import ViewProduct from "../../component/ViewProduct";
import useSWR from "swr";
import Link from "next/link";
import Reviews from "../../component/Reviews";
import styles from "../../styles/Rutvik.module.css";
import QuickView from "../../component/QuickView";
const fetcher = async (url) => {
    return await axios
        .get(url)
        .then((res) => res.data.data)
        .catch((err) => console.log(err));
};

const Single = () => {
    const [rating, setRating] = useState({ totalReviews: 0, averageRating: 0 })
    const router = useRouter();

    const productId = router.query.id;
    const { data, error } = useSWR(
        `${process.env.HOST}/product/${productId}`,
        fetcher
    );
    if (error) {
        console.log(err);
        toast.error("😢 " + err.response?.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
        });
    }
    // useEffect(async () => {
    //     await axios
    //         .get(`${process.env.HOST}/product/${productId}`)
    //         .then((res) => {
    //             setProductData(res.data.data);
    //         })
    //         .catch((err) => {
    //             console.log(err.response);
    //         });
    // }, [productId]);

    return (
        <div>
            {/* <div className="page-title-overlap bg-dark pt-4"> */}
            <div className={`position-relative pt-4 bg-dark`}>
                <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
                    <div className="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-light flex-lg-nowrap justify-content-center justify-content-lg-start">
                                <li className="breadcrumb-item">
                                    <Link href="/">
                                        <a
                                            className="text-nowrap"

                                        >
                                            <i className="czi-home" />
                                            Home
                                        </a>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item text-nowrap">
                                    <a href="#">Shop</a>
                                </li>
                                {/* <li
                                    className="breadcrumb-item text-nowrap active"
                                    aria-current="page"
                                >
                                    {data && data.productName}
                                </li> */}
                            </ol>
                        </nav>
                    </div>
                    <div className="order-lg-1 pr-lg-4 text-center text-lg-left">
                        {/* <h1 className="h3 text-dark mb-0">
                            {data && data.productName} 
                            Vaistra Shop
                        </h1> */}
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="bg-light box-shadow-lg rounded-lg px-4 py-3 mb-5">
                    <div className="px-lg-3">
                        {data ? <ViewProduct product={data} rating={rating} /> : ""}
                    </div>
                </div>
            </div>
            <div className="border-top my-lg-3 py-5">
                <div className="container">
                    {data ? <Reviews product={data} setRating={setRating} /> : ""}
                </div>
            </div>
        </div>
    );
};

export default Single;
