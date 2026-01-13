import {
    FETCH_AUTH_FAILURE,
    FETCH_AUTH_REQUEST,
    FETCH_AUTH_SUCCESS,
    SHOW_SUCCESS_ALERT,
    SHOW_ERROR_ALERT,
    CHECK_AUTH_STATUS,

} from "../Actions/AuthActions";

const initialState = {
    successAlert: null,
    errorAlert: null,
    loading: false,
    auth: null,
    error: '',
    isAuthenticated: false // Thêm trạng thái này
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_AUTH_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_AUTH_SUCCESS:
            return {
                loading: false,
                auth: Array.isArray(action.payload) ? action.payload : [],
                error: '',
                isAuthenticated: true // Cập nhật khi đăng nhập thành công
            };
        case FETCH_AUTH_FAILURE:
            return {
                loading: false,
                auth: null,
                error: action.payload,
                isAuthenticated: false // Cập nhật khi đăng nhập thất bại
            };
        case SHOW_SUCCESS_ALERT:
            return {
                ...state,
                successAlert: action.payload,
            };
        case SHOW_ERROR_ALERT:
            return {
                ...state,
                errorAlert: action.payload,
            };
        case CHECK_AUTH_STATUS:
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                auth: action.payload.user,
                loading: false
            };
        default:
            return state;
    }
};

export default authReducer;

