import {
    FETCH_MEMBERSHIP_FAILURE,
    FETCH_MEMBERSHIP_REQUEST,
    FETCH_MEMBERSHIP_SUCCESS
} from '../Actions/MembershipActions';

const initialState = {
    loading: false,
    membership: [],
    error: ''
};

const MembershipReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MEMBERSHIP_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_MEMBERSHIP_SUCCESS:
            return {
                loading: false,
                membership: action.payload,
                error: ''
            };
        case FETCH_MEMBERSHIP_FAILURE:
            return {
                loading: false,
                membership: [],
                error: action.payload
            };
        default:
            return state;
    }
};

export default MembershipReducer;
