import axios from "axios";
import Toast from "../../component/Toast";
import {
    ADD_WISHLIST,
    FETCH_WISHLIST,
    RESET_WISHLIST,
    SUCCESS,
    REQUEST,
    DELETE_WISHLIST,
} from "./wishListTypes";

export const add_wishlist = (wishlist) => {
    return {
        type: ADD_WISHLIST,
        payload: wishlist,
    };
};

export const fetch_wishlist = (wishlists) => {
    return {
        type: FETCH_WISHLIST,
        payload: wishlists,
    };
};

export const remove_wishlist = (data) => {
    return {
        type: DELETE_WISHLIST,
        payload: data,
    };
};

export const reset_wishlist = () => {
    return {
        type: RESET_WISHLIST,
    };
};

export const request = () => {
    return {
        type: REQUEST,
    };
};

export const success = () => {
    return {
        type: SUCCESS,
    };
};

export const addWishlist = ({ token, product }) => {
    return (dispatch) => {
        dispatch(request());
        const prod = {
            pId: product.id,
            name: product.productName,
            desc: product.description,
            photos: product.photos,
            sellingPrice: product.sellingPrice,
            MRP: product.MRP,
            brand: product.brand,
        };
        if (!token) {
            dispatch(add_wishlist(prod));
            Toast("Added To Wishlist");
            dispatch(success());
            return;
        }
        axios
            .post(
                `${process.env.HOST}/wishlist/${product.id}`,
                {},
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then((res) => {
                dispatch(success());

                dispatch(add_wishlist(prod));
                Toast(res.data.message);
                // dispatch(fetch_wishlist(res.data.data));
            })
            .catch((err) => {
                console.log(err.response);
            });
    };
};
export const fetchWishlist = (token) => {
    return (dispatch) => {
        dispatch(request());
        axios
            .get(`${process.env.HOST}/wishlist`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                dispatch(success());
                dispatch(fetch_wishlist(res.data.data));
            })
            .catch((err) => {
                console.log(err.response);
            });
    };
};

export const removeWishlist = ({ token, pid }) => {
    return (dispatch) => {
        dispatch(request());
        if (!token) {
            dispatch(remove_wishlist(pid));
            dispatch(success());
            return;
        }
        axios
            .delete(`${process.env.HOST}/wishlist/${pid}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                dispatch(success());
                dispatch(remove_wishlist(pid));
                Toast("Product has been removed successfully!");
            })
            .catch((err) => {
                console.log(err.response);
            });
    };
};
