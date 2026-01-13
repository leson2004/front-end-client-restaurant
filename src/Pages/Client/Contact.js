import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addNewContact } from "../../Actions/ContactActions";
import Spinner from "../../Components/Client/Spinner";
import { DangerAlert, SuccessAlert } from "../../Components/Alert/Alert";
import { Link } from "react-router-dom";


export default function Contact() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false); // Thêm state loading
  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });

  const onSubmit = async (data) => {
    setIsLoading(true); // Bắt đầu loading
    try {
      setIsLoading(false); // Kết thúc loading
      await dispatch(addNewContact(data)); // Gọi action để gửi thông tin liên hệ
      setAlert({ open: true, message: 'Gửi thông tin thành công!', severity: 'success' });
      reset();
    } catch (error) {
      console.error('Error sending contact data:', error);
      setAlert({ open: true, message: 'Gửi thông tin thất bại!', severity: 'error' });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };


  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="container-fluid p-0 py-5 bg-dark hero-header mb-5">
            <div className="container text-center my-5 pt-5 pb-4">
              <h1 className="display-3 text-white mb-3 animated slideInDown">
                Liên hệ với chúng tôi
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
                    Liên hệ
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="container-xxl py-5">
            <div className="container">
              <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                <h5 className="section-title ff-secondary text-center text-primary fw-normal">
                  Liên hệ với chúng tôi
                </h5>
                <h1 className="mb-5">Liên hệ để giải đáp mọi thắc mắc</h1>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="row gy-4">
                    <div className="col-md-4">
                      <h5 className="section-title ff-secondary fw-normal text-start text-primary">
                        Đặt chỗ
                      </h5>
                      <p>
                        <i className="fa fa-envelope-open text-primary me-2"></i>
                        contact.huongsen@gmail.com
                      </p>
                    </div>
                    <div className="col-md-4">
                      <h5 className="section-title ff-secondary fw-normal text-start text-primary">
                        Thông tin chung
                      </h5>
                      <p>
                        <i className="fa fa-envelope-open text-primary me-2"></i>
                        contact.huongsen@gmail.com
                      </p>
                    </div>
                    <div className="col-md-4">
                      <h5 className="section-title ff-secondary fw-normal text-start text-primary">
                        Kỹ thuật
                      </h5>
                      <p>
                        <i className="fa fa-envelope-open text-primary me-2"></i>
                        contact.huongsen@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 wow fadeIn" data-wow-delay="0.1s">
                  <iframe
                    className="position-relative rounded w-100 h-100"
                    src="https://www.google.com/maps/d/u/0/embed?mid=1bjw9hlxO6tvUNqAKJSFLdJAHHK_dmlY&ehbc=2E312F&noprof=1"
                    frameBorder="0"
                    style={{ minHeight: "350px", border: 0 }}
                    allowFullScreen=""
                    aria-hidden="false"
                    tabIndex="0"
                  ></iframe>
                </div>
                <div className="col-md-6">
                  <div className="wow fadeInUp" data-wow-delay="0.2s">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input
                              type="text"
                              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                              id="name"
                              placeholder="Tên của bạn"
                              {...register("name", { required: "Tên là bắt buộc" })}
                            />
                            <label htmlFor="name">Tên của bạn</label>
                            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input
                              type="email"
                              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                              id="email"
                              placeholder="Email của bạn"
                              {...register("email", {
                                required: "Email là bắt buộc",
                                pattern: {
                                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                  message: "Email không hợp lệ"
                                }
                              })}
                            />
                            <label htmlFor="email">Email của bạn</label>
                            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating">
                            <input
                              type="text"
                              className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                              id="subject"
                              placeholder="Chủ đề"
                              {...register("subject", { required: "Chủ đề là bắt buộc" })}
                            />
                            <label htmlFor="subject">Chủ đề</label>
                            {errors.subject && <div className="invalid-feedback">{errors.subject.message}</div>}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating">
                            <textarea
                              className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                              placeholder="Để lại tin nhắn tại đây"
                              id="message"
                              style={{ height: "150px" }}
                              {...register("message", { required: "Tin nhắn là bắt buộc" })}
                            ></textarea>
                            <label htmlFor="message">Tin nhắn</label>
                            {errors.message && <div className="invalid-feedback">{errors.message.message}</div>}
                          </div>
                        </div>
                        <div className="col-12">
                          <button className="btn btn-primary w-100 py-3" type="submit">
                            Gửi tin nhắn
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <SuccessAlert open={alert.open && alert.severity === 'success'} onClose={handleCloseAlert} message={alert.message} />
      <DangerAlert open={alert.open && alert.severity === 'error'} onClose={handleCloseAlert} message={alert.message} />
    </div>
  );
}
