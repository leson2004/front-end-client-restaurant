// Action Types
export const FETCH_RESERVATION_REQUEST = "FETCH_RESERVATION_REQUEST";
export const FETCH_RESERVATION_SUCCESS = "FETCH_RESERVATION_SUCCESS";
export const FETCH_RESERVATION_FAILURE = "FETCH_RESERVATION_FAILURE";

// Import API config
import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";
import http from "../Utils/Http";

// Action Creators
export const fetchReservationDetailRequest = () => ({
    type: FETCH_RESERVATION_REQUEST,
});

export const fetchReservationDetailSuccess = details => ({
    type: FETCH_RESERVATION_SUCCESS,
    payload: details,
});

export const fetchReservationDetailFailure = error => ({
    type: FETCH_RESERVATION_FAILURE,
    payload: error,
});

// Thunk to Fetch Reservation Details
export const fetchReservationDetails = () => {
    return async dispatch => {
        dispatch(fetchReservationDetailRequest());
        try {
            const response = await http.get(`${API_ENDPOINT}${API_DATA.reservationDetails}`);
            dispatch(fetchReservationDetailSuccess(response.data));
        } catch (error) {
            dispatch(fetchReservationDetailFailure(error.message));
        }
    };
};

// Thunk to Add a New Reservation Detail
export const addNewReservationDetail = (detailData) => {
    return async (dispatch) => {
        dispatch(fetchReservationDetailRequest());
        try {
            const response = await http.post(`${API_ENDPOINT}${API_DATA.reservation_detail}`, detailData);
            dispatch(fetchReservationDetailSuccess(response.data));
        } catch (error) {
            dispatch(fetchReservationDetailFailure(error.message));
            throw new Error(error.message); // Ném lỗi để bắt trong component
        }
    };
};
