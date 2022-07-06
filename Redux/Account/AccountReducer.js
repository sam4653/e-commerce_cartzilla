import {
    FETCH_ORDER,
    FETCH_TICKET,
    FETCH_ADDRESS,
    FETCH_PAYMENT_METHOD,
    SET_QUICK_VIEW_PRODUCT,
    FETCH_SHIPPING_METHOD,
    REQUEST,
    SUCCESS,
    RESET_ORDER,
    RESET_TICKET,
    RESET_ADDRESS,
    SEARCH_PRODUCT,
    RESET_SEARCH_PRODUCT,
    FETCH_ADVERTISEMENTS,
    DELETE_ADDRESS,
} from "./accountTypes";

const orderInitialState = {
    orders: [],
    loading: false,
};

const ticketInitialState = {
    tickets: [],
    loading: false,
};

const addressInitialState = {
    addresses: [],
    loading: false,
};

const paymentMethodInitialState = {
    paymentMethods: [],
    loading: false,
};

const shippingMethodInitialState = {
    shippingMethods: [],
    loading: false,
};

const quickViewProductInitialState = {
    quickViewProduct: {},
};

const searchProductsInitialState = {
    searchProducts: [],
    loading: false,
};

const advertisementInitialState = {
    advertisements: [],
};

const quickViewReducer = (state = quickViewProductInitialState, action) => {
    switch (action.type) {
        case SET_QUICK_VIEW_PRODUCT:
            return {
                quickViewProduct: action.payload,
            };
        default:
            return state;
    }
};

const advertisementReducer = (state = advertisementInitialState, action) => {
    switch (action.type) {
        case FETCH_ADVERTISEMENTS:
            return {
                advertisements: action.payload,
            };
        default:
            return state;
    }
};

const orderReducer = (state = orderInitialState, action) => {
    switch (action.type) {
        case FETCH_ORDER:
            // console.log("In Fetch ORder", action.payload);
            return {
                ...state,
                orders: action.payload,
            };
        case RESET_ORDER:
            return { ...orderInitialState };
        case REQUEST:
            return {
                ...state,
                loading: true,
            };
        case SUCCESS:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

const ticketReducer = (state = ticketInitialState, action) => {
    switch (action.type) {
        case FETCH_TICKET:
            return {
                ...state,
                tickets: action.payload,
            };
        case RESET_TICKET:
            return { ...ticketInitialState };
        case REQUEST:
            return {
                ...state,
                loading: true,
            };
        case SUCCESS:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

const addressReducer = (state = addressInitialState, action) => {
    switch (action.type) {
        case FETCH_ADDRESS:
            return {
                ...state,
                addresses: action.payload,
            };
        // case DELETE_ADDRESS:
        //     return {
        //         ...state,
        //         addresses: state.addresses.filter(
        //             (address) => String(address.id) !== String(action.payload)
        //         ),
        //     };
        case RESET_ADDRESS:
            return { ...addressInitialState };
        case REQUEST:
            return {
                ...state,
                loading: true,
            };
        case SUCCESS:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

const paymentMethodReducer = (state = paymentMethodInitialState, action) => {
    switch (action.type) {
        case FETCH_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethods: action.payload,
            };
        case REQUEST:
            return {
                ...state,
                loading: true,
            };
        case SUCCESS:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

const shippingMethodReducer = (state = shippingMethodInitialState, action) => {
    switch (action.type) {
        case FETCH_SHIPPING_METHOD:
            return {
                ...state,
                shippingMethods: action.payload,
            };
        case REQUEST:
            return {
                ...state,
                loading: true,
            };
        case SUCCESS:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

const searchProductsReducer = (state = searchProductsInitialState, action) => {
    switch (action.type) {
        case SEARCH_PRODUCT:
            return {
                ...state,
                searchProducts: action.payload,
            };
        case RESET_SEARCH_PRODUCT:
            return { ...searchProductsInitialState };
        case REQUEST:
            return {
                ...state,
                loading: true,
            };
        case SUCCESS:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

export {
    orderReducer,
    ticketReducer,
    addressReducer,
    paymentMethodReducer,
    quickViewReducer,
    shippingMethodReducer,
    searchProductsReducer,
    advertisementReducer,
};
