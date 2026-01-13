import {
    FETCH_CONTACT_FAILURE,
    FETCH_CONTACT_REQUEST,
    FETCH_CONTACT_SUCCESS
} from '../Actions/ContactActions';


const initialState = {
    loading: false,
    contact: [],
    error: ''
};

const contactReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CONTACT_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_CONTACT_SUCCESS:
            return {
                loading: false,
                contact: Array.isArray(action.payload) ? action.payload : [],
                error: ''
            };
        case FETCH_CONTACT_FAILURE:
            return {
                loading: false,
                contact: [],
                error: action.payload
            };
        default:
            return state;
    }
};

export default contactReducer;

