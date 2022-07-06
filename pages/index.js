import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { set_quickViewProduct } from "../Redux/Account/accountActions";
import SwiperCore, { EffectFade, Autoplay, Navigation } from "swiper";
// import Slider from "../component/Slider";
// import Banner from "../component/Banner";
// import FeaturedCategory from "../component/FeaturedCategory";
import QuickView from "../component/QuickView";
import Portal from "../component/Portal";
import { connect } from "react-redux";
import { addCart } from "../Redux/Cart/cartActions";
import Link from "next/link";
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { addWishlist, removeWishlist } from "../Redux/Wishlist/wishListActions";
import { fetch_advertisement } from "../Redux/Account/accountActions";
import Head from "next/head";
import Parser from "html-react-parser";
import styles from "../styles/Rutvik.module.css";
import Ratings from "react-ratings-declarative";
import dynamic from "next/dynamic";
import { getSession } from "next-auth/client";
import router from "next/router";
import Lr from "../component/Lr";
import TrendingProducts from "../component/TrendingProducts";
toast.configure();

const Slider = dynamic(() => import("../component/Slider"));
const Banner = dynamic(() => import("../component/Banner"));
const FeaturedCategory = dynamic(() => import("../component/FeaturedCategory"));

SwiperCore.use([EffectFade, Autoplay, Navigation]);

const index = (props) => {
  const { featuredCategory } = props;
  const { trendingProducts } = props;
  const { brands } = props;
  const { quickViewProduct } = props.quickViewProduct;
  const [sessionUser, setSessionUser] = useState(null);
  const [featuredCategoryData, setFeaturedCategoryData] = useState([]);
  const clicklink = useRef();
  // const [colorname, setColorname] = useState("");
  const [select, setSelect] = useState("");
  const getsess = async () => {
    const sess = await getSession();
    // console.log("session",sess);
    setSessionUser(sess?.user?.role);
  };



  

  useEffect(async () => {
    props.fetchAdvertisements(props.advertisements);
    getsess();
    const type = featuredCategory?.type;
    await axios
      .get(`${process.env.HOST}/products/search?name=${type}`)
      .then((result) => {
        setFeaturedCategoryData(result.data.data);
        // console.log("data",result.data.data);
      })
      .catch((err) => {
        console.log(err);
        // toast("Product Not Found!");
      });
    return () => {
      type.unsubscribe();
    };
  }, []);

  const addNewCart = (
    pId,
    name,
    photos,
    sellingPrice,
    attributes,
    quantity
  ) => {
    if (props.user.token) {
      props.addCart({
        cart: { pId, name, photos, sellingPrice, attributes, quantity },
        token: props.user.token,
      });
    } else {
      // toast.error("😊 " + "Please enter your login details", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 1000,
      //     transition: Flip,
      // });
    }
  };

  const addWishlist = (e, product) => {
    const { checked } = e.target;
    if (props.user.token) {
      if (checked) {
        props.addWishlist({ token: props.user.token, product: product });
      } else {
        props.removeWishlist({ token: props.user.token, pid: product.id });
      }
    } else {
      // toast.error("😊 " + "Please enter your login details", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 1000,
      //     transition: Flip,
      // });
      clicklink.current.click();
    }
  };

  return (
    <>
      <Head>
        <title>Vaistra Ecommerce | Home</title>
      </Head>
      <Slider slider={props.slider} />
      <section className="container pt-md-3 pb-5 mb-md-3">
        <Portal>
          <div
            className="modal-quick-view modal fade"
            id="quick-view"
            tabIndex="-1"
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title product-title">
                    {/* <Link href={`/product/${quickViewProduct.productName}`}> */}
                    <a
                      data-toggle="tooltip"
                      data-placement="right"
                      title="Go to product page"
                      href={`/single/${quickViewProduct.productName}?id=${quickViewProduct.id}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {quickViewProduct && quickViewProduct.productName}
                      <i className="czi-arrow-right font-size-lg ml-2"></i>
                    </a>
                    {/* </Link> */}
                  </h4>
                  <button
                    className="close"
                    type="button"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {/* <div className="row"> */}
                  {/* Product gallery */}
                  {quickViewProduct && <QuickView product={quickViewProduct} />}
                </div>
              </div>
            </div>
          </div>
        </Portal>

        <h2 className="h3 text-center">Trending products</h2>
        <div className="row pt-4 mx-n2 ">
          {props.trendingProducts &&
            props.trendingProducts.map((product, i) => {
              return (
                <>
                  <TrendingProducts
                    product={product}
                    token={props.user.token}
                    wishlists={props.wishlists.wishlists}
                    addWishlist={addWishlist}
                    addNewCart={addNewCart}
                    loading={props.carts.loading}
                    key={product.id}
                  />
                </>
              );
            })}
        </div>
        <div className="text-center pt-3">
          <Link href="/shop">
            <a className="btn btn-outline-accent">
              More products
              <i className="czi-arrow-right ml-1"></i>
            </a>
          </Link>
        </div>
      </section>

      <section className="container pb-4 mb-md-3">
        <Banner advertisements={props.advertisements} />
      </section>

      {/* <section className="container py-lg-4">
        <h1 className="text-center">Budget savers to explore</h1>
        <div className="row text-center">
          <div
            className={`col-12  col-sm-6 col-lg-3 my-3 my-lg-0 ${styles.divHover}`}
          >
            <img src="/img/budget-1.jpg" alt="" width="300" height="300" />
          </div>
          <div
            className={`col-12  col-sm-6 col-lg-3 my-3 my-lg-0 ${styles.divHover}`}
          >
            <img src="/img/budget-2.jpg" alt="" width="300" height="300" />
          </div>
          <div
            className={`col-12 col-sm-6 col-lg-3 my-3 my-lg-0 ${styles.divHover}`}
          >
            <img src="/img/budget-3.jpg" alt="" width="300" height="300" />
          </div>
          <div
            className={`col-12 col-sm-6 col-lg-3 my-3 my-lg-0 ${styles.divHover}`}
          >
            <img src="/img/budget-4.jpg" alt="" width="300" height="300" />
          </div>
        </div>
      </section> */}

      {featuredCategoryData ? (
        <section className="container mb-4 pb-3 pb-sm-0 mb-sm-5">
          <div className="row">
            <div className="col-md-5">
              <div
                className="d-flex flex-column h-100 overflow-hidden rounded-lg"
                style={{ backgroundColor: `rgb(16, 14, 36)` }}
              >
                <div className="d-flex justify-content-between px-grid-gutter py-grid-gutter">
                  <div>
                    <h3 className="mb-1 text-white">
                      {featuredCategory?.title}
                    </h3>
                    <Link href="/shop">
                      <a
                        className="font-size-md text-white"
                        // href="shop-grid-ls.html"
                      >
                        Shop {featuredCategory?.type}
                        <i className="czi-arrow-right font-size-xs align-middle ml-1"></i>
                      </a>
                    </Link>
                  </div>
                  <div className="cz-custom-controls">
                    <button
                      type="button"
                      className="review-swiper-button-prev"
                      disabled={featuredCategoryData?.length < 7}
                    >
                      <i className="czi-arrow-left"></i>
                    </button>
                    <button
                      type="button"
                      className="review-swiper-button-next"
                      disabled={featuredCategoryData?.length < 7}
                    >
                      <i className="czi-arrow-right"></i>
                    </button>
                  </div>
                </div>
                <Link href="/shop">
                  <a
                    className="d-none d-md-block mt-auto"
                    // href="#"
                  >
                    <img
                      className="d-block w-100"
                      src={props.featuredCategory?.photo}
                      alt={props.featuredCategory?.title}
                      style={{ width: 495, height: 584 }}
                    />
                  </a>
                </Link>
              </div>
            </div>

            <div className="col-md-7 pt-4 pt-md-0">
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                allowTouchMove={false}
                loop={true}
                className="sliderMainSecond"
                style={{ width: `100%` }}
                navigation={{
                  nextEl: ".review-swiper-button-next",
                  prevEl: ".review-swiper-button-prev",
                }}
              >
                <SwiperSlide className="swiperSlider">
                  <div>
                    <div className="row mx-n2">
                      {featuredCategoryData &&
                        featuredCategoryData.slice(0, 6).map((p) => {
                          return (
                            <FeaturedCategory
                              product={p}
                              token={props.user.token}
                              wishlists={props.wishlists.wishlists}
                              key={p.id}
                              addWishlist={addWishlist}
                            />
                          );
                        })}
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="swiperSlider">
                  <div className="row mx-n2">
                    {featuredCategoryData &&
                      featuredCategoryData.length > 6 &&
                      featuredCategoryData.slice(6, 12).map((product) => {
                        return (
                          <FeaturedCategory
                            product={product}
                            token={props.user.token}
                            wishlists={props.wishlists.wishlists}
                            key={product.id}
                            addWishlist={addWishlist}
                          />
                        );
                      })}
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </section>
      ) : (
        <></>
      )}

      {/* <section className="container py-lg-4 mb-4">
                <h2 className="h3 text-center pb-4">Shop by brand</h2>
                <div className="row">
                    {brands &&
                        brands.map((brand) => {
                            return (
                                <div
                                    className="col-md-3 col-sm-4 col-6"
                                    key={brand.id}
                                >
                                    <Link
                                        href={`/shop/brand/${brand.name
                                            .toString()
                                            .split(" ")
                                            .join("_")}`}
                                    >
                                        <a className="d-block bg-white box-shadow-sm rounded-lg py-3 py-sm-4 mb-grid-gutter">
                                            <img
                                                className="d-block mx-auto"
                                                src={brand.image}
                                                style={{
                                                    width: `150px`,
                                                    height: `80px`,
                                                }}
                                                alt={brand.name}
                                            />
                                        </a>
                                    </Link>
                                </div>
                            );
                        })}
                </div>
            </section> */}

      {/* <section className="container-fluid px-0">
                <div className="row no-gutters">
                    <div className="col-md-6">
                        <Link href="/blog">
                            <a className="card border-0 rounded-0 text-decoration-none py-md-4 bg-faded-primary">
                                <div className="card-body text-center">
                                    <i className="czi-edit h3 mt-2 mb-4 text-primary"></i>
                                    <h3 className="h5 mb-1">Read the blog</h3>
                                    <p className="text-muted font-size-sm">
                                        Latest store, fashion news and trends
                                    </p>
                                </div>
                            </a>
                        </Link>
                    </div>
                    <div className="col-md-6">
                        <a
                            className="card border-0 rounded-0 text-decoration-none py-md-4 bg-faded-accent"
                            href="#"
                        >
                            <div className="card-body text-center">
                                <i className="czi-instagram h3 mt-2 mb-4 text-accent"></i>
                                <h3 className="h5 mb-1">Follow on Instagram</h3>
                                <p className="text-muted font-size-sm">
                                    #ShopWithVaistra
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </section> */}

      <div className="toast-container toast-bottom-center">
        <div
          className="toast mb-3"
          id="cart-toast"
          data-delay="5000"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header bg-success text-white">
            <i className="czi-check-circle mr-2"></i>
            <h6 className="font-size-sm text-white mb-0 mr-auto">
              Added to cart!
            </h6>
            <button
              className="close text-white ml-2 mb-1"
              type="button"
              data-dismiss="toast"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="toast-body">
            This item has been added to your cart.
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    carts: state.carts,
    wishlists: state.wishlists,
    user: state.user,
    quickViewProduct: state.quickViewProduct,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCart: (cart) => dispatch(addCart(cart)),
    addWishlist: (data) => dispatch(addWishlist(data)),
    removeWishlist: (data) => dispatch(removeWishlist(data)),
    setQuickViewProduct: (product) => dispatch(set_quickViewProduct(product)),
    fetchAdvertisements: (advertisements) =>
      dispatch(fetch_advertisement(advertisements)),
  };
};

export async function getServerSideProps(context) {
  const trendingProducts = await axios
    .get(`${process.env.HOST}/product/trending-product`)
    .then((res) => {
      // console.log("first :", res.data.data);
      return res.data.data;
    })
    .catch((err) => {
      return null;
    });

  const slider = await axios
    .get(`${process.env.HOST}/slider`)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      return null;
    });

  const advertisements = await axios
    .get(`${process.env.HOST}/advertisements`)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      return null;
    });

  const featuredCategory = await axios
    .get(`${process.env.HOST}/featured-category`)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      return null;
    });

  const brands = await axios
    .get(`${process.env.HOST}/brand`)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      return null;
    });

  return {
    props: {
      trendingProducts,
      slider,
      advertisements,
      featuredCategory,
      brands,
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
