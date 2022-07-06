import axios from "axios";
import Toast from "../../component/Toast";
import {
    FETCH_ADDRESS,
    RESET_ADDRESS,
    ADD_ADDRESS,
    UPDATE_ADDRESS,
    DELETE_ADDRESS,
    FETCH_ORDER,
    RESET_ORDER,
    FETCH_PAYMENT_METHOD,
    FETCH_TICKET,
    RESET_TICKET,
    SET_QUICK_VIEW_PRODUCT,
    REQUEST,
    SUCCESS,
    FETCH_SHIPPING_METHOD,
    SEARCH_PRODUCT,
    RESET_SEARCH_PRODUCT,
    FETCH_ADVERTISEMENTS,
} from "./accountTypes";

export const fetchOrder = (token) => {
    return (dispatch) => {
        dispatch(request());
        axios
            .get(`${process.env.HOST}/order`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                dispatch(success());
                dispatch(fetch_order(res.data.data));
            })
            .catch((err) => {
                console.log(err.response);
            });
    };
};

export const fetch_order = (orders) => {
    return {
        type: FETCH_ORDER,
        payload: orders,
    };
};

export const reset_order = (orders) => {
    return {
        type: RESET_ORDER,
        payload: orders,
    };
};

export const set_quickViewProduct = (product) => {
    return {
        type: SET_QUICK_VIEW_PRODUCT,
        payload: product,
    };
};

export const fetch_advertisement = (advertisement) => {
    return {
        type: FETCH_ADVERTISEMENTS,
        payload: advertisement,
    };
};

export const fetchTicket = (token) => {
    return (dispatch) => {
        dispatch(request());
        axios
            .get(`${process.env.HOST}/user-tickets`, {
                headers: {
                    Authorization: token,
                },
                
            })
            .then((res) => {
                dispatch(success());
                dispatch(fetch_ticket(res.data.data));
            })
            .catch((err) => {
                console.log(err.response);
            });
    };
};

export const fetch_ticket = (tickets) => {
    return {
        type: FETCH_TICKET,
        payload: tickets,
    };
};

export const reset_ticket = () => {
    return {
        type: RESET_TICKET,
    };
};

export const fetchAddress = (token) => {
    return (dispatch) => {
        dispatch(request());
        axios
            .get(`${process.env.HOST}/address`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                dispatch(success());
                dispatch(fetch_address(res.data.data));
            })
            .catch((err) => {
                console.log(err.response);
            });
    };
};

export const fetch_address = (addresses) => {
    return {
        type: FETCH_ADDRESS,
        payload: addresses,
    };
};

export const addAddress = (data, token) => {
    return async (dispatch) => {
        await axios
            .post(`${process.env.HOST}/address`, data, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                Toast(res.data.message);
                dispatch(fetchAddress(token));
            })
            .catch((err) => {
                console.log(err.response.data.message);
            });
    };
};
export const reset_address = () => {
    return {
        type: RESET_ADDRESS,
    };
};

// Update User Address
export const updateAddress = (id, data, token) => {
    return async (dispatch) => {
        dispatch(request());
        await axios
            .put(`${process.env.HOST}/address/${id}`, data, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                dispatch(fetchAddress(token));
                dispatch(success());
                Toast("Address Updated Successfully");
            })
            .catch((err) => {
                console.log(err.response?.data);
            });
    };
};
// Delete User Address
export const removeAddress = (id, token) => {
    return async (dispatch) => {
        dispatch(request());
        await axios
            .delete(`${process.env.HOST}/address/${id}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then(() => {
                dispatch(fetchAddress(token));
                // dispatch(remove_address(id));
                dispatch(success());
                Toast("Address Deleted Successfully");
            })
            .catch((err) => {
                console.log(err.response?.data?.message);
                dispatch(success());
            });
    };
};
export const remove_address = (data) => {
    return {
        type: DELETE_ADDRESS,
        payload: data,
    };
};

export const fetchPaymentMethod = (token) => {
    return (dispatch) => {
        dispatch(request());
        axios
            .get(`${process.env.HOST}/cards`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                dispatch(success());
                dispatch(fetch_PaymentMethod(res.data.data));
            })
            .catch((err) => {
                console.log(err.response.data.message);
            });
    };
};

export const fetch_PaymentMethod = (cards) => {
    return {
        type: FETCH_PAYMENT_METHOD,
        payload: cards,
    };
};

export const fetchShippingMethod = (token) => {
    return (dispatch) => {
        dispatch(request());
        axios
            .get(`${process.env.HOST}/shippingMethods`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                // console.log("first", res)
                dispatch(success());
                dispatch(fetch_ShippingMethod(res.data.data));
            })
            .catch((err) => {
                console.log(err.response);
            });
    };
};

export const fetch_ShippingMethod = (shippingMethod) => {
    return {
        type: FETCH_SHIPPING_METHOD,
        payload: shippingMethod,
    };
};

export const search_Product = (products) => {
    return {
        type: SEARCH_PRODUCT,
        payload: products,
    };
};

export const reset_Product = () => {
    return {
        type: RESET_SEARCH_PRODUCT,
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
