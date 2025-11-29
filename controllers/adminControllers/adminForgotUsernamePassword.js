const crypto = require("node:crypto"); 
// const { PrismaClient } = require("../../generated/prisma"); 
const prisma = require("../../lib/prisma.js"); 
const mailSys = require("../../utils/mailer"); 
const bcrypt = require("bcryptjs");

// const prisma = new PrismaClient();  

// adminShowForgotUsernamePageGet(): Get route controller:
const adminShowForgotUsernamePageGet = (req, res) => {
    res.render('adminUtils/adminForgotUsername'); 
}

// adminSendUsernameReminderPost(): Post route controller: 
const adminSendUsernameReminderPost = async(req, res) => {
    const { email } = req.body;

    try{
        const admin = await prisma.findMany({
            where: {
                email: email,
            }
        });

        // Reply SUCCESS regardless of account existence - prevent enumeration:
        if (!admin)
        {
            return res.render("adminUtils/adminUsernameReminderSent"); 
        }

        // Send the username to their email: 
        await mailSys.sendUsernameEmail(email, admin.username); 

        return res.render("adminUtils/adminUsernameReminderSent"); 
    }
    catch(err){
        return res.render("errorPage", { message: "Unexpected error." }); 
    }
}

// adminShowForgotPasswordPageGet(): Get route controller:
const adminShowForgotPasswordPageGet = (req, res) => {
    res.render("adminUtils/adminForgotPassword");
}

// adminHandleForgotPasswordPost(): Post route controller:
const adminHandleForgotPasswordPost = async (req, res) => {
    const { email } = req.body;

    try{
        const admin = await prisma.admin.findMany({
            where: {
                email: email
            }
        }); 

        // Same as username recovery - don't reveal email existence
        if (!admin)
        {
            return res.render("adminUtils/adminPasswordResetEmailSent");
        }

        // Generate token + 1hr expiration:
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 60 * 60 * 1000);

        await prisma.admin.update({
            where: { id: admin.id },
            data:{
                passwordResetToken: token,
                passwordResetExpires: expires, 
            }
        });

        const link = `${process.env.TEMP_BASE_URL}/admin/reset-password/${token}`; 

        // Send the password reset email with nodemailer. 
        await mailSys.sendPasswordResetEmail(email, link); 

        return res.render("adminUtils/adminPasswordResetEmailSent"); 
    }
    catch(err)
    {
        console.error("Forgot Password Error: ", err); // Testing 
        return res.render("errorPage", {message: "Unexpected Error."}); 
    }
}

// adminShowPasswordResetPageGet(): Get Route Controller: 
const adminShowPasswordResetPageGet = async (req, res) => {
    const { token } = req.params; 

    const admin = await prisma.admin.findFirst({
        where: {
            passwordResetToken: token,
            passwordResetExpires: { gt: new Date() }, 
        },
    });

    if (!admin)
    {
        return res.render("adminUtils/adminResetPasswordExpired"); 
    }

    return res.render("adminUtils/adminResetPassword", { token: token }); 
}

// adminResetPasswordPost(): Post Route Controller:
const adminResetPasswordPost = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const admin = await prisma.admin.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: { gt: new Date() },
            }
        });

        if (!admin)
        {
            return res.render("adminUtils/adminResetPasswordExpired");
        }

        const hashed = await bcrypt.hash(password, 12); 

        await prisma.admin.update({
            where: { id: admin.id },
            data: {
                password: hashed,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        }); 

        return res.render("adminUtils/adminResetPasswordSuccess");
    }
    catch(err){
        console.error("Reset Password Error: ", err);
        return res.render("error-page", {message: "Unexpected Error"}); 
    }
}

// admin
module.exports = { 
    adminShowForgotUsernamePageGet, // CSS Added
    adminSendUsernameReminderPost, // CSS Added

    adminShowForgotPasswordPageGet, // CSS Added
    adminHandleForgotPasswordPost, // CSS Added 

    adminShowPasswordResetPageGet, // CSS Added
    adminResetPasswordPost, // CSS Added
}; 