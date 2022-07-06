import {
    ADD_WISHLIST,
    DELETE_WISHLIST,
    FETCH_WISHLIST,
    RESET_WISHLIST,
    REQUEST,
    SUCCESS,
} from "./wishListTypes";

const initialState = {
    wishlists: [],
    loading: false,
};

const wishListReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_WISHLIST:
            return {
                ...state,
                wishlists: action.payload,
            };
        case ADD_WISHLIST:
            return {
                ...state,
                wishlists: [...state.wishlists, action.payload],
            };
        case DELETE_WISHLIST:
            return {
                ...state,
                wishlists: state.wishlists.filter(
                    (item) => String(item.pId) !== String(action.payload)
                ),
            };
        case RESET_WISHLIST:
            return {
                ...initialState,
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

export default wishListReducer;
