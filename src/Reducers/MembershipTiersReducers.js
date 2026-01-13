import {
    FETCH_MEMBERSHIP_TIERS_FAILURE,
    FETCH_MEMBERSHIP_TIERS_REQUEST,
    FETCH_MEMBERSHIP_TIERS_SUCCESS
} from '../Actions/MembershipTiersActions';

const initialState = {
    loading: false,
    membership_tiers: [],
    error: ''
};

const MembershipTiersReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MEMBERSHIP_TIERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_MEMBERSHIP_TIERS_SUCCESS:
            return {
                loading: false,
                // Giữ lại dữ liệu cũ và thêm dữ liệu mới vào
                membership_tiers: action.payload,
                error: ''
            };
        case FETCH_MEMBERSHIP_TIERS_FAILURE:
            return {
                loading: false,
                membership_tiers: [], // Clear dữ liệu khi có lỗi
                error: action.payload
            };
        default:
            return state;
    }
};

export default MembershipTiersReducer;
