import './App.css';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import NotFound from './Components/404/NotFound';
import ClientLayout from './Layouts/Client/ClientLayout';
import ClientConfig from './Config/Client';
import { publicClientRoutes } from './Routes/Client';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from './Actions/AuthActions';
import Spinner from './Components/Client/Spinner';
import { useEffect, useState } from 'react';
import MyBookingDetail from './Pages/Client/MyBookingDetail';

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(checkAuthStatus());
      setIsChecking(false);
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isChecking, isAuthenticated, navigate, location]);

  if (isChecking) {
    return <Spinner />;
  }

  return isAuthenticated ? children : null;
}

function PublicRoute({ children }) {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(checkAuthStatus());
      setIsChecking(false);
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!isChecking && isAuthenticated) {
      navigate('/account');
    }
  }, [isChecking, isAuthenticated, navigate]);

  if (isChecking) {
    return <Spinner />;
  }

  return children;
}



function App() {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (loading) {
    return <div ><Spinner /></div>;
  }

  return (
       
            <Routes>
                 {/* Client Routes */}
                 <Route path="/" element={<ClientLayout />}>
                      {publicClientRoutes
                           .filter((route) => route.path.startsWith(ClientConfig.routes.home))
                           .map(({ path, component: Component }) => {
                                if (path === '/login') {
                                     return (
                                          <Route
                                               key={path}
                                               path={path}
                                               element={
                                                    <PublicRoute>
                                                         <Component />
                                                    </PublicRoute>
                                               }
                                          />
                                     );
                                } else if (path === '/account') {
                                     return (
                                          <Route
                                               key={path}
                                               path={path}
                                               element={
                                                    <ProtectedRoute>
                                                         <Component />
                                                    </ProtectedRoute>
                                               }
                                          />
                                     );
                                } else {
                                     return <Route key={path} path={path} element={<Component />} />;
                                }
                           })}
                 </Route>

                 <Route path="my-bookings/detail/:id" element={<MyBookingDetail />} />

                 {/* 404 Route */}
                 <Route path="*" element={<NotFound />} />
            </Routes>
      
  );
}

export default App;
