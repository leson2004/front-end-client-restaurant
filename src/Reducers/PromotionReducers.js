import {
    FETCH_PROMOTION_FAILURE,
    FETCH_PROMOTION_REQUEST,
    FETCH_PROMOTION_SUCCESS
} from '../Actions/PromotionActions';

const initialState = {
    loading: false,
    promotion: [], 
    error: ''
};

const promotionReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PROMOTION_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_PROMOTION_SUCCESS:
            return {
                loading: false,
                promotion: Array.isArray(action.payload) ? action.payload : [], 
                error: ''
            };
        case FETCH_PROMOTION_FAILURE:
            return {
                loading: false,
                promotion: [], 
                error: action.payload
            };
        default:
            return state;
    }
};

export default promotionReducer;
