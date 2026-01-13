import React, { useEffect, useState } from 'react';
import ImageUploadComponent from '../../Components/ImageUpload/ImageUpload';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { checkPassword, updateProfile } from '../../Actions/UserActions';
import Spinner from '../../Components/Client/Spinner';

import { jwtDecode as jwt_decode } from 'jwt-decode';
import { DangerAlert, SuccessAlert } from '../../Components/Alert/Alert';
import AddressSelector from '../../Components/Location/AddressSelector';
import normalAvatar from '../../Assets/Client/Images/default-avatar.png';
import { useUser } from '../../Context/UserContext';

import defaultLogo from '../../Assets/Client/Images/huong-sen-logo.png'
import { FetchInfoMembershipCard } from '../../Actions/MembershipActions';
import { formatDateTime } from '../../Utils/FormatDateTime';
import { FetchAllListMemberShipTiers, FetchMembershipTier } from '../../Actions/MembershipTiersActions';
import { formatNumber } from '../../Utils/FormatNumber';


function Account() {
    const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { passwordCheckMessage, error } = useSelector(state => state.user);
    const membershipData = useSelector(state => state.membership);
    const membershipTiersData = useSelector(state => state.membership_tiers);
    const { setUser } = useUser();


    const [profile, setProfile] = useState({
        fullname: '',
        email: '',
        avatar: '',
        tel: '',
        address: ''
    });

    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false
    });

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const [activeTab, setActiveTab] = useState('updateInfo');
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [, setInitialAvatar] = useState(null);
    const [, setInitialPassword] = useState('');
    const [fullAddress, setFullAddress] = useState('');
    const [membershipLevel, setMembershipLevel] = useState('');
    const [activeInfoCardTab, setActiveInfoCardTab] = useState(membershipLevel);

    const memberInfo = {
        fullname: membershipData.membership.fullname || 'Nguyễn Văn A',
        membershipLevel: membershipLevel,
        totalPoints: membershipData.membership.point || 0,
        created_at: formatDateTime(membershipData.membership.created_at) || '23/10/2024',
    };

    const membershipLevels = {};
    console.log("Check membershipTiersData:: ", membershipTiersData)
    membershipTiersData.membership_tiers.forEach(tier => {
        console.log("Check tier:: ", tier)

        // Kiểm tra xem tier.description có tồn tại không
        if (tier.description) {
            const [condition, benefits] = tier.description.split("\r\n\r\n");

            console.log("Check [condition, benefits] ::", [condition, benefits])
            membershipLevels[tier.name] = {
                condition: condition ? condition.replace("Điều kiện: ", "") : "", // Kiểm tra condition
                benefits: benefits ? benefits.replace("Ưu đãi: ", "") : "" // Kiểm tra benefits
            };

            console.log("Check membershipLevels[tier.name]:: ", membershipLevels[tier.name])
        } else {
            console.warn(`Tier description is undefined for tier: ${tier.name}`);
        }
    });


    useEffect(() => {
        if (userId) {
            dispatch(FetchInfoMembershipCard(userId));
        }
    }, [dispatch, userId]);

    useEffect(() => {
        dispatch(FetchAllListMemberShipTiers());
    }, [dispatch]);

    useEffect(() => {
        const fetchMembershipData = async () => {
            if (userId) {
                const result = await FetchMembershipTier(userId);
                if (result) {
                    setMembershipLevel(result.tierName); // Lưu tierName vào state
                }
            }
        };

        fetchMembershipData();
    }, [dispatch, userId]);

    const handleTabChange = (level) => {
        setActiveInfoCardTab(level);
    };


    useEffect(() => {
        setActiveInfoCardTab(membershipLevel);
    }, [membershipLevel]);


    useEffect(() => {
        if (profile.address) {
            setFullAddress(profile.address);
        }
    }, [profile.address]);

    const handleAddressChange = (newAddress) => {
        setFullAddress(newAddress.fullAddress);
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prevState) => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            const decodedToken = jwt_decode(accessToken);
            const userIdFromToken = decodedToken.id;
            setUserId(userIdFromToken);

            const storedProfile = localStorage.getItem('user');
            if (storedProfile) {
                const parsedProfile = JSON.parse(storedProfile);
                setProfile(parsedProfile);

                // Đặt giá trị ban đầu cho form
                setValue('fullname', parsedProfile.fullname);
                setValue('email', parsedProfile.email);
                setValue('tel', parsedProfile.tel);
                setValue('address', parsedProfile.address);

                // Lưu giá trị avatar và password ban đầu
                setInitialAvatar(parsedProfile.avatar);
                setInitialPassword(parsedProfile.password || '');
            }
        }
    }, [setValue]);


    const handleImageUpload = (fileNames) => {
        if (fileNames.length > 0) {
            setValue('avatar', fileNames[0]);
            setProfile(prev => ({ ...prev, avatar: fileNames[0] }));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        setUser(null);
        navigate('/login');
    };

    const handleUpdateProfile = async (data) => {
        if (!userId) {
            console.error('User ID is missing');
            return;
        }
    
        // Giữ nguyên avatar cũ nếu không thay đổi avatar
        const updatedProfile = {
            ...data,
            address: fullAddress, // Sử dụng fullAddress thay vì data.address
            avatar: data.avatar || profile.avatar // Nếu không có avatar mới thì giữ avatar cũ
        };
    
        try {
            await dispatch(updateProfile(userId, updatedProfile));
            localStorage.setItem('user', JSON.stringify(updatedProfile));
    
            setAlert({
                open: true,
                message: 'Cập nhật thông tin thành công!',
                severity: 'success'
            });
    
            // Cập nhật state profile
            setProfile(updatedProfile);
    
        } catch (error) {
            console.error('Error updating profile:', error);
            setAlert({
                open: true,
                message: 'Cập nhật thông tin thất bại!',
                severity: 'error'
            });
        }
    };
    

    useEffect(() => {
        const alertStatus = localStorage.getItem('profileUpdateStatus');
        if (alertStatus) {
            setAlert({
                open: true,
                message: alertStatus === 'success' ? 'Cập nhật thông tin thành công!' : 'Cập nhật thông tin thất bại!',
                severity: alertStatus === 'success' ? 'success' : 'error'
            });
            localStorage.removeItem('profileUpdateStatus');
        }
    }, []);


    useEffect(() => {
        if (passwordCheckMessage) {
            if (passwordCheckMessage === 'Password is correct') {
                console.log('Mật khẩu chính xác');
            } else {
                console.log('Sai mật khẩu');
            }
        }
        if (error) {
            console.log('Error:', error);
        }
    }, [passwordCheckMessage, error]);

    const handleChangePassword = async (data) => {
        try {
            setIsLoading(true);

            // Kiểm tra mật khẩu hiện tại
            const email = profile.email;
            const currentPassword = getValues('currentPassword');
            const passwordCheckMessage = await dispatch(checkPassword(email, currentPassword));

            console.log('Kết quả kiểm tra mật khẩu:', passwordCheckMessage);

            // Nếu mật khẩu đúng, tiến hành cập nhật mật khẩu mới
            if (passwordCheckMessage === 'Password is correct') {
                const updatedProfile = {
                    password: data.newPassword
                };

                await dispatch(updateProfile(userId, updatedProfile));

                setAlert({
                    open: true,
                    message: 'Đổi mật khẩu thành công!',
                    severity: 'success'
                });

            }
        } catch (error) {
            console.error(error);
            setAlert({
                open: true,
                message: 'Đổi mật khẩu thất bại!',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <div className="container-fluid p-0 py-5 bg-dark hero-header mb-5">
                        <div className="container text-center my-5 pt-5 pb-4">
                            <h1 className="display-3 text-white mb-3">Thông Tin Tài Khoản</h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb justify-content-center text-uppercase">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Trang chủ</Link>
                                    </li>
                                    <li className="breadcrumb-item text-white active" aria-current="page">
                                        Thông tin tài khoản
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    <div className="container-xxl py-5">
                        <div className="container">
                            <div className="row g-4">
                                <div className="col-md-4">
                                    <div className="bg-white p-4 rounded text-center">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <div
                                                className="avatar-wrapper rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
                                                style={{ width: 140, height: 140 }}
                                            >
                                                <img
                                                    src={profile.avatar || normalAvatar}
                                                    alt="Avatar"
                                                    className="img-fluid"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            </div>
                                        </div>
                                        <br />
                                        <h5 className="section-title ff-secondary fw-normal text-primary">Họ và Tên</h5>
                                        <p>{profile.fullname}</p>
                                        <h5 className="section-title ff-secondary fw-normal text-primary">Email</h5>
                                        <p>{profile.email}</p>
                                        <h5 className="section-title ff-secondary fw-normal text-primary">Số Điện Thoại</h5>
                                        <p>{profile.tel}</p>
                                        <h5 className="section-title ff-secondary fw-normal text-primary">Địa chỉ</h5>
                                        <p>{profile.address}</p>
                                        <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>Đăng Xuất</button>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <ul className="nav nav-tabs">
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'memberCard' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('memberCard')}
                                            >
                                                Thành viên
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'updateInfo' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('updateInfo')}
                                            >
                                                Cập Nhật Thông Tin
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'changePassword' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('changePassword')}
                                            >
                                                Đổi Mật Khẩu
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="tab-content p-4 bg-white rounded-bottom">
                                        {activeTab === 'memberCard' && (
                                            <div className="row justify-content-center">
                                                <div className="col-md-6">
                                                    <div style={{
                                                        backgroundColor: memberInfo.membershipLevel === 'Mới' ? '#ffffff' :
                                                            memberInfo.membershipLevel === 'Thân Thiết' ? '#d4edda' :
                                                                memberInfo.membershipLevel === 'Hạng Bạc' ? '#e2e3e5' :
                                                                    memberInfo.membershipLevel === 'Hạng Vàng' ? '#ffedb4' :
                                                                        '#f8f9fa',
                                                        borderRadius: '20px',
                                                        padding: '10px',
                                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                                                        marginBottom: '10px'
                                                    }}>
                                                        <div className="card mb-3" style={{ width: '100%', borderRadius: '15px', border: 'none', overflow: 'hidden' }}>
                                                            <div className="card-body d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
                                                                <div>
                                                                    <h5 className="card-title" style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{memberInfo.fullname}</h5>
                                                                    <h6 className="card-subtitle mb-2" style={{
                                                                        fontSize: '1.4rem',
                                                                        color: memberInfo.membershipLevel === 'Mới' ? '#000' :
                                                                            memberInfo.membershipLevel === 'Thân Thiết' ? '#28a745' :
                                                                                memberInfo.membershipLevel === 'Hạng Bạc' ? '#6c757d' :
                                                                                    memberInfo.membershipLevel === 'Hạng Vàng' ? '#ffc107' : '#000'
                                                                    }}>
                                                                        Cấp độ: Thành viên {memberInfo.membershipLevel}
                                                                    </h6>
                                                                    <p className="card-text" style={{ fontSize: '1.2rem' }}>
                                                                        Điểm tích lũy: <span style={{ fontWeight: 'bold' }}>{formatNumber(memberInfo.totalPoints)}</span> <br />
                                                                        Thời gian tạo thẻ: <span style={{ fontWeight: 'bold', fontSize: "1rem" }}>{memberInfo.created_at}</span> <br />
                                                                    </p>
                                                                </div>
                                                                <img
                                                                    src={defaultLogo}
                                                                    alt="Membership Icon"
                                                                    style={{
                                                                        width: '5rem',
                                                                        height: '5rem',
                                                                        filter: memberInfo.membershipLevel === 'Mới' ? 'none' :
                                                                            memberInfo.membershipLevel === 'Thân Thiết' ? 'sepia(100%) hue-rotate(100deg)' :
                                                                                memberInfo.membershipLevel === 'Hạng Bạc' ? 'grayscale(100%)' :
                                                                                    memberInfo.membershipLevel === 'Hạng Vàng' ? 'sepia(100%) saturate(400%)' : 'brightness(0)'
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="card rounded-3 shadow">
                                                        <div className="card-body">
                                                            <h6 className="card-title fw-bold fs-4 text-dark">
                                                                <i className="fa-solid fa-circle-info fs-5"></i> Thông tin về Thẻ Thành Viên
                                                            </h6>
                                                            <div className="overflow-auto">
                                                                <ul className="nav nav-tabs flex-nowrap">
                                                                    {Object.keys(membershipLevels).map(level => (
                                                                        <li className="nav-item" key={level}>
                                                                            <a
                                                                                className={`nav-link ${activeInfoCardTab === level ? 'active' : ''} d-flex text-center justify-content-center align-items-center`}
                                                                                onClick={() => handleTabChange(level)}
                                                                                style={{ cursor: 'pointer', height: '100%' }}
                                                                            >
                                                                                {level}
                                                                            </a>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            <div className="tab-content mt-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                                {Object.keys(membershipLevels).map(level => (
                                                                    <div className={`tab-pane fade ${activeInfoCardTab === level ? 'show active' : ''}`} key={level}>
                                                                        <h6 className="fw-bold">Thành Viên {level}</h6>
                                                                        <p><strong>Quy chuẩn tích điểm</strong>: 1 điểm tương ứng với 1.000vnd</p>
                                                                        <p><strong>Điều kiện</strong>: {membershipLevels[level].condition}</p>
                                                                        <p><strong>Ưu đãi</strong>: {membershipLevels[level].benefits}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'updateInfo' && (
                                            <form onSubmit={handleSubmit(handleUpdateProfile)}>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="fullname"
                                                                placeholder="Họ và Tên"
                                                                {...register('fullname', { required: "Họ và tên là bắt buộc" })}
                                                            />
                                                            <label htmlFor="fullname">Họ và Tên</label>
                                                            {errors.fullname && <span className="text-danger">{errors.fullname.message}</span>}
                                                        </div>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="email"
                                                                className="form-control"
                                                                id="email"
                                                                placeholder="Email"
                                                                {...register('email', { required: "Email là bắt buộc" })}
                                                            />
                                                            <label htmlFor="email">Email</label>
                                                            {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                                        </div>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="tel"
                                                                className="form-control"
                                                                id="tel"
                                                                placeholder="Số Điện Thoại"
                                                                {...register('tel', {
                                                                    required: 'Số điện thoại là bắt buộc',
                                                                    pattern: {
                                                                        value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                                                                        message: 'Số điện thoại không đúng định dạng',
                                                                    },
                                                                })}
                                                            />
                                                            <label htmlFor="tel">Số Điện Thoại</label>
                                                            {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="avatar">Ảnh đại diện</label>
                                                            <ImageUploadComponent
                                                                id="avatar"
                                                                onImageUpload={handleImageUpload}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className='form-floating'>
                                                            <label htmlFor="address" style={{ marginTop: -10, opacity: '50%' }}>Địa chỉ</label>
                                                            <AddressSelector
                                                                onChange={handleAddressChange}
                                                                initialAddress={profile.address}
                                                            />
                                                            {errors.address && <p className="text-danger">{errors.address.message}</p>}
                                                        </div>

                                                    </div>
                                                    <div className="col-12 mt-3">
                                                        <button className="btn btn-primary w-100 py-3 rounded-pill" type="submit">Cập Nhật</button>
                                                    </div>
                                                    <div className="col-12 mt-2">
                                                        <button className="btn btn-secondary w-100 py-3 rounded-pill" type="reset">Đặt Lại</button>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                        {activeTab === 'changePassword' && (
                                            <form onSubmit={handleSubmit(handleChangePassword)}>
                                                <div className="row g-3">
                                                    <div className="col-12 position-relative">
                                                        <div className="form-floating">
                                                            <input
                                                                type={showPassword.currentPassword ? "text" : "password"}
                                                                className="form-control"
                                                                id="currentPassword"
                                                                placeholder="Mật Khẩu Cũ"
                                                                {...register('currentPassword', {
                                                                    required: "Mật khẩu cũ là bắt buộc",
                                                                    minLength: {
                                                                        value: 8,
                                                                        message: 'Mật khẩu phải có ít nhất 8 ký tự',
                                                                    },
                                                                    pattern: {
                                                                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                                                        message: 'Mật khẩu phải bao gồm số và ký tự đặc biệt',
                                                                    },
                                                                })}
                                                            />
                                                            <label htmlFor="currentPassword">Mật Khẩu Cũ</label>
                                                            <i
                                                                className={`fa ${showPassword.currentPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute top-50 end-0 translate-middle-y pe-3`}
                                                                onClick={() => togglePasswordVisibility('currentPassword')}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            {errors.currentPassword && <span className="text-danger">{errors.currentPassword.message}</span>}
                                                            {error && <span className="text-danger">{error}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-12 position-relative">
                                                        <div className="form-floating">
                                                            <input
                                                                type={showPassword.newPassword ? "text" : "password"}
                                                                className="form-control"
                                                                id="newPassword"
                                                                placeholder="Mật Khẩu Mới"
                                                                {...register('newPassword', {
                                                                    required: 'Mật khẩu là bắt buộc',
                                                                    minLength: {
                                                                        value: 8,
                                                                        message: 'Mật khẩu phải có ít nhất 8 ký tự',
                                                                    },
                                                                    pattern: {
                                                                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                                                        message: 'Mật khẩu phải bao gồm số và ký tự đặc biệt',
                                                                    },
                                                                })}
                                                            />
                                                            <label htmlFor="newPassword">Mật Khẩu Mới</label>
                                                            <i
                                                                className={`fa ${showPassword.newPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute top-50 end-0 translate-middle-y pe-3`}
                                                                onClick={() => togglePasswordVisibility('newPassword')}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            {errors.newPassword && <span className="text-danger">{errors.newPassword.message}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-12 position-relative">
                                                        <div className="form-floating">
                                                            <input
                                                                type={showPassword.confirmNewPassword ? "text" : "password"}
                                                                className="form-control"
                                                                id="confirmNewPassword"
                                                                placeholder="Nhập Lại Mật Khẩu Mới"
                                                                {...register('confirmNewPassword', {
                                                                    required: 'Xác nhận mật khẩu là bắt buộc',
                                                                    validate: (value) =>
                                                                        value === getValues('newPassword') || 'Mật khẩu không khớp',
                                                                })}
                                                            />
                                                            <label htmlFor="confirmNewPassword">Nhập Lại Mật Khẩu Mới</label>
                                                            <i
                                                                className={`fa ${showPassword.confirmNewPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute top-50 end-0 translate-middle-y pe-3`}
                                                                onClick={() => togglePasswordVisibility('confirmNewPassword')}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            {errors.confirmNewPassword && <span className="text-danger">{errors.confirmNewPassword.message}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <button className="btn btn-primary w-100 py-3 rounded-pill" type="submit">Đổi Mật Khẩu</button>
                                                    </div>
                                                    <div className="col-12">
                                                        <button className="btn btn-secondary w-100 py-3 rounded-pill" type="reset">Đặt Lại</button>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Hiển thị thông báo ở đây*/}
                        <SuccessAlert open={alert.open && alert.severity === 'success'} onClose={() => setAlert({ ...alert, open: false })} message={alert.message} />
                        <DangerAlert open={alert.open && alert.severity === 'error'} onClose={() => setAlert({ ...alert, open: false })} message={alert.message} />
                    </div>
                </>
            )
            }

        </div >
    );
}

export default Account;
