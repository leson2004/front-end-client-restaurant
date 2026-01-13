import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);  // Cuộn lên đầu trang
    }, [pathname]);  // Mỗi khi URL thay đổi, useEffect sẽ được kích hoạt

    return null;
};

export default ScrollToTop;
