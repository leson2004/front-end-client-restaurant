import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetailBySlug } from "../../Actions/ProductDetailActions";
import { fetchProduct } from "../../Actions/ProductActions";
import { useParams, useNavigate } from "react-router-dom";
import unidecode from "unidecode";
import Spinner from "../../Components/Client/Spinner";

const DetailProduct = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productDetailState = useSelector((state) => state.product_detail);
  const productState = useSelector((state) => state.product);
  
  const prevScrollY = useRef(0); // To store the previous scroll position
  
  useEffect(() => {
    dispatch(fetchProductDetailBySlug(slug));
    dispatch(fetchProduct());
    prevScrollY.current = window.scrollY; // Save the current scroll position
  }, [dispatch, slug]);

  useEffect(() => {
    window.scrollTo(0, prevScrollY.current); // Restore the previous scroll position
  }, [slug]); // When slug changes, scroll to the previous position

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

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
    navigate(`/product-detail/${slug}.html`, { replace: true });
  };

  const relatedProducts = productState.product.filter(
    (product) =>
      product.categories_id ===
        productDetailState.productDetail?.categories_id &&
      product.id !== productDetailState.productDetail?.id &&
      product.status === 1
  );

  const featuredProducts = productState.product
    .filter((product) => product.status === 1)
    .sort(() => Math.random() - 0.5);

  const randomFeaturedProducts = featuredProducts.slice(0, 4);

  if (productDetailState.loading) {
    return <Spinner />; // Hiển thị spinner nếu đang tải dữ liệu
  }

  return (
    <>
      <div className="container-fluid py-5 bg-dark hero-header mb-5">
        <div className="container text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">
            Chi Tiết Sản Phẩm
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
              <li className="breadcrumb-item">
                <a href="/">Trang chủ</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/menu">Thực đơn</a>
              </li>
              <li
                className="breadcrumb-item text-white active"
                aria-current="page"
              >
                Chi Tiết Sản Phẩm
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-fluid py-5 mt-5">
        <div className="container py-5">
          <div className="product-detail-box row g-4 mb-5">
            <div className="col-lg-8 col-xl-9">
              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="product-image">
                    <img
                      src={productDetailState.productDetail?.image}
                      className="img-fluid rounded"
                      alt={productDetailState.productDetail?.name}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="product-info">
                    <h4 className="product-title">
                      {productDetailState.productDetail?.name}
                    </h4>
                    <h5 className="product-price">
                      {formatPrice(
                        productDetailState.productDetail?.price - 
                          (productDetailState.productDetail?.sale_price || 0)
                      )}
                    </h5>
                    {productDetailState.productDetail?.sale_price > 0 && (
                      <p className="text-danger text-decoration-line-through">
                        {formatPrice(productDetailState.productDetail?.price)}
                      </p>
                    )}
                    <a href="/booking"><button className="btn-book-table">Đặt bàn ngay</button>
</a>
                  </div>
                </div>
                <div className="col-lg-12">
                  <nav>
                    <div className="nav nav-tabs mb-3">
                      <button
                        className="nav-link active border-white border-bottom-0"
                        type="button"
                        role="tab"
                        id="nav-about-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-about"
                        aria-controls="nav-about"
                        aria-selected="true"
                      >
                        Mô tả
                      </button>
                    </div>
                  </nav>
                  <div className="tab-content mb-5">
                    <div
                      className="tab-pane active"
                      id="nav-about"
                      role="tabpanel"
                      aria-labelledby="nav-about-tab"
                    >
                      <p>{productDetailState.productDetail?.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-xl-3">
              <div className="row g-4">
                <div className="col-lg-12">
                  <h4 className="mb-4">Sản phẩm nổi bật</h4>
                  {randomFeaturedProducts.map((product) => (
                    <div
                      className="d-flex align-items-center justify-content-start mb-4"
                      key={product.id}
                      onClick={() => handleProductClick(product.name)}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="rounded"
                        style={{ width: "100px", height: "100px" }}
                      >
                        <img
                          src={product.image}
                          className="img-fluid rounded"
                          alt={product.name}
                        />
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-2">{product.name}</h6>
                        <div className="d-flex mb-2">
                          <h5 className="fw-bold me-2">
                            {formatPrice(
                              product.price - (product.sale_price || 0)
                            )}
                          </h5>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="d-flex justify-content-center my-4">
                    <a
                      href="/menu"
                      className="btn border border-secondary px-4 py-3 rounded-pill text-primary w-100"
                    >
                      Xem thêm
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h1 className="fw-bold mb-4">Sản phẩm liên quan</h1>
          <div className="related-products">
            {relatedProducts.map((product) => (
              <div
                className="related-product-item"
                key={product.id}
                onClick={() => handleProductClick(product.name)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={product.image}
                  className="img-fluid rounded-top"
                  alt={product.name}
                />
                <div className="p-3">
                  <h4>{product.name}</h4>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="text-dark fs-5 fw-bold">
                      {formatPrice(product.price - (product.sale_price || 0))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailProduct;
