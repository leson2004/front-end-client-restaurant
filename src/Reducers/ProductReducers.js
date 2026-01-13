import {
    FETCH_PRODUCT_FAILURE,
    FETCH_PRODUCT_REQUEST,
    FETCH_PRODUCT_SUCCESS
} from '../Actions/ProductActions';


const initialState = {
    loading: false,
    product: [],
    error: ''
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_PRODUCT_SUCCESS:
            return {
                loading: false,
                product: Array.isArray(action.payload) ? action.payload : [],
                error: ''
            };
        case FETCH_PRODUCT_FAILURE:
            return {
                loading: false,
                product: [],
                error: action.payload
            };
        default:
            return state;
    }
};

export default productReducer;

