const nodemailer = require("nodemailer");

const sendInvite = async(email, activationLink) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.TEMP_EMAIL_USER,
            pass: process.env.TEMP_EMAIL_PASS,
        },
    });

    const message = {
        from: `"Prolific Gaming" <${process.env.TEMP_EMAIL_USER}>`,
        to: email,
        subject: "Admin Account Activation - Prolific Gaming",
        html:`
        <h2>Welcome to Prolific Gaming Admin Team!</h2>
        <p>You've been invited to become an administrator.</p>
        <p>Please click the link below to activate your account:</p>
        
        <a href="${activationLink}">${activationLink}</a>
        <p>This link expires in 24 hours.</p> 
        `
    }

    await transporter.sendMail(message); 
}

module.exports = { sendInvite };