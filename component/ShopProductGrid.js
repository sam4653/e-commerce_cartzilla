import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { set_quickViewProduct } from "../Redux/Account/accountActions";
import Ratings from 'react-ratings-declarative';
import { attributesToProps } from "html-react-parser";

const ShopProductGrid = ({
  product,
  token,
  wishlists,
  addWishlist,
  addNewCart,
  loading,
  clicklink,
  setQuickViewProduct,
  handleselect,
  handleChange,
}) => {

  // console.log("check size", product.attributes)
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
    // <div className="row mx-n2">
    <div className="col-lg-3 col-md-4 col-sm-6 px-2 mb-4">
      <div className={`card product-card`}>
        {token ? (
          <>
            <input
              id={`heart${product.id}`}
              type="checkbox"
              className="heartCheckbox"
              checked={
                token &&
                wishlists.some(
                  (item) => item.pId === product.id
                )
              }
              onChange={(e) => addWishlist(e, product)}
            />
            <label
              htmlFor={`heart${product.id}`}
              className="customHeart btn-wishlist btn-sm"
            >
              <i className="czi-heart-filled"></i>
            </label>
          </>
        ) : (
          <>
            <input
              id={`heart${product.id}`}
              type="checkbox"
              className="heartCheckbox"
              checked={
                token &&
                wishlists.some(
                  (item) => item.pId === product.id
                )
              }
              onChange={(e) => addWishlist(e, product)}
            />
            <label
              htmlFor={`heart${product.id}`}
              className="customHeart btn-wishlist btn-sm"
            >
              <i className="czi-heart-filled"></i>
            </label>

            <a
              className="text-white py-0"
              href="#signin-modal"
              ref={clicklink}
              data-toggle="modal"
            ></a>
          </>
        )}
        {product.stock > 0 ? (
          <>
            <a
              className="card-img-top d-block overflow-hidden"
              href={`/single/${product.productName}?id=${product.id}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                src={product.photos[0]}
                alt="Product"
                style={{
                  height: "200px",
                  width: "100%",
                }}
              />
            </a>

            <div className="card-body py-2">
              <a
                className="product-meta d-block font-size-xs pb-1"
                href="#"
              >
                {" "}
                {product.brand}
              </a>
              <h3 className="product-title font-size-sm line-clamp">
                <a
                  href={`/single/${product.productName}?id=${product.id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {product.productName}
                </a>
              </h3>
              <div className="d-flex justify-content-between">
                <div className="product-price">
                  <span className="text-accent lead">
                    <sup>₹</sup>{" "}
                    {Number(product.offerPrice ? product.offerPrice : product.sellingPrice).toFixed(2)}{" "}
                  </span>
                  <span className="text-accent">
                    {" "}
                    <small>
                      {" "}
                      <sup>₹</sup>
                      <del>{Number(product.MRP).toFixed(2)}</del>
                    </small>
                  </span>
                </div>
                <Ratings rating={Number(product.Average_Ratings ? product.Average_Ratings : 0)} widgetDimensions="14px" widgetSpacings="2px" >
                  <Ratings.Widget widgetRatedColor="#fea569" />
                  <Ratings.Widget widgetRatedColor="#fea569" />
                  <Ratings.Widget widgetRatedColor="#fea569" />
                  <Ratings.Widget widgetRatedColor="#fea569" />
                  <Ratings.Widget widgetRatedColor="#fea569" />
                </Ratings>
              </div>

              <div className="card-body card-body-hidden">
                <div className="custom-control custom-option  mb-2" style={{ display: "flex", justifyContent: "center" }}>
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

                  <div className="custom-control custom-option  mb-2" >
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
                  </div>
                </div>

                {token ? (
                  <>
                    {" "}
                    <div className="d-flex justify-content-between">
                      {/* {
                                  product.size ?  <select className="custom-select custom-select-sm mr-2" onChange={handleselect}>
                                      {
                                        product?.size?.map((val,ind)=>{
                                            return(
                                              <>
                                                  <option value={val}>{val}</option>
                                              </>
                                            )
                                        })
                                      }
                                </select> : <></>
                              } */}
                      <button
                        className="btn btn-primary  btn-sm btn-shadow btn-block"
                        type="button"
                        data-toggle="toast"
                        data-target="#cart-toast"
                        onClick={() => addNewCart(product.id, product.productName, product.photos, product.offerPrice ? product.offerPrice : product.sellingPrice, [{ "color": colorname, "size": sizename, "qty": qtyname }], 1)}
                        disabled={sizeArr.length > 0 ? (
                          product.stock > 0 ? false : true, sizename && colorname ? false : true
                        ) : (
                          product.stock > 0 ? false : true, colorname ? false : true
                        )}

                      // disabled={(product.stock > 0 ? false : true, colorname && sizename ? false : true)}
                      >
                        {loading ? (
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
                      </button>
                    </div>
                    <div className="text-center pt-1">
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
                    </div>{" "}
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-primary btn-shadow btn-block"
                      type="button"
                      data-toggle="toast"
                      data-target="#cart-toast"
                      onClick={() => addNewCart(product.id, product.productName, product.photos, product.offerPrice ? product.offerPrice : product.sellingPrice, [{ "color": colorname, "size": sizename, "qty": qtyname }], 1)}
                      disabled={product.stock > 0 ? false : true}
                    >
                      {loading ? (
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
                            className="text-white py-0"
                            href={
                              product.stock > 0
                                ? "#signin-modal"
                                : " "
                            }
                            data-toggle="modal"
                          >
                            <div className="">
                              {/* <i className="navbar-tool-icon czi-heart mx-lg-2"></i> */}
                              <i className="czi-cart font-size-lg mr-2"></i>
                              Add to Cart
                            </div>
                          </a>
                        </>
                      )}
                    </button>
                    <div className="text-center">
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
                    </div>{" "}
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="imageHover">
              <a
                className="card-img-top d-block overflow-hidden"
                href={`/single/${product.productName}?id=${product.id}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  src={product.photos[0]}
                  alt="Product"
                  className="img"
                  style={{
                    height: "200px",
                    width: "100%",
                  }}
                />
              </a>

              {/* No found found */}

              <div className="card-body py-2 ">
                <a
                  className="product-meta d-block font-size-xs pb-1"
                  href="#"
                >
                  {" "}
                  {product.scName}
                </a>
                <h3 className="product-title font-size-sm line-clamp">
                  <a
                    href={`/single/${product.productName}?id=${product.id}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    style={{ color: "gray" }}
                  >
                    {product.productName}
                  </a>
                </h3>

                <div className="d-flex justify-content-between">
                  <div
                    className="product-price text-muted"
                    style={{ maxWidth: "100%" }}
                  >
                    <span className="text-muted font-size-sm ">
                      Out of stock
                    </span>
                  </div>
                </div>
                <div className="card-body card-body-hidden">
                  {token ? (
                    <>
                      {" "}
                      <button
                        className="btn btn-primary btn-shadow btn-block"
                        type="button"
                        data-toggle="toast"
                        data-target="#cart-toast"
                        onClick={() => addNewCart(product.id, product.productName, product.photos, product.offerPrice ? product.offerPrice : product.sellingPrice, [{ "color": colorname, "size": sizename, "qty": qtyname }], 1)}
                        disabled={product.stock > 0 ? false : true}
                      >
                        {loading ? (
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
                      </button>
                      <div className="text-center">
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
                      </div>{" "}
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary btn-shadow btn-block"
                        type="button"
                        data-toggle="toast"
                        data-target="#cart-toast"
                        onClick={() => addNewCart(product.id, product.productName, product.photos, product.offerPrice ? product.offerPrice : product.sellingPrice, [{ "color": colorname, "size": sizename, "qty": qtyname }], 1)}
                        disabled={product.stock > 0 ? false : true}
                      >
                        {loading ? (
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
                              className="text-white py-0"
                              href={
                                product.stock > 0
                                  ? "#signin-modal"
                                  : " "
                              }
                              data-toggle="modal"
                            >
                              <div className="">
                                {/* <i className="navbar-tool-icon czi-heart mx-lg-2"></i> */}
                                <i className="czi-cart font-size-lg mr-2"></i>
                                Add to Cart
                              </div>
                            </a>
                          </>
                        )}
                      </button>
                      <div className="text-center">
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
                      </div>{" "}
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <hr className="d-sm-none" />
    </div >
    // </div>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setQuickViewProduct: (product) => dispatch(set_quickViewProduct(product)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopProductGrid);
