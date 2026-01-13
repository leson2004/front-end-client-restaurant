import React, { useState } from 'react';
import '../../../Assets/Client/Styles/AuthenStyle/authen.css';
import '../../../Assets/Client/Styles/AuthenStyle/util.css';
import { Link, useNavigate } from 'react-router-dom';
import GoogleAuth from '../../../Services/GoogleAuth/GoogleAuth';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../Components/Client/Spinner';
import { fetchLogin } from '../../../Actions/AuthActions';
import FacebookAuth from '../../../Services/FaceboolAuth/FacebookAuth';

export default function Login() {
     const {
          register,
          handleSubmit,
          formState: { errors },
     } = useForm();
     const [passwordVisible, setPasswordVisible] = useState(false);
     const [serverError, setServerError] = useState('');
     const [loading, setLoading] = useState(false);

     const dispatch = useDispatch();
     const navigate = useNavigate();

     const loginState = useSelector((state) => state.auth);
     const { error } = loginState;

     const togglePasswordVisibility = () => {
          setPasswordVisible(!passwordVisible);
     };

     const onSubmit = async (data) => {
          setLoading(true);
          setServerError('');

          try {
               await dispatch(fetchLogin(data.email, data.password));
               setLoading(false);

               const user = localStorage.getItem('user');
               const accessToken = localStorage.getItem('accessToken');
               if (user && accessToken) {
                    navigate('/');
               }
          } catch (err) {
               setLoading(false);
               setServerError(err.message || 'Đăng nhập thất bại');
          }
     };

     return (
          <div className="min-vh-100 ">
               <div className="container-fluid py-5 bg-dark hero-header"></div>
               <div className="container my-3">
                    <div className="row justify-content-center ">
                         <div className="col-12 col-lg-6">
                              {/* Logo */}
                              <div className="text-center mb-4">
                                   <img src="../../../Assets/Client/Images/huong-sen-logo.png" alt="Lotus Logo" className="img-fluid" style={{ maxWidth: '150px' }} />
                              </div>

                              {/* Social Login Options */}
                              <div className="text-center mb-4">
                                   <h5 className="mb-3">Đăng nhập với</h5>
                                   <div className="d-flex justify-content-center gap-3">
                                        <button className="btn btn-light shadow-sm">
                                             <GoogleAuth />
                                        </button>
                                        <button className="btn btn-light shadow-sm">
                                             <FacebookAuth />
                                        </button>
                                   </div>
                              </div>

                              {/* Divider */}
                              <div className="d-flex align-items-center my-4">
                                   <hr className="flex-grow-1" />
                                   <span className="mx-3 text-muted">hoặc</span>
                                   <hr className="flex-grow-1" />
                              </div>

                              {/* Login Form */}
                              <div className="p-4 shadow-sm rounded">
                                   <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="mb-3">
                                             <label className="form-label">Nhập số điện thoại</label>
                                             <input
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Số điện thoại"
                                                  // {...register('phone')}
                                                  {...register('email')}
                                             />
                                        </div>

                                        <div className="mb-3">
                                             <label className="form-label">Nhập mật khẩu</label>
                                             <input type="password" className="form-control" placeholder="Mật khẩu" {...register('password')} />
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mb-3 float-end">
                                             <a href="/forgot-password" className="text-decoration-none text-muted">
                                                  Quên mật khẩu?
                                             </a>
                                        </div>

                                        <button type="submit" className="btn btn-primary w-100">
                                             Đăng nhập
                                        </button>
                                   </form>
                              </div>

                              {/* Register Option */}
                              <div className="text-center mt-3">
                                   <p className="mb-1">
                                        Bạn chưa có tài khoản?{' '}
                                        <a href="/register" className="text-primary text-decoration-none">
                                             Đăng ký ngay
                                        </a>
                                   </p>
                                   <a href="/policy" className="text-secondary text-decoration-underline">
                                        Xem chính sách của nhà hàng
                                   </a>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}
