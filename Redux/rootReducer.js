import { combineReducers } from "redux";
import cartReducer from "./Cart/cartReducer";
import userReducer from "./User/userReducer";
import wishListReducer from "./Wishlist/wishListReducer";
import checkoutReducer from "./Checkout/checkoutReducer";
import productReducer from "./Product/productReducer";
// import orderReducer from "./Order/OrderReducer";
import {
  orderReducer,
  ticketReducer,
  addressReducer,
  paymentMethodReducer,
  quickViewReducer,
  shippingMethodReducer,
  searchProductsReducer,
  advertisementReducer,
} from "./Account/AccountReducer"; //Account Header's reducer - Dalpat

const rootReducer = combineReducers({
  carts: cartReducer,
  wishlists: wishListReducer,
  user: userReducer,
  checkout: checkoutReducer,
  orders: orderReducer,
  tickets: ticketReducer,
  address: addressReducer,
  paymentMethod: paymentMethodReducer,
  quickViewProduct: quickViewReducer,
  shippingMethod: shippingMethodReducer,
  searchProducts: searchProductsReducer,
  advertisements: advertisementReducer,
  products: productReducer,
});

export default rootReducer;