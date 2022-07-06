import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import SwiperCore, { EffectFade, Autoplay, Navigation } from "swiper";
import Link from "next/link";
import styles from "../styles/Rutvik.module.css";
// import  pageCss from "swiper/css/pagination";
// import "swiper/css/navigation";
// import required modules
import { Pagination } from "swiper";
SwiperCore.use([EffectFade, Autoplay, Navigation]);
const Slider = ({ slider }) => {
  const [category, setCategory] = useState([]);
  useEffect(() => {
    const getCategory = async () => {
      await axios
        .get(`${process.env.HOST}/category/root`)
        .then((res) => {
          // console.log("category", category);
          setCategory(res.data.data);
        })
        .catch((err) => {
          // console.log(err);
          console.log(err?.response?.data?.message);
        });
    };
    getCategory();
    // return () => setCategory([]);
  }, []);

  return (
    <>
      <section className="cz-carousel cz-controls-lg">
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
          slidesPerView={1}
          modules={[EffectFade]}
          effect={"fade"}
          navigation={{
            nextEl: ".review-swiper-button-next-index",
            prevEl: ".review-swiper-button-prev-index",
          }}
        >
          {/* Carousel item */}
          {slider &&
            slider?.map((slide) => {
              return (
                <SwiperSlide
                  className={`swiperSlider ${styles.slider}`}
                  key={slide.id}
                >
                  <div className="">
                    <div className="d-lg-flex justify-content-center align-items-center">
                      <img
                        className={`d-block order-lg-2 mr-lg-n5 flex-shrink-0 ${styles.res}`}
                        src={slide.image}
                        alt="Summer Collection"
                      />
                      <div
                        className={`position-absolute mx-auto mr-lg-n5 py-0 px-4 mb-lg-5  order-lg-1 ${styles.pos} `}
                      >
                        <div
                          className={`pb-lg-5 mb-lg-5 text-center text-lg-left text-lg-nowrap ${styles.divText}`}
                        >
                          <h2
                            className={`text-light font-weight-light pb-1 from-left ${styles.h2} `}
                          >
                            {slide.title}
                          </h2>
                          <h1
                            className={`text-light display-4 from-left delay-1 ${styles.h1}`}
                          >
                            {slide.tagline}
                          </h1>
                          <p
                            className={`font-size-lg text-light pb-3 from-left delay-2 ${styles.p} `}
                          >
                            {slide.hashtag}
                          </p>
                          <Link href="/shop">
                            <a
                              className="btn btn-primary scale-up delay-4"
                            // href="/shop"
                            >
                              Shop Now
                              <i className="czi-arrow-right ml-2 mr-n1"></i>
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          {/* Item */}
          {/* <SwiperSlide className="swiperSlider">
            <div className="px-lg-5" style={{ backgroundColor: `#f5b1b0` }}>
              <div className="d-lg-flex justify-content-between align-items-center pl-lg-4">
                <img
                  className="d-block order-lg-2 mr-lg-n5 flex-shrink-0"
                  src="/img/home/hero-slider/02.jpg"
                  alt="Women Sportswear"
                />
                <div
                  className="position-relative mx-auto mr-lg-n5 py-5 px-4 mb-lg-5 order-lg-1"
                  style={{ maxWidth: `42rem`, zIndex: `10` }}
                >
                  <div className="pb-lg-5 mb-lg-5 text-center text-lg-left text-lg-nowrap">
                    <h2 className="text-light font-weight-light pb-1 from-bottom">
                      Hurry up! Limited time offer.
                    </h2>
                    <h1 className="text-light display-4 from-bottom delay-1">
                      Women Sportswear Sale
                    </h1>
                    <p className="font-size-lg text-light pb-3 from-bottom delay-2">
                      Sneakers, Keds, Sweatshirts, Hoodies &amp; much more...
                    </p>
                    <a
                      className="btn btn-primary scale-up delay-4"
                      href="#"
                    >
                      Shop Now<i className="czi-arrow-right ml-2 mr-n1"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="swiperSlider">
            <div className="px-lg-5" style={{ backgroundColor: `#eba170` }}>
              <div className="d-lg-flex justify-content-between align-items-center pl-lg-4">
                <img
                  className="d-block order-lg-2 mr-lg-n5 flex-shrink-0"
                  src="/img/home/hero-slider/03.jpg"
                  alt="Men Accessories"
                />
                <div
                  className="position-relative mx-auto mr-lg-n5 py-5 px-4 mb-lg-5 order-lg-1"
                  style={{ maxWidth: `42rem`, zIndex: `10` }}
                >
                  <div className="pb-lg-5 mb-lg-5 text-center text-lg-left text-lg-nowrap">
                    <h2 className="text-light font-weight-light pb-1 from-top">
                      Complete your look with
                    </h2>
                    <h1 className="text-light display-4 from-top delay-1">
                      New Men's Accessories
                    </h1>
                    <p className="font-size-lg text-light pb-3 from-top delay-2">
                      Hats &amp; Caps, Sunglasses, Bags &amp; much more...
                    </p>
                    <a
                      className="btn btn-primary scale-up delay-4"
                      href="#"
                    >
                      Shop Now<i className="czi-arrow-right ml-2 mr-n1"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide> */}
        </Swiper>
        {/* </div> */}
      </section>
      {/* Popular categories */}
      <section
        className="container position-relative pt-3 pt-lg-0 pb-5 mt-lg-n10"
        style={{ zIndex: `10` }}
      >
        <div className="row justify-content-center">
          <div className="col-xl-12  col-lg-9">
            <div className="card border-0 box-shadow-lg">
              <div className="card-body px-3 pt-grid-gutter pb-0 sliderMenu">
                <div className="cz-custom-controls-index">
                  <button
                    type="button"
                    className="review-swiper-button-prev-index2"
                  >
                    <i className="czi-arrow-left"></i>
                  </button>
                  <button
                    type="button"
                    className="review-swiper-button-next-index2"
                  >
                    <i className="czi-arrow-right"></i>
                  </button>
                </div>
                <Swiper
                  // install Swiper modules
                  // modules={[Navigation, Pagination, Scrollbar, A11y]}
                  // slidesPerView={5}
                  breakpoints={{
                    0: {
                      slidesPerView: 1,
                      spaceBetween:10,
                    },
                    480: {
                      slidesPerView: 2,
                      spaceBetween:10,
                    },
                    768: {
                      slidesPerView: 3,
                      spaceBetween:15,
                    },
                    1024: {
                      slidesPerView: 4,
                      spaceBetween:15,
                    },
                    1280: {
                      slidesPerView: 5,
                      spaceBetween:30,
                    },
                  }}
                  // spaceBetween={30}
                  initialSlide="1"
                  slidesPerGroup={1}
                  // loop={true}
                  loopFillGroupWithBlank={true}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={{
                    nextEl: ".review-swiper-button-next-index2",
                    prevEl: ".review-swiper-button-prev-index2",
                  }}
                  modules={[Pagination, Navigation]}
                  className="mySwiper"
                >
                  <div className="row no-gutters pl-1">
                    <div className="col-sm-4 px-2 mb-grid-gutter">
                      {category &&
                        category.map((sc, index) => {
                          return (
                            <>
                              <SwiperSlide key={index}>
                                <Link
                                  href={`/category/${sc.name.replace(
                                    " & ",
                                    "And"
                                  )}`}
                                  key={index}
                                >
                                  <a
                                    className="d-block text-center text-decoration-none mr-1"
                                    key={index}
                                  >
                                    <img
                                      src={`${sc.icon}`}
                                      alt="Category Icons"
                                      className={`rounded mb-3 ${styles.imgSize}`}
                                    />
                                    {/* <a className="nav-link" >{sc.name}</a> */}
                                    <h3 className="font-size-base pb-2 pt-1 mb-0">
                                      {sc.name}
                                    </h3>
                                    {/* <SubType menuId={sc.id} menuName={sc.name} /> */}
                                  </a>
                                </Link>
                              </SwiperSlide>
                            </>
                          );
                        })}
                      {/* <SwiperSlide>
                        <Link href="/category/men">
                          <a className="d-block text-center text-decoration-none mr-1">
                            <img
                              src="/img/home/categories/cat-sm01.jpg"
                              alt="Men"
                              className={`rounded mb-3 ${styles.imgSize}`}
                            />
                            <h3 className="font-size-base pb-2 pt-1 mb-0">Men</h3>
                          </a>
                        </Link>
                      </SwiperSlide> */}
                    </div>
                    {/*  <div className="col-sm-4 px-2 mb-grid-gutter">
                      <SwiperSlide>
                        <Link href="/category/men">
                          <a className="d-block text-center text-decoration-none mr-1">
                            <img
                              src="/img/home/categories/cat-sm01.jpg"
                              alt="Men"
                              className={`rounded mb-3 ${styles.imgSize}`}
                            />
                            <h3 className="font-size-base pb-2 pt-1 mb-0">Men</h3>
                          </a>
                        </Link>
                      </SwiperSlide>
                    </div>
                    <div className="col-sm-4 px-2 mb-grid-gutter">
                      <SwiperSlide>
                        <Link href="/category/men">
                          <a className="d-block text-center text-decoration-none mr-1">
                            <img
                              src="/img/components/cards/01.jpg"
                              alt="Men"
                              className={`rounded mb-3 ${styles.imgSize}`}
                            />
                            <h3 className="font-size-base pb-2 pt-1 mb-0">coat</h3>
                          </a>
                        </Link>
                      </SwiperSlide>
                    </div>
                    <div className="col-sm-4 px-2 mb-grid-gutter">
                      <SwiperSlide>
                        <Link href="/category/men">
                          <a className="d-block text-center text-decoration-none mr-1">
                            <img
                              src="/img/components/carousel/01.jpg"
                              alt="Men"
                              className={`rounded mb-3 ${styles.imgSize}`}
                            />
                            <h3 className="font-size-base pb-2 pt-1 mb-0">Shoes</h3>
                          </a>
                        </Link>
                      </SwiperSlide>
                    </div>
                    <div className="col-sm-4 px-2 mb-grid-gutter">

                      <SwiperSlide>
                        <Link href="/category/men">
                          <a className="d-block text-center text-decoration-none mr-1">
                            <img
                              src="/img/grocery/catalog/08.jpg"
                              alt="Men"
                              className={`rounded mb-3 ${styles.imgSize}`}
                            />
                            <h3 className="font-size-base pb-2 pt-1 mb-0">grocery</h3>
                          </a>
                        </Link>
                      </SwiperSlide>
                    </div>
                    <div className="col-sm-4 px-2 mb-grid-gutter">
                      <SwiperSlide>
                        <Link href="/category/men">
                          <a className="d-block text-center text-decoration-none mr-1">
                            <img
                              src="/img/grocery/catalog/01.jpg"
                              alt="Men"
                              className={`rounded mb-3 ${styles.imgSize}`}
                            />
                            <h3 className="font-size-base pb-2 pt-1 mb-0">Coconuts</h3>
                          </a>
                        </Link>
                      </SwiperSlide>
                    </div>
                    <div className="col-sm-4 px-2 mb-grid-gutter">
                      <SwiperSlide>
                        <Link href="/category/men">
                          <a className="d-block text-center text-decoration-none mr-1">
                            <img
                              src="/img/grocery/catalog/06.jpg"
                              alt="Men"
                              className={`rounded mb-3 ${styles.imgSize}`} />
                            <h3 className="font-size-base pb-2 pt-1 mb-0">Peanut Butter</h3>
                          </a>
                        </Link>
                      </SwiperSlide>
                    </div>

                    <div className="col-sm-4 px-2 mb-grid-gutter">
                      <SwiperSlide>
                        <Link href="/category/men">
                          <a className="d-block text-center text-decoration-none mr-1">
                            <img
                              src="/img/components/gallery/08.jpg"
                              alt="Men"
                              className={`rounded mb-3 ${styles.imgSize}`}
                            />
                            <h3 className="font-size-base pt-1 pb-2 mb-0">Dress</h3>
                          </a>
                        </Link>
                      </SwiperSlide>
                    </div>

                    <div className="col-sm-4 px-2 mb-grid-gutter">
                      <SwiperSlide>
                        <Link href="/category/men">
                          <a className="d-block text-center text-decoration-none mr-1">
                            <img
                              src="/img/components/gallery/03.jpg"
                              alt="Men"
                              className={`rounded mb-3 ${styles.imgSize}`}
                            />
                            <h3 className="font-size-base pt-1 pb-2 mb-0">Blue Top</h3>
                          </a>
                        </Link>
                      </SwiperSlide>
                    </div>

                    <div className="col-sm-4 px-2 mb-grid-gutter">
                      <SwiperSlide>
                        <Link href="/category/men">
                          <a className="d-block text-center text-decoration-none mr-1">
                            <img
                              src="/img/components/gallery/01.jpg"
                              alt="Men"
                              className={`rounded mb-3 ${styles.imgSize}`}
                            />
                            <h3 className="font-size-base pt-1 pb-2 mb-0">T-shirt</h3>
                          </a>
                        </Link>
                      </SwiperSlide>
                    </div>

                    <div className="col-sm-4 px-2 mb-grid-gutter">
                      <SwiperSlide>
                        <Link href="/category/men">
                          <a className="d-block text-center text-decoration-none mr-1">
                            <img
                              src="/img/grocery/catalog/04.jpg"
                              alt="Men"
                              className={`rounded mb-3 ${styles.imgSize}`}
                            />
                            <h3 className="font-size-base pt-1 pb-2 mb-0">Orange</h3>
                          </a>
                        </Link>
                      </SwiperSlide>
                    </div>

                    <div className="col-sm-4 px-2 mb-grid-gutter">
                      <SwiperSlide>
                        <Link href="/category/men">
                          <a className="d-block text-center text-decoration-none mr-1">
                            <img
                              src="/img/grocery/catalog/09.jpg"
                              alt="Men"
                              className={`rounded mb-3 ${styles.imgSize}`}
                            />
                            <h3 className="font-size-base pt-1 pb-2 mb-0">Shampoo</h3>
                          </a>
                        </Link>
                      </SwiperSlide>
                    </div>

                    <div className="col-sm-4 px-2 mb-grid-gutter">
                      <SwiperSlide>
                        <Link href="/category/men">
                          <a className="d-block text-center text-decoration-none mr-1">
                            <img
                              src="/img/grocery/catalog/01.jpg"
                              alt="Men"
                              className={`rounded mb-3 ${styles.imgSize}`}
                            />
                            <h3 className="font-size-base pt-1 pb-2 mb-0">Coconuts</h3>
                          </a>
                        </Link>
                      </SwiperSlide>
                    </div> */}
                  </div>
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

{
  /* <Link href="/category/men">
<a className="d-block text-center text-decoration-none mr-1">
  <img
    className="d-block rounded mb-3"
    src="/img/home/categories/cat-sm01.jpg"
    alt="Men"
  />
  <h3 className="font-size-base pt-1 mb-0">Men</h3>
</a>
</Link> */
}
export default Slider;

//     height: 300px;
// color: #ba5050
