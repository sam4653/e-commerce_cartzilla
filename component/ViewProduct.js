import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import ReactImageMagnify from "react-image-magnify";
import { addCart } from "../Redux/Cart/cartActions";
import { addWishlist, removeWishlist } from "../Redux/Wishlist/wishListActions";
import ProductGallery from "./ProductGallery";
import Parser from "html-react-parser";
import { getSession } from "next-auth/client";
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Ratings from 'react-ratings-declarative';

const quantitySize = [1, 2, 3, 4, 5];

const ViewProduct = (props) => {
    const { product } = props;
    // console.log("product", props)
    const [isShow, setIsShown] = useState(true)
    const quantityRef = useRef();
    const clicklink = useRef();
    const [sessionUser, setSessionUser] = useState(null);
    // const [colorname, setColorname] = useState("")

    const [colorArr, setColorArr] = useState([]);
    const [sizeArr, setSizeArr] = useState([]);
    const [qtyArr, setQtyArr] = useState([]);
    const [colorname, setColorName] = useState("");
    const [sizename, setSizeName] = useState("");
    const [qtyname, setQtyName] = useState(1);
    const getsess = async () => {
        const sess = await getSession();
        // console.log("session",sess);
        setSessionUser(sess?.user?.role);
    }
    // const handleChange = (e) => {
    //     setColorname(e.target.value);
    // }

    const addNewCart = (pId, name, photos, sellingPrice, attributes, quantity) => {

        if (props.user.token) {
            // const quantity = parseInt(quantityRef?.current?.value);
            props.addCart({
                cart: { pId, name, photos, sellingPrice, attributes, quantity },
                quantity: quantity,
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

    const color = []
    const size = []
    const qty = []

    useEffect(() => {

        product ? product?.attributes?.map((val, ind) => {
            return (<>
                {val.size ? (
                    color.push(val.color),
                    size.push(val.size),
                    setColorArr(color),
                    setSizeArr(size)
                ) : (
                    color.push(val.color),
                    setColorArr(color),
                    setSizeArr([])
                )}
            </>)
        }) : <></>
    }, [product])



    useEffect(() => {
        getsess();
    }, [])
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
            {product &&
                <div className={`row `}>
                    <div className="col-lg-7 pr-lg-0"  >
                        <ProductGallery photos={product.photos} videoLink={product.videoLink} show={isShow} setIsShown={setIsShown} />
                    </div>
                    <div className={`col-lg-5 pt-4 pt-lg-0 cz-image-zoom-pane`}>
                        <div className="product-details ml-auto pb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <a href="#reviews" data-scroll>
                                    {/* <div className="star-rating">
                                        <i className="sr-star czi-star-filled active" />
                                        <i className="sr-star czi-star-filled active" />
                                        <i className="sr-star czi-star-filled active" />
                                        <i className="sr-star czi-star-filled active" />
                                        <i className="sr-star czi-star" />
                                    </div> */}
                                    <Ratings rating={Number(props.rating.averageRating ? props.rating.averageRating : 0)} widgetDimensions="18px" widgetSpacings="1px" >
                                        <Ratings.Widget widgetRatedColor="#fea569" />
                                        <Ratings.Widget widgetRatedColor="#fea569" />
                                        <Ratings.Widget widgetRatedColor="#fea569" />
                                        <Ratings.Widget widgetRatedColor="#fea569" />
                                        <Ratings.Widget widgetRatedColor="#fea569" />
                                    </Ratings>
                                    <span className="d-inline-block font-size-sm text-body align-middle mt-1 ml-1">
                                        {props.rating.totalReviews ? props.rating.totalReviews : 0} Reviews
                                    </span>
                                </a>
                                {
                                    props.user.token ? <>
                                        <input
                                            id={`heart${product.id}`}
                                            type="checkbox"
                                            className="heartCheckbox"
                                            checked={
                                                props.user.token &&
                                                props.wishlists.wishlists.some(
                                                    (item) =>
                                                        item.pId === product.id
                                                )
                                            }
                                            onChange={(e) =>
                                                addWishlist(e, product)
                                            }
                                        />
                                        <label
                                            htmlFor={`heart${product.id}`}
                                            className="customHeart btn-wishlist btn-sm"
                                        >
                                            <i className="czi-heart-filled"></i>
                                        </label>
                                    </>
                                        : <>
                                            <input
                                                id={`heart${product.id}`}
                                                type="checkbox"
                                                className="heartCheckbox"
                                                checked={
                                                    props.user.token &&
                                                    props.wishlists.wishlists.some(
                                                        (item) =>
                                                            item.pId === product.id
                                                    )
                                                }
                                                onChange={(e) =>
                                                    addWishlist(e, product)
                                                }
                                            />
                                            <label
                                                htmlFor={`heart${product.id}`}
                                                className="customHeart btn-wishlist btn-sm"
                                            >
                                                <i className="czi-heart-filled"></i>
                                            </label>

                                            <a className="text-white py-0" href="#signin-modal" ref={clicklink} data-toggle="modal" >
                                            </a>
                                        </>
                                }
                            </div>
                            <h3 className="product-title">
                                {product.productName}
                            </h3>
                            <div className="mb-3">
                                <span className="text-dark mr-1">
                                    {product.stock > 0 ? (
                                        <>
                                            <span className="font-weight-bold lead h1">
                                                <sup>₹</sup>{" "}
                                                {
                                                    Number(product.sellingPrice).toFixed(2)
                                                }{" "}
                                            </span>
                                            <span className="font-weight-normal">
                                                {" "}
                                                <small>
                                                    {" "}
                                                    <sup>₹</sup>
                                                    <del>
                                                        {
                                                            Number(product.MRP).toFixed(2)
                                                        }
                                                    </del>
                                                </small>
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-muted font-size-sm">
                                            Out of stock
                                        </span>
                                    )}
                                    {/* <sup>₹</sup>18.<small>99</small> */}
                                </span>
                                {/* <del className="text-muted font-size-lg mr-3">
                                <sup>₹</sup>25.<small>00</small>
                            </del> */}
                                <span className="badge badge-danger badge-shadow align-middle mt-n2">
                                    Sale
                                </span>
                            </div>
                            <div className="font-size-sm mb-4">
                                {/* <span className="text-heading font-weight-medium mr-1">
                                    Color:
                                </span>
                                <span className="text-muted" id="colorOption">
                                    {product.color}
                                </span> */}
                            </div>
                            <div className="position-relative mr-n4 mb-3">
                                {colorArr && colorArr?.map((c, index) => {
                                    return (
                                        <div className="custom-control custom-option custom-control-inline mb-2 " key={index} >
                                            <input
                                                className="custom-control-input"
                                                type="radio"
                                                name="color"
                                                id={`color${index}`}
                                                value={c}
                                                onClick={(e) => { setColorName(e.target.value), console.log(e.target.value) }}
                                            />
                                            <label
                                                className="custom-option-label rounded-circle"
                                                htmlFor={`color${index}`}
                                            >
                                                <span
                                                    className="custom-option-color rounded-circle"
                                                    style={{
                                                        // backgroundImage: `url(/img/shop/single/color-opt-1.png)`,
                                                        backgroundColor: `${c}`,
                                                    }}

                                                ></span>
                                            </label>
                                        </div>
                                    )
                                })
                                }
                                {/* <div className="custom-control custom-option custom-control-inline mb-2">
                                <input
                                    className="custom-control-input"
                                    type="radio"
                                    name="color"
                                    id="color2"
                                    data-label="colorOption"
                                    defaultValue="Beige/White/Dark grey"
                                />
                                <label
                                    className="custom-option-label rounded-circle"
                                    htmlFor="color2"
                                >
                                    <span
                                        className="custom-option-color rounded-circle"
                                        style={{
                                            backgroundImage: "url(/img/shop/single/color-opt-2.png)",
                                        }}
                                    />
                                </label>
                            </div>
                            <div className="custom-control custom-option custom-control-inline mb-2">
                                <input
                                    className="custom-control-input"
                                    type="radio"
                                    name="color"
                                    id="color3"
                                    data-label="colorOption"
                                    defaultValue="Dark grey/White/Orange"
                                />
                                <label
                                    className="custom-option-label rounded-circle"
                                    htmlFor="color3"
                                >
                                    <span
                                        className="custom-option-color rounded-circle"
                                        style={{
                                            backgroundImage: "url(/img/shop/single/color-opt-3.png)",
                                        }}
                                    />
                                </label>
                            </div> */}
                                <div
                                    className={`product-badge product-${product.stock > 0
                                        ? "available"
                                        : "not-available"
                                        } mt-n1`}
                                >
                                    <i className="czi-security-check" />
                                    Product{" "}
                                    {product.stock > 0
                                        ? "available"
                                        : "not available"}
                                </div>
                            </div>
                            <form className="mb-grid-gutter">
                                <div className="form-group d-flex align-items-center">
                                    {sizeArr.length > 0 ? <select className="custom-select custom-select-sm mx-3" name="size" id="size" onClick={(e) => setSizeName(e.target.value)}>
                                        {sizeArr?.map((c, index) => {
                                            return (
                                                <>
                                                    <option value={c}>{c}</option>
                                                </>
                                            )
                                        })
                                        }
                                    </select> : <></>}
                                    {
                                        props.user.token ? <button
                                            className="btn btn-primary btn-shadow btn-block"
                                            type="button"
                                            data-toggle="toast"
                                            data-target="#cart-toast"
                                            onClick={() => addNewCart(product.id, product.productName, product.photos, product.offerPrice ? product.offerPrice : product.sellingPrice, [{ "color": colorname, "size": sizename, "qty": qtyname }], 1)}
                                            disabled={sizeArr.length > 0 ? (
                                                    product.stock > 0 ? false : true, sizename && colorname ? false : true
                                                    ) : (
                                                        product.stock > 0 ? false : true, colorname ? false : true
                                                )
                                            
                                            }
                                        >
                                            {props.carts.loading ? (
                                                <div
                                                    className="spinner-border spinner-border-sm text-white"
                                                    role="status"
                                                >
                                                    <span className="sr-only">
                                                        Loading...
                                                    </span>
                                                </div>
                                            ) : (
                                                <>
                                                    <i className="czi-cart font-size-lg mr-2"></i>
                                                    Add to Cart
                                                </>
                                            )}
                                        </button> :
                                            <button
                                                className="btn btn-primary btn-shadow btn-block"
                                                type="button"
                                                data-toggle="toast"
                                                data-target="#cart-toast"
                                                onClick={() => addNewCart(product.id, product.productName, product.photos, product.offerPrice ? product.offerPrice : product.sellingPrice, [{ "color": colorname, "size": sizename, "qty": qtyname }], 1)}
                                                disabled={(product.stock > 0 ? false : true, colorname && sizename ? false : true)} //caal
                                            >
                                                {props.carts.loading ? (
                                                    <div
                                                        className="spinner-border spinner-border-sm text-white"
                                                        role="status"
                                                    >
                                                        <span className="sr-only">
                                                            Loading...
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <a
                                                            className="text-white py-0" href={product.stock > 0 ? "#signin-modal" : " "} data-toggle="modal" >
                                                            <div className="">
                                                                {/* <i className="navbar-tool-icon czi-heart mx-lg-2"></i> */}
                                                                <i className="czi-cart font-size-lg mr-2"></i>
                                                                Add to Cart
                                                            </div>
                                                        </a>
                                                    </>
                                                )}
                                            </button>
                                    }
                                    {/* <button
                                    className="btn btn-primary btn-shadow btn-block"
                                    type="submit"
                                >
                                    <i className="czi-cart font-size-lg mr-2" />
                                    Add to Cart
                                </button> */}
                                </div>
                            </form>
                            {/* Product panels */}
                            <div className="accordion mb-4" id="productPanels">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="accordion-heading">
                                            <a
                                                href="#productInfo"
                                                role="button"
                                                data-toggle="collapse"
                                                aria-expanded="true"
                                                aria-controls="productInfo"
                                            >
                                                <i className="czi-announcement text-muted font-size-lg align-middle mt-n1 mr-2" />
                                                Product info
                                                <span className="accordion-indicator" />
                                            </a>
                                        </h3>
                                    </div>
                                    <div
                                        className="collapse show"
                                        id="productInfo"
                                        data-parent="#productPanels"
                                    >
                                        <div className="card-body">
                                            <h6 className="font-size-sm mb-2">
                                                Description :
                                            </h6>
                                            <p>
                                                {Parser(
                                                    product.description
                                                )}
                                            </p>
                                            {/* <ul className="font-size-sm pl-4">
                                            <li>
                                                Elastic rib: Cotton 95%,
                                                Elastane 5%
                                            </li>
                                            <li>Lining: Cotton 100%</li>
                                            <li>Cotton 80%, Polyester 20%</li>
                                        </ul> */}
                                            {product.productDetail.map((values) => {
                                                return (
                                                    <>
                                                        <h6 className="font-size-sm mb-2" key={values}>
                                                            {values.productKey} :
                                                        </h6>
                                                        <ul className="font-size-sm pl-4 mb-0">
                                                            <li>
                                                                {values.productValue}
                                                            </li>
                                                        </ul>
                                                    </>
                                                );
                                            })}
                                            {/* <h6 className="font-size-sm mb-2">
                                            Art. No.
                                        </h6>
                                        <ul className="font-size-sm pl-4 mb-0">
                                            <li>183260098</li>
                                        </ul> */}
                                        </div>
                                    </div>
                                </div>
                                {!props.view && (
                                    <>
                                        <div className="card">
                                            <div className="card-header">
                                                <h3 className="accordion-heading">
                                                    <a
                                                        className="collapsed"
                                                        href="#shippingOptions"
                                                        role="button"
                                                        data-toggle="collapse"
                                                        aria-expanded="true"
                                                        aria-controls="shippingOptions"
                                                    >
                                                        <i className="czi-delivery text-muted lead align-middle mt-n1 mr-2" />
                                                        Shipping options
                                                        <span className="accordion-indicator" />
                                                    </a>
                                                </h3>
                                            </div>
                                            <div
                                                className="collapse"
                                                id="shippingOptions"
                                                data-parent="#productPanels"
                                            >
                                                <div className="card-body font-size-sm">
                                                    <div className="d-flex justify-content-between border-bottom pb-2">
                                                        <div>
                                                            <div className="font-weight-semibold text-dark">
                                                                Courier
                                                            </div>
                                                            <div className="font-size-sm text-muted">
                                                                2 - 4 days
                                                            </div>
                                                        </div>
                                                        <div>₹{product.additionalDetail.zonalDeliveryCharge ? product.additionalDetail.zonalDeliveryCharge : 0}.00</div>
                                                    </div>
                                                    <div className="d-flex justify-content-between py-2">
                                                        <div>
                                                            <div className="font-weight-semibold text-dark">
                                                                Local shipping
                                                            </div>
                                                            <div className="font-size-sm text-muted">
                                                                up to one week
                                                            </div>
                                                        </div>
                                                        <div>₹{product.additionalDetail.localDeliveryCharge ? product.additionalDetail.localDeliveryCharge : 0}.00</div>
                                                    </div>
                                                    {/* <div className="d-flex justify-content-between border-bottom py-2">
                                                        <div>
                                                            <div className="font-weight-semibold text-dark">
                                                                Flat rate
                                                            </div>
                                                            <div className="font-size-sm text-muted">
                                                                5 - 7 days
                                                            </div>
                                                        </div>
                                                        <div>₹33.85</div>
                                                    </div> */}
                                                    {/* <div className="d-flex justify-content-between border-bottom py-2">
                                                        <div>
                                                            <div className="font-weight-semibold text-dark">
                                                                UPS ground shipping
                                                            </div>
                                                            <div className="font-size-sm text-muted">
                                                                4 - 6 days
                                                            </div>
                                                        </div>
                                                        <div>₹18.00</div>
                                                    </div> */}
                                                    {/* <div className="d-flex justify-content-between pt-2">
                                                        <div>
                                                            <div className="font-weight-semibold text-dark">
                                                                Local pickup from
                                                                store
                                                            </div>
                                                            <div className="font-size-sm text-muted">
                                                                —
                                                            </div>
                                                        </div>
                                                        <div>₹0.00</div>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="card">
                                        <div className="card-header">
                                            <h3 className="accordion-heading">
                                                <a
                                                    className="collapsed"
                                                    href="#localStore"
                                                    role="button"
                                                    data-toggle="collapse"
                                                    aria-expanded="true"
                                                    aria-controls="localStore"
                                                >
                                                    <i className="czi-location text-muted font-size-lg align-middle mt-n1 mr-2" />
                                                    Find in local store
                                                    <span className="accordion-indicator" />
                                                </a>
                                            </h3>
                                        </div>
                                        <div
                                            className="collapse"
                                            id="localStore"
                                            data-parent="#productPanels"
                                        >
                                            <div className="card-body">
                                                <select className="custom-select">
                                                    <option value>
                                                        Select your country
                                                    </option>
                                                    <option value="Argentina">
                                                        Argentina
                                                    </option>
                                                    <option value="Belgium">
                                                        Belgium
                                                    </option>
                                                    <option value="France">
                                                        France
                                                    </option>
                                                    <option value="Germany">
                                                        Germany
                                                    </option>
                                                    <option value="Spain">
                                                        Spain
                                                    </option>
                                                    <option value="UK">
                                                        United Kingdom
                                                    </option>
                                                    <option value="USA">
                                                        USA
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div> */}
                                    </>
                                )}
                            </div>
                            {/* <h6 className="d-inline-block align-middle font-size-base my-2 mr-2">
                                Share:
                            </h6>
                            <a className="share-btn sb-twitter mr-2 my-2" href="#">
                                <i className="czi-twitter" />
                                Twitter
                            </a>
                            <a
                                className="share-btn sb-instagram mr-2 my-2"
                                href="#"
                            >
                                <i className="czi-instagram" />
                                Instagram
                            </a>
                            <a className="share-btn sb-facebook my-2" href="#">
                                <i className="czi-facebook" />
                                Facebook
                            </a> */}
                        </div>
                    </div>
                </div >
            }</>

    );

}

const mapStateToProps = (state) => {
    return {
        carts: state.carts,
        wishlists: state.wishlists,
        user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addCart: (cart) => dispatch(addCart(cart)),
        addWishlist: (data) => dispatch(addWishlist(data)),
        removeWishlist: (data) => dispatch(removeWishlist(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewProduct);