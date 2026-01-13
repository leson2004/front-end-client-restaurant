
export const FETCH_COMMENTBLOG_REQUEST = 'FETCH_COMMENTBLOG_REQUEST';
export const FETCH_COMMENTBLOG_SUCCESS = 'FETCH_COMMENTBLOG_SUCCESS';
export const FETCH_COMMENTBLOG_FAILURE = 'FETCH_COMMENTBLOG_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';

import { API_ENDPOINT } from "../Config/Client/APIs";
import ClientConfig from '../Config/Client';
import http from "../Utils/Http";

// Action Creators
export const fetchCommentBlogRequest = () => ({
    type: FETCH_COMMENTBLOG_REQUEST
});

export const fetchCommentBlogSuccess = (results, totalCount, totalPages, currentPage) => ({
    type: FETCH_COMMENTBLOG_SUCCESS,
    payload: {
        results,
        totalCount,
        totalPages,
        currentPage
    }
});

export const fetchCommentBlogFailure = error => ({
    type: FETCH_COMMENTBLOG_FAILURE,
    payload: error
});

export const setCurrentPage = (page) => ({
    type: SET_CURRENT_PAGE,
    payload: page
});

export const fetchCommentBlog = (content = '', page = 1, pageSize = 20) => {
    return dispatch => {
        dispatch(fetchCommentBlogRequest());

        const url = new URL(`${API_ENDPOINT}/public/${ClientConfig.routes.commentBlog}`);
        console.log (url);
        
        if (content) {
            url.searchParams.append('search', content);
        }
        url.searchParams.append('page', page);
        url.searchParams.append('pageSize', pageSize);

        // Thực hiện gọi API để lấy danh sách bình luận
        http.get(url.toString())
            .then(response => {
                console.log (response.data);
                // Nhận thêm dữ liệu từ API: fullname, avatar
                const { results, totalCount, totalPages, currentPage } = response.data;

                // Dispatch dữ liệu sau khi thành công
                dispatch(fetchCommentBlogSuccess(results, totalCount, totalPages, currentPage));
            })
            .catch(error => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchCommentBlogFailure(errorMsg));
            });
    };
};


// Add Permissions Action
export const addCommentBlog = (commentblog) => {
    return (dispatch) => {
        dispatch(fetchCommentBlogRequest());

        // Return the promise so .then() can be used in the component
        return http.post(`${API_ENDPOINT}/${ClientConfig.routes.commentBlog}`, commentblog)
            .then((response) => {
                dispatch(fetchCommentBlogSuccess([response.data], 1, 1, 1));
                return response; // Return the response to allow chaining
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchCommentBlogFailure(errorMsg));
                throw error; // Rethrow the error to handle it in .catch()
            });
    };
};


// Update Permissions Action
export const updateCommentBlog = (id, data) => {
    return dispatch => {
        dispatch(fetchCommentBlogRequest());
        http.patch(`${API_ENDPOINT}/${ClientConfig.routes.commentBlog}/${id}`, data)
            .then(() => {
                dispatch(fetchCommentBlog());
            })
            .catch(error => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchCommentBlogFailure(errorMsg));
            });
    };
};

// Delete Permissions Action
export const deleteCommentBlog = (id) => {
    return dispatch => {
        dispatch(fetchCommentBlogRequest());
        http.delete(`${API_ENDPOINT}/${ClientConfig.routes.commentBlog}/${id}`)
            .then(() => {
                dispatch(fetchCommentBlog()); // Refresh the permissions list
            })
            .catch(error => {
                const errorMsg = error.response?.data?.message || error.message;
                dispatch(fetchCommentBlogFailure(errorMsg));
            });
    };
};

