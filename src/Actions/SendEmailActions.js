import { API_DATA, API_ENDPOINT } from "../Config/Client/APIs";
import http from "../Utils/Http";

export const FETCH_SEN_REQUEST = "FETCH_SEN_REQUEST";
export const FETCH_SEN_SUCCESS = "FETCH_SEN_SUCCESS";
export const FETCH_SEN_FAILURE = "FETCH_SEN_FAILURE";

export const fetchSenRequest = () => ({
    type: FETCH_SEN_REQUEST,
});

export const fetchSenSuccess = (response) => ({
    type: FETCH_SEN_SUCCESS,
    payload: response,
});

export const fetchSenFailure = (error) => ({
    type: FETCH_SEN_FAILURE,
    payload: error,
});

export const sendEmail = (dishes, dishList, customerInfo, currentTotal, VAT10, discount) => {
    return async (dispatch) => {
        dispatch(fetchSenRequest());
        try {
            // Gửi API
            const response = await http.post(`${API_ENDPOINT}${API_DATA.sendEmail}`, { dishes, dishList, customerInfo, currentTotal, VAT10, discount });
            
            // Dispatch hành động success
            dispatch(fetchSenSuccess(response.data));
            
            // Trả về phản hồi (nếu cần)
            return response.data;
        } catch (error) {
            // Lấy thông báo lỗi chi tiết
            const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi gửi email";
            
            // Dispatch hành động failure
            dispatch(fetchSenFailure(errorMsg));
            
            // Trả về lỗi (hoặc hiển thị trên giao diện)
            throw new Error(errorMsg);
        }
    };
};
