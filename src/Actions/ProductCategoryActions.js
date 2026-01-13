
export const FETCH_PRODUCT_CATEGORY_REQUEST = 'FETCH_PRODUCT_CATEGORY_REQUEST';
export const FETCH_PRODUCT_CATEGORY_SUCCESS = 'FETCH_PRODUCT_CATEGORY_SUCCESS';
export const FETCH_PRODUCT_CATEGORY_FAILURE = 'FETCH_PRODUCT_CATEGORY_FAILURE';

import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";
import http from "../Utils/Http";

export const fetchProductCategoryRequest = () => ({
    type: FETCH_PRODUCT_CATEGORY_REQUEST
});

export const fetchProductCategorySuccess = product => ({
    type: FETCH_PRODUCT_CATEGORY_SUCCESS,
    payload: product
});

export const fetchProductCategoryFailure = error => ({
    type: FETCH_PRODUCT_CATEGORY_FAILURE,
    payload: error
});

export const fetchProductCategory = () => {
    return dispatch => {
        dispatch(fetchProductCategoryRequest());
        http.get(`${API_ENDPOINT}/${API_DATA.categoryProduct}`)
            .then(response => {
                const product_category = response.data.results;
                dispatch(fetchProductCategorySuccess(product_category));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchProductCategoryFailure(errorMsg));
            });
    };
};

export const fetchProductCategoryHoatDong = () => {
    return dispatch => {
        dispatch(fetchProductCategoryRequest());
        http.get(`${API_ENDPOINT}/${API_DATA.categoryProduct}/hoat_dong`)
            .then(response => {
                const product_category = response.data.results;
                dispatch(fetchProductCategorySuccess(product_category));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchProductCategoryFailure(errorMsg));
            });
    };
};

export const fetchListProductCategory = () => {
    return dispatch => {
        dispatch(fetchProductCategoryRequest());
        http.get(`${API_ENDPOINT}/${API_DATA.categoryProduct}/danh_muc`)
            .then(response => {
                const product_category = response.data.results;
                dispatch(fetchProductCategorySuccess(product_category));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchProductCategoryFailure(errorMsg));
            });
    };
};