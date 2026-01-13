import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthSuccess, fetchGoogleAuth } from '../../Actions/AuthActions';
import logoGoogle from '../../Assets/Client/Images/google.png'
import './GoogleAuth.css'
import { DangerAlert } from '../../Components/Alert/Alert';
import Spinner from '../../Components/Client/Spinner';
import { useNavigate } from 'react-router-dom';

const CLIENT_ID = '951595549566-p3mihmpipb7go6loejm0hfq7t55chr5r.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBynwFp7WrjoZRIFlirnb71apWgoU4XiiY';

const GoogleAuth = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [alertOpen, setAlertOpen] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            dispatch(fetchAuthSuccess(JSON.parse(user)));
        }

        const initClient = async () => {
            try {
                await gapi.load('client:auth2', async () => {
                    await gapi.client.init({
                        apiKey: API_KEY,
                        clientId: CLIENT_ID,
                        scope: 'email'
                    });
                });
            } catch (error) {
                console.error('Error initializing Google API client', error);
            }
        };
        initClient();
    }, [dispatch]);

    useEffect(() => {
        if (authState.error) {
            setAlertOpen(true);
            setLoading(false);
        } else if (authState.auth) {
            setLoading(false);
        }
    }, [authState, navigate]);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const authInstance = gapi.auth2.getAuthInstance();
            if (authInstance) {
                const user = await authInstance.signIn();
                const profile = user.getBasicProfile();
                const userData = {
                    fullname: profile.getName(),
                    email: profile.getEmail(),
                    avatar: profile.getImageUrl()
                };

                await dispatch(fetchGoogleAuth(userData));

                const storedUser = localStorage.getItem('user');
                const accessToken = localStorage.getItem('accessToken');

                if (storedUser && accessToken) {
                    navigate('/');
                } else {
                    console.error('Thiếu thông tin người dùng hoặc access token. Vui lòng thử lại.');
                }
            } else {
                console.error('Google Auth instance not initialized');
            }
        } catch (error) {
            console.error('Error during sign-in', error);
        } finally {
            setLoading(false);
        }
    };


    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            {loading ? (
                <Spinner />
            ) : (
                <button className="btn btn-light btn-sm mx-2 d-flex justify-content-center align-items-center" onClick={handleLogin}>
                    <img src={logoGoogle} alt="Google Logo" className="google-icon" width={20} height={20} />
                    <span className='mx-2'>Google</span>
                </button>
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

export default GoogleAuth;

