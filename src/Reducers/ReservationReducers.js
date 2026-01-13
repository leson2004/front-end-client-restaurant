import {
    FETCH_RESERVATION_REQUEST,
    FETCH_RESERVATION_SUCCESS,
    FETCH_RESERVATION_FAILURE
} from '../Actions/ReservationActions';

const initialState = {
    loading: false,
    reservations: [],
    error: ''
};

const reservationReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_RESERVATION_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_RESERVATION_SUCCESS:
            return {
                ...state,
                loading: false,
                reservations: action.payload,
                error: ''
            };
        case FETCH_RESERVATION_FAILURE:
            return {
                ...state,
                loading: false,
                reservations: [],
                error: action.payload
            };
        default:
            return state;
    }
};

export default reservationReducer;
