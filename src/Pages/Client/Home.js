import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductHoatDong,
  fetchProductWithNewDate,
} from "../../Actions/ProductActions";
import { Link, useNavigate } from "react-router-dom";
import ImageGallery from "../../Components/Client/ImageGallery";
import unidecode from "unidecode";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add useNavigate hook
  const productState = useSelector((state) => state.product);
  console.log(productState, "pro1");

  useEffect(() => {
    dispatch(fetchProductWithNewDate());
  }, [dispatch]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const products = productState.product.slice(0, 8);
  console.log(productState, "pro2");
  // Function to create slug from product name
  const createSlug = (name) => {
    return unidecode(name)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  // Function to handle click and navigate to product detail page
  const handleProductClick = (name) => {
    const slug = createSlug(name);
    navigate(`/product-detail/${slug}.html`);
  };

  return (
    <div>
      <div className="container-fluid p-0 py-5 bg-hero ">
        <div className="container my-5 py-5">
          <div className="row align-items-center g-5 hero-header-1">
            <div className="col-lg-5 text-center text-lg-start">
              <h1 className="display-6 title-hero animated slideInLeft">
                Những món ăn ngon sẵn sàng phục vụ quý khách.
              </h1>
              <p className="text-white animated slideInLeft mb-4 pb-2 desc-hero">
                Khám phá hành trình ẩm thực châu Á đầy màu sắc. Với menu phong
                phú, từ những món ăn truyền thống đến những biến tấu mới lạ,
                chúng tôi mang đến cho thực khách những trải nghiệm ẩm thực độc
                đáo.
              </p>
              <Link
                to="/booking"
                className="btn btn-primary py-sm-3 px-sm-5 me-3 animated slideInLeft"
              >
                Đặt bàn ngay
              </Link>
            </div>
            <div className="col-lg-7 text-center text-lg-end">
              <div className="img-wrap">
                <img
                  className="main-img"
                  src={ImageGallery.mainImg}
                  alt="Hero"
                />
                <img
                  className="food-img"
                  src={ImageGallery.foodImg}
                  alt="Hero"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl service py-5 pt-5">
        <div className="container">
          <div className="row g-4">
            <div
              className="col-lg-3 col-sm-6 wow fadeInUp"
              data-wow-delay="0.1s"
            >
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-user-tie text-primary mb-4"></i>
                  <h5 className="title-service">
                    Đầu bếp nhiều năm kinh nghiệm
                  </h5>
                  <p className="desc-service">
                    Đầu bếp của chúng tôi với{" "}
                    <strong>hơn 5 năm kinh nghiệm</strong>, sẽ luôn mang đến cho
                    quý khách những món ăn hảo hạng và đậm chất Việt Nam.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-lg-3 col-sm-6 wow fadeInUp"
              data-wow-delay="0.3s"
            >
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-utensils text-primary mb-4"></i>
                  <h5 className="title-service">Nguyên liệu tươi ngon nhất</h5>
                  <p className="desc-service">
                    Mỗi món ăn tại nhà hàng đều được chế biến từ những{" "}
                    <strong>nguyên liệu tươi ngon nhất</strong> , đảm bảo hương
                    vị thơm ngon và chất lượng.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-lg-3 col-sm-6 wow fadeInUp"
              data-wow-delay="0.5s"
            >
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-chair text-primary mb-4"></i>
                  <h5 className="title-service">
                    Đặt bàn dễ dàng, nhanh chóng
                  </h5>
                  <p className="desc-service">
                    Đặt bàn <strong>dễ dàng chỉ với vài cú click</strong>. Món
                    ăn sẽ nhanh chóng được phục vụ khi khách hàng đến nơ
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-lg-3 col-sm-6 wow fadeInUp"
              data-wow-delay="0.7s"
            >
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-headset text-primary mb-4"></i>
                  <h5 className="title-service">
                    Phục vụ tận tình, xuyên suốt 24/7
                  </h5>
                  <p className="desc-service">
                    Chúng tôi luôn sẵn sàng phục vụ quý khách
                    <strong> 24/7</strong>. Liên hệ ngay để được tư vấn dịch vụ
                    nha hàng và đặt bàn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-lg-6 about-images">
                  <img
                    className="img-fluid rounded w-100 wow zoomIn"
                    data-wow-delay="0.1s"
                    src={ImageGallery.about1}
                  />
                </div>
                <div className="col-lg-6 about-images">
                  <img
                    className="img-fluid rounded w-75 wow zoomIn"
                    data-wow-delay="0.3s"
                    src={ImageGallery.about2}
                    style={{ marginBottom: "25%" }}
                  />
                </div>
                <div className="col-lg-6 about-images">
                  <img
                    className="img-fluid rounded w-75 wow zoomIn"
                    data-wow-delay="0.5s"
                    src={ImageGallery.about3}
                  />
                </div>
                <div className="col-lg-6 about-images">
                  <img
                    className="img-fluid rounded w-100 wow zoomIn"
                    data-wow-delay="0.7s"
                    src={ImageGallery.about4}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <h5 className="section-title ff-secondary text-start text-blue fw-normal title-service">
                Giới thiệu
              </h5>
              <h1 className="fw-bold mb-2 title ">CHÀO MỪNG ĐẾN VỚI</h1>
              <h1 className="ff-secondary text-primary d-flex align-items-center gap-2">
                {/* <img
                  src="../../Assets/Client/Images/huong-sen-logo.png"
                  width={50}
                  style={{ marginBottom: "20px" }}
                ></img>{" "} */}
                {/* <span className="ff-secondary fw-normal text-start  m-0  text-blue">
                  Hương Việt
                </span> */}
              </h1>
              <p className="mb-4 desc">
                Nhà hàng Hương Việt - Hương vị ẩm thực Việt Nam đích thực
              </p>
              <p className="mb-4 desc">
                Với hơn 5 năm kinh nghiệm trong lĩnh vực ẩm thực, Hương Việt tự
                hào mang đến cho thực khách những món ăn ngon, độc đáo và chất
                lượng. Đội ngũ đầu bếp tài năng của chúng tôi luôn không ngừng
                sáng tạo để mang đến những trải nghiệm ẩm thực mới lạ. Không
                gian nhà hàng ấm cúng, sang trọng, cùng với phong cách phục vụ
                chuyên nghiệp sẽ khiến quý khách hài lòng.
              </p>
              <div className="row g-4 mb-4">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center border-start border-5 border-blue px-3">
                    <h1
                      className="flex-shrink-0 display-5 text-primary mb-0 text-blue"
                      data-toggle="counter-up"
                    >
                      {">"}5
                    </h1>
                    <div className="ps-4">
                      <p className="mb-0">Năm</p>
                      <h6 className="text-uppercase mb-0 title-service">
                        Kinh Nghiệm
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center border-start border-5 border-blue px-3">
                    <h1
                      className="flex-shrink-0 display-5 text-primary mb-0 text-blue"
                      data-toggle="counter-up"
                    >
                      20
                    </h1>
                    <div className="ps-4">
                      <p className="mb-0">Đầu Bếp</p>
                      <h6 className="text-uppercase mb-0 title-service ">
                        Nhiều Năm Kinh Nghiệm
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <Link className="btn btn-primary py-3 px-5 mt-2" to="/about">
                Xem thêm tại đây
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h5 className="section-title ff-secondary text-center text-blue desc fw-normal">
              Nhà Hàng Hương Việt
            </h5>
            <h1 className="mb-5 title">Món ăn mới</h1>
          </div>
          <div
            className="tab-class text-center wow fadeInUp"
            data-wow-delay="0.1s"
          >
            <div className="tab-content">
              <div id="tab-1" className="tab-pane fade show p-0 active">
                <div className="row" style={{ rowGap: "20px" }}>
                  {products.map((product) => (
                    <div className="col-lg-6" key={product.id}>
                      <div
                        className="d-flex align-items-center"
                        onClick={() => handleProductClick(product.name)}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          className="flex-shrink-0 img-fluid rounded"
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                        />
                        {product.sale_price > 0 ? (
                          <div className="w-100 d-flex flex-column text-start ps-4">
                            <h5 className="d-flex justify-content-between border-bottom pb-2">
                              <span>{product.name}</span>
                              <span
                                className="text-primary"
                                style={{ fontSize: "1rem" }}
                              >
                                {formatPrice(
                                  product.price - product.sale_price,
                                )}
                              </span>
                            </h5>
                            <div className="d-flex justify-content-end">
                              <span
                                className="text-secondary text-decoration-line-through"
                                style={{ fontSize: "0.85rem" }}
                              >
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-100 d-flex flex-column text-start ps-4">
                            <h5 className="d-flex justify-content-between border-bottom pb-2">
                              <span>{product.name}</span>
                              <span
                                className="text-primary"
                                style={{ fontSize: "1rem" }}
                              >
                                {formatPrice(product.price)}
                              </span>
                            </h5>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
