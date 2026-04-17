import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogDetailBySlug } from "../../Actions/BlogDetailActions";
import { Link, useParams } from "react-router-dom";
import { fetchBlog, fetchBlogWithoutPagi } from "../../Actions/BlogActions";
import unidecode from "unidecode";
import { useNavigate } from "react-router-dom";
import Spinner from "../../Components/Client/Spinner";
import { createComment, fetchCommentsByBlogId, deleteComment, updateComment, clearModerationMessage } from "../../Reducers/commentSlice";
import DialogConfirm from "../../Components/Dialog/Dialog";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { SuccessAlert } from "../../Components/Alert/Alert"; // Import SuccessAlert
import normalAvatar from "../../Assets/Client/Images/default-avatar.png";
import DialogEditComment from "../../Components/Dialog/DialogEditComment";
const DetailBlog = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const blogDetailState = useSelector((state) => state.blog_detail);
  const blogState = useSelector((state) => state.blog);

  const [selectedID, setSelectedID] = useState(null);

  const [editingContent, setEditingContent] = useState(""); // Define setEditingContent
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // Trạng thái mở Dialog sửa
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Trạng thái mở Dialog xóa

  // Hàm mở Dialog xóa
  const handleClickOpen = (type, id, content) => {
    setSelectedID(id);

    if (type === "edit") {
      setEditingContent(content); // Set nội dung cần sửa vào state
      setIsEditDialogOpen(true); // Mở Dialog sửa
      setIsDeleteDialogOpen(false); // Đảm bảo Dialog xóa không mở
    } else if (type === "delete") {
      setIsDeleteDialogOpen(true); // Mở Dialog xóa
      setIsEditDialogOpen(false); // Đảm bảo Dialog sửa không mở
    }
  };

  // Hàm mở Dialog sửa
  // const handleClickOpenEditComment = (id, content) => {
  //   setSelectedID(id);
  //   setEditingContent(content); // Set nội dung cần sửa vào state
  //   setIsEditDialogOpen(true); // Mở Dialog sửa
  //   setIsDeleteDialogOpen(false); // Đảm bảo Dialog xóa không mở
  // };

  // Hàm đóng các Dialog
  const handleClose = () => {
    setIsDeleteDialogOpen(false); // Đóng Dialog xóa
    setIsEditDialogOpen(false); // Đóng Dialog sửa
    setSelectedID(null); // Reset selectedID
  };

  // console.log("Check blogState:: ", blogState)
  const commentState = useSelector((state) => state.comment_blog);

  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newComment, setNewComment] = useState({
    content: "",
    blog_id: "",
    user_id: "",
  });
  const [filteredComments, setFilteredComments] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const decodedToken = jwt_decode(accessToken);
      const userIdFromToken = decodedToken.id;
      setUserId(userIdFromToken);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchBlogDetailBySlug(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    dispatch(fetchBlogWithoutPagi());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      setNewComment((prevComment) => ({
        ...prevComment,
        user_id: userId,
      }));
    }
  }, [userId]);

  useEffect(() => {
    if (blogDetailState.blogDetail) {
      setNewComment((prevComment) => ({
        ...prevComment,
        blog_id: blogDetailState.blogDetail.id,
      }));
    }
    // fetch comments for this blog when blog detail is available
    if (blogDetailState.blogDetail?.id) {
      dispatch(fetchCommentsByBlogId(blogDetailState.blogDetail.id));
    }
  }, [blogDetailState.blogDetail]);

  useEffect(() => {
    const comments = (commentState.comments || []).filter(
      (comment) => comment.blog_id === blogDetailState.blogDetail?.id
    );
    setFilteredComments(comments);
  }, [commentState.comments, blogDetailState.blogDetail]);

  const handleBlogClick = (slug) => {
    navigate(`/blog-detail/${slug}.html`);
  };

  const formatMessageTimestamp = (timestamp) => {
    const now = new Date();
    const timeDifference = now - new Date(timestamp); // Ensure timestamp is treated as Date
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    // Format the timestamp in dd-MM-yyyy HH:mm format
    const formatCustom = (date) => {
      const pad = (num) => num.toString().padStart(2, "0");
      const day = pad(date.getDate());
      const month = pad(date.getMonth() + 1); // Months are zero-indexed
      const year = date.getFullYear();
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());

      return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    // Display time difference in a readable format
    if (minutesDifference < 1) {
      return "Mới nhất"; // "Just now"
    } else if (minutesDifference < 60) {
      return `${minutesDifference} phút trước`; // e.g., "5 minutes ago"
    } else if (timeDifference < 24 * 60 * 60 * 1000) {
      const hoursDifference = Math.floor(minutesDifference / 60);
      return `${hoursDifference} giờ trước`; // e.g., "2 hours ago"
    } else {
      // Return formatted timestamp as dd-MM-yyyy HH:mm
      return formatCustom(new Date(timestamp)); // return in dd-MM-yyyy HH:mm format
    }
  };

  // const relatedPosts = Array.isArray(blogState.blog)
  // ? blogState.blog
  //   .filter((blog) => blog.id !== blogDetailState.blogDetail?.id)
  //   .sort(() => Math.random() - 0.5) // Trộn ngẫu nhiên
  //   .slice(0, 3) // Chỉ lấy 3 bài viết ngẫu nhiên
  // : [];

  const relatedPosts = useMemo(() => {
    if (Array.isArray(blogState.blog)) {
      return blogState.blog
        .filter((blog) => blog.id !== blogDetailState.blogDetail?.id)
        .sort(() => Math.random() - 0.5) // Shuffle randomly
        .slice(0, 3); // Take only 3 random posts
    }
    return [];
  }, [blogState.blog, blogDetailState.blogDetail]);

  // console.log("CHCK relatedPosts:: ", relatedPosts)

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    if (!newComment.content.trim()) {
      setErrors({ content: "Nội dung bình luận không được để trống!" });
      return;
    }
    const commentData = {
      blog_id: newComment.blog_id,
      user_id: newComment.user_id,
      content: newComment.content,
    };
    dispatch(createComment(commentData))
      .then(() => {
        setNewComment((prev) => ({ ...prev, content: "" }));
        setTimeout(() => dispatch(clearModerationMessage()), 5000);
      })
      .catch(() => {
        setTimeout(() => dispatch(clearModerationMessage()), 8000);
      });
  };

  const handleDeleteComment = async () => {
    if (!localStorage.getItem("accessToken")) {
      alert("Bạn cần đăng nhập để thực hiện hành động này!");
      return;
    }
    if (!selectedID) return;
    try {
      await dispatch(deleteComment(selectedID));
      handleClose();
      setShowSuccessAlert(true);
    } catch {
      setShowSuccessAlert(false);
    }
  };

  const handleEditComment = async () => {
    if (!selectedID || !editingContent.trim()) return;
    try {
      await dispatch(updateComment(selectedID, { content: editingContent.trim() }));
      handleClose();
      setEditingContent("");
      setSelectedID(null);
      setShowSuccessAlert(true);
      setTimeout(() => dispatch(clearModerationMessage()), 5000);
    } catch {
      // moderationMessage set by reducer (rejected / 429 / 500)
      setTimeout(() => dispatch(clearModerationMessage()), 8000);
    }
  };

  return (
    <div>
      {/* Blog Detail UI */}
      <div className="container-fluid p-0 py-5 bg-dark hero-header mb-5">
        <div className="container text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">
            Chi Tiết Blog
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
              <li className="breadcrumb-item">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/blog">Bài viết & mẹo hay</Link>
              </li>
              <li
                className="breadcrumb-item text-white active"
                aria-current="page"
              >
                Chi Tiết Bài Viết
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {blogDetailState.loading ? (
        <Spinner />
      ) : blogDetailState.error ? (
        <div>Error: {blogDetailState.error}</div>
      ) : blogDetailState.blogDetail ? (
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-9">
              <div className="mb-5">
                <h1 className="display-4 mb-4">
                  {blogDetailState.blogDetail.title}
                </h1>
                <p
                  className="text-muted"
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Ngày đăng:{" "}
                  {new Date(
                    blogDetailState.blogDetail.created_at
                  ).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  - Tác giả: {blogDetailState.blogDetail.author}
                </p>
              </div>
              <div className="mb-4 text-center">
                <img
                  src={blogDetailState.blogDetail.poster}
                  className="img-fluid"
                  alt={blogDetailState.blogDetail.title}
                  style={{
                    maxHeight: "500px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
              </div>
              <div
                className="mb-5 blog-content"
                dangerouslySetInnerHTML={{
                  __html: blogDetailState.blogDetail.content,
                }}
              />
            </div>
          </div>

          <SuccessAlert
            open={showSuccessAlert}
            onClose={() => setShowSuccessAlert(false)}
            message="Thao tác thành công!"
          />

          {/* Phần bình luận */}
          <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-9">
                <h3 className="text-center mb-4 fw-bold">Bình luận</h3>
                <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                  <div className="card-body p-4">
                    {/* Moderation / error message (create or edit) */}
                    {commentState.moderationMessage && (
                      <div
                        className={`alert alert-${commentState.moderationMessage.type} alert-dismissible fade show d-flex align-items-start`}
                        role="alert"
                      >
                        <span className="flex-grow-1">
                          {commentState.moderationMessage.text}
                          {commentState.moderationMessage.retryAfter != null && (
                            <span className="d-block mt-1 small opacity-90">
                              Thử lại sau {commentState.moderationMessage.retryAfter} giây.
                            </span>
                          )}
                        </span>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => dispatch(clearModerationMessage())}
                          aria-label="Đóng"
                        />
                      </div>
                    )}

                    {/* Danh sách bình luận */}
                    <div className="mb-4">
                      {commentState.loading ? (
                        <div className="text-center py-4">
                          <Spinner />
                        </div>
                      ) : filteredComments.length > 0 ? (
                        <ul className="list-unstyled mb-0">
                          {filteredComments.map((comment) => (
                            <li
                              key={comment.id}
                              className="border-bottom pb-3 mb-3 comment-item"
                            >
                              <div className="d-flex gap-3">
                                <img
                                  src={
                                    comment.avatar && String(comment.avatar).startsWith("http")
                                      ? comment.avatar
                                      : normalAvatar
                                  }
                                  alt={comment.fullname || "Avatar"}
                                  className="rounded-circle flex-shrink-0"
                                  style={{ width: 44, height: 44, objectFit: "cover" }}
                                />
                                <div className="flex-grow-1 min-w-0">
                                  <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                                    <span className="fw-semibold text-dark">
                                      {comment.fullname}
                                    </span>
                                    <small className="text-muted">
                                      {formatMessageTimestamp(comment.created_at)}
                                    </small>
                                  </div>
                                  <p className="mb-2 text-secondary" style={{ whiteSpace: "pre-wrap" }}>
                                    {comment.content}
                                  </p>
                                  {userId === comment.user_id && (
                                    <div className="d-flex gap-2">
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary py-0"
                                        onClick={() =>
                                          handleClickOpen("edit", comment.id, comment.content)
                                        }
                                      >
                                        Sửa
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger py-0"
                                        onClick={() => handleClickOpen("delete", comment.id)}
                                      >
                                        Xóa
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted text-center py-3 mb-0">
                          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                        </p>
                      )}
                    </div>

                    {isLoggedIn ? (
                      <form onSubmit={handleCommentSubmit} className="mt-3">
                        <div className="mb-3">
                          <textarea
                            className={`form-control form-control-lg ${
                              errors.content ? "is-invalid" : ""
                            }`}
                            rows={3}
                            placeholder="Viết bình luận của bạn..."
                            value={newComment.content}
                            onChange={(e) => {
                              setNewComment((prev) => ({ ...prev, content: e.target.value }));
                              if (commentState.moderationMessage && e.target.value.trim()) {
                                dispatch(clearModerationMessage());
                              }
                            }}
                            style={{ resize: "vertical" }}
                          />
                          {errors.content && (
                            <div className="invalid-feedback d-block">{errors.content}</div>
                          )}
                        </div>
                        <button type="submit" className="btn btn-primary px-4" disabled={commentState.loading}>
                          {commentState.loading ? "Đang gửi..." : "Gửi bình luận"}
                        </button>
                      </form>
                    ) : (
                      <div className="alert alert-light border text-center py-3 mb-0">
                        Bạn cần <Link to="/login" className="fw-semibold">đăng nhập</Link> để bình luận.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mt-5">
            <h3 className="text-center mb-4">Có thể bạn quan tâm</h3>
            <div className="row">
              {relatedPosts.map((post) => (
                <div className="col-lg-4 mb-4" key={post.id}>
                  <div
                    className="card border-0 shadow-sm"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleBlogClick(post.slug)}
                  >
                    <img
                      className="card-img-top"
                      src={post.poster}
                      alt={post.title}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{post.title}</h5>
                      <p className="card-text text-muted">{post.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Blog không tồn tại!</p>
      )}

      <DialogEditComment
        open={isEditDialogOpen}
        content={editingContent}
        onChange={(e) => setEditingContent(e.target.value)}
        onClose={handleClose}
        onSave={handleEditComment}
        saving={commentState.loading}
      />

      <DialogConfirm
        open={isDeleteDialogOpen} // Mở Dialog xóa khi isDeleteDialogOpen là true
        onClose={handleClose} // Đóng Dialog xóa
        onConfirm={handleDeleteComment} // Xác nhận xóa bình luận
        message="Bạn có chắc chắn muốn xóa bình luận này?"
      />
    </div>
  );
};

export default DetailBlog;
