import React from 'react'
import { Link } from 'react-router-dom'

function ReservationGuide() {
    return (
        <>
            <div className="container-fluid py-5 bg-dark hero-header mb-2">
            </div>
            <div className="container py-1">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="text-center">
                            <h1 className="mb-4 text-uppercase fw-normal section-title" style={{ fontWeight: 'bold', color: '#FEA100' }}>Hướng dẫn đặt bàn</h1>
                        </div>
                        <div className="mb-4">
                            <h3>*Hướng dẫn đặt bàn ăn*</h3>
                            <h3>1. Điền thông tin</h3>
                            <p>Khách hàng chọn vào nút đặt bàn trên giao diện chính.</p>
                            <p>Điền đầy đủ các thông tin cơ bản để tiện trong quá trình đặt bàn như họ tên, số điện thoại, ngày đặt bàn, số người ăn,... Khi điền đầy đủ thông tin thì ấn vào nút "Tiếp theo" đển chuyển đến trang chọn món ăn khi có nhu cầu</p>
                            <p>Khi bạn chỉ muốn điền thông tin để đặt chỗ thì ấn vào nút "Hoàn thành đặt chỗ" để hoàn thành việc lưu thông tin</p>
                        </div>
                        <div className="mb-4">
                            <h3>2. Chọn món ăn</h3>
                            <p>Khách hàng chọn món ăn từ danh sách thực đơn của nhà hàng, bao gồm các món chính, món phụ, đồ uống và tráng miệng.</p>
                            <p>Các món ăn được chọn sẽ được ghi nhận trong mục "Món ăn đã chọn", trong đó hiển thị chi tiết tên món, số lượng, giá từng món và tổng giá của đơn đặt bàn. Khách hàng có thể thay đổi món ăn (thêm, bớt món) tại giai đoạn này.</p>
                        </div>
                        <div className="mb-4">
                            <h3>3. Thanh toán đơn đặt bàn (nếu có)</h3>
                            <p>Nếu nhà hàng yêu cầu thanh toán trước, khách hàng sẽ được chuyển đến trang thanh toán. Tại đây, khách hàng có thể chọn phương thức thanh toán bao gồm thanh toán qua thẻ, ví điện tử, hoặc các phương thức khác được nhà hàng hỗ trợ.</p>
                            <p>Sau khi chọn phương thức thanh toán, khách hàng điền các thông tin cần thiết và chọn "Xác nhận thanh toán".</p>
                        </div>
                        <div className="mb-4">
                            <h3>4. Xác nhận đặt bàn</h3>
                            <p>Tại trang "Xác nhận đặt bàn", khách hàng khách hàng có thể kiểm tra lại toàn bộ đơn hàng vừa đặt và có thể thay đổi trong thời gian được phép.</p>
                            <p>Hệ thống sẽ gửi tin nhắn hoặc email xác nhận đặt bàn trong vòng 10 phút kể từ khi khách hàng chọn "Đồng ý đặt bàn".</p>
                        </div>
                        <div className="mb-4">
                            <h3>*Lưu ý </h3>
                            <p>Khi đặt bàn trên website của nhà hàng, khách hàng hiểu và chấp nhận các điều kiện/lưu ý sau:</p>
                            <ul>
                                <li>Nhà hàng chỉ tiếp nhận đơn đặt bàn trực tuyến từ 09:00 sáng đến trước 21:00 tối.</li>
                                <li>Nhà hàng yêu cầu đặt bàn trước ít nhất 2 tiếng so với thời gian dự kiến đến.</li>
                                <li>Nếu khách hàng đã thanh toán trước, việc hủy bàn hoặc thay đổi thời gian cần liên hệ với nhà hàng ít nhất 1 tiếng trước giờ đặt.</li>
                            </ul>
                        </div>

                        <Link to="/" className="btn btn-primary">
                            <i className="fa-solid fa-arrow-left ms-2"></i> Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReservationGuide
