import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu } from "../../Actions/ProductActions";
import { fetchListProductCategory } from "../../Actions/ProductCategoryActions";
import { DangerAlert } from "../../Components/Alert/Alert";

export default function Order() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.product);
  const productCategoryState = useSelector((state) => state.product_category);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    fullname: "",
    email: "",
    tel: "",
    reservation_date: "",
    party_size: "",
    note: "",
    status: 1,
  });

  const [selectedProducts, setSelectedProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    dispatch(fetchMenu());
    dispatch(fetchListProductCategory());

    const savedData = localStorage.getItem("customerInfo");
    if (savedData) {
      setCustomerInfo(JSON.parse(savedData));
    }

    const savedProducts = localStorage.getItem("selectedProducts");
    if (savedProducts) {
      setSelectedProducts(JSON.parse(savedProducts));
    }
  }, [dispatch]);

  const handleProductChange = (productId, price, sale_price, image, name) => {
    setSelectedProducts((prev) => {
      const newSelection = { ...prev };
      if (newSelection[productId]) {
        delete newSelection[productId];
      } else {
        const finalPrice = sale_price ? price - sale_price : price;
        newSelection[productId] = {
          id: productId,
          price: parseFloat(finalPrice),
          quantity: 1,
          image: image,
          name: name,
        };
      }
      localStorage.setItem("selectedProducts", JSON.stringify(newSelection));
      return newSelection;
    });
  };
  
  const handleQuantityChange = (
    productId,
    change,
    price,
    sale_price,
    image,
    name
  ) => {
    setSelectedProducts((prev) => {
      const currentProduct = prev[productId] || { quantity: 0 };
      const newQuantity = Math.max(currentProduct.quantity + change, 0);
  
      if (newQuantity > 0) {
        const finalPrice = sale_price ? price - sale_price : price;
        const newSelection = {
          ...prev,
          [productId]: {
            id: productId,
            price: parseFloat(finalPrice),
            quantity: newQuantity,
            image: image,
            name: name,
          },
        };
        localStorage.setItem("selectedProducts", JSON.stringify(newSelection));
        return newSelection;
      } else {
        const newSelection = { ...prev };
        delete newSelection[productId];
        localStorage.setItem("selectedProducts", JSON.stringify(newSelection));
        return newSelection;
      }
    });
  };
  

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleNext = () => {
    const filteredProducts = Object.entries(selectedProducts).reduce(
      (acc, [id, product]) => {
        if (product.quantity > 0) {
          acc[id] = { ...product };
        }
        return acc;
      },
      {}
    );

    if (Object.keys(filteredProducts).length === 0) {
      setSnackbarMessage("Vui lòng chọn ít nhất một sản phẩm.");
      setOpenSnackbar(true);
      return;
    }

    localStorage.setItem("selectedProducts", JSON.stringify(filteredProducts));
    navigate("/pay");
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const formatTime = (datetime) => {
    return new Date(datetime).toLocaleString("VN-vi");
  };

  const calculateTotalPrice = () => {
    return Object.values(selectedProducts).reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const productsInCategorySelected = selectedCategory
    ? products.filter((product) => product.categories_id === selectedCategory)
    : products;

  return (
    <div>
      <div className="container-fluid p-0 py-5 bg-dark hero-header mb-5">
        <div className="container text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">
            Đặt bàn online
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
              <li className="breadcrumb-item">
                <a href="#">Trang chủ</a>
              </li>
              <li
                className="breadcrumb-item text-white active"
                aria-current="page"
              >
                Đặt bàn
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-xxl py-5 px-0">
        <div className="row g-0">
          <div className="col-lg-4 col-md-6 bg-warning p-5">
            <div className="text-center mb-4">
              <h1 className="text-white section-title ff-secondary">
                Thông tin đặt bàn
              </h1>
            </div>
            <p className="mb-4 mt-4 text-dark text-start">
              <strong>Họ tên:</strong> {customerInfo.fullname}
            </p>
            <p className="mb-4 text-dark text-start">
              <strong>Email:</strong> {customerInfo.email}
            </p>
            <p className="mb-4 text-dark text-start">
              <strong>Số điện thoại:</strong> {customerInfo.tel}
            </p>
            <p className="mb-4 text-dark text-start">
              <strong>Thời gian đặt bàn:</strong>{" "}
              {formatTime(customerInfo.reservation_date)}
            </p>
            <p className="mb-4 text-dark text-start">
              <strong>Số người:</strong> {customerInfo.party_size} người
            </p>
            <p className="mb-4 text-dark text-start">
              <strong>Ghi chú:</strong> {customerInfo.note}
            </p>
          </div>

          <div className="col-lg-8 col-md-6 bg-light p-5">
            <ul className="nav nav-tabs">
              <li
                className="nav-item"
                onClick={() => setSelectedCategory(null)}
              >
                <a
                  className={`nav-link ${
                    selectedCategory === null ? "active" : ""
                  }`}
                >
                  Tất cả
                </a>
              </li>
              {productCategoryState.product_category
                .filter(
                  (category) =>
                    category.name !== "Chưa phân loại" &&
                    products.some(
                      (product) => product.categories_id === category.id
                    )
                )
                .map((category) => (
                  <li
                    className="nav-item"
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <a
                      className={`nav-link ${
                        selectedCategory === category.id ? "active" : ""
                      }`}
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
            </ul>

            <div className="col-md-12 bg-light p-4">
              <form>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                <div className="scrollable-list">
                  {productsInCategorySelected.map((product) => (
                    <div
                      className="menu-item d-flex justify-content-between align-items-center mb-3"
                      key={product.id}
                    >
                      <div className="d-flex align-items-center flex-grow-1">
                        <img
                          src={product.image}
                          style={{ width: "50px" }}
                          alt={product.name}
                          className="img-fluid me-3"
                        />
                        <div className="flex-grow-1">
                          <label
                            htmlFor={`product-${product.id}`}
                            className="mb-0"
                          >
                            {product.name}
                          </label>
                          <p className="text-primary mb-0">
                            {formatPrice(product.price - product.sale_price)}
                          </p>
                        </div>
                      </div>
                      <div className="quantity-control d-flex align-items-center">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            handleQuantityChange(
                              product.id,
                              -1,
                              product.price,
                              product.sale_price,
                              product.image,
                              product.name
                            )
                          }
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={selectedProducts[product.id]?.quantity || 0}
                          className="form-control text-center mx-2"
                          style={{ width: "50px" }}
                          readOnly
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            handleQuantityChange(
                              product.id,
                              1,
                              product.price,
                              product.sale_price,
                              product.image,
                              product.name
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </form>

              {/* Display the list of selected products */}
              <div className="selected-products mt-4">
                <h4 className="text-center mb-3">Danh sách món đã chọn</h4>
                {Object.keys(selectedProducts).length === 0 ? (
                  <p className="text-center text-muted">
                    Chưa có món nào được chọn.
                  </p>
                ) : (
                  <div className="scrollable-list">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th scope="col">Món ăn</th>
                          <th scope="col">Số lượng</th>
                          <th scope="col">Giá</th>
                          <th scope="col">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(selectedProducts)
                          .slice(0, 5)
                          .map(([productId, product]) => (
                            <tr key={productId}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img
                                    src={product.image}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      objectFit: "cover",
                                    }}
                                    alt={product.name}
                                    className="me-2"
                                  />
                                  {product.name}
                                </div>
                              </td>
                              <td>{product.quantity}</td>
                              <td>{formatPrice(product.price)}</td>
                              <td>
                                {formatPrice(product.price * product.quantity)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="text-end text-warning mt-4 ">
                <strong>Tổng tiền: {formatPrice(calculateTotalPrice())}</strong>
              </div>

              <hr />

              <div className="text-end">
                <NavLink to="/booking" className="btn btn-secondary me-2">
                  Trở lại
                </NavLink>
                <NavLink
                  to="/pay"
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNext();
                  }}
                >
                  Tiếp theo
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DangerAlert
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </div>
  );
}
