import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/common/Navbar';
import Footer from './Components/common/Footer';
import ScrollToTop from './Components/common/ScrollToTop';
import RouteChangeLoader from './Components/common/RouteChangeLoader';

import Homepages from './Pages/Homepages';
import SignUpPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import KidsClothingShop from './Components/Shop/KidsClothingShop';
import ProductCollections from './Pages/ProductCollections';
import ProductDetailPage from './Components/common/ProductDetailPage';
import CartPage from './Pages/CartPage';
import CheckoutPage from './Pages/CheckoutPage';
import WishlistPage from './Pages/WishlistPage';
import UserProfileDashboard from './Pages/UserProfileDashboard';
import CompleteProfile from './Pages/CompleteProfile';
import ForgotPasswordPage from './Components/ForgotPasswordPage';
import ResetPasswordPage from './Pages/ResetPasswordPage';
import NotFoundPage from './Pages/NotFoundPage';
import CollectionPages from './Pages/CollectionPages';
import DenimCollectionPage from './Pages/DenimCollectionPage';
import MyOrders from './Pages/AccountManagement/MyOrders';
import EmailVerificationBanner from './Components/common/EmailVerificationBanner';

import ProtectedRoute from './Components/ProtectedRoute';

const App = () => {
  return (
    <div>
      <Router>
        <ScrollToTop />
        <RouteChangeLoader />
        <Navbar />
        <EmailVerificationBanner />
        <Routes>
          {/* Public Routes - All routes accessible without authentication */}
          <Route index element={<Homepages />} />
          <Route path='/clothing' element={<KidsClothingShop />} />
          <Route path='/collections/:category?' element={<ProductCollections />} />
          <Route path='/details/:productId' element={<ProductDetailPage />} />
          <Route path='/collection' element={<CollectionPages />} />
          <Route path='/Denim' element={<DenimCollectionPage />} />

          {/* Auth Pages - Always accessible */}
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* E-commerce Pages */}
          <Route path='/cart' element={<CartPage />} />

          {/* Protected Routes */}
          <Route
            path='/checkout'
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/wishlist'
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/order'
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='/complete-profile'
            element={
              <ProtectedRoute>
                <CompleteProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/*'
            element={
              <ProtectedRoute>
                <UserProfileDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Page */}
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;