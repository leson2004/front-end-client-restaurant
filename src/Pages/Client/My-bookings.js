import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchReservations, updateReservations, setCurrentPage } from '../../Actions/MyBookingActions';
import { fetchReservationdetail } from '../../Actions/ReservationDetailOfTrangActions';
import { requestMomoPayUrl, requestMomoPaymentBalance } from "../../Actions/ReservationActions";
import DialogConfirm from '../../Components/Dialog/Dialog';
import CustomPagination from '../../Components/Pagination/CustomPagination';
import SpinnerSink from '../../Components/Client/SniperSink';
import { SuccessAlert, DangerAlert } from '../../Components/Alert/Alert';
import { formatDateTime } from '../../Utils/FormatDateTime';
import { ChangeDishModal } from '../../Components/FormPopup/ChangeDishModal';
import { canCancelReservation } from '../../Components/FormPopup/canCancel';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import http from "../../Utils/Http";

export default function MyBooking() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [nameSearch, setNameSearch] = useState('');

  const handleNameSearch = (event) => {
    setNameSearch(event.target.value);
    dispatch(setCurrentPage(1));
  };

  const [emailSearch, setEmailSearch] = useState('');

  const handleEmailSearch = (event) => {
    setEmailSearch(event.target.value);
    dispatch(setCurrentPage(1));
  };

  const [phoneSearch, setPhoneSearch] = useState('');

  const handlePhoneSearch = (event) => {
    setPhoneSearch(event.target.value);
    dispatch(setCurrentPage(1));
  };

  const [statusSearch, setStatusSearch] = useState('');

  const handleStatusSearch = (event) => {
    setStatusSearch(event.target.value);
    dispatch(setCurrentPage(1));
  };

  const reservationState = useSelector(state => state.my_booking);
  const reservationDetailState = useSelector(state => state.my_booking_detail);

  const query = new URLSearchParams(location.search);
  const urlPage = parseInt(query.get('page')) || 1;

  const [open, setOpen] = useState(false);
  const [openDanger, setOpenDanger] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // State để quản lý modal thay đổi món ăn
  const [showChangeDishModal, setShowChangeDishModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState();
  const [selectedDishes, setSelectedDishes] = useState([]);  // Dữ liệu các món ăn đã đặt
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    if (selectedReservation) {
      dispatch(fetchReservationdetail(selectedReservation));
    }
  }, [selectedReservation, dispatch]);

  useEffect(() => {
    if (reservationDetailState && reservationDetailState.reservationDetail) {
      setSelectedDishes(reservationDetailState.reservationDetail);
      console.log("Reservation Detail:", reservationDetailState.reservationDetail);
      console.log("Danh sách món ăn được cập nhật:", reservationDetailState.reservationDetail);
    }
  }, [reservationDetailState]);

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
    setRequestSent(false);
    const userIdFromToken = getUserIdFromToken();
    if (userIdFromToken) {
      dispatch(fetchReservations(userIdFromToken , nameSearch , phoneSearch , emailSearch , statusSearch , urlPage, reservationState.pageSize));
    }
  }, [dispatch, urlPage, reservationState.pageSize, nameSearch, phoneSearch, emailSearch, statusSearch, requestSent]);

  useEffect(() => {
    navigate(`?page=${reservationState.currentPage}`);
  }, [reservationState.currentPage, navigate]);

  const handleClickOpen = (id) => {
    setSelectedReservation(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReservation(null);
  };

  const handleSuccessClose = () => {
    setOpenSuccess(false);
  };

  const handleDangerClose = () => {
    setOpenDanger(false);
  };

  // Hàm mở modal thay đổi món ăn
  const handleChangeDish = (reservationId, customerInfo) => {
    setSelectedReservation(reservationId); // Lưu id của đơn đặt
    setCustomerInfo(customerInfo);
    setShowChangeDishModal(true); // Mở modal
  };   

  // Hàm đóng modal
  const handleCloseChangeDishModal = () => {
    setShowChangeDishModal(false);
    // setSelectedDishes([]);  // Đặt lại món ăn
  };

  // Hàm xác nhận thay đổi món ăn
  const handleConfirmChangeDish = (updatedDishes) => {
    // Đóng modal sau khi xác nhận thay đổi
    setShowChangeDishModal(false);

    // Hiển thị thông báo thành công
    setOpenSuccess(true);
  };

  const handleUpdateStatus = async (st) => {
    const userIdFromToken = getUserIdFromToken();
    if (selectedReservation && userIdFromToken) {
      try {
        await dispatch(updateReservations(selectedReservation, {status: st}, userIdFromToken, nameSearch, phoneSearch, emailSearch, statusSearch, urlPage, reservationState.pageSize));
        handleClose();
        setOpenSuccess(true); // Hiển thị thông báo thành công
      } catch (error) {
        console.error("Error update reservations:", error);
      }
    }
  };

  const handleDetail = (id) => {
    navigate(`detail/${id}`);
  };

  const pay = async (reservationID , depositAmount) => {
    const momoResponse = await dispatch(requestMomoPayUrl(reservationID, depositAmount));

    if (momoResponse && momoResponse.payUrl) {
      window.location.href = momoResponse.payUrl;
    }
  }

  const addTable = async (reservationID, reservationDate, depositAmount) => {
    try {
      // Gửi yêu cầu POST tới API
      const response = await http.post("http://localhost:6969/api/reservations_t_admin/addTable", {
        reservationID,
        reservationDate,
      });
  
      // Xử lý kết quả trả về từ API
      const { message } = response.data;
  
      if (message == 'Ghép bàn thành công!') {
        pay(reservationID, depositAmount);
      } else {
        setOpenDanger(true);
      }
    } catch (error) {
      if (error.response) {
        setOpenDanger(true);
        console.error("Error response:", error.response.data.message);
      } else {
        console.error("Error:", error.message);
      }
    }
  }

  const formatCurrency = (value) => {
    return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`;
  };

  const handlePageChange = (page) => {
    navigate(`?page=${page}`); // Cập nhật URL với page
    const userIdFromToken = getUserIdFromToken();
    if (userIdFromToken) {
      dispatch(setCurrentPage(page)); // Cập nhật trang hiện tại trong state
      dispatch(fetchReservations(userIdFromToken , nameSearch , phoneSearch , emailSearch , statusSearch , page, reservationState.pageSize));
    }
  };

  const statusMapping = {
    1: { text: 'Chờ thanh toán cọc', class: 'badge bg-warning' },    
    2: { text: 'Hết hạn thanh toán cọc', class: 'badge bg-info' },
    3: { text: 'Đã thanh toán cọc', class: 'badge bg-primary' },     
    0: { text: 'Hủy đơn', class: 'badge bg-danger' },             
    4: { text: 'Chờ thanh toán toàn bộ đơn', class: 'badge bg-success' },
    5: { text: 'Hoàn thành đơn', class: 'badge bg-secondary' }       
  };

  const monney = (status, total_amount, deposit) => {
    if (status == 1 || status == 2) {
      return "<strong>Số tiền thanh toán:</strong> " + formatCurrency (deposit);
    } else if (status == 3 || status == 4 || status == 0) {
      if (total_amount >= deposit) {
        return "<strong>Số tiền còn lại:</strong> " + formatCurrency (total_amount - deposit);
      } else {
        return "<strong>Nhà hàng thối lại:</strong> " + formatCurrency (deposit - total_amount);
      }
    } else {
      return "<strong>Số tiền còn lại:</strong> " + formatCurrency (0);
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="py-5 bg-dark hero-header mb-3">
        <div className="container text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">
              Lịch sử đặt bàn
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
            <li className="breadcrumb-item">
                <Link to="/">Trang chủ</Link>
            </li>
            <li className="breadcrumb-item text-white active" aria-current="page">
                Lịch sử
            </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Search Filters */}
      <div className="container mb-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="row g-3">  
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Tìm theo tên" value={nameSearch} onChange={handleNameSearch} />
              </div>               
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Tìm theo email" value={emailSearch} onChange={handleEmailSearch} />
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Tìm theo số điện thoại" value={phoneSearch} onChange={handlePhoneSearch} />
              </div>
              <div className="col-md-3">
                <select className="form-control mr-2" value={statusSearch} onChange={handleStatusSearch}>
                  <option value="">Trạng thái</option>
                  <option value="0">Đã hủy</option>
                  <option value="1">Chờ thanh toán cọc</option>
                  <option value="2">Hết hạn thanh toán cọc</option>
                  <option value="3">Đã thanh toán cọc</option>
                  <option value="4">Chờ thanh toán toàn bộ đơn</option>
                  <option value="5">Hoàn thành đơn</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking List */}
      <div className="container">
        {reservationState.loading && (
          <div><SpinnerSink/></div>
        )}
        {!getUserIdFromToken() ? (
          <div className="text-center">Bạn chưa đăng nhập!</div>
          ) : (
          <>
            {!reservationState.loading && reservationState.reservation.length === 0 && (
              <div className='text-center'>Không tìm thấy danh sách nào!</div>
            )}
            {reservationState.reservation && reservationState.reservation.map((booking, index) => {
              const statusInfo = statusMapping[booking.status] || { text: 'Không xác định', class: 'badge-secondary' };
              return (
                <div className="card mb-3 shadow-sm" key={booking.id}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <span className="fw-bold">{booking.fullname}</span>
                    <span className={`badge ${statusInfo.class} fs-6`}>
                      {statusInfo.text}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8 col-sm-12 d-flex flex-wrap" style={{ gap: '10px' }}>
                        <div style={{ flex: '1 1 30%' }}>
                          <p className="mb-2">
                            <strong>Email:</strong> {booking.email}
                          </p>
                          <p className="mb-2">
                            <strong>Mã hóa đơn:</strong> {booking.reservation_code ? booking.reservation_code : 'Chưa rõ'}
                          </p>
                        </div>
                        <div style={{ flex: '1 1 30%' }}>
                          <p className="mb-2">
                            <strong>Số điện thoại:</strong> {booking.tel}
                          </p>
                          <p className="mb-2">
                            <strong>Số người:</strong> {booking.party_size}
                          </p>
                        </div>
                        <div style={{ flex: '1 1 30%' }}>
                          <p className="mb-2">
                            <strong>Ngày đặt:</strong> {formatDateTime(booking.reservation_date)}
                          </p>
                          <p className="mb-2">
                            <strong>Số bàn:</strong> {(booking.tableName && booking.status !== 1 && booking.status !== 2) ? booking.tableName : 'Chưa có'}
                          </p>
                        </div>
                      </div>

                      {/* Payment Info and Action Button */}
                      <div className="col-md-4 col-sm-12 text-md-end text-left mt-3 mt-md-0">
                        <p className="mb-2" dangerouslySetInnerHTML={{ __html: monney(booking.status, booking.total_amount, booking.deposit) }} />
                        <div>
                          {/* {(statusInfo.text == 'Chờ thanh toán cọc') && (
                            <button className="btn btn-outline-secondary btn-sm mt-2 me-2" onClick={() => handleClickOpen(booking.id)} style={{ padding: '0.25rem 0.75rem' }}>
                              Hủy thanh toán
                            </button>
                          )} */}
                          <button className="btn btn-outline-success btn-sm mt-2" onClick={() => handleDetail(booking.id)} style={{ padding: '0.25rem 0.75rem' }}>
                            Xem chi tiết
                          </button>
                          {(statusInfo.text === 'Chờ thanh toán cọc') && (
                            <button className="btn btn-primary btn-sm mt-2 ms-2" onClick={() => addTable(booking.id , booking.reservation_date, booking.deposit)} style={{ padding: '0.25rem 0.75rem' }}>
                              Thanh toán
                            </button>
                          )}
                          {(statusInfo.text === 'Đã thanh toán cọc') && (canCancelReservation(booking.reservation_date)) && (booking.number_change == 1) && (
                            <button
                              className="btn btn-outline-secondary btn-sm mt-2 ms-2"
                              style={{
                                padding: '0.25rem 0.75rem',
                                backgroundColor: '#f8f9fa', // Màu nền nhạt
                                color: '#6c757d',          // Màu chữ xám nhạt
                                borderColor: '#ced4da',    // Viền màu xám nhạt
                                boxShadow: 'none'          // Loại bỏ đổ bóng
                              }}
                              onClick={() => handleChangeDish(booking.id, {
                                fullname: booking.fullname,
                                email: booking.email,
                                tel: booking.tel,
                                reservation_code: booking.reservation_code,
                                total_amount: booking.total_amount,
                                deposit: booking.deposit,
                                id: booking.id,
                                discount: booking.discount
                              })}
                            >
                              Yêu cầu thay đổi món ăn
                            </button>
                          )}
                        </div>
                      </div>
                      {booking.deposit > booking.total_amount && (
                        <span style={{ fontSize: '12px', color: 'red' }}>
                          Do bạn đã thanh toán cọc trước khi yêu cầu đổi món và tổng tiền hiện đang nhỏ hơn tiền cọc, khi bạn đến ăn nhà hàng sẽ trả lại bạn.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
      <div className='my-2'>
        <CustomPagination
          count={reservationState.totalPages} // Tổng số trang
          currentPageSelector={state => state.my_booking.currentPage} // Selector để lấy trang hiện tại
          fetchAction={(page, pageSize) => fetchReservations(getUserIdFromToken() , nameSearch , phoneSearch , emailSearch , statusSearch , page , pageSize)} // Hàm fetch dữ liệu
          onPageChange={handlePageChange} 
        />
      </div>

      {/* Modal thay đổi món ăn */}
      {showChangeDishModal && (
        <>
          {/* Lớp phủ mờ */}
          <div className="overlay" onClick={handleCloseChangeDishModal}></div>

          <ChangeDishModal
            show={showChangeDishModal}
            onHide={handleCloseChangeDishModal}
            onConfirm={handleConfirmChangeDish}
            dishes={selectedDishes} // Truyền danh sách món ăn đã chọn
            customerInfo={customerInfo}
            setOpenSuccess={setOpenSuccess}
            setRequestSent={setRequestSent}
          />
        </>
      )}

      <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Thao tác thành công!" />
      <DangerAlert open={openDanger} onClose={handleDangerClose} message="Không có bàn trống!" />
      <DialogConfirm open={open} onClose={handleClose} onConfirm={() => handleUpdateStatus(2)} />
    </div>
  );
}
