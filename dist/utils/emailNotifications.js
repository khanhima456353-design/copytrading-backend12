"use strict";
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
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.error("Failed to send deposit rejection notification:", error);
    }
};
module.exports = {
    sendDepositNotification,
    sendDepositApprovedNotification,
    sendDepositRejectedNotification
};
