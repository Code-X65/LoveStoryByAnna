import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Firebase/AuthContext';
import Navbar from './Components/common/Navbar';
import Footer from './Components/common/Footer';
import ProtectedRoute from './Components/common/ProtectedRoute';
import PublicRoute from './Components/common/PublicRoute';
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
import ForgotPasswordPage from './Components/ForgotPasswordPage';
import NotFoundPage from './Pages/NotFoundPage';
import CollectionPages from './Pages/CollectionPages';
import DenimCollectionPage from './Pages/DenimCollectionPage';
import MyOrders from './Pages/AccountManagement/MyOrders';

const App = () => {
  return (
    <div>
      <Router basename='/LoveStoryByAnna'>
        <AuthProvider>
          <ScrollToTop />
          <RouteChangeLoader />
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route index element={<Homepages />} />
            <Route path='/clothing' element={<KidsClothingShop />} />
            <Route path='/collections/:category?' element={<ProductCollections />} />
            <Route path='/details/:productId' element={<ProductDetailPage />} />
            <Route path='/collect' element={<CollectionPages />} />
            <Route path='/Denim' element={<DenimCollectionPage />} />


            <Route path='*' element={<NotFoundPage />} />

            
            {/* Auth Routes - Only accessible when NOT logged in */}
            <Route 
              path='/signup' 
              element={
                <PublicRoute>
                  <SignUpPage />
                </PublicRoute>
              } 
            />
            <Route 
              path='/login' 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Protected Routes - Only accessible when logged in */}
            <Route 
              path='/cart' 
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } 
            />
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
              path='/profile/*' 
              element={
                <ProtectedRoute>
                  <UserProfileDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;