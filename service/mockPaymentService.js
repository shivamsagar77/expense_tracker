// Mock Payment Service for Testing
// Use this when you don't have real Cashfree credentials yet

class MockPaymentService {
    constructor() {
        console.log('🔧 Using Mock Payment Service for testing');
    }

    // Mock order creation
    async createOrder(orderData) {
        console.log('🔧 Mock: Creating order with data:', orderData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock payment session ID
        const mockPaymentSessionId = `mock_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        return {
            success: true,
            data: {
                payment_session_id: mockPaymentSessionId,
                order_id: orderData.orderId,
                order_amount: orderData.amount,
                order_currency: "INR",
                customer_details: orderData.customer_details
            },
            message: "Mock order created successfully"
        };
    }

    // Mock payment status check
    async getPaymentStatus(orderId) {
        console.log('🔧 Mock: Checking payment status for order:', orderId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            success: true,
            data: [{
                cf_payment_id: `mock_payment_${Date.now()}`,
                order_id: orderId,
                payment_status: "SUCCESS",
                payment_amount: 299,
                payment_currency: "INR",
                payment_time: new Date().toISOString(),
                payment_completion_time: new Date().toISOString()
            }],
            message: "Mock payment status fetched successfully"
        };
    }

    // Mock order details
    async getOrderDetails(orderId) {
        console.log('🔧 Mock: Fetching order details for:', orderId);
        
        return {
            success: true,
            data: {
                order_id: orderId,
                order_amount: 299,
                order_currency: "INR",
                order_status: "ACTIVE",
                created_at: new Date().toISOString()
            },
            message: "Mock order details fetched successfully"
        };
    }
}

module.exports = new MockPaymentService();
