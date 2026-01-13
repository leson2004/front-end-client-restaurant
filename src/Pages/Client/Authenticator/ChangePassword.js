import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { changePassword } from '../../../Actions/AuthActions';
import { DangerAlert, SuccessAlert } from '../../../Components/Alert/Alert';
import Spinner from '../../../Components/Client/Spinner';

export default function ChangePassword() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    // Lấy token từ URL query parameter
    const getTokenFromQuery = () => {
        const queryParams = new URLSearchParams(location.search);
        return queryParams.get('token');
    };

    const token = getTokenFromQuery();

    const onSubmit = async (data) => {
        if (data.newPassword !== data.confirmNewPassword) {
            setErrorMessage('Mật khẩu xác nhận không khớp');
            setSuccessMessage('');
            return;
        }

        setLoading(true);
        try {
            await dispatch(changePassword(token, data.newPassword));
            setSuccessMessage('Đổi mật khẩu thành công');
            setErrorMessage('');
            setTimeout(() => navigate('/login'), 2000); // Điều hướng đến trang /login sau 2 giây
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage('');
        } finally {
            setLoading(false);
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
                                    <h2 className="text-center mb-4">Đổi mật khẩu</h2>

                                    <div className="form-group mb-3">
                                        <label htmlFor="newPassword" className="form-label">Mật khẩu mới</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white">
                                                <i className="fa fa-lock" aria-hidden="true"></i>
                                            </span>
                                            <input
                                                type={passwordVisible ? 'text' : 'password'}
                                                className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                                id="newPassword"
                                                placeholder="Nhập mật khẩu mới"
                                                {...register('newPassword', {
                                                    required: 'Mật khẩu mới là bắt buộc',
                                                    minLength: {
                                                        value: 6,
                                                        message: 'Mật khẩu phải có ít nhất 6 ký tự'
                                                    },
                                                    pattern: {
                                                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                                        message: 'Mật khẩu phải bao gồm số và ký tự đặc biệt',
                                                    },
                                                })}
                                            />
                                            <span className="input-group-text bg-white" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                                <i className={passwordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'} aria-hidden="true"></i>
                                            </span>
                                        </div>
                                        {errors.newPassword && <span className="text-danger">{errors.newPassword.message}</span>}
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="confirmNewPassword" className="form-label">Xác nhận mật khẩu mới</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white">
                                                <i className="fa fa-lock" aria-hidden="true"></i>
                                            </span>
                                            <input
                                                type={confirmPasswordVisible ? 'text' : 'password'}
                                                className={`form-control ${errors.confirmNewPassword ? 'is-invalid' : ''}`}
                                                id="confirmNewPassword"
                                                placeholder="Nhập lại mật khẩu mới"
                                                {...register('confirmNewPassword', {
                                                    required: 'Xác nhận mật khẩu là bắt buộc',
                                                    validate: value =>
                                                        value === watch('newPassword') || 'Mật khẩu xác nhận không khớp'
                                                })}
                                            />
                                            <span className="input-group-text bg-white" onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }}>
                                                <i className={confirmPasswordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'} aria-hidden="true"></i>
                                            </span>
                                        </div>
                                        {errors.confirmNewPassword && <span className="text-danger">{errors.confirmNewPassword.message}</span>}
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-warning btn-lg text-white">
                                            {loading ? <Spinner /> : 'Gửi yêu cầu'}
                                        </button>
                                    </div>

                                    <div className="text-center mt-4">
                                        <Link to="/login" className="link-primary me-3">
                                            <i className="fa-solid fa-arrow-left ms-2"></i> Trở lại
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SuccessAlert open={!!successMessage} onClose={() => setSuccessMessage('')} message={successMessage} />
            <DangerAlert open={!!errorMessage} onClose={() => setErrorMessage('')} message={errorMessage} />
        </div>
    );
}