import {
    FETCH_TABLE_REQUEST,
    FETCH_TABLE_SUCCESS,
    FETCH_TABLE_FAILURE
} from '../Actions/TableActions';

const initialState = {
    loading: false,
    table: [], 
    error: ''
};

const tableReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_TABLE_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_TABLE_SUCCESS:
            return {
                loading: false,
                table: Array.isArray(action.payload) ? action.payload : [], 
                error: ''
            };
        case FETCH_TABLE_FAILURE:
            return {
                loading: false,
                table: [], 
                error: action.payload
            };
        default:
            return state;
    }
};

export default tableReducer;
