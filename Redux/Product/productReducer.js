import {
    FETCH_PRODUCT,
    DELETE_PRODUCT,
    REQUEST,
    SUCCESS,
} from "./productTypes";

const initialState = {
    products: [],
    loading: false,
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCT:
            return {
                ...state,
                products: action.payload,
            };
        case DELETE_PRODUCT:
            return {
                ...state,
                products: state.products.filter(
                    (item) => item.id !== action.payload
                ),
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

export default productReducer;
