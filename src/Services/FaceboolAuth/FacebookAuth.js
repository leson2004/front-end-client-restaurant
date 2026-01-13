import React from 'react';
import { LoginSocialFacebook } from 'reactjs-social-login';
import './FacebookAuth.css'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import logoFb from '../../Assets/Client/Images/facebook.png';
import { fetchAuthSuccess, fetchFacebookAuth } from '../../Actions/AuthActions';
import { DangerAlert } from '../../Components/Alert/Alert';
import Spinner from '../../Components/Client/Spinner';

const FacebookAuth = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [alertOpen, setAlertOpen] = useState(false);

    // Kiểm tra nếu đã có người dùng trong localStorage
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            dispatch(fetchAuthSuccess(JSON.parse(user)));
        }
    }, [dispatch]);

    // Theo dõi trạng thái đăng nhập
    useEffect(() => {
        if (authState.error) {
            setAlertOpen(true);
            setLoading(false);
        } else if (authState.auth) {
            setLoading(false);
        }
    }, [authState]);

    // Xử lý khi đăng nhập Facebook thành công
    const handleSuccess = async (response) => {
        setLoading(true);
        try {
            const { name, email, picture } = response.data;
            const userData = {
                fullname: name,
                email: email,
                avatar: picture.data.url,
            };

            await dispatch(fetchFacebookAuth(userData));

            const storedUser = localStorage.getItem('user');
            const accessToken = localStorage.getItem('accessToken');

            if (storedUser && accessToken) {
                navigate('/');
            } else {
                console.error('Thiếu thông tin người dùng hoặc access token. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Lỗi khi xử lý đăng nhập Facebook', error);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý khi đăng nhập Facebook thất bại
    const handleFailure = (error) => {
        console.error('Đăng nhập Facebook thất bại:', error);
        setLoading(false);
        setAlertOpen(true);
    };

    // Đóng alert khi có lỗi
    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            {loading ? (
                <Spinner />
            ) : (
                <LoginSocialFacebook
                    appId="410687418510018"
                    fields="name,email,picture"
                    onResolve={handleSuccess}
                    onReject={handleFailure}
                >
                    <button className="btn btn-light btn-sm mx-2 d-flex justify-content-center align-items-center">
                        <img src={logoFb} alt="Facebook Logo" className="google-icon" width={20} height={20} />
                        <span className="mx-2">Facebook</span>
                    </button>
                </LoginSocialFacebook>
            )}

            <DangerAlert
                open={alertOpen}
                onClose={handleCloseAlert}
                message={authState.error}
                vertical="top"
                horizontal="right"
            />
        </div>
    );
};

export default FacebookAuth;


