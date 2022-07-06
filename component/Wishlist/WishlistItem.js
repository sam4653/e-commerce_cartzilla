import Link from "next/link";
import React, { useState } from "react";
import { connect } from "react-redux";
import { removeWishlist } from "../../Redux/Wishlist/wishListActions";
import Spinner from "../Spinner";
import ReactLoading from "react-loading";

const WishlistItem = ({
    wishlist,
    wishlistsLoading,
    removeWishlist,
    token,
}) => {
    const [id, setId] = useState(0);
    return (
        <>
            <div className="d-sm-flex justify-content-between mt-lg-4 mb-4 pb-3 pb-sm-2 border-bottom">
                <div className="media media-ie-fix d-block d-sm-flex text-center text-sm-left">
                    <Link href={`/single/${wishlist.name}?id=${wishlist.pId}`}>
                        <a
                            className="d-inline-block mx-auto mr-sm-4"
                        // href="shop-single-v1.html"
                        >
                            <img
                                src={wishlist.photos[0]}
                                alt="Product"
                                style={{ width: "100px", height: "100px" }}
                            />
                        </a>
                    </Link>
                    <div className="media-body pt-2">
                        <h3 className="product-title font-size-base mb-2">
                            <Link
                                href={`/single/${wishlist.name}?id=${wishlist.pId}`}
                            >
                                <a>{wishlist.name}</a>
                            </Link>
                        </h3>
                        <div className="font-size-sm">
                            <span className="text-muted mr-2">Brand:</span>
                            {wishlist.brand}
                        </div>
                        <div className="font-size-lg text-accent pt-2">
                            <span>
                                ₹{wishlist.sellingPrice}.<small>00</small>{" "}
                            </span>
                            <del>
                                {" "}
                                <small>
                                    <sup>₹</sup>
                                    {wishlist.MRP}.<small>00</small>
                                </small>
                            </del>
                        </div>
                    </div>
                </div>
                <div className="pt-2 pl-sm-3 mx-auto mx-sm-0 text-center">
                    <button
                        className="btn btn-outline-danger btn-sm"
                        type="button"
                        disabled={wishlistsLoading}
                        onClick={() => {
                            removeWishlist({ token: token, pid: wishlist.pId });
                            setId(wishlist.pId);
                        }}
                    >
                        {wishlistsLoading && id === wishlist.pId ? (
                            // <Spinner />
                            <div className="loadingBars">
                                <ReactLoading type="bars" color="#666362"
                                    height={100} width={70} />
                            </div>
                        ) : (
                            <>
                                <i className="czi-trash mr-2" />
                                Remove
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};
const mapStateToProps = (state) => {
    return {
        wishlistsLoading: state.wishlists.loading,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        removeWishlist: (data) => dispatch(removeWishlist(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WishlistItem);
