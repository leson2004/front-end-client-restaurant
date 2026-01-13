import React from 'react'

import ImageGallery from '../../Components/Client/ImageGallery';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div>

            <div className="container-fluid p-0 py-5 bg-dark hero-header mb-5">
                <div className="container text-center my-5 pt-5 pb-4">
                    <h1 className="display-3 text-white mb-3 animated slideInDown">Về Chúng Tôi</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center text-uppercase">
                            <li className="breadcrumb-item">
                                <Link to="/">Trang chủ</Link>
                            </li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Về Chúng Tôi</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-6">
                            <div className="row g-3">
                                <div className="col-6 text-start">
                                    <img className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.1s" src={ImageGallery.about1} />
                                </div>
                                <div className="col-6 text-start">
                                    <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.3s" src={ImageGallery.about2}
                                        style={{ marginBottom: '25%' }} />
                                </div>
                                <div className="col-6 text-end">
                                    <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.5s" src={ImageGallery.about3} />
                                </div>
                                <div className="col-6 text-end">
                                    <img className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.7s" src={ImageGallery.about4} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <h5 className="section-title ff-secondary text-start text-primary fw-normal">Về Chúng Tôi</h5>
                            <h1 className="mb-4">Chào Mừng Đến Với <i className="fa fa-utensils text-primary me-2"></i>Nhà Hàng</h1>
                            <p className="mb-4">Chúng tôi tự hào mang đến cho bạn trải nghiệm ẩm thực độc đáo và tuyệt vời. Với nhiều năm kinh nghiệm và đội ngũ đầu bếp tài năng, chúng tôi cam kết mang lại những món ăn ngon miệng và dịch vụ chuyên nghiệp nhất.</p>
                            <p className="mb-4">Không chỉ là một nhà hàng, chúng tôi còn là nơi bạn có thể thưởng thức những giây phút thư giãn, tận hưởng không gian ấm cúng và phong cách phục vụ tận tâm. Chúng tôi luôn nỗ lực không ngừng để mang đến những điều tốt nhất cho khách hàng của mình.</p>
                            <div className="row g-4 mb-4">
                                <div className="col-sm-6">
                                    <div className="d-flex align-items-center border-start border-5 border-primary px-3">
                                        <h1 className="flex-shrink-0 display-5 text-primary mb-0" data-toggle="counter-up">15</h1>
                                        <div className="ps-4">
                                            <p className="mb-0">Năm</p>
                                            <h6 className="text-uppercase mb-0">Kinh Nghiệm</h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="d-flex align-items-center border-start border-5 border-primary px-3">
                                        <h1 className="flex-shrink-0 display-5 text-primary mb-0" data-toggle="counter-up">50</h1>
                                        <div className="ps-4">
                                            <p className="mb-0">Đầu Bếp</p>
                                            <h6 className="text-uppercase mb-0">Hàng Đầu</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <a className="btn btn-primary py-3 px-5 mt-2" href="">Xem Thêm</a>
                        </div>
                    </div>
                </div>
            </div>


            <div className="container-xxl pt-5 pb-3">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h5 className="section-title ff-secondary text-center text-primary fw-normal">Thành Viên</h5>
                        <h1 className="mb-5">Đội Ngũ Đầu Bếp</h1>
                    </div>
                    <div className="row g-4">
                        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="team-item text-center rounded overflow-hidden">
                                <div className="rounded-circle overflow-hidden m-4">
                                    <img className="img-fluid" src={ImageGallery.team1} alt="" />
                                </div>
                                <h5 className="mb-0">Nguyễn Văn A</h5>
                                <small>Đầu Bếp Trưởng</small>
                                <div className="d-flex justify-content-center mt-3">
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-facebook-f"></i></a>
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-twitter"></i></a>
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                            <div className="team-item text-center rounded overflow-hidden">
                                <div className="rounded-circle overflow-hidden m-4">
                                    <img className="img-fluid" src={ImageGallery.team2} alt="" />
                                </div>
                                <h5 className="mb-0">Trần Thị B</h5>
                                <small>Đầu Bếp Chính</small>
                                <div className="d-flex justify-content-center mt-3">
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-facebook-f"></i></a>
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-twitter"></i></a>
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
                            <div className="team-item text-center rounded overflow-hidden">
                                <div className="rounded-circle overflow-hidden m-4">
                                    <img className="img-fluid" src={ImageGallery.team3} alt="" />
                                </div>
                                <h5 className="mb-0">Phạm Văn C</h5>
                                <small>Đầu Bếp</small>
                                <div className="d-flex justify-content-center mt-3">
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-facebook-f"></i></a>
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-twitter"></i></a>
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.7s">
                            <div className="team-item text-center rounded overflow-hidden">
                                <div className="rounded-circle overflow-hidden m-4">
                                    <img className="img-fluid" src={ImageGallery.team4} alt="" />
                                </div>
                                <h5 className="mb-0">Lê Thị D</h5>
                                <small>Đầu Bếp Phụ</small>
                                <div className="d-flex justify-content-center mt-3">
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-facebook-f"></i></a>
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-twitter"></i></a>
                                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
