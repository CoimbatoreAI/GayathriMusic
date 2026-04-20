import { Router } from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPaymentStatus,
  processEnrollmentWithPayment,
  handleRazorpayPaymentSuccess,
  handleRazorpayPaymentFailed
} from '../controllers/payment.controller';

const router = Router();

// Create Razorpay order
router.post('/create-order', createRazorpayOrder);

// Verify Razorpay payment
router.post('/verify', verifyRazorpayPayment);

// Get payment status
router.get('/status/:paymentId', getPaymentStatus);

// Process enrollment with payment
router.post('/process-enrollment', processEnrollmentWithPayment);

// Razorpay webhook endpoint
router.post('/webhooks/razorpay', async (req, res) => {
  try {
    const body = req.body;

    // Log webhook event for debugging
    console.log('🔔 Razorpay webhook received:', {
      event: body.event,
      render_url: 'https://gayathricarnaticmusic.in',
      timestamp: new Date().toISOString()
    });

    // Handle different webhook events
    switch (body.event) {
      case 'payment.authorized':
      case 'payment.captured':
        await handleRazorpayPaymentSuccess(body);
        break;
      case 'payment.failed':
        await handleRazorpayPaymentFailed(body);
        break;
      default:
        console.log('Unhandled webhook event:', body.event);
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;