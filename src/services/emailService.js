// Web3Forms Email Service
// Documentation: https://web3forms.com/

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

/**
 * Send OTP email after successful payment
 * @param {Object} params - Email parameters
 * @param {string} params.toEmail - Recipient email
 * @param {string} params.customerName - Customer name
 * @param {string} params.orderNumber - Order number
 * @param {string} params.otp - 6-digit OTP code
 * @param {number} params.orderTotal - Order total amount
 * @returns {Promise<Object>} - Response object
 */
export const sendOTPEmail = async ({ toEmail, customerName, orderNumber, otp, orderTotal }) => {
  try {
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FFC0CB 0%, #FFB6C1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
          .otp-box { background: #f8f9fa; border: 2px dashed #FFC0CB; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #FFC0CB; letter-spacing: 8px; font-family: monospace; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
          @media only screen and (max-width: 600px) {
            .container { padding: 10px; }
            .otp-code { font-size: 24px; letter-spacing: 4px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🎉 Payment Successful!</h1>
            <p style="margin: 10px 0 0 0;">Love Story by Anna</p>
          </div>
          
          <div class="content">
            <h2>Hello ${customerName},</h2>
            
            <p>Thank you for your order! Your payment has been successfully processed.</p>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>Order Number:</strong> ${orderNumber}<br>
              <strong>Amount Paid:</strong> ₦${orderTotal.toLocaleString()}
            </div>
            
            <h3 style="color: #FFC0CB;">📦 Your Package Collection Code</h3>
            
            <div class="otp-box">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your OTP Code</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Valid for 48 hours</p>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important Instructions:</strong>
              <ul style="margin: 10px 0;">
                <li>Keep this code <strong>safe and confidential</strong></li>
                <li>You will need to present this code to collect your package</li>
                <li>Do not share this code with anyone except our delivery personnel</li>
                <li>This code expires in 48 hours</li>
              </ul>
            </div>
            
            <h3>What's Next?</h3>
            <ol>
              <li>We'll prepare your order for shipment</li>
              <li>You'll receive a shipping notification with tracking details</li>
              <li>When your package arrives, present this OTP code to the delivery personnel</li>
              <li>Verify your package and enjoy your purchase!</li>
            </ol>
            
            <p style="margin-top: 30px;">If you have any questions, please don't hesitate to contact us.</p>
          </div>
          
          <div class="footer">
            <p><strong>Love Story by Anna</strong></p>
            <p>Thank you for shopping with us! ❤️</p>
            <p style="color: #999; font-size: 11px;">This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Payment Successful – Your Pickup Code (Order ${orderNumber})`,
        from_name: 'Love Story by Anna',
        email: toEmail,
        message: emailHTML,
        replyto: 'support@lovestorybyanna.com',
        botcheck: ''
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ OTP email sent successfully to:', toEmail);
      return { success: true, message: 'OTP email sent successfully' };
    } else {
      console.error('❌ Failed to send OTP email:', result);
      return { success: false, error: result.message || 'Failed to send email' };
    }
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send COD order confirmation email
 * @param {Object} params - Email parameters
 * @param {string} params.toEmail - Recipient email
 * @param {string} params.customerName - Customer name
 * @param {string} params.orderNumber - Order number
 * @param {number} params.orderTotal - Order total amount
 * @param {Object} params.shippingAddress - Shipping address object
 * @returns {Promise<Object>} - Response object
 */
export const sendCODConfirmationEmail = async ({ toEmail, customerName, orderNumber, orderTotal, shippingAddress }) => {
  try {
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FFC0CB 0%, #FFB6C1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
          .info-box { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .highlight { background: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
          @media only screen and (max-width: 600px) {
            .container { padding: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">✅ Order Confirmed!</h1>
            <p style="margin: 10px 0 0 0;">Love Story by Anna</p>
          </div>
          
          <div class="content">
            <h2>Hello ${customerName},</h2>
            
            <p>Thank you for your order! We've received your order and it's being processed.</p>
            
            <div class="info-box">
              <strong>Order Number:</strong> ${orderNumber}<br>
              <strong>Payment Method:</strong> Cash on Delivery<br>
              <strong>Amount to Pay:</strong> ₦${orderTotal.toLocaleString()}
            </div>
            
            <h3>📍 Delivery Address</h3>
            <div class="info-box">
              ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
              ${shippingAddress.address}<br>
              ${shippingAddress.city}, ${shippingAddress.state}<br>
              ${shippingAddress.phone}
            </div>
            
            <div class="highlight">
              <strong>💵 Cash on Delivery Instructions:</strong>
              <ul style="margin: 10px 0;">
                <li>Payment will be collected when your order is delivered</li>
                <li>Please have <strong>₦${orderTotal.toLocaleString()}</strong> ready in cash</li>
                <li>You can inspect your package before making payment</li>
                <li>Our delivery personnel will provide you with a receipt</li>
              </ul>
            </div>
            
            <h3>What's Next?</h3>
            <ol>
              <li>We'll prepare your order for shipment</li>
              <li>You'll receive a shipping notification with tracking details</li>
              <li>Our delivery personnel will contact you before delivery</li>
              <li>Inspect your package and make payment upon delivery</li>
            </ol>
            
            <p style="margin-top: 30px;">If you have any questions or need to make changes to your order, please contact us immediately.</p>
          </div>
          
          <div class="footer">
            <p><strong>Love Story by Anna</strong></p>
            <p>Thank you for shopping with us! ❤️</p>
            <p style="color: #999; font-size: 11px;">This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Order Confirmed – Cash on Delivery (Order ${orderNumber})`,
        from_name: 'Love Story by Anna',
        email: toEmail,
        message: emailHTML,
        replyto: 'support@lovestorybyanna.com',
        botcheck: ''
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ COD confirmation email sent successfully to:', toEmail);
      return { success: true, message: 'Confirmation email sent successfully' };
    } else {
      console.error('❌ Failed to send COD confirmation email:', result);
      return { success: false, error: result.message || 'Failed to send email' };
    }
  } catch (error) {
    console.error('❌ Error sending COD confirmation email:', error);
    return { success: false, error: error.message };
  }
};
