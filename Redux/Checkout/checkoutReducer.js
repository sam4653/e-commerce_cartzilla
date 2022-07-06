import {
    ADD_CHECKOUT_DETAIL,
    ADD_CHECKOUT_SHIPPING,
    ADD_CHECKOUT_PAYMENT,
    ADD_CHECKOUT_DISCOUNT,
    RESET_CHECKOUT,
    UPDATE_CHECKOUT,
    FETCH_CHECKOUT,
} from "./checkoutTypes";

const initialState = {
    details: 0,
    shippingMethodId: {},
    discount: 0,
    payment: {
        cardNumber: "",
        fullName: "",
        validThru: "",
        cvc: "",
    },
};

const checkoutReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_CHECKOUT_DETAIL:
            return {
                ...state,
                details: action.payload.data,
            };

        case ADD_CHECKOUT_SHIPPING:
            return {
                ...state,
                shippingMethodId: action.payload.data,
            };
        case ADD_CHECKOUT_PAYMENT:
            return {
                ...state,
                payment: action.payload.data,
            };
        case ADD_CHECKOUT_DISCOUNT:
            return {
                ...state,
                discount: action.payload.data,
            };
        default:
            return state;
    }
};

export default checkoutReducer;
