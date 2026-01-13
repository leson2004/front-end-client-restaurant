import {
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    CHECK_PASSWORD_REQUEST,
    CHECK_PASSWORD_SUCCESS,
    CHECK_PASSWORD_FAILURE
} from "../Actions/UserActions";

const initialState = {
    loading: false,
    user: [],
    error: '',
    passwordCheckMessage: '',
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: Array.isArray(action.payload) ? action.payload : [],
                error: ''
            };
        case FETCH_USER_FAILURE:
            return {
                ...state,
                loading: false,
                user: [],
                error: action.payload
            };
        case CHECK_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true,
                error: '',
                passwordCheckMessage: '',
            };
        case CHECK_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                passwordCheckMessage: action.payload,
                error: ''
            };
        case CHECK_PASSWORD_FAILURE:
            return {
                ...state,
                loading: false,
                passwordCheckMessage: '',
                error: action.payload
            };
        default:
            return state;
    }
};

export default userReducer;
