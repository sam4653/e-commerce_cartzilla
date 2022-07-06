import {
    FETCH_ORDER,
    REQUEST,
    SUCCESS,
  } from "./orderTypes";
  
  const initialState = {
    orders: [],
    loading: false,
  };
  
  const orderReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_ORDER:
        return {
          ...state,
          orders: action.payload,
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
  
  export default orderReducer;
  