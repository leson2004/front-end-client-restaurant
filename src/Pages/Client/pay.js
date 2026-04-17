import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPaymentPreview,
  requestDepositPayment,
  applyPromotionToReservation,
} from "../../Actions/ReservationHoldActions";
import { clearHold } from "../../Actions/ReservationHoldActions";
import { DangerAlert } from "../../Components/Alert/Alert";

const DEPOSIT_RATE = 0.3;

export default function Pay() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const holdState = useSelector((state) => state.reservation_hold);
  const [paymentPreview, setPaymentPreview] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [openDangerAlert, setOpenDangerAlert] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [selectedProducts, setSelectedProducts] = useState({});

  // Mã giảm giá (chỉ mã thường - nhập tay)
  const [manualCode, setManualCode] = useState("");
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [loadingApply, setLoadingApply] = useState(false);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    if (!holdState.reservationId) {
      navigate("/booking", { replace: true });
      return;
    }
    const load = async () => {
      setLoadingPreview(true);
      try {
        const previewData = await getPaymentPreview(holdState.reservationId)();
        setPaymentPreview(previewData);
      } catch (err) {
        setErrMessage(err.message || "Không tải được thông tin thanh toán.");
        setOpenDangerAlert(true);
      } finally {
        setLoadingPreview(false);
      }
    };
    load();

    const saved = localStorage.getItem("selectedProducts");
    if (saved) {
      try {
        setSelectedProducts(JSON.parse(saved));
      } catch (_) {
        setSelectedProducts({});
      }
    }
  }, [holdState.reservationId, navigate]);

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // Tổng tiền từ danh sách món đã chọn (khớp với màn Order) — ưu tiên khi có
  const totalFromSelectedProducts = Object.values(selectedProducts).reduce(
    (sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 0),
    0
  );
  const fromBackend =
    paymentPreview?.total_amount ?? paymentPreview?.total ?? 0;
  // Dùng tổng từ món đã chọn nếu có, để khớp với màn chọn món; không thì dùng từ API
  // MoMo/VNPay yêu cầu số tiền là integer VND (không nhận số thập phân)
  const totalBefore =
    totalFromSelectedProducts > 0
      ? Math.round(totalFromSelectedProducts)
      : Math.round(Number(fromBackend) || 0);

  const depositBefore = Math.round(totalBefore * DEPOSIT_RATE);

  // Mã thường: giảm theo % hoặc số tiền cố định (backend có thể trả discount_type dạng string hoặc number)
  const promo = appliedPromotion?.promotion;
  const rawDiscountAmount = Math.round(
    Number(appliedPromotion?.discount_amount ?? 0)
  );
  const promoDiscount = promo?.discount != null ? Number(promo.discount) : null;

  const isPercentByType =
    promo?.discount_type === "percent" ||
    promo?.discount_type === "percentage" ||
    String(promo?.discount_type).toLowerCase() === "percent" ||
    Number(promo?.discount_type) === 1;
  const isPercentByValue =
    promoDiscount != null &&
    promoDiscount >= 1 &&
    promoDiscount <= 100 &&
    totalBefore > 0 &&
    rawDiscountAmount < totalBefore * 0.01;

  const isPercent = isPercentByType || isPercentByValue;
  const discountAmount =
    appliedPromotion != null
      ? isPercent && (promoDiscount > 0 || isPercentByType)
        ? Math.round((totalBefore * (promoDiscount || 0)) / 100)
        : rawDiscountAmount
      : 0;

  const totalAfter = totalBefore - discountAmount;
  const depositAfter = Math.round(totalAfter * DEPOSIT_RATE);
  const remaining = totalAfter - depositAfter;

  const discountLabel = appliedPromotion
    ? isPercent && (promoDiscount != null || isPercentByType)
      ? `${promoDiscount ?? promo?.discount ?? ""}%`
      : formatPrice(discountAmount)
    : "";

  const handleApplyPromotion = async () => {
    setPromoError("");
    const codeToSend = manualCode?.trim() || "";
    if (!codeToSend) {
      setPromoError("Vui lòng nhập mã giảm giá.");
      return;
    }
    setLoadingApply(true);
    try {
      const result = await applyPromotionToReservation(
        holdState.reservationId,
        { code_name: codeToSend }
      )();
      if (result?.applied && result?.total_after != null) {
        setAppliedPromotion(result);
        setManualCode("");
      } else {
        setPromoError(result?.message || "Không thể áp dụng mã.");
      }
    } catch (err) {
      setPromoError(err?.message || err?.response?.data?.message || "Mã không hợp lệ hoặc đã hết.");
    } finally {
      setLoadingApply(false);
    }
  };

  const handleRemovePromotion = () => {
    setAppliedPromotion(null);
    setPromoError("");
  };

  const handleCompleteBooking = async () => {
    if (!showConfirmDialog) {
      setShowConfirmDialog(true);
      return;
    }

    if (!paymentMethod) {
      setErrMessage("Vui lòng chọn phương thức thanh toán.");
      setOpenDangerAlert(true);
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        reservationId: Number(holdState.reservationId),
        depositAmount: depositAfter,
        method: paymentMethod.toLowerCase(),
      };
      if (appliedPromotion?.promotion?.id) {
        body.promotion_id = Number(appliedPromotion.promotion.id);
      }
      const result = await requestDepositPayment(body)();

      if (result?.payUrl) {
        localStorage.removeItem("selectedProducts");
        dispatch(clearHold());
        window.location.href = result.payUrl;
        return;
      }
      setErrMessage("Không nhận được link thanh toán. Vui lòng thử lại.");
      setOpenDangerAlert(true);
    } catch (err) {
      setErrMessage(err.message || "Thanh toán thất bại. Vui lòng thử lại.");
      setOpenDangerAlert(true);
    } finally {
      setSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  if (!holdState.reservationId) {
    return null;
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Modal xác nhận */}
      <div
        className={`modal fade ${showConfirmDialog ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill text-warning me-2" style={{ fontSize: "1.5rem" }} />
                Xác nhận đặt bàn
              </h5>
              <button type="button" className="btn-close" onClick={() => setShowConfirmDialog(false)} />
            </div>
            <div className="modal-body pt-2">
              <p className="text-muted mb-0">
                <strong>Lưu ý:</strong> Nếu quý khách đến trễ quá 30 phút, nhà hàng sẽ huỷ bàn và không hoàn lại cọc.
              </p>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmDialog(false)}>
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-warning text-dark"
                onClick={handleCompleteBooking}
                disabled={submitting}
              >
                {submitting ? "Đang xử lý..." : "Đồng ý"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-dark py-5 mb-4">
        <div className="container text-center py-4">
          <h1 className="display-5 text-white mb-2 fw-bold">Thanh toán cọc</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><a href="/" className="text-white-50">Trang chủ</a></li>
              <li className="breadcrumb-item text-white active" aria-current="page">Thanh toán</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container py-4" style={{ maxWidth: "900px" }}>
        {loadingPreview ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status" />
            <p className="mt-2 text-muted">Đang tải thông tin thanh toán...</p>
          </div>
        ) : (
          <>
            {/* Mã đặt chỗ */}
            <div className="card border-0 shadow-sm mb-4 overflow-hidden">
              <div className="card-body d-flex align-items-center py-3">
                <div className="rounded-circle bg-warning bg-opacity-25 d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48 }}>
                  <i className="bi bi-ticket-perforated-fill text-warning" style={{ fontSize: "1.25rem" }} />
                </div>
                <div>
                  <span className="text-muted small">Mã đặt chỗ</span>
                  <p className="mb-0 fw-bold fs-5">{holdState.reservationCode}</p>
                </div>
              </div>
            </div>

            {/* Đơn hàng (pre-order) */}
            {Object.keys(selectedProducts).length > 0 && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white border-0 py-3">
                  <h6 className="mb-0 fw-bold text-dark">
                    <i className="bi bi-basket2 me-2 text-warning" />
                    Đơn hàng ({Object.keys(selectedProducts).length} món)
                  </h6>
                </div>
                <div className="card-body pt-0" style={{ maxHeight: "280px", overflowY: "auto" }}>
                  {Object.values(selectedProducts).map((product) => (
                    <div
                      key={product.id}
                      className="d-flex justify-content-between align-items-center py-2 border-bottom border-light"
                    >
                      <span className="fw-medium">{product.name}</span>
                      <span className="text-muted">
                        {product.quantity} × {formatPrice(product.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tóm tắt thanh toán + Mã giảm giá */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h6 className="mb-0 fw-bold text-dark">
                  <i className="bi bi-receipt me-2 text-warning" />
                  Tóm tắt thanh toán
                </h6>
              </div>
              <div className="card-body">
                {/* Khối mã giảm giá */}
                <div className="mb-4 p-3 rounded-3" style={{ background: "var(--bs-light)" }}>
                  <label className="fw-semibold small text-muted d-block mb-2">
                    <i className="bi bi-tag me-1" /> Mã giảm giá
                  </label>
                  {appliedPromotion ? (
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <span className="badge bg-success py-2 px-3">
                        <i className="bi bi-check-circle me-1" /> {appliedPromotion.promotion?.code_name} — Giảm {discountLabel}
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={handleRemovePromotion}
                      >
                        Bỏ mã
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="input-group input-group-sm">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nhập mã giảm giá"
                          value={manualCode}
                          onChange={(e) => {
                            setManualCode(e.target.value);
                            setPromoError("");
                          }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyPromotion()}
                        />
                        <button
                          type="button"
                          className="btn btn-warning text-dark"
                          onClick={handleApplyPromotion}
                          disabled={loadingApply || !manualCode?.trim()}
                        >
                          {loadingApply ? "Đang áp dụng..." : "Áp dụng"}
                        </button>
                      </div>
                      {promoError && (
                        <p className="small text-danger mt-2 mb-0">{promoError}</p>
                      )}
                    </>
                  )}
                </div>

                {/* Số tiền */}
                <div className="d-flex justify-content-between align-items-center py-2">
                  <span className="text-muted">Tổng đơn hàng</span>
                  <span>{formatPrice(totalBefore)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="d-flex justify-content-between align-items-center py-2 text-success">
                    <span>Giảm giá</span>
                    <span>−{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-center py-2">
                  <span>Tổng thanh toán</span>
                  <span className="fw-bold">{formatPrice(totalAfter)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center py-2 border-top pt-3">
                  <span className="text-muted">Cọc (30%)</span>
                  <span className="fw-bold text-warning">{formatPrice(depositAfter)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center py-2">
                  <span className="text-muted small">Còn lại (thanh toán tại quán)</span>
                  <span>{formatPrice(remaining)}</span>
                </div>

                <hr className="my-3" />

                {/* Phương thức thanh toán */}
                <label className="fw-semibold small text-muted d-block mb-2">Phương thức thanh toán cọc</label>
                <div className="d-flex flex-wrap gap-3">
                  <label className="d-flex align-items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="momo"
                      checked={paymentMethod === "momo"}
                      onChange={() => setPaymentMethod("momo")}
                      className="me-2"
                    />
                    <span className="small">MoMo</span>
                  </label>
                  <label className="d-flex align-items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vnpay"
                      checked={paymentMethod === "vnpay"}
                      onChange={() => setPaymentMethod("vnpay")}
                      className="me-2"
                    />
                    <span className="small">VNPay</span>
                  </label>
                </div>

                <hr className="my-3" />

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <NavLink to="/order" className="btn btn-outline-secondary">
                    Trở lại
                  </NavLink>
                  <button
                    type="button"
                    className="btn btn-warning text-dark fw-semibold"
                    onClick={handleCompleteBooking}
                    disabled={!paymentMethod || submitting}
                  >
                    {submitting ? "Đang xử lý..." : "Xác nhận thanh toán cọc"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <DangerAlert
        open={openDangerAlert}
        onClose={() => setOpenDangerAlert(false)}
        message={errMessage}
      />
    </div>
  );
}
