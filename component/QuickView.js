import ReactImageMagnify from "react-image-magnify";
import { useState, useRef, useEffect } from "react";
import { addCart } from "../Redux/Cart/cartActions";
import { connect } from "react-redux";
import { addWishlist, removeWishlist } from "../Redux/Wishlist/wishListActions";
import ProductGallery from "./ProductGallery";
import Parser from "html-react-parser";
import styles from "../styles/Rutvik.module.css"
import { getSession } from "next-auth/client";
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Ratings from 'react-ratings-declarative';
const quantitySize = [1, 2, 3, 4, 5];

const QuickView = (props) => {
    const { product } = props;
    // console.log("product",product)
    const quantityRef = useRef();
    const clicklink = useRef();
    // const [colorname, setColorname] = useState("");
    const [isShow, setIsShown] = useState(true)
    const [sessionUser, setSessionUser] = useState(null);
    const getsess = async () => {
        const sess = await getSession();
        // console.log("session",sess);
        setSessionUser(sess?.user?.role);
    }
    const [colorArr, setColorArr] = useState([]);
    const [sizeArr, setSizeArr] = useState([]);
    const [qtyArr, setQtyArr] = useState([]);
    const [colorname, setColorName] = useState("");
    const [sizename, setSizeName] = useState("");
    const [qtyname, setQtyName] = useState(1);

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
                    //  {setQtyArr([val.qty])} 
                ) : (
                    setColorName(""),
                    setColorArr([]),
                    color.push(val.color),
                    setColorArr(color),
                    setSizeName(""),
                    setSizeArr([])
                )}
            </>)
        }) : <></>
    }, [product])


    const addNewCart = (pId, name, photos, sellingPrice, attributes, quantity) => {
        if (props.user.token) {
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

    // const handleChange = (e) => {
    //     // alert(e.target.value);
    //     setColorname(e.target.value);

    // }

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
        <div className="row">
            <div className="col-lg-7 pr-lg-0"  >
                <ProductGallery photos={product.photos} videoLink={product.videoLink} show={isShow} setIsShown={setIsShown} />
            </div>
            <div className={`col-lg-5 pt-4 pt-lg-0 cz-image-zoom-pane ${styles.qty}`}>
                <div className="product-details ml-auto pb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <a
                            href={`/single/${product.productName}?id=${product.id}#reviews`}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <Ratings rating={Number(props.product.Average_Ratings ? props.product.Average_Ratings : 0)} widgetDimensions="14px" widgetSpacings="2px" >
                                <Ratings.Widget widgetRatedColor="#fea569" />
                                <Ratings.Widget widgetRatedColor="#fea569" />
                                <Ratings.Widget widgetRatedColor="#fea569" />
                                <Ratings.Widget widgetRatedColor="#fea569" />
                                <Ratings.Widget widgetRatedColor="#fea569" />
                            </Ratings>
                            <span className="d-inline-block font-size-sm text-body align-middle mt-1 ml-1">
                                {props.product.No_Of_Reviews ? props.product.No_Of_Reviews : 0} Reviews
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
                    <div className="mb-3">
                        <span className="text-dark mr-1">
                            {product.stock > 0 ? (
                                <>
                                    <span className="font-weight-bold lead h1">
                                        <sup>₹</sup>{" "}
                                        {
                                            Number(product.offerPrice ? product.offerPrice : product.sellingPrice).toFixed(2)
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
                        {/* <span className="h3 font-weight-normal text-accent mr-1">
                            ₹{product.price}.<small>99</small>
                        </span>
                        <del className="text-muted font-size-lg mr-3">
                            ₹25.<small>00</small>
                        </del> */}
                        <span className="badge badge-danger badge-shadow align-middle mt-n2">
                            Sale
                        </span>

                    </div>
                    <div className="font-size-sm mb-4">
                        {/* <span className="text-heading font-weight-medium mr-1">
                            Color:
                        </span> */}
                        {/* <span className="text-muted" style={{ wordWrap: "break-word" }}>{product.color}</span> */}
                    </div>

                    <div className="position-relative mr-n4 mb-3">
                        {
                            colorArr && colorArr?.map((col, index) => {
                                {/* console.log(col) */ }
                                return (
                                    <>
                                        <div className="custom-control custom-option custom-control-inline mb-2 " key={index} >
                                            <input
                                                className="custom-control-input"
                                                type="radio"
                                                name="color"
                                                id={`color${index}`}
                                                value={col}
                                                onClick={(e) => setColorName(e.target.value)}
                                            />
                                            <label
                                                className="custom-option-label rounded-circle"
                                                htmlFor={`color${index}`}
                                            >
                                                <span
                                                    className="custom-option-color rounded-circle" 
                                                    style={{
                                                        // backgroundImage: `url(/img/shop/single/color-opt-1.png)`,
                                                        backgroundColor: `${col}`,
                                                    }}

                                                ></span>
                                            </label>
                                        </div>

                                    </>
                                )
                            })
                        }

                        {/* <div className="custom-control custom-option custom-control-inline mb-2">
                            <input
                                className="custom-control-input"
                                type="radio"
                                name="color"
                                id="color2"
                            />
                            <label
                                className="custom-option-label rounded-circle"
                                htmlFor="color2"
                            >
                                <span
                                    className="custom-option-color rounded-circle"
                                    style={{
                                        backgroundImage: `url(/img/shop/single/color-opt-2.png)`,
                                    }}
                                ></span>
                            </label>
                        </div>
                        <div className="custom-control custom-option custom-control-inline mb-2">
                            <input
                                className="custom-control-input"
                                type="radio"
                                name="color"
                                id="color3"
                            />
                            <label
                                className="custom-option-label rounded-circle"
                                htmlFor="color3"
                            >
                                <span
                                    className="custom-option-color rounded-circle"
                                    style={{
                                        backgroundImage: `url(/img/shop/single/color-opt-3.png)`,
                                    }}
                                ></span>
                            </label>
                        </div> */}
                        <div
                            className={`product-badge product-${product.stock > 0
                                ? "available"
                                : "not-available"
                                } mt-n1`}
                        >
                            <i className="czi-security-check"></i>Product{" "}
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
                                            {/* <option value="">{console.log("size",c)}</option> */}
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
                                    )}
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
                                        // disabled={(product.stock > 0 ? false : true, colorname && sizename ? false : true)}
                                        disabled={(product.stock > 0 ? false : true, colorname && sizename ? false : true)}

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
                        </div>
                    </form>
                    <h5 className="h6 mb-3 pb-2 border-bottom">
                        <i className="czi-announcement text-muted font-size-lg align-middle mt-n1 mr-2"></i>
                        Product info
                    </h5>
                    <h6 className="font-size-sm mb-2">Style</h6>
                    <ul className="font-size-sm pl-4">
                        <li>Hooded top</li>
                    </ul>
                    <h6 className="font-size-sm mb-2">Product Description</h6>
                    <div dangerouslySetInnerHTML={{ __html: `${product.description}` }} />
                    {product.productDetail?.map((values) => {
                        return (
                            <>
                                <h6 className="font-size-sm mb-2" key={values}>
                                    {values.productKey}:
                                </h6>
                                <ul className="font-size-sm pl-4 mb-0" key={values}>
                                    <li>
                                        {values.productValue}
                                    </li>
                                </ul>
                            </>
                        );
                    })}
                    {/* <h6 className="font-size-sm mb-2">Art. No.</h6>
                    <ul className="font-size-sm pl-4 mb-0">
                        <li>183260098</li>
                    </ul> */}
                </div>
            </div>
        </div>
    );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(QuickView);
