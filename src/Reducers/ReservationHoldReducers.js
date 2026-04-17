import {
  HOLD_REQUEST,
  HOLD_SUCCESS,
  HOLD_FAILURE,
  HOLD_CLEAR,
} from "../Actions/ReservationHoldActions";

const initialState = {
  reservationId: null,
  reservationCode: null,
  holdExpiredAt: null,
  status: null,
  loading: false,
  error: null,
};

export default function reservationHoldReducer(state = initialState, action) {
  switch (action.type) {
    case HOLD_REQUEST:
      return { ...state, loading: true, error: null };
    case HOLD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        reservationId: action.payload.reservation_id ?? action.payload.id,
        reservationCode:
          action.payload.reservation_code ?? action.payload.code ?? null,
        holdExpiredAt: action.payload.hold_expired_at ?? null,
        status: action.payload.status ?? "HOLD",
      };
    case HOLD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        reservationId: null,
        reservationCode: null,
        holdExpiredAt: null,
        status: null,
      };
    case HOLD_CLEAR:
      return initialState;
    default:
      return state;
  }
}
