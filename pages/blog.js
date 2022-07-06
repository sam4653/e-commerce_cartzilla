import { Swiper, SwiperSlide } from "swiper/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getSession } from "next-auth/client";
import SwiperCore, { EffectFade, Autoplay, Navigation } from "swiper";
SwiperCore.use([EffectFade, Autoplay, Navigation]);
import Head from "next/head";
import Link from "next/link";
import Breadcrumb from "../component/Breadcrumb";
import styles from "../styles/Rutvik.module.css";
import parser from "html-react-parser";


const Blog = () => {

  const [blog, setBlog] = useState([]);
  useEffect(async () => {
    const getProductReview = async () => {
      const sess = await getSession();
      try {
        const res = await axios.get(
          `${process.env.HOST}/blogs`, {
          headers: { Authorization: sess.accessToken }
        },
        );
        // console.log("Blog Data::", blog)
        setBlog(res.data.data);
      } catch (err) {
        console.log(err.response);
      }
    };
    getProductReview();
  }, []);



  return (
    <>
      <Head>
        <title>Vaistra Ecommerce | Blog</title>
      </Head>
      <div>
        <div className="bg-dark py-4">
          <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
            <div className="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
              <Breadcrumb />
            </div>
            <div className="order-lg-1 pr-lg-4 text-center text-lg-left ">
              <h1 className="h3 mb-0 text-dark">Blog</h1>
            </div>
          </div>
        </div>
        {/* Page Content*/}
        <div className="container pb-5 mb-2 mb-md-4">
          
          {/* Featured posts carousel*/}
          {/* <div className=" cz-carousel pt-5">
            <div className="cz-custom-controls-index">
              <button type="button" className="review-swiper-button-prev-index">
                <i className="czi-arrow-left"></i>
              </button>
              <button type="button" className="review-swiper-button-next-index">
                <i className="czi-arrow-right"></i>
              </button>
            </div>
            <Swiper
              spaceBetween={10}
              slidesPerView={2}
              className="featured-posts-carousel"
              navigation={{
                nextEl: ".review-swiper-button-next-index",
                prevEl: ".review-swiper-button-prev-index",
              }}
            >
              <SwiperSlide className="blog-entry-thumb mb-3">
                <article>
                  <a className="" href="blog-single-sidebar.html">
                    <span className="blog-entry-meta-label font-size-sm">
                      <i className="czi-time" />
                      Sep 10
                    </span>
                    <img src="/img/blog/featured/01.jpg" alt="Featured post" />
                  </a>
                  <div className="d-flex justify-content-between mb-2 pt-1">
                    <h2 className="h5 blog-entry-title mb-0">
                      <a href="blog-single-sidebar.html">
                        Healthy Food - New Way of Living
                      </a>
                    </h2>
                    <a
                      className="blog-entry-meta-link font-size-sm text-nowrap ml-3 pt-1"
                      href="blog-single-sidebar.html#comments"
                    >
                      <i className="czi-message" />
                      13
                    </a>
                  </div>
                  <div className="d-flex align-items-center font-size-sm">
                    <a className="blog-entry-meta-link" href="#">
                      <div className="blog-entry-author-ava">
                        <img src="/img/blog/meta/04.jpg" alt="Olivia Reyes" />
                      </div>
                      Olivia Reyes
                    </a>
                    <span className="blog-entry-meta-divider" />
                    <div className="font-size-sm text-muted">
                      in{" "}
                      <a href="#" className="blog-entry-meta-link">
                        Lifestyle
                      </a>
                      ,{" "}
                      <a href="#" className="blog-entry-meta-link">
                        Nutrition
                      </a>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
              <SwiperSlide className="blog-entry-thumb mb-3">
                <article>
                  <a className="" href="blog-single-sidebar.html">
                    <span className="blog-entry-meta-label font-size-sm">
                      <i className="czi-time" />
                      Aug 27
                    </span>
                    <img src="/img/blog/featured/02.jpg" alt="Featured post" />
                  </a>
                  <div className="d-flex justify-content-between mb-2 pt-1">
                    <h2 className="h5 blog-entry-title mb-0">
                      <a href="blog-single-sidebar.html">
                        Online Payment Security Tips for Shoppers
                      </a>
                    </h2>
                    <a
                      className="blog-entry-meta-link font-size-sm text-nowrap ml-3 pt-1"
                      href="blog-single-sidebar.html#comments"
                    >
                      <i className="czi-message" />9
                    </a>
                  </div>
                  <div className="d-flex align-items-center font-size-sm">
                    <a className="blog-entry-meta-link" href="#">
                      <div className="blog-entry-author-ava">
                        <img src="/img/blog/meta/05.jpg" alt="Rafael Marquez" />
                      </div>
                      Rafael Marquez
                    </a>
                    <span className="blog-entry-meta-divider" />
                    <div className="font-size-sm text-muted">
                      in{" "}
                      <a href="#" className="blog-entry-meta-link">
                        Online shpopping
                      </a>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
              <SwiperSlide className="blog-entry-thumb mb-3">
                <article>
                  <a className="" href="blog-single-sidebar.html">
                    <span className="blog-entry-meta-label font-size-sm">
                      <i className="czi-time" />
                      Sep 10
                    </span>
                    <img src="/img/blog/featured/01.jpg" alt="Featured post" />
                  </a>
                  <div className="d-flex justify-content-between mb-2 pt-1">
                    <h2 className="h5 blog-entry-title mb-0">
                      <a href="blog-single-sidebar.html">
                        Healthy Food - New Way of Living
                      </a>
                    </h2>
                    <a
                      className="blog-entry-meta-link font-size-sm text-nowrap ml-3 pt-1"
                      href="blog-single-sidebar.html#comments"
                    >
                      <i className="czi-message" />
                      13
                    </a>
                  </div>
                  <div className="d-flex align-items-center font-size-sm">
                    <a className="blog-entry-meta-link" href="#">
                      <div className="blog-entry-author-ava">
                        <img src="/img/blog/meta/04.jpg" alt="Olivia Reyes" />
                      </div>
                      Olivia Reyes
                    </a>
                    <span className="blog-entry-meta-divider" />
                    <div className="font-size-sm text-muted">
                      in{" "}
                      <a href="#" className="blog-entry-meta-link">
                        Lifestyle
                      </a>
                      ,{" "}
                      <a href="#" className="blog-entry-meta-link">
                        Nutrition
                      </a>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
              <SwiperSlide className="blog-entry-thumb mb-3">
                <article>
                  <a
                    className="blog-entry-thumb mb-3"
                    href="blog-single-sidebar.html"
                  >
                    <span className="blog-entry-meta-label font-size-sm">
                      <i className="czi-time" />
                      Aug 16
                    </span>
                    <img src="/img/blog/featured/03.jpg" alt="Featured post" />
                  </a>
                  <div className="d-flex justify-content-between mb-2 pt-1">
                    <h2 className="h5 blog-entry-title mb-0">
                      <a href="blog-single-sidebar.html">
                        We Launched New Store in San Francisco!
                      </a>
                    </h2>
                    <a
                      className="blog-entry-meta-link font-size-sm text-nowrap ml-3 pt-1"
                      href="blog-single-sidebar.html#comments"
                    >
                      <i className="czi-message" />
                      23
                    </a>
                  </div>
                  <div className="d-flex align-items-center font-size-sm">
                    <a className="blog-entry-meta-link" href="#">
                      <div className="blog-entry-author-ava">
                        <img src="/img/blog/meta/03.jpg" alt="Paul Woodred" />
                      </div>
                      Paul Woodred
                    </a>
                    <span className="blog-entry-meta-divider" />
                    <div className="font-size-sm text-muted">
                      in{" "}
                      <a href="#" className="blog-entry-meta-link">
                        Cartzilla news
                      </a>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            </Swiper>
          </div>
          <hr className="mt-5" /> */}
          <div className="pt-5 mt-md-2">
            <div className="row justify-content-center pt-5 mt-2">
              <section className="col-lg-9">
                {blog.map((b, k) => {
                  return (
                    <article className="blog-list border-bottom pb-4 mb-5" key={k}>
                      <div className="left-column">
                        <div className="d-flex align-items-center font-size-sm pb-2 mb-1">
                          <a className="blog-entry-meta-link" href="#">
                            {/* <div className="blog-entry-author-ava">
                              <img src="img/blog/meta/03.jpg" alt="Paul Woodred" />
                            </div> */}
                            by {b.creator}
                          </a>
                          <span className="blog-entry-meta-divider"></span>
                          {b.category}
                          {/* <a className="blog-entry-meta-link" href="#">{b.category}</a> */}
                        </div>
                        <h2 className="h5 blog-entry-title">
                          <a href="#">{b?.title}</a>
                        </h2>
                      </div>
                      <div className="right-column">
                        <a className="blog-entry-thumb mb-3" href="#">
                          {b?.photos?.length ? (
                            // <img src={`${b.photos[0] ? b.photos[0] : "img/blog/02.jpg"}`} alt="Post" />
                            <img src={`${b.photos[0]}`} alt="Post" />
                          ):(
                            ""
                          )}
                        </a>
                        <div className="d-flex justify-content-between mb-1">
                          <div className="font-size-sm text-muted pr-2 mb-2">
                            <a href='#' className='blog-entry-meta-link'>{b?.caption?.join(", ")}</a>
                          </div>
                          {/* <div className="font-size-sm mb-2">
                            <a className="blog-entry-meta-link text-nowrap" href="blog-single.html#comments">
                              <i className="czi-message"></i>15</a>
                          </div> */}
                        </div>
                        <b>Description</b>:-
                        <p className="font-size-sm text-justify"> {parser(b?.desc)}</p>
                      </div>
                    </article>
                  )
                })}
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
