// export const API_ENDPOINT = 'http://localhost:3307/api';
// export const API_ENDPOINT = 'http://localhost:6969/api';

export const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const API_DATA = {
  product: "/public/product",
  categoryProduct: "/public/category-product",
  users: "/users",
  checkPassword: "/users/check-password",
  authOGoogle: "/auth/google",
  authOFacebook: "/auth/facebook",
  login: "/auth/login",
  register: "/auth/register",
  forgotPassword: "/auth/forgot-password",
  changePassword: "/auth/change-password",
  reservations_client: "/reservations_t_admin",
  myBooking: "/myBooking",

  // New reservation workflow (hold → customer-info → items → payment)
  reservations: "/reservations",
  reservationsHold: "/reservations/hold",
  paymentsDeposit: "/public/payment/deposit",

  blog: "/public/blogs",
  contact: "/contact",
  promotion: "/public/promotion",
  applyPromotion: "/reservations", // POST .../reservations/:id/apply-promotion
  reservation_detail: "/public/reservation_detail",
  table: "/public/table",
  membership: "public/membership",
  membership_tiers: "public/membership_tiers",
  sendEmail: "/email/send",
};
