import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlog } from '../../Actions/BlogActions';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Spinner from "../../Components/Client/Spinner";
import CustomPagination from '../../Components/Pagination/CustomPagination';

export default function Blog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Lấy vị trí hiện tại
  const blogState = useSelector((state) => state.blog);

  const [, setCurrentPage] = useState(1); // Trạng thái cho trang hiện tại

  // Hàm để lấy trang hiện tại từ URL
  const getCurrentPageFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return parseInt(params.get('page')) || 1; // Mặc định là 1 nếu không tìm thấy
  };

  useEffect(() => {
    const fetchData = async () => {
      const page = getCurrentPageFromUrl();
      setCurrentPage(page); // Cập nhật trang hiện tại từ URL
      await dispatch(fetchBlog(page, blogState.pageSize)); // Sử dụng await để đợi fetchBlog hoàn thành
    };

    fetchData(); // Gọi hàm async
  }, [dispatch, location.search]); // Lấy lại khi vị trí thay đổi

  // Hàm xử lý khi nhấp vào bài viết
  const handleBlogClick = (slug) => {
    navigate(`/blog-detail/${slug}.html`);
  };

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
    navigate(`?page=${page}`); // Cập nhật URL với trang mới
  };

  const getRandomBlogs = () => {
    if (blogState.allBlog) {
      // Trộn mảng allBlog
      const shuffled = [...blogState.allBlog].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 6); // Lấy 6 bài viết ngẫu nhiên
    }
    return [];
  };

  return (
    <div>
      {/* Hero Header */}
      <div className="container-fluid p-0 py-5 bg-dark hero-header mb-5">
        <div className="text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">
            Tin tức và mẹo hay
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
              <li className="breadcrumb-item">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item text-white active" aria-current="page">
                Tin tức & mẹo hay
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="row">
          {/* Blog Posts */}
          <div className="col-md-9">
            <div className="row">
              {/* Hiển thị trạng thái loading hoặc lỗi */}
              {blogState.loading && <Spinner />}
              {blogState.error && <div className="alert alert-danger">Error: {blogState.error}</div>}

              {/* Lặp qua các bài viết */}
              {!blogState.loading && blogState.allBlog?.length > 0 && blogState.allBlog.map((blog) => (

                console.log(blog),
                <div className="col-md-4 mb-4" key={blog.id}>
                  <div
                    className="blog-card"
                    onClick={() => handleBlogClick(blog.slug)}
                    style={{
                      cursor: "pointer",
                      borderRadius: "8px",
                      overflow: "hidden",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s ease",
                      background: "white",
                    }}
                  >
                    <img
                      src={blog.poster || "https://images.rawpixel.com/image_social_square/cHJpdmF0ZS9zci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA0L2pvYjcwOS0yMy12LmpwZw.jpg"}
                      className="card-img-top"
                      alt={blog.title}
                      style={{
                        height: "200px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{blog.title.length > 50 ? `${blog.title.slice(0, 50)}...` : blog.title}</h5>
                      <p className="card-text">{blog.author}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Nếu không tìm thấy bài viết */}
              {!blogState.loading && blogState.allBlog?.length === 0 && (
                <div className="col-12">
                  <div className="alert alert-info">Không tìm thấy bài viết nào.</div>
                </div>
              )}
            </div>

            {/* Component phân trang */}
            <CustomPagination
              count={blogState.totalPages} // Tổng số trang từ state
              onPageChange={handlePageChange} // Hàm xử lý thay đổi trang
              currentPageSelector={(state) => state.blog.currentPage} // Hàm chọn trang hiện tại
              fetchAction={fetchBlog} // Hành động lấy dữ liệu
            />
          </div>

          {/* Sidebar */}
          <div className="col-md-3">
            <div className="blog-more">
              <h3 className="mb-4">Có thể bạn quan tâm</h3>
              {getRandomBlogs().length > 0 &&
                getRandomBlogs().map((blog) => (
                  <div className="list-group mt-3" key={blog.id} onClick={() => handleBlogClick(blog.slug)} style={{ cursor: "pointer" }}>
                    <a
                      href="#"
                      className="list-group-item-action"
                      style={{
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        color: "inherit",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.3s ease",
                        backgroundColor: "#fff",
                      }}
                    >
                      <div style={{ flex: 1, padding: "10px" }}>
                        <h6 className="mb-1" style={{ fontSize: "16px", fontWeight: "bold" }}>
                          {blog.title.length > 30 ? `${blog.title.slice(0, 30)}...` : blog.title}
                        </h6>
                      </div>
                      <img
                        src={blog.poster || "https://images.rawpixel.com/image_social_square/cHJpdmF0ZS9zci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA0L2pvYjcwOS0yMy12LmpwZw.jpg"}
                        className="img-fluid"
                        alt={blog.title}
                        style={{
                          height: "100px",
                          objectFit: "cover",
                          width: "100px",
                          marginLeft: "10px",
                        }}
                      />
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
