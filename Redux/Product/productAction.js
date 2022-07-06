import axios from "axios";
import Toast from "../../component/Toast";
import {
    FETCH_PRODUCT,
    DELETE_PRODUCT,
    SUCCESS,
    REQUEST,
} from "./productTypes";

export const fetch_product = (products) => {
    return {
        type: FETCH_PRODUCT,
        payload: products,
    };
};

export const remove_product = (data) => {
    return {
        type: DELETE_PRODUCT,
        payload: data,
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

export const fetchProduct = (token) => {
    return (dispatch) => {
        dispatch(request());
        axios
            .get(`${process.env.HOST}/product`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                // console.log("ProductResponse", res.data.data);
                dispatch(success());
                dispatch(fetch_product(res.data.data));
            })
            .catch((err) => {
                console.log(err.response);
            });
    };
};

export const fetchVendorProduct = (token) => {
    return (dispatch) => {
        dispatch(request());
        axios
            .get(`${process.env.HOST}/products/vendor`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                // console.log("ProductResponse",res.data.data)
                dispatch(success());
                dispatch(fetch_product(res.data.data));
            })
            .catch((err) => {
                console.log(err.response);
            });
    };
};

export const removeProduct = ({ token, id }) => {
    return (dispatch) => {
        dispatch(request());
        // if (!token) {
        //     dispatch(remove_product(id));
        //     dispatch(success());
        //     return;
        // }
        console.log("action",token)
        axios
        .delete(`${process.env.HOST}/product/${id}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                dispatch(remove_product(id));
                dispatch(success());
                
                Toast("Product Deleted Successfully");
            })
            .catch((err) => {
                alert("res")
                console.log(err.response);
            });
        };
};
