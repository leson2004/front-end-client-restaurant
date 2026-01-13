import { API_DATA, API_ENDPOINT } from "../Config/Client/APIs";
import http from "../Utils/Http";

export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const CHECK_PASSWORD_REQUEST = 'CHECK_PASSWORD_REQUEST';
export const CHECK_PASSWORD_SUCCESS = 'CHECK_PASSWORD_SUCCESS';
export const CHECK_PASSWORD_FAILURE = 'CHECK_PASSWORD_FAILURE';


export const fetchUserRequest = () => ({
    type: FETCH_USER_REQUEST
});

export const fetchUserSuccess = user => ({
    type: FETCH_USER_SUCCESS,
    payload: user
});

export const fetchUserFailure = error => ({
    type: FETCH_USER_FAILURE,
    payload: error
});

export const checkPasswordRequest = () => ({
    type: CHECK_PASSWORD_REQUEST
});

export const checkPasswordSuccess = message => ({
    type: CHECK_PASSWORD_SUCCESS,
    payload: message
});

export const checkPasswordFailure = error => ({
    type: CHECK_PASSWORD_FAILURE,
    payload: error
});



export const fetchUser = () => {
    return dispatch => {
        dispatch(fetchUserRequest());
        http.get(`${API_ENDPOINT}${API_DATA.users}`)
            .then(response => {
                const user = response.data.results;
                dispatch(fetchUserSuccess(user));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchUserFailure(errorMsg));
            });
    };
};

export const checkPassword = (email, currentPassword) => {
    return dispatch => {
        dispatch(checkPasswordRequest());
        return http.post(`${API_ENDPOINT}${API_DATA.checkPassword}`, { email, currentPassword })
            .then(response => {
                dispatch(checkPasswordSuccess(response.data.message));
                return response.data.message; // Trả về thông báo mật khẩu đúng/sai
            })
            .catch(error => {
                const errorMsg = error.response && error.response.data && error.response.data.error
                    ? error.response.data.error
                    : error.message;
                dispatch(checkPasswordFailure(errorMsg));
                return errorMsg; // Trả về thông báo lỗi
            });
    };
};


export const updateProfile = (id, data) => {
    return (dispatch) => {
        dispatch(fetchUserRequest());
        console.log('Update profile action ID:', id); // Kiểm tra giá trị id
        http.patch(`${API_ENDPOINT}${API_DATA.users}/${id}`, data)
            .then((response) => {
                console.log(response);
                dispatch(fetchUserSuccess(response.data.data));
            })
            .catch((error) => {
                console.error('Update profile error:', error); // Kiểm tra lỗi
                dispatch(fetchUserFailure(error.message));
            });
    };
};


