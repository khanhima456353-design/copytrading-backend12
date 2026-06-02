const nodemailer = require("nodemailer");

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send deposit notification to admin
const sendDepositNotification = async (userEmail, amount, depositId) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "khanhima456353@gmail.com",
      subject: "New Deposit Request - Manual Verification Required",
      html: `
        <h2>New Deposit Request</h2>
        <p><strong>User Email:</strong> ${userEmail}</p>
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>Deposit ID:</strong> ${depositId}</p>
        <p><strong>Instructions:</strong> Please verify the payment and approve/reject the deposit.</p>
        <p><strong>Payment Method:</strong> Email transfer to khanhima456353@gmail.com</p>
        <br>
        <p>Please check your email for the payment and update the deposit status accordingly.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Deposit notification sent to admin");
  } catch (error) {
    console.error("Failed to send deposit notification:", error);
  }
};

// Send deposit approval notification to user
const sendDepositApprovedNotification = async (userEmail, amount) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Deposit Approved - Funds Added to Your Account",
      html: `
        <h2>Deposit Approved!</h2>
        <p>Your deposit of <strong>$${amount}</strong> has been approved and added to your trading account.</p>
        <p>You can now use these funds for trading.</p>
        <br>
        <p>Thank you for using SwanCore!</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Deposit approval notification sent to user");
  } catch (error) {
    console.error("Failed to send deposit approval notification:", error);
  }
};

// Send deposit rejection notification to user
const sendDepositRejectedNotification = async (userEmail, amount, reason) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Deposit Request Rejected",
      html: `
        <h2>Deposit Request Rejected</h2>
        <p>Your deposit request of <strong>$${amount}</strong> has been rejected.</p>
        <p><strong>Reason:</strong> ${reason || "Payment not verified"}</p>
        <p>Please contact support if you believe this is an error.</p>
        <br>
        <p>Thank you for using SwanCore!</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Deposit rejection notification sent to user");
  } catch (error) {
    console.error("Failed to send deposit rejection notification:", error);
  }
};

// Send KYC approval notification to user
const sendKycApprovedNotification = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "✅ KYC Verified – Full Trading Access Unlocked",
      html: `
        <div style="font-family: Arial, sans-serif; background: #f5f7fa; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #27ae60; margin: 0; font-size: 28px;">✅ KYC Verified</h1>
            </div>
            <p style="color: #2c3e50; font-size: 16px; line-height: 1.6;">
              Congratulations ${userName || 'User'}!
            </p>
            <p style="color: #2c3e50; font-size: 16px; line-height: 1.6;">
              Your identity has been successfully verified. You now have full access to all trading features including:
            </p>
            <ul style="color: #2c3e50; font-size: 15px; line-height: 1.8; margin: 20px 0; padding-left: 20px;">
              <li>Unlimited deposits & withdrawals</li>
              <li>Leveraged products</li>
              <li>SwanCore Services</li>
            </ul>
            <div style="background: #d4edda; border-left: 4px solid #27ae60; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <p style="color: #155724; margin: 0; font-weight: 600;">Full Trading Access Unlocked</p>
              <p style="color: #155724; margin: 8px 0; font-size: 14px;">Start trading immediately with your verified account.</p>
            </div>
            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.FRONTEND_URL || 'https://swancore.io'}/trading" style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
                Start Trading
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e0e6ed; margin: 32px 0;">
            <p style="color: #7a8a99; font-size: 13px; text-align: center;">
              <strong>SwanCore Team</strong><br>
              Simplified Trading
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("KYC approval notification sent to user:", userEmail);
  } catch (error) {
    console.error("Failed to send KYC approval notification:", error);
  }
};

// Send KYC rejection notification to user
const sendKycRejectedNotification = async (userEmail, userName, rejectionDetails) => {
  try {
    const reasonsList = rejectionDetails?.reasons || [];
    const reasonsHtml = reasonsList.length > 0 
      ? reasonsList.map(reason => `<li>${reason}</li>`).join('')
      : '<li>Unable to verify documents with provided information</li>';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "⚠️ KYC Verification Requires Attention",
      html: `
        <div style="font-family: Arial, sans-serif; background: #f5f7fa; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #e74c3c; margin: 0; font-size: 28px;">⚠️ KYC Verification Requires Attention</h1>
            </div>
            <p style="color: #2c3e50; font-size: 16px; line-height: 1.6;">
              Dear ${userName || 'User'},
            </p>
            <p style="color: #2c3e50; font-size: 16px; line-height: 1.6;">
              We were unable to verify your identity with the documents provided. Please re-submit with the following corrected items:
            </p>
            <ul style="color: #721c24; font-size: 15px; line-height: 1.8; margin: 20px 0; padding-left: 20px;">
              ${reasonsHtml}
            </ul>
            <div style="background: #fff3cd; border-left: 4px solid #f39c12; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <p style="color: #856404; margin: 0; font-weight: 600;">Time Limit: 7 Days</p>
              <p style="color: #856404; margin: 8px 0; font-size: 14px;">You have 7 days to re-submit before your account is restricted from trading.</p>
            </div>
            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.FRONTEND_URL || 'https://swancore.io'}/kyc-resubmit" style="background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
                Re-submit Documents
              </a>
            </div>
            <div style="background: #f8f9fa; padding: 16px; margin: 24px 0; border-radius: 4px; font-size: 14px; color: #2c3e50;">
              <p style="margin-top: 0;"><strong>Guidelines for re-submission:</strong></p>
              <ul style="padding-left: 20px; margin-bottom: 0;">
                <li>Ensure documents are clear, well-lit, and fully visible</li>
                <li>Address proof must be dated within the last 3 months</li>
                <li>All text must be readable</li>
              </ul>
            </div>
            <hr style="border: none; border-top: 1px solid #e0e6ed; margin: 32px 0;">
            <p style="color: #7a8a99; font-size: 13px; text-align: center;">
              <strong>SwanCore Team</strong><br>
              Simplified Trading
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("KYC rejection notification sent to user:", userEmail);
  } catch (error) {
    console.error("Failed to send KYC rejection notification:", error);
  }
};

module.exports = {
  sendDepositNotification,
  sendDepositApprovedNotification,
  sendDepositRejectedNotification,
  sendKycApprovedNotification,
  sendKycRejectedNotification
};
