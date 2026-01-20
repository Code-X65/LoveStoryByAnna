import React, { useState, useEffect } from 'react';
import { CreditCard, Truck, MapPin, Phone, Mail, User, Lock, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../Context/AuthContextCore';
import { useCart } from '../Context/CartContext';
import { useToast } from '../Context/ToastContext';
import { createOrder, updateOrderPaymentStatus } from '../firebase/orderServices';
import { getUserAddresses, addAddress } from '../firebase/addressServices';
import { calculateShippingCost, getRegionLabel } from '../firebase/shippingServices';
import { verifyPaystackTransaction, generatePaystackReference } from '../services/paystackService';
import { sendOTPEmail, sendCODConfirmationEmail } from '../services/emailService';
import { PaystackButton } from 'react-paystack';
import { Link, useNavigate } from 'react-router-dom';
import StateAndCitySelector from '../Components/StateAndCitySelector';
import InlineLoader from '../Components/common/InlineLoader';

const CheckoutPage = () => {
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [step, setStep] = useState(1);
  const [orderNumber, setOrderNumber] = useState('');
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { currentUser } = useAuth();
  const { cartItems, clearCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [loadingCart, setLoadingCart] = useState(false);
  const [orderOtp, setOrderOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveInfo: false,
    newsletter: false,
    shippingMethod: 'standard',
    paymentMethod: 'card',
    termsAccepted: false
  });

  // Remove mock data

  const populateFormWithAddress = (address) => {
    setFormData({
      ...formData,
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      email: address.email || '',
      phone: address.phone,
      address: address.addressLine || address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode || ''
    });
  };

  const generateOrderNumber = () => {
    return `LS${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  /**
   * Finalize order after successful payment (Card/Bank) or directly for COD
   */
  const finalizeOrder = async (paymentRef = null, verifiedPaymentData = null) => {
    setLoadingCart(true);

    try {
      const orderNum = generateOrderNumber();
      const currentSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const currentShippingCost = calculateShippingCost(formData.state);
      const currentTax = currentSubtotal * 0.075;
      const currentTotal = currentSubtotal + currentShippingCost + currentTax;

      // Save new address if requested
      if (useNewAddress && formData.saveInfo && currentUser) {
        await addAddress(currentUser.uid, {
          label: 'Default',
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          addressLine: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          isDefault: savedAddresses.length === 0
        });
      }

      // Determine if OTP should be generated (Card/Bank = true, COD = false)
      const requiresOTP = formData.paymentMethod === 'card' || formData.paymentMethod === 'bank';

      const orderData = {
        orderNumber: orderNum,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode
        },
        items: cartItems,
        subtotal: currentSubtotal,
        total: currentTotal,
        shippingCost: currentShippingCost,
        tax: currentTax,
        paymentMethod: formData.paymentMethod,
        paymentStatus: paymentRef ? 'paid' : 'pending',
        paymentReference: paymentRef || '',
        generateOTPCode: requiresOTP
      };

      if (currentUser) {
        const result = await createOrder(currentUser.uid, orderData);

        if (result.success) {
          // Send appropriate email based on payment method
          if (requiresOTP && result.otp) {
            // Send OTP email for Card/Bank payments
            const emailResult = await sendOTPEmail({
              toEmail: formData.email,
              customerName: `${formData.firstName} ${formData.lastName}`,
              orderNumber: orderNum,
              otp: result.otp,
              orderTotal: currentTotal
            });

            if (emailResult.success) {
              console.log('✅ OTP email sent successfully');
              setOrderOtp(result.otp); // Store for display in success modal
            } else {
              console.error('❌ Failed to send OTP email:', emailResult.error);
              toast.warning('Order created but email failed to send. Please contact support.');
            }
          } else {
            // Send COD confirmation email
            const emailResult = await sendCODConfirmationEmail({
              toEmail: formData.email,
              customerName: `${formData.firstName} ${formData.lastName}`,
              orderNumber: orderNum,
              orderTotal: currentTotal,
              shippingAddress: orderData.shippingAddress
            });

            if (emailResult.success) {
              console.log('✅ COD confirmation email sent successfully');
            } else {
              console.error('❌ Failed to send COD email:', emailResult.error);
              toast.warning('Order created but email failed to send. Please contact support.');
            }
          }

          await clearCart();
          setOrderNumber(orderNum);
          setOrderPlaced(true);
          setShowOrderStatus(true);
          toast.success('Order placed successfully!');
        } else {
          throw new Error(result.error || 'Failed to create order');
        }
      } else {
        toast.error('Please login to place order');
        navigate('/login', { state: { from: { pathname: '/checkout' } } });
      }
    } catch (error) {
      console.error('❌ Error processing order:', error);
      toast.error('An error occurred: ' + error.message);
    } finally {
      setLoadingCart(false);
    }
  };

  /**
   * Handle order placement for COD (non-Paystack payments)
   */
  const handlePlaceOrder = async () => {
    if (!formData.termsAccepted) {
      toast.warning('Please accept the terms and conditions');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // For COD, proceed directly without payment
    if (formData.paymentMethod === 'cod') {
      await finalizeOrder();
    } else {
      // For card/bank, Paystack button handles the flow
      toast.info('Please complete payment via the secure gateway');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = calculateShippingCost(formData.state);
  const tax = subtotal * 0.075;
  const total = subtotal + shippingCost + tax;

  // Validate Paystack configuration
  const isPaystackConfigValid = () => {
    return (
      formData.email &&
      formData.email.includes('@') &&
      total > 0 &&
      PAYSTACK_PUBLIC_KEY
    );
  };

  const orderNum = generateOrderNumber();
  const paystackReference = generatePaystackReference(orderNum);

  const paystackConfig = {
    reference: paystackReference,
    email: formData.email || 'placeholder@example.com',
    amount: Math.round(total * 100),
    publicKey: PAYSTACK_PUBLIC_KEY || '',
    metadata: {
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      orderNumber: orderNum,
      userId: currentUser?.uid
    },
    channels: formData.paymentMethod === 'bank'
      ? ['bank', 'bank_transfer']
      : ['card']
  };

  /**
   * Handle successful Paystack payment
   * IMPORTANT: Always verify payment server-side before creating order
   */
  const handlePaystackSuccessAction = async (reference) => {
    setLoadingCart(true);

    try {
      console.log('🔄 Verifying payment...', reference.reference);

      // Verify payment with Paystack API (server-side verification)
      const verificationResult = await verifyPaystackTransaction(reference.reference);

      if (verificationResult.success) {
        console.log('✅ Payment verified successfully');
        toast.success('Payment verified successfully!');

        // Create order with verified payment
        await finalizeOrder(reference.reference, verificationResult.data);
      } else {
        console.error('❌ Payment verification failed:', verificationResult.error);
        toast.error('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('❌ Error verifying payment:', error);
      toast.error('An error occurred while verifying payment.');
    } finally {
      setLoadingCart(false);
    }
  };

  const handlePaystackCloseAction = () => {
    toast.info('Payment cancelled');
  };

  const componentProps = {
    ...paystackConfig,
    text: `Pay ₦${total.toLocaleString()}`,
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  const handleContinue = () => {
    if (step === 1) {
      // Validate address is selected or new address is filled
      if (!useNewAddress && !selectedAddressId && savedAddresses.length > 0) {
        toast.warning('Please select a delivery address');
        return;
      }

      if (useNewAddress || savedAddresses.length === 0) {
        if (!formData.firstName || !formData.lastName || !formData.email ||
          !formData.phone || !formData.address || !formData.city || !formData.state) {
          toast.warning('Please fill in all required fields');
          return;
        }
      }
    }

    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
    "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
  ];

  useEffect(() => {
    // Load saved addresses
    if (currentUser) {
      setLoadingCart(true);
      getUserAddresses(currentUser.uid).then(addrs => {
        // Map db columns to form fields (using consolidated camelCase fields)
        const mapped = addrs.map(a => ({
          id: a.id,
          label: a.label || 'Saved Address',
          firstName: a.firstName,
          lastName: a.lastName,
          name: `${a.firstName || ''} ${a.lastName || ''}`,
          email: a.email,
          address: a.addressLine || a.address,
          city: a.city,
          state: a.state,
          phone: a.phone,
          zipCode: a.zipCode,
          isDefault: a.isDefault
        }));
        setSavedAddresses(mapped);
        setLoadingCart(false);

        const defaultAddress = mapped.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          populateFormWithAddress(defaultAddress);
        }
      });
    }
  }, [currentUser]);

  if (loadingCart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <InlineLoader size="lg" text="Loading checkout..." />
      </div>
    );
  }

  // Check for empty cart
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <ShoppingBag className="mx-auto text-gray-300 mb-4" size={80} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items before checking out</p>
          <Link
            to="/collections"
            className="inline-block bg-pink-300 text-white px-8 py-3 font-semibold hover:bg-pink-400 transition-colors rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          Home / Cart / <span className="text-pink-300">Checkout</span>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= stepNum
                      ? 'bg-pink-300 text-white'
                      : 'bg-gray-200 text-gray-500'
                      }`}
                  >
                    {stepNum}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium hidden sm:inline ${step >= stepNum ? 'text-pink-300' : 'text-gray-500'
                      }`}
                  >
                    {stepNum === 1 ? 'Shipping' : stepNum === 2 ? 'Payment' : 'Review'}
                  </span>
                </div>
                {stepNum < 3 && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-2 ${step > stepNum ? 'bg-pink-300' : 'bg-gray-200'
                      }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 p-6">

              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Truck className="text-pink-300" size={24} />
                    <h2 className="text-2xl font-semibold text-gray-900">Shipping Information</h2>
                  </div>

                  {/* Saved Addresses Section */}
                  {savedAddresses.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Delivery Address</h3>
                      <div className="space-y-3 mb-4">
                        {savedAddresses.map((address) => (
                          <label
                            key={address.id}
                            className={`flex items-start p-4 border-2 cursor-pointer transition-colors ${selectedAddressId === address.id && !useNewAddress
                              ? 'border-pink-300 bg-pink-50'
                              : 'border-gray-300 hover:border-pink-300'
                              }`}
                          >
                            <input
                              type="radio"
                              name="savedAddress"
                              checked={selectedAddressId === address.id && !useNewAddress}
                              onChange={() => {
                                setSelectedAddressId(address.id);
                                setUseNewAddress(false);
                                populateFormWithAddress(address);
                              }}
                              className="mt-1 text-pink-300 focus:ring-pink-300"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">{address.label}</span>
                                {address.isDefault && (
                                  <span className="px-2 py-0.5 bg-pink-300 text-white text-xs font-medium">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-900 font-medium">{address.name}</p>
                              <p className="text-sm text-gray-600">{address.address}</p>
                              <p className="text-sm text-gray-600">{address.city}, {address.state}</p>
                              <p className="text-sm text-gray-600">{address.phone}</p>
                            </div>
                          </label>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setUseNewAddress(true);
                          setSelectedAddressId(null);
                          setFormData({
                            ...formData,
                            firstName: '',
                            lastName: '',
                            phone: '',
                            address: '',
                            city: '',
                            state: '',
                            zipCode: ''
                          });
                        }}
                        className={`w-full py-3 border-2 font-medium transition-colors ${useNewAddress
                          ? 'border-pink-300 bg-pink-50 text-pink-400'
                          : 'border-gray-300 text-gray-700 hover:border-pink-300'
                          }`}
                      >
                        + Use a different address
                      </button>
                    </div>
                  )}

                  <div className={savedAddresses.length > 0 && !useNewAddress ? 'hidden' : ''}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {savedAddresses.length > 0 ? 'New Delivery Address' : 'Delivery Information'}
                    </h3>

                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows="2"
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
                          />
                        </div>
                      </div>

                      {/* State and City Selector */}
                      <StateAndCitySelector
                        selectedState={formData.state}
                        selectedCity={formData.city}
                        onStateChange={(value) => setFormData({ ...formData, state: value })}
                        onCityChange={(value) => setFormData({ ...formData, city: value })}
                        required={true}
                      />

                      {/* Zip Code */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
                        />
                      </div>

                      {/* Shipping Method */}
                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Method</h3>
                        <div className="space-y-3">
                          <label className="flex items-center p-4 border-2 border-gray-300 cursor-pointer hover:border-pink-300 transition-colors">
                            <input
                              type="radio"
                              name="shippingMethod"
                              value="standard"
                              checked={formData.shippingMethod === 'standard'}
                              onChange={handleInputChange}
                              className="text-pink-300 focus:ring-pink-300"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-900">Standard Delivery</span>
                                <span className="font-semibold text-gray-900">₦2,500</span>
                              </div>
                              <p className="text-sm text-gray-500">5-7 business days</p>
                            </div>
                          </label>
                          <label className="flex items-center p-4 border-2 border-gray-300 cursor-pointer hover:border-pink-300 transition-colors">
                            <input
                              type="radio"
                              name="shippingMethod"
                              value="express"
                              checked={formData.shippingMethod === 'express'}
                              onChange={handleInputChange}
                              className="text-pink-300 focus:ring-pink-300"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-900">Express Delivery</span>
                                <span className="font-semibold text-gray-900">₦5,000</span>
                              </div>
                              <p className="text-sm text-gray-500">2-3 business days</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4">
                        <input
                          type="checkbox"
                          name="saveInfo"
                          checked={formData.saveInfo}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-pink-300 border-gray-300 focus:ring-pink-300"
                        />
                        <label className="text-sm text-gray-700">
                          Save this information for next time
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {step === 2 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="text-pink-300" size={24} />
                    <h2 className="text-2xl font-semibold text-gray-900">Payment Information</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Payment Method */}
                    <div className="space-y-3 mb-6">
                      <label className="flex items-center p-4 border-2 border-gray-300 cursor-pointer hover:border-pink-300 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          className="text-pink-300 focus:ring-pink-300"
                        />
                        <div className="ml-3">
                          <span className="font-medium text-gray-900">Credit/Debit Card</span>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border-2 border-gray-300 cursor-pointer hover:border-pink-300 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank"
                          checked={formData.paymentMethod === 'bank'}
                          onChange={handleInputChange}
                          className="text-pink-300 focus:ring-pink-300"
                        />
                        <div className="ml-3">
                          <span className="font-medium text-gray-900">Bank Transfer</span>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border-2 border-gray-300 cursor-pointer hover:border-pink-300 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleInputChange}
                          className="text-pink-300 focus:ring-pink-300"
                        />
                        <div className="ml-3">
                          <span className="font-medium text-gray-900">Cash on Delivery</span>
                        </div>
                      </label>
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number *
                          </label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                              type="text"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              placeholder="1234 5678 9012 3456"
                              maxLength="19"
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                              maxLength="5"
                              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV *
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              <input
                                type="text"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                placeholder="123"
                                maxLength="4"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {formData.paymentMethod === 'bank' && (
                      <div className="bg-blue-50 border border-blue-200 p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Bank Transfer Details</h4>
                        <p className="text-sm text-gray-700 mb-2">Please transfer to:</p>
                        <div className="space-y-1 text-sm">
                          <p><strong>Bank:</strong> First Bank of Nigeria</p>
                          <p><strong>Account Name:</strong> Love Story By Anna</p>
                          <p><strong>Account Number:</strong> 1234567890</p>
                          <p className="text-pink-300 font-medium mt-2">Amount: ₦{total.toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    {formData.paymentMethod === 'cod' && (
                      <div className="bg-green-50 border border-green-200 p-4">
                        <p className="text-sm text-gray-700">
                          Pay with cash when your order is delivered. Please have exact change ready.
                        </p>
                      </div>
                    )}

                    <div className="bg-gray-50 border border-gray-200 p-4 mt-4">
                      <p className="text-xs text-gray-600 flex items-center gap-2">
                        <Lock size={14} className="text-green-600" />
                        Your payment information is secure and encrypted
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Review Your Order</h2>

                  {/* Shipping Info */}
                  <div className="mb-6 p-4 bg-gray-50 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                    <p className="text-sm text-gray-700">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.state} {formData.zipCode}<br />
                      {formData.email}<br />
                      {formData.phone}
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm text-pink-300 hover:text-pink-400 mt-2"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Payment Info */}
                  <div className="mb-6 p-4 bg-gray-50 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                    <p className="text-sm text-gray-700">
                      {formData.paymentMethod === 'card' ? 'Credit/Debit Card' :
                        formData.paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash on Delivery'}
                    </p>
                    <button
                      onClick={() => setStep(2)}
                      className="text-sm text-pink-300 hover:text-pink-400 mt-2"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {cartItems.map((item, index) => (
                        <div key={`review-${item.id}-${item.size || 'default'}-${item.color || 'default'}-${index}`} className="flex gap-4 p-3 border border-gray-200">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-24 object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                            <p className="text-xs text-gray-600">Size: {item.size}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              ₦{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-2 mb-4">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-pink-300 border-gray-300 focus:ring-pink-300 mt-1"
                    />
                    <label className="text-sm text-gray-700">
                      I agree to the <a href="#" className="text-pink-300 hover:underline">Terms & Conditions</a> and <a href="#" className="text-pink-300 hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => step > 1 && setStep(step - 1)}
                  className={`px-6 py-3 border-2 border-gray-300 font-semibold transition-colors ${step === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:border-gray-400'
                    }`}
                  disabled={step === 1}
                >
                  Back
                </button>
                {step < 3 ? (
                  <button
                    onClick={handleContinue}
                    className="px-6 py-3 bg-pink-300 text-white font-semibold hover:bg-pink-400 transition-colors flex items-center gap-2"
                  >
                    Continue
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <>
                    {(formData.paymentMethod === 'card' || formData.paymentMethod === 'bank') ? (
                      isPaystackConfigValid() ? (
                        <PaystackButton
                          {...componentProps}
                          className="px-8 py-3 bg-pink-300 text-white font-semibold hover:bg-pink-400 transition-colors"
                        />
                      ) : (
                        <button
                          disabled
                          className="px-8 py-3 bg-gray-300 text-gray-500 font-semibold cursor-not-allowed"
                          title="Please fill in all required fields"
                        >
                          Complete Payment Info
                        </button>
                      )
                    ) : (
                      <button
                        onClick={handlePlaceOrder}
                        disabled={loadingCart}
                        className="px-8 py-3 bg-pink-300 text-white font-semibold hover:bg-pink-400 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {loadingCart ? 'Processing...' : 'Place Order'}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                {cartItems.map((item, index) => (
                  <div key={`summary-${item.id}-${item.size || 'default'}-${item.color || 'default'}-${index}`} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover border border-gray-200"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm text-gray-900 line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">₦{shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (7.5%)</span>
                  <span className="font-medium text-gray-900">₦{tax.toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between mb-6">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">₦{total.toLocaleString()}</span>
              </div>

              {/* Security Badge */}
              <div className="bg-gray-50 p-3 text-center border border-gray-200">
                <p className="text-xs text-gray-600 flex items-center justify-center gap-2">
                  <Lock size={14} className="text-green-600" />
                  Secure Checkout - SSL Encrypted
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Success Modal */}
        {showOrderStatus && (
          <div className="fixed inset-0 bg-black/[0.7] mt-25 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
              <button
                onClick={() => {
                  setShowOrderStatus(false);
                  window.location.href = '/';
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
                <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>

                <div className="bg-gray-50 border border-gray-200 p-4 mb-4 text-left">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-semibold text-gray-900">{orderNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold text-gray-900">₦{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <span className="font-semibold text-gray-900">
                      {formData.shippingMethod === 'express' ? '2-3 days' : '5-7 days'}
                    </span>
                  </div>
                </div>

                {/* OTP Display - Only for Card/Bank payments */}
                {orderOtp && (formData.paymentMethod === 'card' || formData.paymentMethod === 'bank') && (
                  <div className="bg-pink-50 border-2 border-pink-300 p-4 mb-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">📦 Your Package Collection Code:</p>
                    <div className="text-3xl font-bold text-pink-300 tracking-widest mb-2 font-mono">
                      {orderOtp}
                    </div>
                    <p className="text-xs text-gray-600">
                      ⚠️ Keep this code safe! You'll need it to collect your package.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Valid for 48 hours
                    </p>
                  </div>
                )}

                {/* COD Message */}
                {formData.paymentMethod === 'cod' && (
                  <div className="bg-green-50 border-2 border-green-300 p-4 mb-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">💵 Cash on Delivery</p>
                    <p className="text-xs text-gray-600">
                      Please have ₦{total.toLocaleString()} ready when your order arrives.
                    </p>
                  </div>
                )}

                <p className="text-sm text-gray-600 mb-6">
                  A confirmation email has been sent to <span className="font-medium">{formData.email}</span>
                  {orderOtp && ' with your package collection code'}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowOrderStatus(false);
                      navigate('/profile/orders');
                    }}
                    className="flex-1 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors rounded-lg"
                  >
                    View Orders
                  </button>
                  <button
                    onClick={() => {
                      setShowOrderStatus(false);
                      navigate('/collections');
                    }}
                    className="flex-1 py-3 bg-pink-300 text-white font-semibold hover:bg-pink-400 transition-colors rounded-lg"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;