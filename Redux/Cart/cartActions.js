import axios from "axios";
import { getSession, useSession } from "next-auth/client";
import Toast from "../../component/Toast";
import {
    FETCH_CART,
    DELETE_CART,
    ADD_CART,
    ADD_CART_SUCCESS,
    ADD_CART_ERROR,
    REQUEST,
    LOADING_REQUEST,
    LOADING_SUCCESS,
    UPDATE_CART,
    RESET_CART,
} from "./cartTypes";

export const fetch_cart = (carts) => {
    return {
        type: FETCH_CART,
        payload: carts,
    };
};

export const loading_request = () => {
    return {
        type: LOADING_REQUEST,
    };
};

export const update_cart = (cart) => {
    return {
        type: UPDATE_CART,
        payload: cart,
    };
};
export const loading_success = () => {
    return {
        type: LOADING_SUCCESS,
    };
};
export const add_cart = (cart) => {
    return {
        type: ADD_CART,
        payload: cart,
    };
};

export const reset_cart = () => {
    return {
        type: RESET_CART,
    };
};

export const add_success = (status) => {
    return {
        type: ADD_CART_SUCCESS,
        payload: status,
    };
};

export const add_error = (status) => {
    return {
        type: ADD_CART_ERROR,
        payload: status,
    };
};
export const request = (loading) => {
    return {
        type: REQUEST,
        payload: loading,
    };
};
export const delete_cart = (id) => {
    return {
        type: DELETE_CART,
        payload: id,
    };
};

export const addCart = ({ cart, quantity, token }) => {
    //  console.log("cart",cart);
    
    return (dispatch, getState) => {
        let total = 0;
        if (!token) {
            // console.log("With Out Token");
            dispatch(loading_success());
            let img = [];
            img.push(cart.photos[0]);
            cart.quantity = quantity;
            cart.name = cart.productName;
            cart.images = img;
            cart.pId = cart.id;
            const index = getState().carts.carts.findIndex(
                (c) => c.pId == cart.id
            );
            if (index >= 0) {
                dispatch(
                    update_cart({
                        id: cart.id,
                        quantity: getState().carts.carts[index].quantity + 1,
                    })
                );
            } else {
                alert("ok")
                dispatch(
                    add_cart({
                        cart: cart,
                        status: {
                            success: true,
                            message: "Successfully added to cart.",
                        },
                    })
                );
            }
            Toast("Product added to Cart!");
            return;
        }
        dispatch(loading_request());
        axios
            .post(
                `${process.env.HOST}/cart/${cart.pId}`,
                { attributes: cart.attributes },
                { headers: { Authorization: token } }
            )
            .then((res) => {
                dispatch(loading_success());
                // let img = [];
                // img.push(cart.photos[0]);
                // cart.quantity = quantity;
                // cart.name = cart.productName;
                // cart.photo = cart.photos;
                // cart.sellingPrice=cart.sellingPrice;
                // cart.offerPrice=Number(cart.offerPrice);       
                // cart.pId = cart.id;
                // cart.color = cart.color;
                // console.log("object",getState().carts.carts);
                const index = getState().carts.carts.findIndex(
                    (c) => c.pId === cart.pId
                );
                if (index >= 0) {
                    // console.log("Index",index)
                    dispatch(
                        update_cart({
                            pId: cart.pId,
                            quantity:
                                getState().carts.carts[index].quantity +
                                (quantity > 1 ? quantity : 1),
                        })
                    );
                } else {
                    // alert("ok")
                    dispatch(
                        add_cart({
                            cart: cart,
                            status: {
                                success: true,
                                message: "Successfully added to cart.",
                            },
                        })
                    );
                }
                Toast(res.data.message);
            })
            .catch((err) => {
                dispatch(loading_success());
                console.log(err);
                Toast(err.response.data.message);
            });
    };
};

export const update_quantity = ({ token, quantity, pid }) => {
    return (dispatch) => {
        if (!token) {
            // console.log("With Out Token");
            dispatch(update_cart({ id: pid, quantity: quantity }));
            return;
        }

        axios
            .put(
                `${process.env.HOST}/cart/${pid}`,
                { quantity: quantity },
                { headers: { Authorization: token } }
            )
            .then((res) => {
                dispatch(update_cart({ id: pid, quantity: quantity }));
            })
            .catch((err) => {
                console.log(err.response);
                Toast(err.response.data.message);
            });
    };
};

// export const addCart = (cart) => {
//   return (dispatch) => {
//     // dispatch(request(true));
//     dispatch(loading_request());
//     let total = 0;
//     const carts = JSON.parse(localStorage.getItem("carts"));
//     if (carts === null) {
//       const initTodo = [cart];
//       total = total + Number(cart.price);
//       setTimeout(() => {
//         localStorage.setItem("carts", JSON.stringify(initTodo));

//         dispatch(loading_success());
//         // dispatch(request(false));
//         dispatch(
//           add_cart({
//             cart: cart,
//             total: total,
//             status: { success: true, message: "Successfully added to cart." },
//           })
//         );
//       }, 1000);

//       // dispatch(
//       //   add_success({ success: true, message: "Successfully added to cart." })
//       // );
//     } else {
//       if (carts.some((item) => item.id === cart.id)) {
//         // dispatch(request(false));
//         setTimeout(() => {
//           dispatch(loading_success());
//           dispatch(add_error({ success: false, message: "Already in cart." }));
//         }, 1000);
//       } else {
//         carts.push(cart);
//         carts.map((cart) => {
//           total = total + Number(cart.price);
//         });
//         setTimeout(() => {
//           localStorage.setItem("carts", JSON.stringify(carts));
//           // dispatch(request(false));

//           dispatch(loading_success());
//           dispatch(
//             add_cart({
//               cart: cart,
//               total: total,
//               status: { success: true, message: "Successfully added to cart." },
//             })
//           );
//         }, 1000);

//         // dispatch(
//         //   add_success({ success: true, message: "Successfully added to cart." })
//         // );
//       }
//     }
//   };
// };

export const fetchCart = (token) => {
    return (dispatch) => {
        axios
            .get(`${process.env.HOST}/cart`, {
                headers: { Authorization: token },
            })
            .then((res) => {
                // const prod = res.data.data.products;
                // prod.map((p) => {
                //     let img = [p.photo];
                //     p.images = img;
                // });
                //   console.log("res",res);
                // console.log(" res.data.data.totalAmount" ,res.data.data.totalAmount,)
                dispatch(
                    fetch_cart({
                        carts: res.data.data.products,
                        total: res.data.data.totalAmount,
                    })
                );
            })
            .catch((err) => {
                // alert("res");
                console.log(err);
            });
        // const carts = localStorage.getItem("carts");
        // if (carts !== null) {
        //   const allCarts = JSON.parse(carts);
        //   let total = 0;
        //   allCarts.map((cart) => {
        //     total = total + Number(cart.price);
        //   });
        //   dispatch(fetch_cart({ carts: allCarts, total: total }));
        // }
    };
};

export const deleteCart = ({ pid, token }) => {
    return (dispatch) => {
        if (!token) {
            // console.log("With Out Token");
            dispatch(delete_cart({ pid: pid }));
            return;
        }
        axios
            .delete(`${process.env.HOST}/cart/${pid}`, {
                headers: { Authorization: token },
            })
            .then((res) => {
                dispatch(delete_cart({ pid: pid }));
            })
            .catch((err) => {
                console.log(err);
            });
        // let total = 0;
        // const carts = JSON.parse(localStorage.getItem("carts"));
        // if (carts !== null) {
        //   const newCart = carts.filter((cart) => cart.id !== id);
        //   newCart.map((cart) => {
        //     total = total + Number(cart.price);
        //   });
        //   localStorage.setItem("carts", JSON.stringify(newCart));
        //   dispatch(delete_cart({ id: id, total: total }));
        // }
    };
};

export const resetCart = ({ token }) => {
    // console.log(token);
    return (dispatch) => {
        axios
            .delete(`${process.env.HOST}/cart`, {
                headers: { Authorization: token },
            })
            .then((res) => {
                dispatch(reset_cart());
            })
            .catch((err) => {
                console.log(err);
            });
    };
};
