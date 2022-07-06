import {
    ADD_USER_DETAIL,
    REMOVE_USER_DETAIL,
    UPDATE_USER_DETAIL,
} from "./userTypes";

export const add_user_detail = (detail) => {
    return {
        type: ADD_USER_DETAIL,
        payload: detail,
    };
};

export const remove_user_detail = () => {
    return {
        type: REMOVE_USER_DETAIL,
    };
};
export const update_user_detail = (detail) => {
    return {
        type: UPDATE_USER_DETAIL,
        payload: detail,
    };
};
