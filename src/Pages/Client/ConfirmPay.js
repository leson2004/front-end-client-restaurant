import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

export default function Booking() {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (confirmRef.current) {
      // Kéo xuống với offset, điều chỉnh 100 pixel cho cao hơn một chút
      const offset = 350;
      const elementPosition = confirmRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div>
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
              <li className="breadcrumb-item text-white active" aria-current="page">
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
                <span className="circle">1</span>
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
                <span className="circle active">4</span>
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
        <div className="row g-0 bg-white">
          <div className="col-12 text-center mb-5 mt-5" ref={confirmRef}>
            <div className="success-message">
              <img
                src="../../Assets/Client/Images/huong-sen-logo.png"
                style={{ width: "100px" }}
                alt="Success"
                className="mb-4"
              />
              <h1 className="text-success">CẢM ƠN ĐÃ SỬ DỤNG DỊCH VỤ!</h1>
              <p className="fw-bold">
                Bạn đã đặt bàn ở nhà hàng chúng tôi thành công. Chúng tôi sẽ
                liên hệ để xác nhận lại trong thời gian sớm nhất.
              </p>
              <p>
                Nếu bạn có thắc mắc hay cần hỗ trợ. Vui lòng liên hệ
                <span className="text-warning ms-2 fw-bold">078.546.8567</span>
              </p>
              <p>
                <Button
                  component={Link}
                  to="/my-bookings"
                  variant="contained"
                  sx={{
                    backgroundColor: "#FF9800",
                    color: "#FFFFFF",
                    border: "1px solid #FF9800",
                    "&:hover": {
                      backgroundColor: "#FFFFFF",
                      color: "#FF9800",
                      border: "1px solid #FF9800",
                    },
                  }}
                >
                  Xem lịch sử đặt bàn
                </Button>
              </p>
              {/* New Note Section */}
              <div className="alert alert-warning mt-4">
                <strong>Lưu ý:</strong> Nếu quý khách đến trễ quá 30 phút, nhà hàng sẽ
                huỷ bàn và không hoàn lại cọc.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
