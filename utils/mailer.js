const nodemailer = require("nodemailer");
require('dotenv').config();

// sendInvite(): Will send an activation link to the new admin.
const sendInvite = async(email, activationLink, inviteRole) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // or any SMTP provider 
        port: 465,
        secure: true, // true = SSL and 465 and false = for other ports
        auth: {
            user: process.env.TEMP_EMAIL_USER_SOSU,
            pass: process.env.TEMP_EMAIL_PASS_SOSU,
        },
        logger: true,
        debug: true,
    });

    const message = {
        from: `"Prolific Gaming Dynamics" ${process.env.TEMP_EMAIL_USER_SOSU}`,
        to: email,
        subject: `Prolific Gaming - ${inviteRole} Role`,
        html:`
        <h2>Welcome to Prolific Gaming Admin Team!</h2>
        <p>You've been invited to become a ${inviteRole}.</p>
        <p>Please click the link below to activate your account:</p>
        
        <a href="${activationLink}">${activationLink}</a>
        <p>This link expires in 24 hours.</p> 
        `,
    }

    await transporter.sendMail(message); 
    // transporter.verify((err, success) => {
    //     console.log("Mail Error: ", err || "MAIL CONNECTED"); 
    // }); 
    // try{
    //     await transporter.verify();
    //     console.log("SMTP connection success!");
    // }
    // catch(err)
    // {
    //     console.error("SMTP ERROR: ", err);
    // }
}

// sendUsernameEmail(): Will send a username email to the admin that forgot. 
const sendUsernameEmail = async (email, username) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.TEMP_EMAIL_USER_SOSU,
            pass: process.env.TEMP_EMAIL_PASS_SOSU, 
        },
    }); 

    const message = {
        from: `"Prolific Gaming" <${process.env.TEMP_EMAIL_USER_SOSU}`,
        to: email,
        subject: "Your Admin Username",
        html: `
        <p>Hello, </p>
        <p>Your administrator username is:</p>
        <h3>${username}</h3>
        <p>If you did not request this reminder, you can safely ignore this email.</p>
        `,
    }

    await transporter.sendMail(message); 
}

// sendPasswordResetEmail(): Will send a password reset email to the admin that forgot.
const sendPasswordResetEmail = async (email, link) => { 
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.TEMP_EMAIL_USER_SOSU,
            pass: process.env.TEMP_EMAIL_PASS_SOSU,
        },
    });

    const message = {
        from: `"Prolific Gaming" <${process.env.TEMP_EMAIL_USER_SOSU}>`,
        to: email,
        subject: "Reset Your Admin Password",
        html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to set a new password:</p>
        <a href="${link}">${link}</a>
        <p>This link expires in 1 hour.</p>
        <p>If you did not makes this request, please ignore this email.</p>
        `,  
    }

    await transporter.sendMail(message);
}

module.exports = { 
    sendInvite, 
    sendUsernameEmail, 
    sendPasswordResetEmail, 
};