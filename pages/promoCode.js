import React, { useEffect, useState } from 'react'
import { getSession } from "next-auth/client";
import axios from 'axios';
import Head from "next/head";
import styles from "../styles/Rutvik.module.css";
import Breadcrumb from "../component/Breadcrumb";
import parser from "html-react-parser";

export default function promoCode() {

    const [promoCode, setPromoCode] = useState([]);
    useEffect(async () => {
        const getProductReview = async () => {
            const sess = await getSession();
            try {
                const res = await axios.get(
                    `${process.env.HOST}/discounts`, {
                    headers: { Authorization: sess.accessToken }
                },
                );
                // console.log("Promo code Data::", res.data.data)
                setPromoCode(res.data.data);
            } catch (err) {
                console.log(err.response);
            }
        };
        getProductReview();
    }, []);

    return (
        <>
            <Head>
                <title>Vaistra Ecommerce | Promo Code</title>
            </Head>
            <div className="bg-dark py-4">
                <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
                    <div className="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                        <Breadcrumb />
                    </div>
                    <div className="order-lg-1 pr-lg-4 text-center text-lg-left ">
                        <h1 className="h3 mb-0 text-dark">Promo Code</h1>
                    </div>
                </div>
            </div>
            <section className="container">
                <h1>Discount Coupon</h1>
                {promoCode.map((p, k) => {
                    return (
                        <>
                            {promoCode.length ? (
                                <div className="store-offer-item">
                                    <div className="store-thumb-link">
                                        <div className="offer-image">
                                            <span className="offer-text">{p.value ? p.value : 0}% OFF </span>
                                        </div>
                                        <div className="store-name">
                                            <span>Discount on <p>{p.category}</p></span>
                                        </div>
                                    </div>
                                    <div className="latest-coupon">
                                        <h3 className="coupon-title"><i className="czi-discount"></i> {p.disc_name}</h3>
                                        <div className="coupon-des">
                                            <span className='font-weight-bold'>Description :</span> {parser(p.description)} 
                                            {/* <span id="des-more12" className="des-more">... 
                                        <a role="button" data-toggle="collapse" href="#seemore12" aria-expanded="false" aria-controls="seemore12">More 
                                        <i className="glyphicon glyphicon-menu-down"></i>
                                        </a>
                                        </span>
                                    <div className="coupon-des-full collapse" id="seemore12">Some exclusions apply. No code required. Limited time offer.</div> */}
                                        </div>
                                    </div>
                                    <div className="coupon-detail coupon-button-type">
                                        <a href="#" className="coupon-button coupon-code">
                                            <span className="code-text">{p.code ? p.code : 0}</span>
                                            <span className="get-code">Get Code</span>
                                        </a>
                                        <div className="exp-text">Expires on {p?.valid_until?.replace(/\T.*/g, "$'")}
                                            {/* <a title="Save This Coupon" href="#" className="coupon-save"><i className="czi-star-filled"></i></a> */}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="alert alert-danger my-3" role="alert">
                                    No Coupon Available
                                </div>
                            )}
                        </>
                    )
                })}
            </section>

        </>
    )
}