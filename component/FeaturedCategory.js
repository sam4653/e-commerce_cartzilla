import Ratings from 'react-ratings-declarative';
const FeaturedCategory = ({ product, token, wishlists, addWishlist }) => {
    return (
        <div className="col-lg-5 col-6 px-0 px-sm-2 mb-sm-4 ">
            <div className="card product-card">
                <input
                    id={`heart${product.id}`}
                    type="checkbox"
                    className="heartCheckbox"
                    hidden={true}
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
                    <i className="czi-heart-filled"></i>
                </label>

                <a
                    className="card-img-top d-block overflow-hidden"
                    href={`/single/${product.productName}?id=${product.id}`}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <img
                        src={product.photos[0]}
                        alt="Product"
                        style={{ width: 224, height: 255 }}
                    />
                </a>
                {/* </Link> */}
                <div className="card-body py-2">
                    {/* <Link href="/single"> */}
                    <a
                        className="product-meta d-block font-size-xs pb-1 d-flex justify-content-end"
                        href={`/single/${product.productName}?id=${product.id}`}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                       {product.brand}
                    </a>
                    {/* </Link> */}
                    <h3 className="product-title font-size-sm line-clamp">
                        {/* <Link href="/single"> */}
                        <a
                            href={`/single/${product.productName}?id=${product.id}`}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            {product.productName}
                        </a>
                        {/* </Link> */}
                    </h3>
                    <div className="d-flex justify-content-between">
                            <div className="product-price">
                              <span className="text-accent lead">
                                <sup>₹</sup>{" "}
                                {Number(product.offerPrice ? product.offerPrice : product.sellingPrice ).toFixed(2)}{" "}
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
                </div>
            </div>
        </div>
    );
};

export default FeaturedCategory;
