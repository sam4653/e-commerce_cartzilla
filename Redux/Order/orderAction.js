import axios from "axios";
import { FETCH_ORDER, SUCCESS, REQUEST } from "./orderTypes";

export const fetch_order = (orders) => {
    return {
        type: FETCH_ORDER,
        payload: orders,
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
