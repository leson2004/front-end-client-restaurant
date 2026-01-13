import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className='d-flex vh-100 justify-content-center align-items-center bg-light'>
            <div className="text-center">
                <h1 className="display-1 font-weight-bold text-dark">404</h1>
                <p className="h4 mb-4">Trang không tìm thấy</p>
                <p className="lead">Xin lỗi, trang bạn đang tìm kiếm không tồn tại!</p>
                <Link to="/" className="btn btn-primary mt-3">Trở về trang chủ</Link>
            </div>
        </div>
    )
}
