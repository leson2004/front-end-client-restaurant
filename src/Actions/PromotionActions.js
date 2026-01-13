import axios from "axios";

export const FETCH_PROMOTION_REQUEST = 'FETCH_PROMOTION_REQUEST';
export const FETCH_PROMOTION_SUCCESS = 'FETCH_PROMOTION_SUCCESS';
export const FETCH_PROMOTION_FAILURE = 'FETCH_PROMOTION_FAILURE';

import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";


export const fetchPromotionRequest = () => ({
    type: FETCH_PROMOTION_REQUEST
});

export const fetchPromotionSuccess = promotion => ({
    type: FETCH_PROMOTION_SUCCESS,
    payload: promotion
});

export const fetchPromotionFailure = error => ({
    type: FETCH_PROMOTION_FAILURE,
    payload: error
});



export const fetchPromotion = () => {
    return dispatch => {
        dispatch(fetchPromotionRequest());
        return axios.get(`${API_ENDPOINT}${API_DATA.promotion}`) 
            .then(response => {
                const promotions = response.data.results;
                dispatch(fetchPromotionSuccess(promotions));
                return promotions;
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchPromotionFailure(errorMsg));
            });
    };
};


