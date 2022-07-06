import {
    ADD_USER_DETAIL,
    REMOVE_USER_DETAIL,
    UPDATE_USER_DETAIL,
} from "./userTypes";

const initialState = {
    user: {},
    token: "",
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_USER_DETAIL:
            return {
                user: action.payload.user,
                token: action.payload.token,
            };
        case REMOVE_USER_DETAIL:
            return {
                user: {},
                token: "",
            };
        case UPDATE_USER_DETAIL:
            return {
                ...state,
                user: { ...state.user, ...action.payload.user },
            };
        default:
            return state;
    }
};

export default userReducer;
