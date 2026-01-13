import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../Config/Client/Firebase";
import Spinner from "../Client/Spinner";
import { CircularProgress } from "@mui/material";

const UserInfoForm = ({ onFormSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [title, setTitle] = useState("Anh");
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  const onSubmit = async (data) => {
    setLoading(true); // Bắt đầu hiển thị spinner
    const userInfo = { ...data, title, uid: uuidv4() };

    try {
      // Kiểm tra thông tin người dùng có tồn tại không
      const userChatsCollection = collection(db, "userChats");
      const q = query(
        userChatsCollection,
        where("fullname", "==", userInfo.fullname),
        where("tel", "==", userInfo.tel)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Nếu thông tin tồn tại, lấy thông tin người dùng
        const existingUser = querySnapshot.docs[0].data();

        // Cập nhật localStorage và thông báo cho parent component
        localStorage.setItem("userInfo", JSON.stringify(existingUser));
        onFormSubmit(existingUser);
      } else {
        // Nếu thông tin không tồn tại, thêm mới vào Firestore
        await addDoc(userChatsCollection, userInfo);

        // Cập nhật localStorage và thông báo cho parent component
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        onFormSubmit(userInfo);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý thông tin người dùng:", error);
    } finally {
      setLoading(false); // Ẩn spinner khi hoàn tất xử lý
    }
  };

  return (
    <>
      {loading && (
        <div className="spinner-overlay d-flex justify-content-center align-content-center">
          <CircularProgress color="warning" />
        </div>
      )}

      {!loading && (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Header của Form */}
          <div className="mb-4">
            <h5 className="text-center">Nhập thông tin để tiện hỗ trợ</h5>
          </div>

          <div className="mb-3">
            <label className="form-label">Họ tên:</label>
            <input
              type="text"
              className={`form-control ${errors.fullname ? "is-invalid" : ""}`}
              {...register("fullname", {
                required: "Vui lòng nhập họ tên",
                pattern: {
                  value: /^[a-zA-ZÀ-ỹ0-9\s]+$/,
                  message: "Họ tên không được chứa kí tự đặc biệt",
                },
              })}
            />
            {errors.fullname && (
              <div className="invalid-feedback">{errors.fullname.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Số điện thoại:</label>
            <input
              type="text"
              className={`form-control ${errors.tel ? "is-invalid" : ""}`}
              {...register("tel", {
                required: "Vui lòng nhập số điện thoại",
                pattern: {
                  value: /^(0|\+84)(\d{9})$/,
                  message: "Số điện thoại không hợp lệ",
                },
              })}
            />
            {errors.tel && (
              <div className="invalid-feedback">{errors.tel.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Xưng hô:</label>
            <select
              className="form-select"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            >
              <option value="Anh">Anh</option>
              <option value="Chị">Chị</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Bắt đầu chat
          </button>
          <button
            type="button"
            className="btn btn-secondary mx-2"
            onClick={onCancel} // Xử lý sự kiện hủy
            disabled={loading}
          >
            Hủy
          </button>
        </form>
      )}
    </>
  );
};

export default UserInfoForm;
