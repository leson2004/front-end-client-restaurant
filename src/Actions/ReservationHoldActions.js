import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";
import http from "../Utils/Http";

export const HOLD_REQUEST = "reservation_hold/REQUEST";
export const HOLD_SUCCESS = "reservation_hold/SUCCESS";
export const HOLD_FAILURE = "reservation_hold/FAILURE";
export const HOLD_CLEAR = "reservation_hold/CLEAR";

// Persist only minimal reservation session info on client
const persistHoldSession = (payload) => {
  try {
    if (payload?.reservation_id) {
      localStorage.setItem(
        "active_reservation_id",
        String(payload.reservation_id)
      );
    }
    if (payload?.hold_expired_at) {
      localStorage.setItem("hold_expired_at", payload.hold_expired_at);
    }
  } catch (e) {
    // Ignore storage errors (e.g. private mode)
  }
};

const clearHoldSession = () => {
  try {
    localStorage.removeItem("active_reservation_id");
    localStorage.removeItem("hold_expired_at");
  } catch (e) {
    // Ignore storage errors
  }
};

export const holdRequest = () => ({ type: HOLD_REQUEST });
export const holdSuccess = (payload) => ({ type: HOLD_SUCCESS, payload });
export const holdFailure = (error) => ({ type: HOLD_FAILURE, payload: error });
export const clearHold = () => ({ type: HOLD_CLEAR });

/**
 * Step 1: Create hold. Body: { date, arrival_time, party_size }.
 * Backend returns: { reservation_id, reservation_code, hold_expired_at }.
 */
export const createHold = (data) => async (dispatch) => {
  dispatch(holdRequest());
  try {
    const response = await http.post(
      `${API_ENDPOINT}${API_DATA.reservationsHold}`,
      data
    );
    dispatch(holdSuccess(response.data));
    // Save session only after backend confirms hold creation
    persistHoldSession(response.data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(holdFailure(message));
    throw new Error(message);
  }
};

/**
 * Step 2: Update customer info. PUT /api/reservations/{id}/customer-info
 * Body: { fullname, phone, email, note }.
 */
export const updateCustomerInfo = (reservationId, data) => async (dispatch) => {
  try {
    await http.put(
      `${API_ENDPOINT}${API_DATA.reservations}/${reservationId}/customer-info`,
      data
    );
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
};

/**
 * Step 3: Add pre-order items. POST /api/reservations/{id}/items
 * Body: { items: [ { product_id, quantity, price }, ... ] }.
 */
export const addReservationItems = (reservationId, items) => async () => {
  try {
    await http.post(
      `${API_ENDPOINT}${API_DATA.reservations}/${reservationId}/items`,
      { items }
    );
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
};

/**
 * Step 4: Get payment preview. GET /api/reservations/{id}/payment-preview
 */
export const getPaymentPreview = (reservationId) => async () => {
  try {
    const response = await http.get(
      `${API_ENDPOINT}${API_DATA.reservations}/${reservationId}/payment-preview`
    );
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
};

/**
 * Step 5: Pay deposit. POST /api/public/payment/deposit
 * Body: { reservationId, depositAmount, method: 'momo' | 'vnpay', promotion_id? }.
 * Returns e.g. { payUrl } for redirect.
 */
export const requestDepositPayment = (data) => async () => {
  try {
    const response = await http.post(
      `${API_ENDPOINT}${API_DATA.paymentsDeposit}`,
      data
    );
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
};

/**
 * Lấy danh sách mã khuyến mãi đặc biệt (type=1, còn hiệu lực, còn số lượng).
 * GET /api/public/promotion?type=1&valid_now=1
 */
export const getSpecialPromotions = () => async () => {
  try {
    const response = await http.get(
      `${API_ENDPOINT}${API_DATA.promotion}?type=1&valid_now=1`
    );
    const list = response.data?.results ?? response.data ?? [];
    return Array.isArray(list) ? list : [];
  } catch (error) {
    return [];
  }
};

/**
 * Áp dụng mã giảm giá cho đặt bàn.
 * POST /api/reservations/:id/apply-promotion
 * Body: { code_name?: string, promotion_id?: number } (một trong hai).
 * Returns: { applied, promotion, total_before, total_after, discount_amount, deposit_before, deposit_after } hoặc lỗi.
 */
export const applyPromotionToReservation = (reservationId, body) => async () => {
  try {
    const response = await http.post(
      `${API_ENDPOINT}${API_DATA.applyPromotion}/${reservationId}/apply-promotion`,
      body
    );
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
};

/**
 * Resume an existing reservation session by ID.
 * Backend is the source of truth for status & expiration.
 *
 * GET /api/reservations/:id
 *
 * - status === 'HOLD' (not expired): restore hold state
 * - status === 'EXPIRED' or 'CANCELED': clear Redux + localStorage
 * - status === 'CONFIRMED': restore state and let caller redirect to success page
 */
export const resumeReservation = (reservationId) => async (dispatch) => {
  dispatch(holdRequest());
  try {
    const response = await http.get(
      `${API_ENDPOINT}${API_DATA.reservations}/${reservationId}`
    );
    const data = response.data || {};
    const rawStatus = data.status;

    // Backend may return numeric status:
    // 0=HOLD,1=CONFIRMED,2=CHECKED_IN,3=COMPLETED,4=CANCELED,5=EXPIRED
    let status;
    if (typeof rawStatus === "number") {
      switch (rawStatus) {
        case 0:
          status = "HOLD";
          break;
        case 1:
          status = "CONFIRMED";
          break;
        case 2:
          status = "CHECKED_IN";
          break;
        case 3:
          status = "COMPLETED";
          break;
        case 4:
          status = "CANCELED";
          break;
        case 5:
          status = "EXPIRED";
          break;
        default:
          status = "UNKNOWN";
      }
    } else {
      status = rawStatus;
    }

    // Normalize payload for reducer
    const payload = {
      reservation_id: data.reservation_id ?? data.id,
      reservation_code: data.reservation_code ?? data.code,
      hold_expired_at: data.hold_expired_at,
      status,
    };

    if (status === "HOLD") {
      dispatch(holdSuccess(payload));
      persistHoldSession(payload);
      return { status: "HOLD", reservation: payload };
    }

    if (status === "CONFIRMED") {
      dispatch(holdSuccess(payload));
      // We keep active_reservation_id so success pages can still show info
      persistHoldSession(payload);
      return { status: "CONFIRMED", reservation: payload };
    }

    if (status === "EXPIRED" || status === "CANCELED") {
      dispatch(clearHold());
      clearHoldSession();
      return { status };
    }

    // Unknown status → clear local state to be safe
    dispatch(clearHold());
    clearHoldSession();
    return { status: status || "UNKNOWN" };
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(holdFailure(message));
    throw new Error(message);
  }
};

/**
 * Cancel an existing reservation on hold.
 * NOTE: This assumes backend exposes POST /reservations/:id/cancel.
 */
export const cancelReservation = (reservationId) => async (dispatch) => {
  try {
    await http.post(
      `${API_ENDPOINT}${API_DATA.reservations}/${reservationId}/cancel`
    );
    dispatch(clearHold());
    clearHoldSession();
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
};
