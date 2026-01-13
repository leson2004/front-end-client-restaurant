import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageUploadComponent from "../../../Components/ImageUpload/ImageUpload";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addNewCustomer, checkEmailExists } from "../../../Actions/AuthActions";
import { DangerAlert, SuccessAlert } from "../../../Components/Alert/Alert";
import Spinner from "../../../Components/Client/Spinner";
import AddressSelector from "../../../Components/Location/AddressSelector";

export default function Register() {
    const {
        handleSubmit,
        register,
        formState: { errors },
        watch,
        setValue,
        setError,
    } = useForm();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [avatar, setAvatar] = useState("");
    const [loading, setLoading] = useState(false);


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const password = watch("password");

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleImageUpload = (fileNames) => {
        if (fileNames.length > 0) {
            setAvatar(fileNames[0]);
        }
    };

    // Hàm kiểm tra email có tồn tại trên hệ thống chưa.
    const validateEmailExists = async (email) => {
        try {
            const user = await checkEmailExists(email);
            if (user) {
                setError("email", {
                    type: "manual",
                    message: "Email đã tồn tại trên hệ thống",
                });
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error checking email:", error);
            return false;
        }
    };
    // *Hàm sử lý chọn địa chỉ
    const handleAddressChange = (addressData) => {
        setValue("address", addressData.fullAddress);
    };

    const onSubmit = async (data) => {
        setLoading(true);

        const emailIsValid = await validateEmailExists(data.email);
        if (!emailIsValid) {
            setLoading(false);
            return; // Nếu email không hợp lệ, dừng lại ở đây
        }

        const customerData = {
            ...data,
            avatar, // Đảm bảo biến avatar đã được định nghĩa trước đó
            address: data.address,
        };

        try {
            await dispatch(addNewCustomer(customerData));
            navigate("/login"); // Điều hướng đến trang đăng nhập ngay sau khi đăng ký thành công
        } catch (error) {
            console.error("Đăng ký thất bại:", error.message);
        } finally {
            setLoading(false); // Đặt loading về false sau khi hoàn tất
        }
    };

    return (
        <div>
            <div className="container-fluid py-5 bg-dark hero-header"></div>
            <div className="container my-3">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        {/* Logo */}
                        <div className="text-center mb-4">
                            <img
                                src="../../../Assets/Client/Images/huong-sen-logo.png"
                                alt="Lotus Logo"
                                className="img-fluid"
                                style={{ maxWidth: '150px' }}
                            />
                        </div>

                        {/* Social Login Options */}
                        <div className="text-center mb-4">
                            <h2>
                                Đăng ký tài khoản thành viên
                            </h2>
                        </div>

                        <div className=" d-flex flex-row shadow-sm rounded">
                            <div className="col-md-12 p-3">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit(onSubmit)}>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="fullname" className="form-label">
                                                        Họ và Tên
                                                    </label>
                                                    <div className="input-group">
                                                        <span className="input-group-text bg-white">
                                                            <i className="fa fa-user" aria-hidden="true"></i>
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${errors.fullname ? 'is-invalid' : ''}`}
                                                            id="fullname"
                                                            placeholder="Nhập họ và tên"
                                                            {...register("fullname", {
                                                                required: "Họ và tên là bắt buộc",
                                                            })}
                                                        />
                                                    </div>
                                                    {errors.fullname && (
                                                        <p className="text-danger">
                                                            {errors.fullname.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="email" className="form-label">
                                                        Email
                                                    </label>
                                                    <div className="input-group">
                                                        <span className="input-group-text bg-white">
                                                            <i className="fa fa-envelope" aria-hidden="true"></i>
                                                        </span>
                                                        <input
                                                            type="email"
                                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                            id="email"
                                                            placeholder="Nhập Email"
                                                            {...register("email", {
                                                                required: "Email là bắt buộc",
                                                                pattern: {
                                                                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                                                    message: "Email không hợp lệ",
                                                                },
                                                            })}
                                                        />
                                                    </div>
                                                    {errors.email && (
                                                        <p className="text-danger">
                                                            {errors.email.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group mb-3">
                                            <label htmlFor="avatar" className="form-label">
                                                Ảnh đại diện
                                            </label>
                                            <div className="input-group">
                                                <ImageUploadComponent
                                                    id="avatar"
                                                    onImageUpload={handleImageUpload}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="tel" className="form-label">
                                                        Số điện thoại
                                                    </label>
                                                    <div className="input-group">
                                                        <span className="input-group-text bg-white">
                                                            <i className="fa fa-phone" aria-hidden="true"></i>
                                                        </span>
                                                        <input
                                                            type="tel"
                                                            className={`form-control ${errors.tel ? 'is-invalid' : ''}`}
                                                            id="tel"
                                                            placeholder="Nhập số điện thoại"
                                                            {...register("tel", {
                                                                required: "Số điện thoại là bắt buộc",
                                                                pattern: {
                                                                    value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                                                                    message: "Số điện thoại không không đúng định dạng",
                                                                },
                                                            })}
                                                        />
                                                    </div>
                                                    {errors.tel && (
                                                        <p className="text-danger">{errors.tel.message}</p>
                                                    )}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label htmlFor="password" className="form-label">
                                                        Mật khẩu
                                                    </label>
                                                    <div className="input-group">
                                                        <span className="input-group-text bg-white">
                                                            <i className="fa fa-lock" aria-hidden="true"></i>
                                                        </span>
                                                        <input
                                                            type={passwordVisible ? "text" : "password"}
                                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                            id="password"
                                                            placeholder="Nhập mật khẩu mới"
                                                            {...register("password", {
                                                                required: "Mật khẩu là bắt buộc",
                                                                minLength: {
                                                                    value: 8,
                                                                    message: "Mật khẩu phải có ít nhất 8 ký tự",
                                                                },
                                                                pattern: {
                                                                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                                                    message: "Mật khẩu phải bao gồm ít nhất chữ in hoa, số và ký tự đặc biệt",
                                                                },
                                                            })}
                                                        />
                                                        <span
                                                            className="input-group-text bg-white"
                                                            onClick={togglePasswordVisibility}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <i
                                                                className={passwordVisible ? "fa fa-eye-slash" : "fa fa-eye"}
                                                                aria-hidden="true"
                                                            ></i>
                                                        </span>
                                                    </div>
                                                    {errors.password && (
                                                        <p className="text-danger">
                                                            {errors.password.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label htmlFor="confirm-password" className="form-label">
                                                        Xác nhận mật khẩu
                                                    </label>
                                                    <div className="input-group">
                                                        <span className="input-group-text bg-white">
                                                            <i className="fa fa-lock" aria-hidden="true"></i>
                                                        </span>
                                                        <input
                                                            type={confirmPasswordVisible ? "text" : "password"}
                                                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                                            id="confirm-password"
                                                            placeholder="Nhập mật khẩu xác nhận"
                                                            {...register("confirmPassword", {
                                                                required: "Mật khẩu xác nhận là bắt buộc",
                                                                validate: (value) =>
                                                                    value === password || "Mật khẩu xác nhận không khớp",
                                                            })}
                                                        />
                                                        <span
                                                            className="input-group-text bg-white"
                                                            onClick={toggleConfirmPasswordVisibility}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <i
                                                                className={confirmPasswordVisible ? "fa fa-eye-slash" : "fa fa-eye"}
                                                                aria-hidden="true"
                                                            ></i>
                                                        </span>
                                                    </div>
                                                    {errors.confirmPassword && (
                                                        <p className="text-danger">
                                                            {errors.confirmPassword.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="address" className="form-label">
                                                        Địa chỉ
                                                    </label>
                                                    <AddressSelector onChange={handleAddressChange} />
                                                </div>

                                                <div className="form-group mb-3">
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                                        readOnly
                                                        placeholder="Địa chỉ chi tiết xem ở đây..."
                                                        {...register("address", {
                                                            required: "Địa chỉ là bắt buộc",
                                                            validate: (value) =>
                                                                value.split(",").filter((part) => part.trim()).length >= 4 ||
                                                                "Vui lòng điền đầy đủ thông tin địa chỉ",
                                                        })}
                                                    />
                                                    {errors.address && (
                                                        <p className="text-danger">
                                                            {errors.address.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-grid gap-2">
                                            <button type="submit" className="btn btn-warning btn-lg text-white">
                                                Đăng ký
                                            </button>
                                        </div>

                                        <div className="text-center mt-4">
                                            <Link to="/login" className="link-primary me-3">
                                                <i className="fa-solid fa-arrow-left ms-2"></i> Trở lại
                                            </Link>
                                            <Link to="/Login" className="link-primary">
                                                Bạn đã có tài khoản?
                                                <i
                                                    className="fa fa-long-arrow-right ms-2"
                                                    aria-hidden="true"
                                                ></i>
                                            </Link>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {loading && <Spinner />}
            </div>
        </div>
    );
}
