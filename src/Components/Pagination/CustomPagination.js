import React from 'react';
import Pagination from '@mui/material/Pagination';
import { useDispatch, useSelector } from 'react-redux';

const CustomPagination = ({ count, onPageChange, currentPageSelector, fetchAction }) => {
    const dispatch = useDispatch();
    const currentPage = useSelector(currentPageSelector); // Lấy trang hiện tại từ state

    const handlePageChange = (event, value) => {
        onPageChange(value); // Gọi hàm để cập nhật trang
        dispatch(fetchAction(value)); // Gọi action để fetch dữ liệu
    }

    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <Pagination
                count={count}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                variant="outlined"
            />
        </div>
    );
};

export default CustomPagination;