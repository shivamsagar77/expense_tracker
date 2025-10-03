const paymentService = require('../service/paymentService');
const mockPaymentService = require('../service/mockPaymentService');
const paymentStorageService = require('../service/paymentStorageService');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

class PaymentController {
    // Order create करने के लिए controller method
    async createOrder(req, res) {
        try {
            const { amount, customerId, customerPhone, customerEmail, returnUrl } = req.body;
            
            // Validation
            if (!amount || !customerId || !customerPhone) {
                return res.status(400).json({
                    success: false,
                    message: "Amount, customer ID और customer phone required हैं"
                });
            }

            // Unique order ID generate करना
            const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const orderData = {
                amount: parseFloat(amount),
                orderId: orderId,
                customerId: customerId,
                customerPhone: customerPhone,
                customerEmail: customerEmail,
                returnUrl: returnUrl
            };

            // Check if we have real Cashfree credentials
            const hasRealCredentials = process.env.CASHFREE_CLIENT_ID && 
                                     process.env.CASHFREE_CLIENT_ID !== 'YOUR_ACTUAL_CLIENT_ID' &&
                                     process.env.CASHFREE_CLIENT_SECRET && 
                                     process.env.CASHFREE_CLIENT_SECRET !== 'YOUR_ACTUAL_CLIENT_SECRET';

            let result;
            if (hasRealCredentials) {
                console.log('✅ Using real Cashfree service');
                result = await paymentService.createOrder(orderData);
            } else {
                console.log('🔧 Using mock payment service for testing');
                result = await mockPaymentService.createOrder(orderData);
            }

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: {
                        orderId: orderId,
                        paymentSessionId: result.data.payment_session_id,
                        orderAmount: result.data.order_amount,
                        orderCurrency: result.data.order_currency
                    }
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Payment Controller Error:', error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }

    // Payment status check करने के लिए controller method
    async getPaymentStatus(req, res) {
        try {
            const { orderId } = req.params;

            if (!orderId) {
                return res.status(400).json({
                    success: false,
                    message: "Order ID required है"
                });
            }

            // Check if we have real Cashfree credentials
            const hasRealCredentials = process.env.CASHFREE_CLIENT_ID && 
                                     process.env.CASHFREE_CLIENT_ID !== 'YOUR_ACTUAL_CLIENT_ID' &&
                                     process.env.CASHFREE_CLIENT_SECRET && 
                                     process.env.CASHFREE_CLIENT_SECRET !== 'YOUR_ACTUAL_CLIENT_SECRET';

            let result;
            if (hasRealCredentials) {
                result = await paymentService.getPaymentStatus(orderId);
            } else {
                result = await mockPaymentService.getPaymentStatus(orderId);
            }

            if (result.success) {
                let premiumUpdated = false;
                
                // Payment success होने पर user को premium बनाना
                const paymentData = result.data;
                if (paymentData && paymentData.length > 0) {
                    const payment = paymentData[0];
                    console.log('Payment data received:', payment);
                    
                    // if (payment.payment_status === 'SUCCESS') {
                        let userIdToUpdate = null;
                        
                    //     // Customer ID determine करना - multiple sources से
                    //     const customerIdFromBody = req.body.customerId;
                    //     const customerIdFromQuery = req.query.customerId;
                        const userIdFromAuth = req.user ? req.user.userId : null;
                        
                        // if (customerIdFromBody) {
                        //     userIdToUpdate = customerIdFromBody;
                        //     console.log('Using customer_id from request body:', userIdToUpdate);
                        // } else if (customerIdFromQuery) {
                        //     userIdToUpdate = customerIdFromQuery;
                        //     console.log('Using customer_id from query params:', userIdToUpdate);
                        // } else if (userIdFromAuth) {
                            userIdToUpdate = userIdFromAuth;
                            console.log('Using user ID from auth token:', userIdToUpdate);
                        // } else {
                        //     console.log('❌ No customer_id or auth token available');
                        // }
                        
                        if (userIdToUpdate) {
                            try {
                                const updateResult = await Signup.update(
                                    { ispremimumuser: true },
                                    { where: { id: userIdToUpdate } }
                                );
                                
                                if (updateResult[0] > 0) {
                                    console.log(`✅ User ${userIdToUpdate} को premium user बनाया गया (Status Check)`);
                                    premiumUpdated = true;
                                } else {
                                    console.log(`⚠️ User ${userIdToUpdate} not found for premium update`);
                                }
                            } catch (updateError) {
                                console.error('❌ Premium user update error:', updateError);
                            }
                        }
                    } 
                // }

                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data,
                    premiumUpdated: premiumUpdated
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Payment Status Controller Error:', error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }

    // Order details fetch करने के लिए controller method
    async getOrderDetails(req, res) {
        try {
            const { orderId } = req.params;

            if (!orderId) {
                return res.status(400).json({
                    success: false,
                    message: "Order ID required है"
                });
            }

            const result = await paymentService.getOrderDetails(orderId);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Order Details Controller Error:', error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }

    // Order payments fetch करने के लिए controller method
    async fetchOrderPayments(req, res) {
        try {
            const { orderId } = req.params;

            if (!orderId) {
                return res.status(400).json({
                    success: false,
                    message: "Order ID required है"
                });
            }

            const result = await paymentService.fetchOrderPayments(orderId);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Fetch Order Payments Controller Error:', error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }

    // Payment session fetch करने के लिए controller method
    async getPaymentSession(req, res) {
        try {
            const { paymentSessionId } = req.params;

            if (!paymentSessionId) {
                return res.status(400).json({
                    success: false,
                    message: "Payment Session ID required है"
                });
            }

            const result = await paymentService.getPaymentSession(paymentSessionId);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Payment Session Controller Error:', error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }

    // Payment success callback handle करने के लिए method
    async paymentCallback(req, res) {
        try {
            const { order_id, payment_status, payment_message, customer_id } = req.body;
            
            console.log('Payment Callback Received:', {
                order_id,
                payment_status,
                payment_message,
                customer_id
            });

            // Payment success होने पर user को premium बनाना
            if (payment_status === 'SUCCESS') {
                let userIdToUpdate = null;
                
                // Customer ID determine करना - multiple sources से
                if (customer_id) {
                    userIdToUpdate = customer_id;
                    console.log('Using customer_id from callback:', userIdToUpdate);
                } else if (req.user && req.user.userId) {
                    userIdToUpdate = req.user.userId;
                    console.log('Using user ID from auth token:', userIdToUpdate);
                } else {
                    console.log('❌ No customer_id or auth token available');
                }
                
                if (userIdToUpdate) {
                    try {
                        const updateResult = await Signup.update(
                            { ispremimumuser: true },
                            { where: { id: userIdToUpdate } }
                        );
                        
                        if (updateResult[0] > 0) {
                            console.log(`✅ User ${userIdToUpdate} को premium user बनाया गया (Payment Success)`);
                        } else {
                            console.log(`⚠️ User ${userIdToUpdate} not found for premium update`);
                        }
                    } catch (updateError) {
                        console.error('❌ Premium user update error:', updateError);
                    }
                }
            } else {
                console.log(`❌ Payment not successful. Status: ${payment_status}`);
            }

            res.status(200).json({
                success: true,
                message: "Payment callback processed successfully",
                premiumUpdated: payment_status === 'SUCCESS' ? true : false
            });
        } catch (error) {
            console.error('Payment Callback Error:', error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }

    // Payment data store करने के लिए method
    async storePaymentData(req, res) {
        try {
            const { paymentResponse } = req.body;
            const userId = req.user.userId; // From auth middleware

            if (!paymentResponse || !paymentResponse.data) {
                return res.status(400).json({
                    success: false,
                    message: "Payment response data required है"
                });
            }

            const result = await paymentStorageService.storePaymentData(paymentResponse, userId);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: result.message,
                    paymentId: result.paymentId
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Store Payment Data Error:', error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }

    // Payment data fetch करने के लिए method
    async getPaymentData(req, res) {
        try {
            const { paymentId } = req.params;

            if (!paymentId) {
                return res.status(400).json({
                    success: false,
                    message: "Payment ID required है"
                });
            }

            const result = await paymentStorageService.getPaymentData(paymentId);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Get Payment Data Error:', error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }

    // User के सभी payments fetch करने के लिए method
    async getUserPayments(req, res) {
        try {
            const userId = req.user.userId; // From auth middleware

            const result = await paymentStorageService.getUserPayments(userId);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Get User Payments Error:', error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }

    // User का premium status check करने के लिए method
    async getUserPremiumStatus(req, res) {
        try {
            console.log('Premium status check - JWT user data:', req.user);
            
            // JWT से premium status directly get करना
            const isPremiumFromJWT = req.user.ispremimumuser;
            
            // Database से भी verify करना (optional - for double check)
            const userId = req.user.userId; // JWT में userId field है, id नहीं
            console.log('Looking for user with ID:', userId);
            
            const user = await Signup.findByPk(userId, {
                attributes: ['id', 'name', 'email', 'ispremimumuser']
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Premium status fetched successfully",
                data: {
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    ispremimumuser: isPremiumFromJWT || user.ispremimumuser
                }
            });
        } catch (error) {
            console.error('Get User Premium Status Error:', error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }

    // Payment success के बाद fresh JWT token generate करने के लिए method
    async refreshTokenAfterPayment(req, res) {
        try {
            console.log('Refresh token - JWT user data:', req.user);
            
            const userId = req.user.userId; // JWT में userId field है, id नहीं
            console.log('Looking for user with ID:', userId);
            
            // Database से latest user data fetch करना
            const user = await Signup.findByPk(userId, {
                attributes: ['id', 'name', 'email', 'ispremimumuser']
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Fresh JWT token generate करना with updated premium status
            const freshToken = jwt.sign(
                { 
                    userId: user.id, 
                    email: user.email, 
                    name: user.name,
                    ispremimumuser: user.ispremimumuser
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
                data: {
                    token: freshToken,
                    user: {
                        userId: user.id,
                        name: user.name,
                        email: user.email,
                        ispremimumuser: user.ispremimumuser
                    }
                }
            });
        } catch (error) {
            console.error('Refresh Token Error:', error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }

    // Payment success के बाद user को premium बनाने के लिए dedicated method
    async updateUserToPremium(req, res) {
        try {
            const { userId, orderId } = req.body;
            
            console.log('Update to premium request:', { userId, orderId });
            
            let userIdToUpdate = null;
            
            // User ID determine करना - multiple sources से
            if (userId) {
                userIdToUpdate = userId;
                console.log('Using userId from request body:', userIdToUpdate);
            } else if (req.user && req.user.userId) {
                userIdToUpdate = req.user.userId;
                console.log('Using user ID from auth token:', userIdToUpdate);
            } else {
                return res.status(400).json({
                    success: false,
                    message: "User ID is required (either in body or auth token)"
                });
            }

            // User को premium बनाना
            const updateResult = await Signup.update(
                { ispremimumuser: true },
                { where: { id: userIdToUpdate } }
            );

            if (updateResult[0] > 0) {
                console.log(`✅ User ${userIdToUpdate} को premium user बनाया गया (Manual Update)`);
                
                // Updated user data fetch करना
                const user = await Signup.findByPk(userIdToUpdate, {
                    attributes: ['id', 'name', 'email', 'ispremimumuser']
                });

                res.status(200).json({
                    success: true,
                    message: "User successfully upgraded to premium",
                    data: {
                        userId: user.id,
                        name: user.name,
                        email: user.email,
                        ispremimumuser: user.ispremimumuser
                    }
                });
            } else {
                console.log(`⚠️ User ${userIdToUpdate} not found for premium update`);
                res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
        } catch (error) {
            console.error('Update to Premium Error:', error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }

    // Order ID से customer ID extract करने के लिए helper method
    async extractCustomerIdFromOrder(orderId) {
        try {
            // Order ID pattern: order_${timestamp}_${random}
            // Customer ID usually embedded in order creation
            // This is a fallback method - ideally customer_id should be provided
            
            console.log('Attempting to extract customer ID from order:', orderId);
            
            // You can implement order-to-customer mapping logic here
            // For now, return null and let other methods handle it
            return null;
        } catch (error) {
            console.error('Error extracting customer ID from order:', error);
            return null;
        }
    }
}

module.exports = new PaymentController();
