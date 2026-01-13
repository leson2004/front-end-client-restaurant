import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { DangerAlert, SuccessAlert } from '../../../Components/Alert/Alert';
import { forgotPassword } from '../../../Actions/AuthActions';
import Spinner from '../../../Components/Client/Spinner';

export default function ForgotPassword() {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);



    const onSubmit = async (data) => {
        setLoading(true); // Bắt đầu hiển thị spinner khi bắt đầu gửi yêu cầu
        try {
            await dispatch(forgotPassword(data.email));
            setSuccessMessage('Email đặt lại mật khẩu đã được gửi!');
            setErrorMessage('');  // Xóa thông báo lỗi nếu có
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage('');  // Xóa thông báo thành công nếu có
        } finally {
            setLoading(false); // Kết thúc hiển thị spinner sau khi hoàn tất
        }
    };


    return (
        <div>
            <div className="container-fluid py-5 bg-dark hero-header mb-5">
            </div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="shadow-sm rounded">
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <h2 className="text-center mb-4">Quên mật khẩu</h2>

                                    <div className="form-group mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white">
                                                <i className="fa fa-envelope" aria-hidden="true"></i>
                                            </span>
                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                id="email"
                                                placeholder="Nhập Email"
                                                {...register('email', {
                                                    required: 'Email là bắt buộc',
                                                    pattern: {
                                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                        message: 'Email không hợp lệ'
                                                    }
                                                })}
                                            />
                                        </div>
                                        {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-warning btn-lg text-white">
                                            Gửi yêu cầu
                                        </button>
                                    </div>

                                    <div className="mt-4">
                                        <Link to="/login" className="link-primary me-3">
                                            <i className="fa-solid fa-arrow-left ms-2"></i> Trở lại
                                        </Link>
                                    </div>
                                </form>
                                {loading && <Spinner />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Thông báo */}
            <SuccessAlert open={!!successMessage} onClose={() => setSuccessMessage('')} message={successMessage} />
            <DangerAlert open={!!errorMessage} onClose={() => setErrorMessage('')} message={errorMessage} />
        </div>
    );
}
