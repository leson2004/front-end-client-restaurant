import axios from "axios";

export const FETCH_BLOG_DETAIL_REQUEST = 'FETCH_BLOG_DETAIL_REQUEST';
export const FETCH_BLOG_DETAIL_SUCCESS = 'FETCH_BLOG_DETAIL_SUCCESS';
export const FETCH_BLOG_DETAIL_FAILURE = 'FETCH_BLOG_DETAIL_FAILURE';

import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";

export const fetchBlogDetailRequest = () => ({
    type: FETCH_BLOG_DETAIL_REQUEST
});

export const fetchBlogDetailSuccess = blogDetail => ({
    type: FETCH_BLOG_DETAIL_SUCCESS,
    payload: blogDetail
});

export const fetchBlogDetailFailure = error => ({
    type: FETCH_BLOG_DETAIL_FAILURE,
    payload: error
});

// Hàm để fetch chi tiết blog theo ID
export const fetchBlogDetail = (blogId) => {
    return dispatch => {
        dispatch(fetchBlogDetailRequest());
        axios.get(`${API_ENDPOINT}${API_DATA.blog}/${blogId}`)
            .then(response => {
                const blogDetail = response.data.results;
                dispatch(fetchBlogDetailSuccess(blogDetail));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchBlogDetailFailure(errorMsg));
            });
    };
};

// Hàm để fetch chi tiết blog theo slug
export const fetchBlogDetailBySlug = (slug) => {
    return dispatch => {
        dispatch(fetchBlogDetailRequest());
        axios.get(`${API_ENDPOINT}${API_DATA.blog}/slug/${slug}`)
            .then(response => {
                const blogDetail = response.data.data;
                
                dispatch(fetchBlogDetailSuccess(blogDetail));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchBlogDetailFailure(errorMsg));
            });
    };
};
