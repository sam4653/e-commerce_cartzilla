import {
    ADD_CHECKOUT_DETAIL,
    ADD_CHECKOUT_SHIPPING,
    ADD_CHECKOUT_PAYMENT,
    ADD_CHECKOUT_DISCOUNT,
    RESET_CHECKOUT,
    UPDATE_CHECKOUT,
    FETCH_CHECKOUT,
} from "./checkoutTypes";

export const addCheckoutDetail = (data) => {
    return {
        type: ADD_CHECKOUT_DETAIL,
        payload: data,
    };
};

export const addCheckoutShipping = (data) => {
    return {
        type: ADD_CHECKOUT_SHIPPING,
        payload: data,
    };
};

export const addCheckoutPayment = (data) => {
    return {
        type: ADD_CHECKOUT_PAYMENT,
        payload: data,
    };
};

export const addCheckoutDiscount = (data) => {
    return {
        type: ADD_CHECKOUT_DISCOUNT,
        payload: data,
    };
};
