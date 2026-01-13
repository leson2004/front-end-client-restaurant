import React from 'react'

export default function Service() {
  return (
    <div>
      <div className="container-fluid py-5 bg-dark hero-header mb-5">
        <div className="container text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">Dịch vụ</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
              <li className="breadcrumb-item"><a href="/">Trang chủ</a></li>
              <li className="breadcrumb-item text-white active" aria-current="page">Dịch vụ</li>
            </ol>
          </nav>
        </div>
      </div>
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h5 className="section-title ff-secondary text-center text-primary fw-normal">Dịch vụ của chúng tôi</h5>
            <h1 className="mb-5">Khám phá các dịch vụ của chúng tôi</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-user-tie text-primary mb-4"></i>
                  <h5>Đầu bếp hàng đầu</h5>
                  <p>Đội ngũ đầu bếp của chúng tôi là những chuyên gia giàu kinh nghiệm, mang đến những món ăn độc đáo và hấp dẫn.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-utensils text-primary mb-4"></i>
                  <h5>Thức ăn chất lượng</h5>
                  <p>Chúng tôi sử dụng nguyên liệu tươi ngon nhất để đảm bảo mỗi món ăn đều đạt chuẩn chất lượng cao nhất.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i class="fa fa-3x fa-solid fa-chair text-primary mb-4"></i>
                  <h5>Đặt bàn trực tuyến</h5>
                  <p>Dễ dàng đặt món ăn yêu thích của bạn thông qua hệ thống trực tuyến của chúng tôi, nhanh chóng và tiện lợi.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-headset text-primary mb-4"></i>
                  <h5>Dịch vụ 24/7</h5>
                  <p>Chúng tôi luôn sẵn sàng phục vụ bạn mọi lúc, mọi nơi, với dịch vụ khách hàng 24/7. Hỗ trợ chat trực tuyến với nhà hàng.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-shield-alt text-primary mb-4"></i>
                  <h5>An toàn và bảo mật</h5>
                  <p>Chúng tôi cam kết cung cấp các dịch vụ an toàn và bảo mật, đảm bảo thông tin cá nhân của bạn được bảo vệ tốt nhất.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-truck text-primary mb-4"></i>
                  <h5>Giao hàng nhanh chóng</h5>
                  <p>Dịch vụ giao hàng của chúng tôi đảm bảo rằng bạn nhận được sản phẩm của mình một cách nhanh chóng và đúng thời gian.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-hands-helping text-primary mb-4"></i>
                  <h5>Hỗ trợ tận tình</h5>
                  <p>Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn với bất kỳ câu hỏi hay vấn đề nào bạn gặp phải.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-gem text-primary mb-4"></i>
                  <h5>Dịch vụ cao cấp</h5>
                  <p>Chúng tôi cung cấp các dịch vụ cao cấp với chất lượng vượt trội, mang đến trải nghiệm tốt nhất cho khách hàng.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
