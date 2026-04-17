import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  createHold,
  updateCustomerInfo,
  clearHold,
  resumeReservation,
  cancelReservation,
} from "../../Actions/ReservationHoldActions";
import { jwtDecode as jwt_decode } from "jwt-decode";

/** Lấy user_id từ accessToken (nếu đã đăng nhập) */
const getUserIdFromToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return null;
  try {
    const decoded = jwt_decode(accessToken);
    return decoded?.id ?? null;
  } catch {
    return null;
  }
};

export default function Booking() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const holdState = useSelector((state) => state.reservation_hold);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [countdownSeconds, setCountdownSeconds] = useState(null);
  const [existingHoldSeconds, setExistingHoldSeconds] = useState(null);
  const [hasExistingHold, setHasExistingHold] = useState(false);
  const [pendingReservationId, setPendingReservationId] = useState(null);
  const [resuming, setResuming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const step1Form = useForm();
  const step2Form = useForm();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setShowModal(true);
    }
  }, []);

  // On mount: check if there is a locally persisted HOLD session
  useEffect(() => {
    const storedId = localStorage.getItem("active_reservation_id");
    const storedExpiredAt = localStorage.getItem("hold_expired_at");
    if (!storedId || !storedExpiredAt) {
      return;
    }

    const expiredAtMs = new Date(storedExpiredAt).getTime();
    const now = Date.now();

    // If local copy is obviously expired, clear it and reset Redux
    if (!Number.isFinite(expiredAtMs) || now >= expiredAtMs) {
      localStorage.removeItem("active_reservation_id");
      localStorage.removeItem("hold_expired_at");
      dispatch(clearHold());
      return;
    }

    // There is a potentially valid hold → ask user whether to resume
    setPendingReservationId(storedId);
    setHasExistingHold(true);
  }, [dispatch]);

  // Pre-fill step 2 from logged-in user
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && step === 2) {
      const user = JSON.parse(userData);
      step2Form.setValue("fullname", user.fullname || "");
      step2Form.setValue("email", user.email || "");
      step2Form.setValue("phone", user.tel || user.phone || "");
    }
  }, [step]);

  // Countdown for active HOLD in Redux (step 2 after user chose to continue)
  useEffect(() => {
    if (!holdState.holdExpiredAt || step !== 2 || holdState.status !== "HOLD") {
      setCountdownSeconds(null);
      return;
    }
    const updateCountdown = () => {
      const now = new Date().getTime();
      const expiredAt = new Date(holdState.holdExpiredAt).getTime();
      const remaining = Math.max(0, Math.floor((expiredAt - now) / 1000));
      setCountdownSeconds(remaining);
      if (remaining <= 0) {
        dispatch(clearHold());
        setStep(1);
        setSubmitError(
          "Đặt chỗ đã hết hạn. Vui lòng chọn lại ngày, giờ và số người."
        );
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [holdState.holdExpiredAt, holdState.status, step, dispatch]);

  // Countdown for existing HOLD message before user decides to continue/cancel
  useEffect(() => {
    if (!hasExistingHold) {
      setExistingHoldSeconds(null);
      return;
    }

    const storedExpiredAt = localStorage.getItem("hold_expired_at");
    if (!storedExpiredAt) {
      setExistingHoldSeconds(null);
      setHasExistingHold(false);
      return;
    }

    const updateExistingCountdown = () => {
      const now = Date.now();
      const expiredAt = new Date(storedExpiredAt).getTime();
      const remaining = Math.max(0, Math.floor((expiredAt - now) / 1000));
      setExistingHoldSeconds(remaining);

      if (!Number.isFinite(expiredAt) || remaining <= 0) {
        localStorage.removeItem("active_reservation_id");
        localStorage.removeItem("hold_expired_at");
        dispatch(clearHold());
        setHasExistingHold(false);
      }
    };

    updateExistingCountdown();
    const interval = setInterval(updateExistingCountdown, 1000);
    return () => clearInterval(interval);
  }, [hasExistingHold, dispatch]);

  const handleResumeExistingHold = async () => {
    if (!pendingReservationId) return;
    setResuming(true);
    setSubmitError("");
    try {
      const result = await dispatch(resumeReservation(pendingReservationId));
      const status = result?.status;

      if (status === "HOLD") {
        setHasExistingHold(false);
        setStep(2);
      } else if (status === "CONFIRMED") {
        // Reservation already confirmed → send user to success page
        navigate("/confirm");
      } else if (status === "EXPIRED" || status === "CANCELED") {
        setHasExistingHold(false);
        setSubmitError(
          "Đặt chỗ của bạn đã hết hạn hoặc đã bị hủy. Vui lòng đặt chỗ mới."
        );
      } else {
        setHasExistingHold(false);
        setSubmitError(
          "Không thể tiếp tục đặt chỗ. Vui lòng thử lại hoặc đặt chỗ mới."
        );
      }
    } catch (err) {
      setSubmitError(
        err.message || "Không thể kiểm tra đặt chỗ hiện tại. Vui lòng thử lại."
      );
    } finally {
      setResuming(false);
    }
  };

  const handleCancelExistingHold = async () => {
    const reservationId =
      pendingReservationId || holdState.reservationId || null;
    if (!reservationId) {
      setHasExistingHold(false);
      return;
    }

    setCancelling(true);
    setSubmitError("");
    try {
      await dispatch(cancelReservation(reservationId));
      localStorage.removeItem("active_reservation_id");
      localStorage.removeItem("hold_expired_at");
      setHasExistingHold(false);
      setPendingReservationId(null);
      setStep(1);
    } catch (err) {
      setSubmitError(err.message || "Không thể hủy giữ chỗ. Vui lòng thử lại.");
    } finally {
      setCancelling(false);
    }
  };

  const handleStep1Submit = async (data) => {
    setSubmitError("");
    const selectedDate = new Date(data.reservation_datetime);
    const date = selectedDate.toISOString().slice(0, 10);
    const time = selectedDate.toTimeString().slice(0, 5);
    const userId = getUserIdFromToken();
    try {
      await dispatch(
        createHold({
          date,
          time,
          party_size: Number(data.party_size),
          ...(userId != null && { user_id: userId }),
        })
      );
      setStep(2);
    } catch (err) {
      setSubmitError(err.message || "Không thể đặt chỗ. Vui lòng thử lại.");
    }
  };

  const handleStep2Submit = async (data) => {
    if (!holdState.reservationId) return;
    setSubmitError("");
    const userId = getUserIdFromToken();
    try {
      await dispatch(
        updateCustomerInfo(holdState.reservationId, {
          fullname: data.fullname,
          tel: data.phone,
          email: data.email,
          note: data.note || "",
          ...(userId != null && { user_id: userId }),
        })
      );
      navigate("/order");
    } catch (err) {
      setSubmitError(
        err.message || "Cập nhật thông tin thất bại. Vui lòng thử lại."
      );
    }
  };

  const handleRedirectToLogin = () => {
    setShowModal(false);
    navigate("/login");
  };

  const handleCancel = () => {
    setShowModal(false);
    navigate("/");
  };

  const formatCountdown = (seconds) => {
    if (seconds == null) return "";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      {showModal && (
        <div
          className="modal show"
          tabIndex="-1"
          style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="modal-dialog d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thông báo</h5>
              </div>
              <div className="modal-body">
                <p>
                  Bạn cần đăng nhập để tiếp tục. Bạn có muốn chuyển đến trang
                  đăng nhập không?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleRedirectToLogin}
                >
                  Đi đến đăng nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid p-0 py-5 bg-dark hero-header mb-5">
        <div className="container text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">
            Đặt bàn online
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
              <li className="breadcrumb-item">
                <Link to="/">Trang chủ</Link>
              </li>
              <li
                className="breadcrumb-item text-white active"
                aria-current="page"
              >
                Đặt bàn
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container text-center my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {hasExistingHold && (
              <div className="alert alert-info mb-4">
                <p className="mb-2">
                  Bạn đang có một bàn đang được giữ. Thời gian còn lại:{" "}
                  <strong>
                    {existingHoldSeconds != null
                      ? formatCountdown(existingHoldSeconds)
                      : "--:--"}
                  </strong>
                </p>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancelExistingHold}
                    disabled={cancelling}
                  >
                    {cancelling ? "Đang hủy..." : "Hủy giữ chỗ"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleResumeExistingHold}
                    disabled={resuming}
                  >
                    {resuming ? "Đang kiểm tra..." : "Tiếp tục đặt chỗ"}
                  </button>
                </div>
              </div>
            )}
            <div className="progress-steps d-flex justify-content-between">
              <div className="step">
                <span className={`circle ${step >= 1 ? "active" : ""}`}>1</span>
                <p>Chọn ngày & giờ</p>
              </div>
              <div className="step">
                <span className={`circle ${step >= 2 ? "active" : ""}`}>2</span>
                <p>Thông tin khách hàng</p>
              </div>
              <div className="step">
                <span className="circle">3</span>
                <p>Chọn món</p>
              </div>
              <div className="step">
                <span className="circle">4</span>
                <p>Thanh toán</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container-xxl py-5 px-0 wow fadeInUp"
        data-wow-delay="0.1s"
      >
        <div className="row g-0">
          <div className="col-md-6">
            <div className="video"></div>
          </div>
          <div className="col-md-6 bg-dark d-flex align-items-center">
            <div className="p-5 wow fadeInUp" data-wow-delay="0.2s">
              {step === 1 && (
                <>
                  <h5 className="section-title ff-secondary text-start text-primary fw-normal">
                    Đặt chỗ
                  </h5>
                  <h1 className="text-white mb-4">
                    Chọn ngày, giờ đến và số người
                  </h1>
                  <form onSubmit={step1Form.handleSubmit(handleStep1Submit)}>
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="datetime-local"
                            className={`form-control ${
                              step1Form.formState.errors.reservation_datetime
                                ? "is-invalid"
                                : ""
                            }`}
                            id="reservation_datetime"
                            step={60}
                            min={new Date(
                              new Date().getTime() + 2 * 60 * 60 * 1000
                            )
                              .toISOString()
                              .slice(0, 16)}
                            max={new Date(
                              new Date().getTime() + 7 * 24 * 60 * 60 * 1000
                            )
                              .toISOString()
                              .slice(0, 16)}
                            {...step1Form.register("reservation_datetime", {
                              required: "Thời gian là bắt buộc",
                              validate: (value) => {
                                const selected = new Date(value);
                                const now = new Date();
                                const minTime = new Date(
                                  now.getTime() + 2 * 60 * 60 * 1000
                                );
                                const maxTime = new Date(
                                  now.getTime() + 7 * 24 * 60 * 60 * 1000
                                );
                                if (selected < now)
                                  return "Không thể chọn thời gian trong quá khứ";
                                if (selected < minTime)
                                  return "Vui lòng đặt bàn trước ít nhất 2 giờ";
                                if (selected > maxTime)
                                  return "Không thể đặt bàn quá 7 ngày kể từ hôm nay";
                                const h = selected.getHours();
                                if (h < 9 || h > 20)
                                  return "Chỉ được đặt bàn từ 9h đến 20h";
                                return true;
                              },
                            })}
                          />
                          <label htmlFor="reservation_datetime">
                            Ngày & giờ dùng bữa
                          </label>
                          {step1Form.formState.errors.reservation_datetime && (
                            <p className="text-danger">
                              {
                                step1Form.formState.errors.reservation_datetime
                                  .message
                              }
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="number"
                            className="form-control"
                            id="party_size"
                            min={1}
                            max={8}
                            {...step1Form.register("party_size", {
                              required: "Số người ăn là bắt buộc",
                              min: {
                                value: 1,
                                message: "Số người ăn tối thiểu 1 người",
                              },
                              max: {
                                value: 8,
                                message: "Số người ăn tối đa 8 người",
                              },
                              valueAsNumber: true,
                            })}
                          />
                          <label htmlFor="party_size">Số người ăn</label>
                          {step1Form.formState.errors.party_size && (
                            <p className="text-danger">
                              {step1Form.formState.errors.party_size.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {submitError && (
                        <div className="col-12">
                          <p className="text-danger">{submitError}</p>
                        </div>
                      )}
                      <div className="d-flex justify-content-end align-items-center mt-3">
                        <button
                          type="submit"
                          className="btn btn-primary py-2 px-5"
                          disabled={holdState.loading}
                        >
                          {holdState.loading ? "Đang xử lý..." : "Giữ chỗ"}
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}

              {step === 2 && (
                <>
                  <h5 className="section-title ff-secondary text-start text-primary fw-normal">
                    Thông tin khách hàng
                  </h5>
                  <h1 className="text-white mb-2">Điền thông tin liên hệ</h1>
                  {holdState.reservationCode && (
                    <p className="text-white-50 mb-3">
                      Mã đặt chỗ: <strong>{holdState.reservationCode}</strong>
                    </p>
                  )}
                  {countdownSeconds !== null && (
                    <p className="text-warning mb-3">
                      Thời gian còn lại:{" "}
                      <strong>{formatCountdown(countdownSeconds)}</strong> (giữ
                      chỗ 10 phút)
                    </p>
                  )}
                  <form onSubmit={step2Form.handleSubmit(handleStep2Submit)}>
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="fullname"
                            {...step2Form.register("fullname", {
                              required: "Họ và tên là bắt buộc",
                            })}
                          />
                          <label htmlFor="fullname">Họ và tên</label>
                          {step2Form.formState.errors.fullname && (
                            <p className="text-danger">
                              {step2Form.formState.errors.fullname.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            {...step2Form.register("phone", {
                              required: "Số điện thoại là bắt buộc",
                              pattern: {
                                value: /^[0-9\s\-\.\+\(\)]{9,}$/,
                                message: "Số điện thoại không hợp lệ",
                              },
                            })}
                          />
                          <label htmlFor="phone">Số điện thoại</label>
                          {step2Form.formState.errors.phone && (
                            <p className="text-danger">
                              {step2Form.formState.errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            {...step2Form.register("email", {
                              required: "Email là bắt buộc",
                              pattern: {
                                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                message: "Email không hợp lệ",
                              },
                            })}
                          />
                          <label htmlFor="email">Email</label>
                          {step2Form.formState.errors.email && (
                            <p className="text-danger">
                              {step2Form.formState.errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <textarea
                            className="form-control"
                            id="note"
                            style={{ height: "80px" }}
                            {...step2Form.register("note")}
                          />
                          <label htmlFor="note">Ghi chú</label>
                        </div>
                      </div>
                      {submitError && (
                        <div className="col-12">
                          <p className="text-danger">{submitError}</p>
                        </div>
                      )}
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <button
                          type="button"
                          className="btn btn-outline-light"
                          onClick={() => {
                            dispatch(clearHold());
                            setStep(1);
                            setSubmitError("");
                          }}
                        >
                          Quay lại
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary py-2 px-5"
                        >
                          Tiếp theo (Chọn món)
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
