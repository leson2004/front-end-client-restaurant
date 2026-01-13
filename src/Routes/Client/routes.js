import ClientConfig from '../../Config/Client';

import Home from '../../Pages/Client/Home';
import About from '../../Pages/Client/About';
import Login from '../../Pages/Client/Authenticator/Login';
import Register from '../../Pages/Client/Authenticator/Register';
import ForgotPassword from '../../Pages/Client/Authenticator/ForgotPassword';
import ChangePassword from '../../Pages/Client/Authenticator/ChangePassword';
import Contact from '../../Pages/Client/Contact';
import Menu from '../../Pages/Client/Menu';
import Service from '../../Pages/Client/Service'
import Booking from '../../Pages/Client/Booking';
import DetailProduct from '../../Pages/Client/DetailProduct';
import Account from '../../Pages/Client/Account';
import Blog from '../../Pages/Client/Blog';
import DetailBlog from '../../Pages/Client/DetailBlog';
import Order from '../../Pages/Client/Order';
import Pay from '../../Pages/Client/pay';
import Confirm from '../../Pages/Client/ConfirmPay';
import Policy from '../../Pages/Client/Policy';
import ReservationGuide from '../../Pages/Client/ReservationGuide';
import MyBooking from '../../Pages/Client/My-bookings';

// Public routes
const publicClientRoutes = [
    // *Client routes
    { path: ClientConfig.routes.home, component: Home },
    { path: ClientConfig.routes.about, component: About },
    { path: ClientConfig.routes.login, component: Login },
    { path: ClientConfig.routes.register, component: Register },
    { path: ClientConfig.routes.forgotPassword, component: ForgotPassword },
    { path: ClientConfig.routes.changePassword, component: ChangePassword },
    { path: ClientConfig.routes.contact, component: Contact },
    { path: ClientConfig.routes.menu, component: Menu },
    { path: ClientConfig.routes.service, component: Service },
    { path: ClientConfig.routes.booking, component: Booking },
    { path: ClientConfig.routes.detailproduct, component: DetailProduct },
    { path: ClientConfig.routes.account, component: Account },
    { path: ClientConfig.routes.blog, component: Blog },
    { path: ClientConfig.routes.detailblog, component: DetailBlog },
    { path: ClientConfig.routes.order, component: Order },
    { path: ClientConfig.routes.pay, component: Pay },
    { path: ClientConfig.routes.confirm, component: Confirm },
    { path: ClientConfig.routes.policy, component: Policy },
    { path: ClientConfig.routes.reservationGuide, component: ReservationGuide },
    { path: ClientConfig.routes.myBookings, component: MyBooking },
];


export { publicClientRoutes };
