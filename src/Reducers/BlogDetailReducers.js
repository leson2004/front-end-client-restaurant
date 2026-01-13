import {
  FETCH_BLOG_DETAIL_REQUEST,
  FETCH_BLOG_DETAIL_SUCCESS,
  FETCH_BLOG_DETAIL_FAILURE,
} from "../Actions/BlogDetailActions";

const initialState = {
  loading: false,
  blogDetail: null,
  error: null,
};

const blogDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BLOG_DETAIL_REQUEST:
      return { 
        ...state,
         loading: true };
    case FETCH_BLOG_DETAIL_SUCCESS:
      return { 
        loading: false,
         blogDetail: action.payload };
    case FETCH_BLOG_DETAIL_FAILURE:
      return { 
        loading: false,
         error: action.payload 
        };
    default:
      return state;
  }
};

export default blogDetailReducer;
