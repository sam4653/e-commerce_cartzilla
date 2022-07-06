import React, { useState } from "react";
import ReactImageMagnify from "react-image-magnify";
const ProductDetail = () => {
  const [activeImg, setActiveImg] = useState(0);

  const [imgs, setImgs] = useState([
    "/img/shop/single/gallery/01.jpg",
    "/img/shop/single/gallery/02.jpg",
    "/img/shop/single/gallery/03.jpg",
    "/img/shop/single/gallery/04.jpg",
  ]);
  return (
    <div>
      <div className="position-relative bg-dark pt-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb breadcrumb-light flex-lg-nowrap justify-content-center justify-content-lg-start">
                <li className="breadcrumb-item">
                  <a className="text-nowrap" href="#">
                    <i className="czi-home" />
                    Home
                  </a>
                </li>
                <li className="breadcrumb-item text-nowrap">
                  <a href="#">Shop</a>
                </li>
                <li
                  className="breadcrumb-item text-nowrap active"
                  aria-current="page"
                >
                  Product Page v.1
                </li>
              </ol>
            </nav>
          </div>
          <div className="order-lg-1 pr-lg-4 text-center text-lg-left">
            <h1 className="h3 text-light mb-0">Sports Hooded Sweatshirt</h1>
          </div>
        </div>
      </div>
      {/* Page Content*/}
      <div className="container">
        {/* Gallery + details*/}
        <div className="bg-light box-shadow-lg rounded-lg px-4 py-3 mb-5">
          <div className="px-lg-3">
            <div className="row">
              {/* Product gallery*/}
              <div className="col-lg-7 pr-lg-0 pt-lg-4">
                <div className="cz-product-gallery">
                  <div className="cz-preview order-sm-2">
                    <div className="cz-preview-item active" id="first">
                      <img
                        className="cz-image-zoom"
                        src={imgs[activeImg]}
                        data-zoom="/img/shop/single/gallery/01.jpg"
                        alt="Product image"
                      />
                      <div className="cz-image-zoom-pane" />
                    </div>
                    {/* <div className="cz-preview-item" id="second">
                      <img
                        className="cz-image-zoom"
                        src="/img/shop/single/gallery/02.jpg"
                        data-zoom="/img/shop/single/gallery/02.jpg"
                        alt="Product image"
                      />
                      <div className="cz-image-zoom-pane" />
                    </div>
                    <div className="cz-preview-item" id="third">
                      <img
                        className="cz-image-zoom"
                        src="/img/shop/single/gallery/03.jpg"
                        data-zoom="/img/shop/single/gallery/03.jpg"
                        alt="Product image"
                      />
                      <div className="cz-image-zoom-pane" />
                    </div>
                    <div className="cz-preview-item" id="fourth">
                      <img
                        className="cz-image-zoom"
                        src="/img/shop/single/gallery/04.jpg"
                        data-zoom="/img/shop/single/gallery/04.jpg"
                        alt="Product image"
                      />
                      <div className="cz-image-zoom-pane" />
                    </div> */}
                  </div>
                  <div className="cz-thumblist order-sm-1">
                    {imgs.map((img, i) => {
                      return (
                        <div
                          onClick={() => setActiveImg(i)}
                          className={`cz-thumblist-item ${activeImg === i ? "active" : ""
                            }`}
                          key={i}
                        >
                          <img src={img} alt="Product thumb" />
                        </div>
                      );
                    })}
                    {/* <a className="cz-thumblist-item active" href="#first"> */}
                    {/* </a> */}

                    {/* </a> */}
                    <a
                      className="cz-thumblist-item video-item"
                      href="https://www.youtube.com/watch?v=1vrXpMLLK14"
                    >
                      <div className="cz-thumblist-item-text">
                        <i className="czi-video" />
                        Video
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              {/* Product details*/}
              <div className="col-lg-5 pt-4 pt-lg-0">
                <div className="product-details ml-auto pb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <a href="#reviews" data-scroll>
                      <div className="star-rating">
                        <i className="sr-star czi-star-filled active" />
                        <i className="sr-star czi-star-filled active" />
                        <i className="sr-star czi-star-filled active" />
                        <i className="sr-star czi-star-filled active" />
                        <i className="sr-star czi-star" />
                      </div>
                      <span className="d-inline-block font-size-sm text-body align-middle mt-1 ml-1">
                        74 Reviews
                      </span>
                    </a>
                    <button
                      className="btn-wishlist mr-0 mr-lg-n3"
                      type="button"
                      data-toggle="tooltip"
                      title="Add to wishlist"
                    >
                      <i className="czi-heart" />
                    </button>
                  </div>
                  <div className="mb-3">
                    <span className="h3 font-weight-normal text-accent mr-1">
                      $18.<small>99</small>
                    </span>
                    <del className="text-muted font-size-lg mr-3">
                      $25.<small>00</small>
                    </del>
                    <span className="badge badge-danger badge-shadow align-middle mt-n2">
                      Sale
                    </span>
                  </div>
                  <div className="font-size-sm mb-4">
                    <span className="text-heading font-weight-medium mr-1">
                      Color:
                    </span>
                    <span className="text-muted" id="colorOption">
                      Red/Dark blue/White
                    </span>
                  </div>
                  <div className="position-relative mr-n4 mb-3">
                    <div className="custom-control custom-option custom-control-inline mb-2">
                      <input
                        className="custom-control-input"
                        type="radio"
                        name="color"
                        id="color1"
                        data-label="colorOption"
                        defaultValue="Red/Dark blue/White"
                        defaultChecked
                      />
                      <label
                        className="custom-option-label rounded-circle"
                        htmlFor="color1"
                      >
                        <span
                          className="custom-option-color rounded-circle"
                          style={{
                            backgroundImage:
                              "url(/img/shop/single/color-opt-1.png)",
                          }}
                        />
                      </label>
                    </div>
                    <div className="custom-control custom-option custom-control-inline mb-2">
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
                            backgroundImage:
                              "url(/img/shop/single/color-opt-2.png)",
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
                            backgroundImage:
                              "url(/img/shop/single/color-opt-3.png)",
                          }}
                        />
                      </label>
                    </div>
                    <div className="product-badge product-available mt-n1">
                      <i className="czi-security-check" />
                      Product available
                    </div>
                  </div>
                  <form className="mb-grid-gutter" method="post">
                    <div className="form-group">
                      <div className="d-flex justify-content-between align-items-center pb-1">
                        <label
                          className="font-weight-medium"
                          htmlFor="product-size"
                        >
                          Size:
                        </label>
                        <a
                          className="nav-link-style font-size-sm"
                          href="#size-chart"
                          data-toggle="modal"
                        >
                          <i className="czi-ruler lead align-middle mr-1 mt-n1" />
                          Size guide
                        </a>
                      </div>
                      <select
                        className="custom-select"
                        required
                        id="product-size"
                      >
                        <option value>Select size</option>
                        <option value="xs">XS</option>
                        <option value="s">S</option>
                        <option value="m">M</option>
                        <option value="l">L</option>
                        <option value="xl">XL</option>
                      </select>
                    </div>
                    <div className="form-group d-flex align-items-center">
                      <select
                        className="addproduct"
                        style={{ width: "5rem" }}
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                      <button
                        className="btn btn-primary btn-shadow btn-block"
                        type="submit"
                      >
                        <i className="czi-cart font-size-lg mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </form>
                  {/* Product panels*/}
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
                          <h6 className="font-size-sm mb-2">Composition</h6>
                          <ul className="font-size-sm pl-4">
                            <li>Elastic rib: Cotton 95%, Elastane 5%</li>
                            <li>Lining: Cotton 100%</li>
                            <li>Cotton 80%, Polyester 20%</li>
                          </ul>
                          <h6 className="font-size-sm mb-2">Art. No.</h6>
                          <ul className="font-size-sm pl-4 mb-0">
                            <li>183260098</li>
                          </ul>
                        </div>
                      </div>
                    </div>
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
                            <div>$26.50</div>
                          </div>
                          <div className="d-flex justify-content-between border-bottom py-2">
                            <div>
                              <div className="font-weight-semibold text-dark">
                                Local shipping
                              </div>
                              <div className="font-size-sm text-muted">
                                up to one week
                              </div>
                            </div>
                            <div>$10.00</div>
                          </div>
                          <div className="d-flex justify-content-between border-bottom py-2">
                            <div>
                              <div className="font-weight-semibold text-dark">
                                Flat rate
                              </div>
                              <div className="font-size-sm text-muted">
                                5 - 7 days
                              </div>
                            </div>
                            <div>$33.85</div>
                          </div>
                          <div className="d-flex justify-content-between border-bottom py-2">
                            <div>
                              <div className="font-weight-semibold text-dark">
                                UPS ground shipping
                              </div>
                              <div className="font-size-sm text-muted">
                                4 - 6 days
                              </div>
                            </div>
                            <div>$18.00</div>
                          </div>
                          <div className="d-flex justify-content-between pt-2">
                            <div>
                              <div className="font-weight-semibold text-dark">
                                Local pickup from store
                              </div>
                              <div className="font-size-sm text-muted">—</div>
                            </div>
                            <div>$0.00</div>
                          </div>
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
                            <option value>Select your country</option>
                            <option value="Argentina">Argentina</option>
                            <option value="Belgium">Belgium</option>
                            <option value="France">France</option>
                            <option value="Germany">Germany</option>
                            <option value="Spain">Spain</option>
                            <option value="UK">United Kingdom</option>
                            <option value="USA">USA</option>
                          </select>
                        </div>
                      </div>
                    </div> */}
                  </div>
                  {/* Sharing*/}
                  <h6 className="d-inline-block align-middle font-size-base my-2 mr-2">
                    Share:
                  </h6>
                  <a className="share-btn sb-twitter mr-2 my-2" href="#">
                    <i className="czi-twitter" />
                    Twitter
                  </a>
                  <a className="share-btn sb-instagram mr-2 my-2" href="#">
                    <i className="czi-instagram" />
                    Instagram
                  </a>
                  <a className="share-btn sb-facebook my-2" href="#">
                    <i className="czi-facebook" />
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;
