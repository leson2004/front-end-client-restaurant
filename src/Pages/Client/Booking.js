import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function Booking() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State for controlling the modal visibility

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setShowModal(true); // Hiển thị modal nếu không có dữ liệu người dùng
    }
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("customerInfo");
    const userData = localStorage.getItem("user");

    // Kiểm tra xem dữ liệu người dùng có tồn tại không và đặt những giá trị đó trước
    if (userData) {
      const user = JSON.parse(userData);
      setValue("fullname", user.fullname || "");
      setValue("email", user.email || "");
      setValue("tel", user.tel || "");
    }

    // Nếu thông tin khách hàng tồn tại, hãy đặt các giá trị đó (điều này có thể ghi đè lên dữ liệu người dùng)
    if (savedData) {
      const customerInfo = JSON.parse(savedData);
      Object.keys(customerInfo).forEach((key) => {
        setValue(key, customerInfo[key]);
      });
    }
  }, [setValue]);

  // Lưu dữ liệu biểu mẫu hiện tại vào local storage khi nhấn "Tiếp theo"
  const handleNext = (data) => {
    const userData = localStorage.getItem("user");
    let userId = null;
    if (userData) {
      const user = JSON.parse(userData);
      userId = user.id;
    }

    const dataWithUserId = { ...data, user_id: userId };
    localStorage.setItem("customerInfo", JSON.stringify(dataWithUserId));
    navigate("/order");
  };

  const handleRedirectToLogin = () => {
    setShowModal(false);
    navigate("/login");
  };

  const handleCancel = () => {
    setShowModal(false);
    navigate("/"); // Điều hướng về trang chủ khi nhấn "Hủy"
  };

  return (
    <div>
      {/* Popup Modal */}
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
            <div className="progress-steps d-flex justify-content-between">
              <div className="step">
                <span className="circle active">1</span>
                <p>Điền thông tin</p>
              </div>
              <div className="step">
                <span className="circle">2</span>
                <p>Chọn món</p>
              </div>
              <div className="step">
                <span className="circle">3</span>
                <p>Thanh toán</p>
              </div>
              <div className="step">
                <span className="circle">4</span>
                <p>Xác nhận</p>
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
              <h5 className="section-title ff-secondary text-start text-primary fw-normal">
                Đặt chỗ
              </h5>
              <h1 className="text-white mb-4">Điền thông tin khách hàng</h1>
              <form onSubmit={handleSubmit(handleNext)}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="fullname"
                        placeholder="Your Name"
                        {...register("fullname", {
                          required: "Họ và tên là bắt buộc",
                        })}
                      />
                      <label htmlFor="fullname">Họ và tên bạn</label>
                      {errors.fullname && (
                        <p className="text-danger">{errors.fullname.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Your Email"
                        {...register("email", {
                          required: "Email là bắt buộc",
                          pattern: {
                            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                            message: "Email không hợp lệ",
                          },
                        })}
                      />
                      <label htmlFor="email">Email của bạn</label>
                      {errors.email && (
                        <p className="text-danger">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="datetime-local"
                        className={`form-control ${
                          errors.reservation_date ? "is-invalid" : ""
                        }`}
                        id="reservation_date"
                        placeholder="Date & Time"
                        {...register("reservation_date", {
                          required: "Thời gian là bắt buộc",
                          validate: (value) => {
                            const selectedDate = new Date(value);
                            const now = new Date();
                            const minTime = new Date(
                              now.getTime() + 2 * 60 * 60 * 1000
                            ); // 2 giờ sau hiện tại
                            const maxTime = new Date(
                              now.getTime() + 7 * 24 * 60 * 60 * 1000
                            ); // 7 ngày sau hiện tại

                            // Kiểm tra nếu thời gian trong quá khứ
                            if (selectedDate < now) {
                              return "Không thể chọn thời gian trong quá khứ";
                            }

                            // Kiểm tra nếu thời gian đặt bàn ít nhất 2 giờ sau
                            if (selectedDate < minTime) {
                              return "Vui lòng đặt bàn trước ít nhất 2 giờ";
                            }

                            // Kiểm tra nếu thời gian đặt bàn trong 7 ngày
                            if (selectedDate > maxTime) {
                              return "Không thể đặt bàn quá 7 ngày kể từ hôm nay";
                            }

                            // Lấy giờ và phút
                            const selectedHours = selectedDate.getHours();
                            if (selectedHours < 9 || selectedHours > 20) {
                              return "Chỉ được đặt bàn trong khung giờ từ 9h sáng đến 8h tối";
                            }

                            return true; // Nếu tất cả điều kiện đều hợp lệ
                          },
                        })}
                        step={300} // Bước thay đổi thời gian là 5 phút
                        min={new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
                          .toISOString()
                          .slice(0, 16)} // Thời gian tối thiểu là 2 giờ sau hiện tại
                        max={new Date(
                          new Date().getTime() + 7 * 24 * 60 * 60 * 1000
                        )
                          .toISOString()
                          .slice(0, 16)} // Thời gian tối đa là 7 ngày sau hiện tại
                      />
                      <label htmlFor="reservation_date">
                        Thời gian dùng bữa
                      </label>
                      {errors.reservation_date && (
                        <p className="text-danger">
                          {errors.reservation_date.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="number"
                        className="form-control"
                        id="party_size"
                        placeholder="Party Size"
                        {...register("party_size", {
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
                      {errors.party_size && (
                        <p className="text-danger">
                          {errors.party_size.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="tel"
                        className="form-control"
                        id="tel"
                        placeholder="Your Phone"
                        {...register("tel", {
                          required: "Số điện thoại là bắt buộc",
                          pattern: {
                            value:
                              /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                            message: "Số điện thoại không đúng định dạng",
                          },
                        })}
                      />
                      <label htmlFor="tel">Số điện thoại</label>
                      {errors.tel && (
                        <p className="text-danger">{errors.tel.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        placeholder="Special Request"
                        id="note"
                        style={{ height: "100px" }}
                        {...register("note")}
                      ></textarea>
                      <label htmlFor="note">Ghi chú thêm</label>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end align-items-center mt-3">
                    <button
                      type="button"
                      className="btn btn-primary py-2 px-5"
                      onClick={handleSubmit(handleNext)}
                    >
                      Tiếp theo
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
