import {
    FETCH_PRODUCT_CATEGORY_REQUEST,
    FETCH_PRODUCT_CATEGORY_SUCCESS,
    FETCH_PRODUCT_CATEGORY_FAILURE
} from '../Actions/ProductCategoryActions';


const initialState = {
    loading: false,
    product_category: [],
    error: ''
};

const productCategoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCT_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_PRODUCT_CATEGORY_SUCCESS:
            return {
                loading: false,
                product_category: Array.isArray(action.payload) ? action.payload : [],
                error: ''
            };
        case FETCH_PRODUCT_CATEGORY_FAILURE:
            return {
                loading: false,
                product_category: [],
                error: action.payload
            };
        default:
            return state;
    }
};

export default productCategoryReducer;

