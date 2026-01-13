import {
    FETCH_PRODUCT_DETAIL_FAILURE,
    FETCH_PRODUCT_DETAIL_REQUEST,
    FETCH_PRODUCT_DETAIL_SUCCESS
} from '../Actions/ProductDetailActions';

const initialState = {
    loading: false,
    productDetail: null, // Dùng `null` vì chỉ có 1 sản phẩm chi tiết
    error: ''
};

const productDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCT_DETAIL_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };
        case FETCH_PRODUCT_DETAIL_SUCCESS:
            return {
                loading: false,
                productDetail: action.payload, // Lưu chi tiết sản phẩm
                error: ''
            };
        case FETCH_PRODUCT_DETAIL_FAILURE:
            return {
                loading: false,
                productDetail: null, // Không có chi tiết sản phẩm nếu lỗi xảy ra
                error: action.payload
            };
        default:
            return state;
    }
};

export default productDetailReducer;
