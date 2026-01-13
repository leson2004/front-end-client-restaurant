import React from 'react'
import { Link } from 'react-router-dom'

export default function ClientFooter() {
    return (
        <div>
            <div className="container-fluid bg-dark text-light footer pt-5 mt-5 wow fadeIn" data-wow-delay="0.1s">
                <div className="container py-5">
                    <div className="row g-5">
                        <div className="col-lg-3 col-md-6">
                            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Về nhà hàng</h4>
                            <Link className="btn btn-link" to="/about">Về chúng tôi</Link>
                            <Link className="btn btn-link" to="/contact">Liên hệ</Link>
                            <Link className="btn btn-link" to="/service">Dịch vụ</Link>
                            <Link className="btn btn-link" to="/policy">Chính sách hoạt động</Link>
                            <Link className="btn btn-link" to="/reservation-guide">Hướng dẫn đặt bàn</Link>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Thông tin liên lạc</h4>
                            <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>Quận Ninh Kiều, TP.Cần Thơ</p>
                            <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>0123.546.789</p>
                            <p className="mb-2"><i className="fa fa-envelope me-3"></i>contact.restaurant@gmail.com</p>
                            <div className="d-flex pt-2">
                                <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-twitter"></i></a>
                                <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-facebook-f"></i></a>
                                <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-youtube"></i></a>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Giờ mở cửa</h4>
                            <h5 className="text-light fw-normal">Thứ Hai - Thứ Sáu</h5>
                            <p>8:00 - 22:00</p>
                            <h5 className="text-light fw-normal">Thứ Bảy - Chủ Nhật</h5>
                            <p>10:00 - 23:00</p>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Liên hệ nhanh</h4>
                            <p>Nếu có thắc mắc hoặc muốn nhận thêm ưu đãi hãy liên hệ ngay với chúng tôi.</p>
                            <div className="position-relative mx-auto" style={{ maxWidth: '400px' }}>
                                <input className="form-control border-primary w-100 py-3 ps-4 pe-5" type="text" placeholder="Điền email tại đây" />
                                <button type="button" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">Gởi</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="copyright">
                        <div className="row">
                            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                                &copy; <a className="border-bottom" href="#">Fast Restaurant</a>, All Right Reserved.
                            </div>
                            <div className="col-md-6 text-center text-md-end">
                                <div className="footer-menu">
                                    <Link to="/">Trang chủ</Link>
                                    <Link to="/menu">Thực đơn</Link>
                                    <Link to="/blog">Tin tức</Link>
                                    <Link to="/about">Về chúng tôi</Link>
                                    <Link to="/contact">FQ&A</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
