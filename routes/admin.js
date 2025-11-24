const express = require('express'); 
const passport = require('passport'); 
const { PrismaClient } = require('../generated/prisma');
const bcrypt = require("bcryptjs"); 

const adminInvites = require("../controllers/adminInviteController.js");
const adminForgotUsernamePassword = require("../controllers/adminControllers/adminForgotUsernamePassword.js"); 

const adminRoute = express();
const prisma = new PrismaClient(); 

// AdminDashboardSidebarLinks: All the admin sidebar paths: 
let adminDashboardSidebarLinks = [
    {name: "/dashboard", current: false},
    {name: "/dashboard/appearance", current: false},
    {name: "/dashboard/invite", current: false}, 
    {name: "/dashboard/tournaments", current: false}, 
];

// Admin login get route:
adminRoute.get('/', (req, res) => {
    res.status(200).render("main/admin");
});

// Admin post route:
adminRoute.post('/',
    passport.authenticate("local", {
        successRedirect: "/admin/dashboard",
        failureRedirect: "/",
    })
);

// Admin login post route:
// adminRoute.post("/", (req, res, next) => {
//     console.log('User: ', req.user.username);
//     passport.authenticate("local", (err, user, info, status) => {
//         if (err) return next(err);
//         if (!user) res.status(200).render("main/admin");

//         // req.logIn(user, () => {
//         //     if (err) return next(err);
            
//         // });  
//     });
// })

// Admin dashboard get route: 
adminRoute.get('/dashboard', EnsureAdminAuthenticated, (req, res) => {
    console.log(req.user); // Testing     
    adminDashboardSidebarLinks.forEach((link) => {
        if (link.name === req.path)
        {
            link.current = true;
        }
        else
        {
            link.current = false; 
        }
    })
    res.status(200).render("main/adminDashboard", {
        username: req.user.username,
        role: req.user.role,
        sidebarLinks: adminDashboardSidebarLinks,
    }); 
}); 

// EnsureAdminAuthenicated(): Test authentication to redirect the user to the admin dashboard: 
function EnsureAdminAuthenticated(req, res, next){
    if (req.isAuthenticated() && req.user.role === "SuperAdmin")
    {
        console.log("Ready");
        return next();
    }
    res.redirect('/admin');  
}

// Admin invite get route:
adminRoute.get("/dashboard/invite", (req, res) => {
    adminDashboardSidebarLinks.forEach((link) => {
        if (link.name === req.path)
        {
            link.current = true; 
        }
        else
        {
            link.current = false; 
        }
    });

    res.status(200).render("main/adminInvite", {
        inviteSent: null,
        username: req.user.username,
        role: req.user.role,
        sidebarLinks: adminDashboardSidebarLinks, 
    });
}); 

// Admin invite post route:
adminRoute.post("/dashboard/invite", adminInvites.inviteAdmin);

// Admin: Set tournaments get route: 
adminRoute.get("/dashboard/tournaments", (req, res) => {
    adminDashboardSidebarLinks.forEach((link) => {
        if (link.name === req.path)
        {
            link.current = true;
        }
        else
        {
            link.current = false; 
        }
    });

    res.render("adminUtils/adminTournaments", {
        username: req.user.username,
        role: req.user.role,
        sidebarLinks: adminDashboardSidebarLinks,
    }); 
});

// admin logout get route: 
adminRoute.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err)
        {
            return next(err);
        }
        res.redirect("/admin"); 
    }); 
})

// Admin activate get route:  
adminRoute.get("/activate", (req, res) => {
    res.render("main/adminActivate");
});

// Admin activate post route
adminRoute.post("/activate", async (req, res) => {
    const { email } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin)
    {
        return res.render("main/adminActivate", {error: "Email not found" });
    }

    if (admin.isActive)
    {
        return res.render("main/adminActivate", { error: "Account already activated. Please log in." }); 
    }

    // Render the form to set username and password:
    res.render("main/adminSetCredentials", { email: email });

    // Redirect the new admin back to the admin username and password to log in. 
    // res.status(200).redirect("/admin"); 
});

// Admin activate get route - /admin/activate/:token
adminRoute.get("/activate/:token", async (req, res) => {
    const { token } = req.params; 

    const admin = await prisma.admin.findUnique({ where: { activationToken: token } }); 
    if (!admin) return res.render("adminActivateError", { error: "Invalid token." }); 

    if (admin.isActive)
    {
        return res.render("adminActivateError", { error: "Account already activated" }); 
    }

    if (admin.tokenExpiresAt && admin.tokenExpiresAt < new Date())
    {
        return res.render("adminActivateError", { error: "Activation link expired." }); 
    }

    res.render("main/adminSetCredentials", {email: admin.email, token: token }); 
});

// Admin activate get route (Temporary GET Request for style editing):
// adminRoute.get("/activate/set-credentials", (req, res) => {
//     res.render("main/adminSetCredentials", { email: null }); 
// });

// Admin activate post route: 
adminRoute.post("/activate/set-credentials", async (req, res) => {
    const {token, setUsername, setPassword } = req.body;

    const admin = await prisma.admin.findUnique({ where: { activationToken: token } });
    // const admin = await prisma.admin.findUnique({ where: { email: email } });
    const user = await prisma.admin.findUnique({
        where: {
            username: setUsername, 
        },
    }); 

    if (user !== null)
    {
        return res.status(404).render("main/adminSetCredentials", {
            error: "This username already exist. Please choose another one.",
        }); 
    }

    if (!admin)
    {
        return res.status(404).render("main/adminSetCredentials", {
            error: "Admin not found. Contact admin support for more help.",
        });  
    }

    if (admin.isActive)
    {
        return res.status(400).render("main/adminSetCredentials", {
            error: "This account is already active", 
        }); 
    }

    if (admin.tokenExpiresAt && admin.tokenExpiresAt < new Date())
    {
        return res.status(400).render("adminActivateError", { error: "Activation link expired" }); 
    }

    const hashedPassword = await bcrypt.hash(setPassword, 10); 

    await prisma.admin.update({
        where: { activationToken: token },
        data: {
            username: setUsername, 
            password: hashedPassword,
            activationToken: null,
            tokenExpiresAt: null,
            isActive: true, 
        },
    });

    res.render("main/adminActivateSuccess", { username: setUsername }); 
});

// Admin Activate Success get route (Temporary get request for style editing):
// adminRoute.get("/activate/admin-activate-success", (req, res) => {
//     res.render("main/adminActivateSuccess", {
//         username: null,
//     }); 
// }); 

// forgot-username: GET and POST routes:
adminRoute.get("/forgot-username", adminForgotUsernamePassword.adminShowForgotUsernamePageGet);
adminRoute.post("/forgot-username", adminForgotUsernamePassword.adminSendUsernameReminderPost); 

// forgot-password: GET and POST routes:
adminRoute.get("/forgot-password", adminForgotUsernamePassword.adminShowForgotPasswordPageGet); 
adminRoute.get("/forgot-password", adminForgotUsernamePassword.adminHandleForgotPasswordPost); 

// reset-password/:token: GET and POST routes:
adminRoute.get("/reset-password/:token", adminForgotUsernamePassword.adminShowPasswordResetPageGet);
adminRoute.post("/reset-password/:token", adminForgotUsernamePassword.adminResetPasswordPost);  

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* GET Request Testing: */
// adminRoute.get("/test", (req, res) => res.render("adminUtils/adminUsernameReminderSent")); 
// adminRoute.get("/test", (req, res) => res.render('adminUtils/adminPasswordResetEmailSent'));

// adminRoute.get("/reset-password", (req, res) => res.render("adminUtils/adminResetPassword", {token: null})); 
// adminRoute.get("/reset-password", (req, res) => res.render("adminUtils/adminResetPasswordSuccess")); 

adminRoute.get("/reset-password", (req, res) => res.render('adminUtils/adminResetPasswordExpired')); 


module.exports = adminRoute; 