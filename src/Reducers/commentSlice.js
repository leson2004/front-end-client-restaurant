// Plain Redux implementation (no @reduxjs/toolkit) to match project setup
// Aligned with Comment Blog API: moderation (approved/hidden/rejected), rate limit 429
import http from '../Utils/Http';

// Action types
const CREATE_COMMENT_REQUEST = 'comment/CREATE_COMMENT_REQUEST';
const CREATE_COMMENT_SUCCESS = 'comment/CREATE_COMMENT_SUCCESS';
const CREATE_COMMENT_FAILURE = 'comment/CREATE_COMMENT_FAILURE';

const UPDATE_COMMENT_REQUEST = 'comment/UPDATE_COMMENT_REQUEST';
const UPDATE_COMMENT_SUCCESS = 'comment/UPDATE_COMMENT_SUCCESS';
const UPDATE_COMMENT_FAILURE = 'comment/UPDATE_COMMENT_FAILURE';

const FETCH_COMMENTS_REQUEST = 'comment/FETCH_COMMENTS_REQUEST';
const FETCH_COMMENTS_SUCCESS = 'comment/FETCH_COMMENTS_SUCCESS';
const FETCH_COMMENTS_FAILURE = 'comment/FETCH_COMMENTS_FAILURE';

const DELETE_COMMENT_REQUEST = 'comment/DELETE_COMMENT_REQUEST';
const DELETE_COMMENT_SUCCESS = 'comment/DELETE_COMMENT_SUCCESS';
const DELETE_COMMENT_FAILURE = 'comment/DELETE_COMMENT_FAILURE';

const CLEAR_MODERATION_MESSAGE = 'comment/CLEAR_MODERATION_MESSAGE';

// Normalize comment from API (user object -> fullname, avatar on comment)
function normalizeComment(c) {
  if (!c) return c;
  const u = c.user;
  return {
    ...c,
    fullname: c.fullname || (u && u.fullname) || 'Ẩn danh',
    avatar: c.avatar || (u && u.avatar) || null,
  };
}

// Initial state
const initialState = {
  comments: [],
  loading: false,
  error: null,
  moderationMessage: null, // { type: 'success'|'warning'|'danger', text, retryAfter? }
};

// Reducer
export default function commentReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_COMMENT_REQUEST:
    case FETCH_COMMENTS_REQUEST:
    case DELETE_COMMENT_REQUEST:
    case UPDATE_COMMENT_REQUEST:
      return { ...state, loading: true, error: null };

    case CREATE_COMMENT_SUCCESS: {
      const payload = action.payload || {};
      const status = payload.status;
      const message = payload.message || '';
      const comment = payload.comment;
      if (status === 'approved' && comment) {
        const normalized = normalizeComment(comment);
        return {
          ...state,
          loading: false,
          comments: [normalized, ...state.comments],
          moderationMessage: {
            type: 'success',
            text: message || 'Thêm bình luận thành công.',
            ...(payload.moderation_skipped && { moderationSkipped: true }),
          },
        };
      }
      if (status === 'hidden') {
        return {
          ...state,
          loading: false,
          moderationMessage: {
            type: 'warning',
            text: message || 'Bình luận đã bị ẩn do vi phạm tiêu chuẩn cộng đồng.',
          },
        };
      }
      if (status === 'rejected') {
        return {
          ...state,
          loading: false,
          moderationMessage: {
            type: 'danger',
            text: message || payload.reason || 'Nội dung không phù hợp.',
          },
        };
      }
      return { ...state, loading: false, moderationMessage: { type: 'success', text: message } };
    }

    case CREATE_COMMENT_FAILURE: {
      const payload = action.payload;
      const isObj = payload && typeof payload === 'object';
      const text = isObj ? (payload.text || payload.message) : payload;
      const retryAfter = isObj ? payload.retryAfter : undefined;
      const msg = {
        type: retryAfter != null ? 'warning' : 'danger',
        text: text || 'Có lỗi xảy ra.',
        ...(retryAfter != null && { retryAfter }),
      };
      return {
        ...state,
        loading: false,
        error: text,
        moderationMessage: msg,
      };
    }

    case UPDATE_COMMENT_SUCCESS: {
      const payload = action.payload || {};
      const status = payload.status;
      const message = payload.message || '';
      const updated = payload.comment;
      const nextComments = updated
        ? state.comments.map((c) => (c.id === updated.id ? normalizeComment(updated) : c))
        : state.comments;
      const msgType = status === 'hidden' ? 'warning' : 'success';
      const msgText =
        status === 'hidden'
          ? message || 'Đã cập nhật nhưng bình luận bị ẩn do vi phạm tiêu chuẩn.'
          : message || 'Cập nhật bình luận thành công.';
      return {
        ...state,
        loading: false,
        comments: nextComments,
        moderationMessage: { type: msgType, text: msgText },
      };
    }

    case UPDATE_COMMENT_FAILURE: {
      const payload = action.payload;
      const isObj = payload && typeof payload === 'object';
      const text = isObj ? (payload.text || payload.message) : payload;
      const retryAfter = isObj ? payload.retryAfter : undefined;
      return {
        ...state,
        loading: false,
        error: text,
        moderationMessage: {
          type: retryAfter != null ? 'warning' : 'danger',
          text: text || 'Có lỗi xảy ra.',
          ...(retryAfter != null && { retryAfter }),
        },
      };
    }

    case FETCH_COMMENTS_SUCCESS: {
      const list = action.payload || [];
      return { ...state, loading: false, comments: list.map(normalizeComment) };
    }

    case FETCH_COMMENTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DELETE_COMMENT_SUCCESS: {
      const id = action.payload?.id;
      return {
        ...state,
        loading: false,
        comments: id ? state.comments.filter((c) => c.id !== id) : state.comments,
        moderationMessage: { type: 'success', text: 'Xóa bình luận thành công' },
      };
    }

    case DELETE_COMMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CLEAR_MODERATION_MESSAGE:
      return { ...state, moderationMessage: null };

    default:
      return state;
  }
}

// Action creators / thunks
export const clearModerationMessage = () => ({ type: CLEAR_MODERATION_MESSAGE });

export const createComment = (commentData) => (dispatch) => {
  dispatch({ type: CREATE_COMMENT_REQUEST });
  return http
    .post('/public/comment-blog/', commentData)
    .then((res) => {
      const data = res.data || {};
      // Backend: 201 = approved | hidden; 400 = rejected (handled in catch)
      dispatch({ type: CREATE_COMMENT_SUCCESS, payload: data });
      return data;
    })
    .catch((err) => {
      const status = err.response?.status;
      const body = err.response?.data || {};
      if (status === 400) {
        const text = body.message || body.reason || 'Nội dung không phù hợp.';
        dispatch({ type: CREATE_COMMENT_FAILURE, payload: { text, status: 400 } });
        return Promise.reject({ text, status: 400 });
      }
      if (status === 429) {
        const retryAfter = body.retryAfter ?? 60;
        const text =
          body.error ||
          `Quá nhiều thao tác. Vui lòng thử lại sau ${retryAfter} giây.`;
        dispatch({
          type: CREATE_COMMENT_FAILURE,
          payload: { text, retryAfter, status: 429 },
        });
        return Promise.reject({ text, retryAfter, status: 429 });
      }
      const text = body.error || body.message || err.message || 'Lỗi hệ thống.';
      dispatch({ type: CREATE_COMMENT_FAILURE, payload: { text, status } });
      return Promise.reject({ text, status });
    });
};

export const fetchCommentsByBlogId = (blogId, params = {}) => (dispatch) => {
  dispatch({ type: FETCH_COMMENTS_REQUEST });
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `/public/comment-blog/blog/${blogId}?${query}`
    : `/public/comment-blog/blog/${blogId}`;
  return http
    .get(url)
    .then((res) => {
      const data = res.data;
      let comments = [];
      if (Array.isArray(data)) comments = data;
      else if (data.results) comments = data.results;
      else if (data.comments) comments = data.comments;
      dispatch({ type: FETCH_COMMENTS_SUCCESS, payload: comments });
      return comments;
    })
    .catch((err) => {
      const msg = err.response?.data?.message || err.message;
      dispatch({ type: FETCH_COMMENTS_FAILURE, payload: msg });
      return Promise.reject(msg);
    });
};

export const updateComment = (id, body) => (dispatch) => {
  dispatch({ type: UPDATE_COMMENT_REQUEST });
  return http
    .patch(`/public/comment-blog/${id}`, body)
    .then((res) => {
      const data = res.data || {};
      dispatch({ type: UPDATE_COMMENT_SUCCESS, payload: data });
      return data;
    })
    .catch((err) => {
      const status = err.response?.status;
      const b = err.response?.data || {};
      if (status === 400) {
        const text = b.message || b.reason || 'Nội dung chỉnh sửa không phù hợp.';
        dispatch({ type: UPDATE_COMMENT_FAILURE, payload: { text, status: 400 } });
        return Promise.reject({ text, status: 400 });
      }
      if (status === 429) {
        const retryAfter = b.retryAfter ?? 60;
        const text = b.error || `Quá nhiều thao tác. Thử lại sau ${retryAfter} giây.`;
        dispatch({
          type: UPDATE_COMMENT_FAILURE,
          payload: { text, retryAfter, status: 429 },
        });
        return Promise.reject({ text, retryAfter, status: 429 });
      }
      const text = b.error || b.message || err.message || 'Lỗi hệ thống.';
      dispatch({ type: UPDATE_COMMENT_FAILURE, payload: { text, status } });
      return Promise.reject({ text, status });
    });
};

export const deleteComment = (id) => (dispatch) => {
  dispatch({ type: DELETE_COMMENT_REQUEST });
  return http
    .delete(`/public/comment-blog/${id}`)
    .then((res) => {
      dispatch({ type: DELETE_COMMENT_SUCCESS, payload: { id, data: res.data } });
      return { id, data: res.data };
    })
    .catch((err) => {
      const msg = err.response?.data?.message || err.message;
      dispatch({ type: DELETE_COMMENT_FAILURE, payload: msg });
      return Promise.reject(msg);
    });
};
