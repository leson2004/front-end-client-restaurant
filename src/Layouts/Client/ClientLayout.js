import React from 'react'

import { Outlet, useLocation } from 'react-router-dom';
import ClientHeader from '../../Components/Client/ClientHeader';
import Navbar from '../../Components/Client/Navbar';
import ClientFooter from '../../Components/Client/ClientFooter';
import BackToTop from '../../Components/Client/BackToTop';
import Spinner from '../../Components/Client/Spinner';
import ChatPopup from '../../Components/ChatPopup/ChatPopup';


export default function ClientLayout() {
    const location = useLocation();

    const noFooterPaths = ['/login', '/register', '/forgot-password', '/change-password'];
    const showFooter = !noFooterPaths.includes(location.pathname);

    return (
        <div>
            <ClientHeader />
            {/* <Navbar /> */}
            <div className="content">
                <Outlet />
            </div>
            <ChatPopup />
            <BackToTop />
            {showFooter && <ClientFooter />}
        </div>
    )
}
