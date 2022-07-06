import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { set_quickViewProduct } from "../Redux/Account/accountActions";
import Ratings from 'react-ratings-declarative';

const ShopProductList = ({
    product,
    token,
    wishlists,
    addWishlist,
    addNewCart,
    loading,
    clicklink,
    setQuickViewProduct,
}) => {

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
                ) : (
                    color.push(val.color),
                    setColorArr(color),
                    setSizeArr([])
                )}
            </>)
        }) : <></>
    }, [product])
    return (
        //  Product card (List)
        // <div className="col-lg-3 col-md-4 col-sm-6 px-2 mb-4">
        <div className="card product-card product-list">
            <span className="badge badge-danger badge-shadow align-middle mt-n2">
                Sale
            </span>
            {
                token ? <>
                    <input
                        id={`heart${product.id}`}
                        type="checkbox"
                        className="heartCheckbox"
                        checked={
                            token &&
                            wishlists.some((item) => item.pId === product.id)
                        }
                        onChange={(e) => addWishlist(e, product)}
                    />
                    <label
                        htmlFor={`heart${product.id}`}
                        className="customHeart btn-wishlist btn-sm"
                    >
                        <i className="czi-heart-filled active"></i>
                    </label>

                </> : <>
                    <input
                        id={`heart${product.id}`}
                        type="checkbox"
                        className="heartCheckbox"
                        checked={
                            token &&
                            wishlists.some((item) => item.pId === product.id)
                        }
                        onChange={(e) => addWishlist(e, product)}
                    />
                    <label
                        htmlFor={`heart${product.id}`}
                        className="customHeart btn-wishlist btn-sm"
                    >
                        <i className="czi-heart-filled active"></i>
                    </label>
                    <a className="text-white py-0" href="#signin-modal" ref={clicklink} data-toggle="modal" >
                    </a>
                </>
            }
            <div className="d-sm-flex align-items-center">
                <a className="product-list-thumb">
                    <img
                        src={product.photos[0]}
                        alt="Product"
                        style={{ height: "200px", width: "100%" }}
                    />
                </a>

                <div className="card-body py-2">
                    <Ratings rating={Number(product.Average_Ratings ? product.Average_Ratings : 0)} widgetDimensions="14px" widgetSpacings="2px" >
                        <Ratings.Widget widgetRatedColor="#fea569" />
                        <Ratings.Widget widgetRatedColor="#fea569" />
                        <Ratings.Widget widgetRatedColor="#fea569" />
                        <Ratings.Widget widgetRatedColor="#fea569" />
                        <Ratings.Widget widgetRatedColor="#fea569" />
                    </Ratings>
                    <a className="product-meta d-block font-size-xs pb-1">
                        {product.scName}
                    </a>
                    <h3 className="product-title font-size-base line-clamp">
                        <a
                            href={`/single/${product.productName}?id=${product.id}`}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            {product.productName}
                        </a>
                    </h3>
                    <div className="d-flex justify-content-between">
                        <div className="product-price" style={{ maxWidth: "100%" }}>
                            {product.stock > 0 ? (
                                <div className="mb-3">
                                    <span className="h3 font-weight-normal text-accent mr-1">
                                        <sup>₹</sup>
                                        {Number(product.sellingPrice).toFixed(2)}
                                    </span>
                                    <del className="text-muted font-size-lg mr-3">
                                        <sup>?</sup>
                                        {Number(product.MRP).toFixed(2)}
                                    </del>
                                </div>
                            ) : (
                                <span className="text-muted font-size-sm">
                                    Out of stock
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="card-body card-body-hidden">
                        {/* <div className="pb-2">
                            <div className="custom-control custom-option custom-control-inline mb-2">
                                <input
                                    className="custom-control-input"
                                    type="radio"
                                    name="size1"
                                    id="s-75"
                                />
                                <label className="custom-option-label" for="s-75">
                                    7.5
                                </label>
                            </div>
                            <div className="custom-control custom-option custom-control-inline mb-2">
                                <input
                                    className="custom-control-input"
                                    type="radio"
                                    name="size1"
                                    id="s-80"
                                    checked
                                />
                                <label className="custom-option-label" for="s-80">
                                    8
                                </label>
                            </div>
                            <div className="custom-control custom-option custom-control-inline mb-2">
                                <input
                                    className="custom-control-input"
                                    type="radio"
                                    name="size1"
                                    id="s-85"
                                />
                                <label className="custom-option-label" for="s-85">
                                    8.5
                                </label>
                            </div>
                            <div className="custom-control custom-option custom-control-inline mb-2">
                                <input
                                    className="custom-control-input"
                                    type="radio"
                                    name="size1"
                                    id="s-90"
                                />
                                <label className="custom-option-label" for="s-90">
                                    9
                                </label>
                            </div>
                        </div> */}
                        {colorArr && colorArr?.map((c, index) => {
                            return (
                                <div className="custom-control custom-option custom-control-inline mb-2" key={c + index}>
                                    <input
                                        className="custom-control-input"
                                        type="radio"
                                        name="color"
                                        value={c}
                                        id={`color${product.id + index}`}
                                        onClick={(e) => setColorName(e.target.value)}
                                    />
                                    <label
                                        className="custom-option-label rounded-circle"
                                        htmlFor={`color${product.id + index}`}
                                    >
                                        <span
                                            className="custom-option-color rounded-circle"
                                            style={{
                                                backgroundColor: `${c}`
                                            }}
                                        />
                                    </label>
                                </div>
                            )
                        })
                        }
                        <div className="custom-control custom-option mb-2" >
                        {sizeArr.length > 0 ? <select className="custom-select custom-select-sm w-25" name="size" id="size" onClick={(e) => setSizeName(e.target.value)}>
                                {sizeArr?.map((c, index) => {
                                    return (
                                        <>
                                            <option value={c}>{c}</option>
                                        </>
                                    )
                                })
                                }
                            </select>:<></>}
                        </div>
                        <button
                            className="btn btn-primary btn-sm mb-2"
                            type="button"
                            data-toggle="toast"
                            data-target="#cart-toast"
                            onClick={() => addNewCart(product.id, product.productName, product.photos, product.offerPrice ? product.offerPrice : product.sellingPrice, [{ "color": colorname, "size": sizename, "qty": qtyname }], 1)}
                            disabled={sizeArr.length>0 ? (
                                product.stock > 0 ? false : true, sizename && colorname ? false : true
                              ) : (
                                product.stock > 0 ? false : true, colorname ? false : true
                              )}
                        >
                            {loading ? (
                                <div
                                    className="spinner-border spinner-border-sm text-white"
                                    role="status"
                                >
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ) : (
                                <>
                                    <i className="czi-cart font-size-sm mr-1"></i>
                                    Add to Cart
                                </>
                            )}
                        </button>
                        <div className="text-left">
                            <a
                                className="nav-link-style font-size-ms"
                                href="#quick-view"
                                data-toggle="modal"
                                onClick={(e) => {
                                    setQuickViewProduct(product);
                                }}
                            >
                                <i className="czi-eye align-middle mr-1" />
                                Quick view
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        // </div>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        setQuickViewProduct: (product) =>
            dispatch(set_quickViewProduct(product)),
    };
};
export default connect(null, mapDispatchToProps)(ShopProductList);
