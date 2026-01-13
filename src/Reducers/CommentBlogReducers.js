import {
    FETCH_COMMENTBLOG_FAILURE,
    FETCH_COMMENTBLOG_REQUEST,
    FETCH_COMMENTBLOG_SUCCESS,
    SET_CURRENT_PAGE
} from '../Actions/CommentBlogActions';

const initialState = {
    allCommentBlog: [],
    commentBlog: [],
    currentPage: 1,
    pageSize: 20,
    loading: false,
    error: '',
    totalCount: 0,
    totalPages: 0
};



const CommentBlogReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_COMMENTBLOG_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_COMMENTBLOG_SUCCESS:
            return {
                ...state,
                loading: false,
                allCommentBlog: action.payload.results,
                totalCount: action.payload.totalCount,
                totalPages: action.payload.totalPages,
                currentPage: action.payload.currentPage,
                commentBlog: action.payload.results.slice(0, state.pageSize) // Chia dữ liệu cho trang đầu tiên
            };
        case FETCH_COMMENTBLOG_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case SET_CURRENT_PAGE:
            if (state.pageSize) {
                const start = (action.payload - 1) * state.pageSize;
                const end = start + state.pageSize;
                return {
                    ...state,
                    currentPage: action.payload,
                    commentBlog: state.allCommentBlog.slice(start, end)
                };
            }
            return state;

        default:
            return state;
    }
};

export default CommentBlogReducer;

