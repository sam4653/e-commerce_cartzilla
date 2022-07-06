import {
    FETCH_CART,
    DELETE_CART,
    ADD_CART,
    RESET_CART,
    ADD_CART_SUCCESS,
    ADD_CART_ERROR,
    REQUEST,
    LOADING_REQUEST,
    LOADING_SUCCESS,
    UPDATE_CART,
} from "./cartTypes";

const initialState = {
    carts: [],
    total: 0,
    loading: false,
    status: { success: false, message: "" },
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case LOADING_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case REQUEST:
            return {
                ...state,
                loading: action.payload,
            };

        case RESET_CART:
            return {
                ...initialState,
            };

        case FETCH_CART:
            return {
                ...state,
                total: action.payload.total,
                carts: action.payload.carts,
            };

        case UPDATE_CART:
            const existingCartItemIndex = state.carts.findIndex(
                (cart) => cart.pId === action.payload.pId
            );
            const existingCart = state.carts[existingCartItemIndex];
            let updatedCarts;
            if (action.payload.quantity === 0) {
                updatedCarts = state.carts.filter(
                    (cart) => cart.pId !== action.payload.pId
                );
                // console.log("Successfully Removed");
            } else {
                const updatedCart = {
                    ...existingCart,
                    quantity: action.payload.quantity,
                };
                updatedCarts = [...state.carts];
                updatedCarts[existingCartItemIndex] = updatedCart;
            }
            return {
                ...state,
                carts: updatedCarts,
                total: calculate(updatedCarts),
            };

        // const cartEdit = state.carts.map((cart) => {
        //   if (cart.pId === action.payload.id) {
        //     cart.quantity = action.payload.quantity;
        //   }
        //   return cart;
        // });
        // return {
        //   ...state,
        //   total: calculate(cartEdit),
        //   carts: cartEdit,
        // };

        case ADD_CART:
            const cartsAdd = [action.payload.cart, ...state.carts];
            const total = calculate(cartsAdd);
            return {
                ...state,
                total: total,
                status: action.payload.status,
                carts: cartsAdd,
            };
        case ADD_CART_SUCCESS:
            return {
                ...state,
                status: action.payload,
            };
        case ADD_CART_ERROR:
            return {
                ...state,
                status: action.payload,
            };

        case DELETE_CART:
            const carts = state.carts.filter(
                (item) => item.pId !== action.payload.pid
            );
            return {
                ...state,
                total: calculate(carts),
                carts: carts,
            };
        default:
            return state;
    }
};

const calculate = (carts) => {
    let total = 0;
    carts.forEach((cart) => {
        total = Number(total) + Number(cart.offerPrice ? cart.offerPrice : cart.sellingPrice) * Number(cart.quantity);
    });
    // console.log("total",total)
    return total;
};

export default cartReducer;
