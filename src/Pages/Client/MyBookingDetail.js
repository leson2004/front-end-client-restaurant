import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchReservationsID } from '../../Actions/MyBookingActions';
import { fetchReservationdetail } from '../../Actions/ReservationDetailOfTrangActions';
import Spinner from '../../Components/Client/Spinner';
import { formatDateTime } from '../../Utils/FormatDateTime';
import logo from "../../Assets/Client/Images/huong-sen-logo.png";
import { jwtDecode as jwt_decode } from 'jwt-decode';

export default function MyBookingDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const reservationState = useSelector(state => state.my_booking);
    const reservationDetailState = useSelector(state => state.my_booking_detail);

    // Lấy accessToken từ localStorage và decode ra user_id
    const getUserIdFromToken = useCallback(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                const decodedToken = jwt_decode(accessToken);
                return decodedToken.id; // Trả về user_id từ token
            } catch (error) {
                console.error('Error decoding token:', error);
                return null;
            }
        }
        return null;
    }, []);

    useEffect(() => {
        dispatch(fetchReservationsID(id));
        dispatch(fetchReservationdetail(id));
    }, [dispatch]);

    const handlePrint = () => {
        window.print();
    };

    const formatCurrency = (value) => {
        return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`;
    };

    const statusMapping = {
        1: { text: 'Chờ thanh toán cọc', class: 'badge bg-warning' },
        2: { text: 'Hết hạn thanh toán cọc', class: 'badge bg-info' },
        3: { text: 'Đã thanh toán cọc', class: 'badge bg-primary' },
        0: { text: 'Hủy đơn', class: 'badge bg-danger' },
        4: { text: 'Chờ thanh toán toàn bộ đơn', class: 'badge bg-success' },
        5: { text: 'Hoàn thành đơn', class: 'badge bg-secondary' }
    };

    if (!getUserIdFromToken()) {
        return (
            <div className='d-flex vh-100 justify-content-center align-items-center bg-light'>
                <div className="text-center">
                    <h1 className="display-1 font-weight-bold text-dark">---</h1>
                    <p className="h4 mb-4">Bạn chưa đăng nhập</p>
                    <p className="lead">Xin lỗi, bạn cần đăng nhập để xem chi tiết đặt bàn</p>
                    <Link to="/" className="btn btn-primary mt-3">Trở về trang chủ</Link>
                </div>
            </div>
        )
    }

    return (
        <div>
            {(reservationState.loading || reservationDetailState.loading) ? (
                <section className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#EEEEEE' }}>
                    <Spinner />
                </section>
            ) : (reservationState.error || reservationDetailState.error) ? (
                <div>Error: {reservationState.error} {reservationDetailState.error}</div>
            ) : (
                <div>
                    {reservationState.reservation.length > 0 ? (
                        <div className='container' style={{ margin: '20px auto', fontFamily: 'Arial, sans-serif', maxWidth: '800px' }}>
                            <style>
                                {`
                                    @media print {
                                        .print-buttons {
                                            display: none; /* Ẩn nút In và Quay lại khi in */
                                        }
                                    }

                                    .invoice-header, .invoice-info, .invoice-details {
                                        margin-bottom: 20px;
                                        padding: 10px;
                                        border: 1px solid #ddd;
                                        border-radius: 5px;
                                    }

                                    .invoice-header {
                                        text-align: center;
                                    }

                                    .invoice-header img {
                                        width: 70px;
                                        height: 70px;
                                    }

                                    .invoice-details table {
                                        width: 100%;
                                        border-collapse: collapse;
                                    }

                                    .invoice-details th, .invoice-details td {
                                        border: 1px solid #ddd;
                                        padding: 8px;
                                        text-align: left;
                                    }

                                    .total-summary {
                                        display: flex;
                                        justify-content: space-between;
                                        border-top: 2px solid #000;
                                        padding-top: 10px;
                                        margin-top: 10px;
                                    }

                                    .summary-title {
                                        font-weight: bold;
                                    }
                                `}
                            </style>

                            {/* Header */}
                            <div className="invoice-header">
                                <img src={logo} alt="navbar brand" />
                                <h2>Nhà Hàng Hương Sen</h2>
                                <p>Địa chỉ: Tầng 8, Số 2 Tôn Thất Tùng, Đống Đa - Hà Nội</p>
                                <p>Điện thoại: 190030060 | Email: support@elise.vn</p>
                            </div>

                            {/* Thông tin khách hàng */}
                            <div className="invoice-info">
                                <h3>Thông tin khách hàng</h3>
                                <p><strong>Tên:</strong> {reservationState.reservation[0].fullname} | <strong>Mã:</strong> {reservationState.reservation[0].reservation_code ? reservationState.reservation[0].reservation_code : 'Chưa biết'}</p>
                                <p><strong>Phone:</strong> {reservationState.reservation[0].tel}</p>
                                <p><strong>Email:</strong> {reservationState.reservation[0].email}</p>
                                <p><strong>Ngày đặt:</strong> {formatDateTime(reservationState.reservation[0].reservation_date)} | <strong>Số người:</strong> {reservationState.reservation[0].party_size} | <strong>Số bàn:</strong> {(reservationState.reservation[0].tableName && reservationState.reservation[0].status !== 1 && reservationState.reservation[0].status !== 2) ? reservationState.reservation[0].tableName : 'Chưa có'}</p>
                            </div>

                            {/* Chi tiết đơn hàng */}
                            <div className="invoice-details">
                                <h3>Chi tiết đơn hàng</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Món</th>
                                            <th>Số lượng</th>
                                            <th>Giá</th>
                                            <th>Tổng tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservationDetailState.reservationDetail.length > 0 ? (
                                            reservationDetailState.reservationDetail.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.product_name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{formatCurrency(item.price)}</td>
                                                    <td>{formatCurrency(item.price * item.quantity)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center' }}>
                                                    Khách hàng chưa đặt món!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <div className='mt-2'><strong>Ghi chú:</strong> {reservationState.reservation[0].note ? reservationState.reservation[0].note : 'Không có'}</div>
                            </div>

                            {/* Thông tin thanh toán */}
                            {reservationDetailState.reservationDetail.length > 0 && (() => {
                                const reservation = reservationState.reservation[0];
                                const subTotal = reservationDetailState.reservationDetail.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                                const discount = reservation.discount ? subTotal * reservation.discount / 100 : 0; // Giảm giá
                                const tax = (subTotal) * 0.10; // Thuế 10%
                                const deposit = reservation.deposit ? reservation.deposit : 0; // Đã cọc
                                const total = subTotal + tax - discount; // Tổng
                                const remaining = total - deposit; // Còn lại

                                return (
                                    <div className="total-summary">
                                        <div>
                                            <h3>Thông tin hóa đơn</h3>
                                            <p><strong>Tạm tính:</strong> {formatCurrency(subTotal)}</p>
                                            <p><strong>Giảm giá:</strong> {formatCurrency(discount)}</p>
                                            <p><strong>Thuế 10%:</strong> {formatCurrency(tax)}</p>
                                            <p><strong>Tổng:</strong> {formatCurrency(total)}</p>
                                        </div>
                                        <div>
                                            <h3>Thông tin thanh toán</h3>
                                            <p><strong>Tiền cọc:</strong> {formatCurrency(deposit)}</p>
                                            {/* <p><strong>Còn lại:</strong> {reservation.status == 5 ? 0 : formatCurrency(remaining)}</p> */}
                                            {remaining >= 0 && (
                                                <p><strong>Còn lại:</strong> {reservation.status == 5 ? 0 : formatCurrency(remaining)}</p>
                                            )}
                                            {remaining < 0 && (
                                                <p style={{ color: 'red' }}><strong>Nhà hàng thối lại:</strong> {formatCurrency(reservationState.reservation[0].deposit - reservationState.reservation[0].total_amount)}</p>
                                            )}
                                            <p><strong>Trạng thái:</strong> {statusMapping[reservation.status].text}</p>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* {reservationState.reservation[0].deposit > reservationState.reservation[0].total_amount && (
                                <span style={{ fontSize: '15px', color: 'red' }}>
                                    Do bạn đã thanh toán cọc trước khi yêu cầu đổi món và tổng tiền hiện đang nhỏ hơn tiền cọc, khi bạn đến ăn nhà hàng sẽ trả lại bạn.
                                </span>
                            )} */}

                            {/* Nút in và quay lại */}
                            <div style={{ textAlign: 'center', marginTop: '20px' }} className="print-buttons">
                                <button onClick={handlePrint} style={{ marginRight: '10px', padding: '10px 20px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}>
                                    In
                                </button>
                                <Link to="/my-bookings">
                                    <button style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#007B9E'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#008CBA'}>
                                        Quay lại
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div>No reservation found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
