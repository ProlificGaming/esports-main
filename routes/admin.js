const express = require('express'); 
const passport = require('passport'); 
const prisma = require("../lib/prisma.js");
const bcrypt = require("bcryptjs"); 

const adminInvites = require("../controllers/adminInviteController.js");
const adminForgotUsernamePassword = require("../controllers/adminControllers/adminForgotUsernamePassword.js"); 
const adminControllers = require("../controllers/adminControllers/adminLoginController.js"); 
const adminAddTournamentsEventsPost = require("../controllers/adminControllers/adminAddTournamentsEvent.js");

const injectTheme = require("../middlewares/themeInjector.js"); 
const adminDashboardSidebarLinksMiddleWare = require("../middlewares/adminDashboardSidebarLinks.js"); 
const upload = require("../middlewares/uploadTournamentBanner.js"); 

const { adminLoginLimiter, adminLoginSlowdown } = require("../configurations/rateLimiters.js"); 
const { validateUsername, validatePassword } = require("../utils/validators.js"); 

const adminRoute = express();

// Middleware content: 
adminRoute.use(injectTheme); 
adminRoute.use(adminDashboardSidebarLinksMiddleWare);  

/**
 * ------------------------------------- Admin Username/Password Authentication Section -------------------------------------
 */
// Admin login get route:
adminRoute.get('/', (req, res) => {
    if (req.isUnauthenticated())
    {
        res.status(200).render("main/admin", {
            user: req.user, // For: logInWindow.ejs template.
            title: "Prolific Gaming",
            lockoutInitiated: false,
            failedAttempt: false,
            mssg: null,
        });
    }
    else
    {
        res.status(200).render("main/index", {
            title: "Prolific Gaming", 
            user: req.user,
        }); 
    }
});

// Admin post route:
// adminRoute.post('/',
//     passport.authenticate("local", {
//         successRedirect: "/admin/dashboard",
//         failureRedirect: "/",
//     })
// );

// TODO: Remember to add the express-rate-limiter function to
// lockout IP-addresses to try brute force the admin. This will
// help prevent bots from hacking the administration portal. 
// Express-rate-limiter functions: adminLoginLimiter() and adminLoginSlowdown()
/** ORDER MATTERS:
 * 1) slowdown (progressive delay)
 * 2) limiter (caps total attempts)
 * 3) login controller (DB lockout + passport)
 */
adminRoute.post('/', adminControllers.adminLoginController); // New admin login pattern with rate-limiters

// Admin dashboard get route: 
adminRoute.get('/dashboard', EnsureAdminAuthenticated, (req, res) => {
    console.log(req.user); // Testing     

    res.status(200).render("main/adminDashboard", {
        username: req.user.username,
        role: req.user.role,
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

/** 
 * ------------------------------------- Admin Dashboard Sidebar Links Section -------------------------------------
 */
// AdminCurrentAppearanceThemes: The current theme for the admin dashboard:
let adminCurrentAppearanceThemes = [
    {name: "dark", current: false, buttonHoverColor: '#f12711' },
    {name: "white", current: false},
    {name: "orange-creme", current: false},
    {name: "horizon", current: false}, 
]; 

// Admin appearance get route: (sidebar link get route):
adminRoute.get("/dashboard/appearance", (req, res) => {
    adminCurrentAppearanceThemes.forEach((theme) => {
        if (theme.name === req.user.theme)
        {
            theme.current = true;
        }
        else
        {
            theme.current = false;
        }
    });

    res.status(200).render("adminDashboard/sidebarLinks/adminAppearance", {
        username: req.user.username, 
        role: req.user.role,
        currentTheme: adminCurrentAppearanceThemes, 
        hoverCover: adminCurrentAppearanceThemes.forEach(theme => {if (theme.current) return theme.buttonHoverColor }),
    }); 
}); 

// Admin appearance post route: (Sidebar link post route): 
adminRoute.post("/dashboard/appearance", async(req, res) => {
    const { theme } = req.body; 

    if (!["orange-creme", "dark", "white", "horizon"].includes(theme)){
        return res.status(400).render('adminErrors/designError.ejs');
    }

    await prisma.admin.update({
        where: { id: req.user.id },
        data:{
            theme: theme,
        }
    }); 

    return res.redirect("/dashboard/appearance"); 
});

// Admin invite get route: (Sidebar link get route): 
adminRoute.get("/dashboard/invite", (req, res) => {
    res.status(200).render("main/adminInvite", {
        inviteSent: null,
        username: req.user.username,
        role: req.user.role,
    });
}); 

// Admin invite post route: (Sidebar link post route): 
adminRoute.post("/dashboard/invite", adminInvites.inviteAdmin);

// Admin: Set tournaments get route: (Sidebar link get route):
adminRoute.get("/dashboard/tournaments", async (req, res) => {
    const tournaments = await prisma.tournamentLog.findMany();

    res.render("adminDashboard/sidebarLinks/adminTournaments", {
        username: req.user.username,
        role: req.user.role,
        tournaments: tournaments, 
    }); 
});

adminRoute.post("/dashboard/tournaments", adminAddTournamentsEventsPost.adminAddTournamentsEventsPost); 
adminRoute.post(
    "/dashboard/tournaments/:tournamentId", 
    upload.single("banner"), 
    adminAddTournamentsEventsPost.adminAddTournamentImagesPost
);
adminRoute.post(
    "/dashboard/tournaments/:tournamentId/delete",
    adminAddTournamentsEventsPost.adminDeleteTournamentImagesPost
);

/**
 * ------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------
 */

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
    const admin = await prisma.admin.findMany({ where: { email } });

    if (!admin)
    {
        return res.render("main/adminActivate", {
            error: "Email not found" 
        });
    }

    if (admin.isActive)
    {
        return res.render("main/adminActivate", {
            error: "Account already activated. Please log in." 
        }); 
    }

    // Render the form to set username and password (Note: This is technically your GET request for this route):
    res.render("main/adminSetCredentials", { 
        email: email, 
        token: admin[0].activationToken,
        noUsernameError: true,
        noPasswordError: true,
        usernameExist: false,
        usernameRules: {},
        passwordRules: {},
        usernameExistMssg: "This username already exist. Please choose another one.", 
    });
});

// Admin activate get route - /admin/activate/:token
adminRoute.get("/activate/:token", async (req, res) => {
    const { token } = req.params; 

    const admin = await prisma.admin.findUnique({ where: { activationToken: token } }); 

    if (!admin) return res.render("main/adminActivateError", { error: "Invalid token." }); 

    if (admin.isActive)
    {
        return res.render("main/adminActivateError", { 
            error: "Account already activated" 
        }); 
    }

    if (admin.tokenExpiresAt && admin.tokenExpiresAt < new Date())
    {
        return res.render("main/adminActivateError", { 
            error: "Activation link expired." 
        }); 
    }

    // Render the form to set username and password (Note: This is technically your GET request for this route):
    res.render("main/adminSetCredentials", {
        email: admin.email, 
        token: token,
        noUsernameError: true, 
        noPasswordError: true,
        usernameExist: false,
        usernameRules: {},
        passwordRules: {},
        usernameExistMssg: "This username already exist. Please choose another one.",
    }); 
});

// Admin activate post route: 
adminRoute.post("/activate/set-credentials", async (req, res) => {
    const { userToken, userEmail, setUsername, setPassword } = req.body;

    // Check activation token:
    const admin = await prisma.admin.findMany({
        where:{
            activationToken: userToken,
        }
    }); 

    // Check if the username already exist: 
    const usernameExist = await prisma.admin.findUnique({
        where: {
            username: setUsername,
        }
    });

    // validate username and password: 
    if ((!validateUsername(setUsername)) || (!validatePassword(setPassword)))
    {
        return res.status(400).render("main/adminSetCredentials", {
            email: userEmail,
            token: userToken, 
            noUsernameError: validateUsername(setUsername),
            noPasswordError: validatePassword(setPassword),
            usernameExist: false,
            usernameRules: {
                invalid: "Invalid username format:",
                characters: "Needs to be 6-20 characters long.",
                includes: "Can include letters, numbers, periods, and underscores.",
                noPunc: "No consecutive punctuation: .., __, ._, etc.",
                noEndPunc: "No ending punctuation or symbols (!@#$%^&*-=+_).",
                start: "Must start with a letter.", 
                validExample: "Valid usernames: john_admin, super.mod01, alex92, and Admin_Team1.",
            },
            passwordRules: {
                invalid: "Invalid password format:",
                characters: "Must be 12 characters or more.",
                uppercase: "Must contain 1 uppercase character.", 
                lowercase: "Must contain 1 lowercase character.",
                digit: "Must contain at least 1 digit.", 
                special: 'Must contain at least 1 special character (!@#$%^&*()_+-=[]{};:"\',.<>\?)',
                spaces: "Can't contain spaces",
                validExample: "Valid passwords: ProlificAdmin#2025, SecurePass_88!!, ModAccess@Level2", 
            },
            usernameExistMssg: "This username already exist. Please choose another one.",
            
        });
    }
    

    // If the new admin username is already exist on another admin file. 
    // TODO: This still needs to be unit tested.
    if (usernameExist){
        return res.status(404).render("main/adminSetCredentials", {
            email: userEmail,
            token: userToken, 
            noUsernameError: validateUsername(setUsername),
            noPasswordError: validatePassword(setPassword),
            usernameExist: true,
            usernameRules: {
                invalid: "Invalid username format:",
                characters: "Needs to be 6-20 characters long.",
                includes: "Can include letters, numbers, periods, and underscores.",
                noPunc: "No consecutive punctuation: .., __, ._, etc.",
                noEndPunc: "No ending punctuation or symbols (!@#$%^&*-=+_).",
                start: "Must start with a letter.", 
                validExample: "Valid usernames: john_admin, super.mod01, alex92, and Admin_Team1.",
            },
            passwordRules: {
                invalid: "Invalid password format:",
                characters: "Must be 12 characters or more.",
                uppercase: "Must contain 1 uppercase character.", 
                lowercase: "Must contain 1 lowercase character.",
                digit: "Must contain at least 1 digit.", 
                special: 'Must contain at least 1 special character (!@#$%^&*()_+-=[]{};:"\',.<>\?)',
                spaces: "Can't contain spaces",
                validExample: "Valid passwords: ProlificAdmin#2025, SecurePass_88!!, ModAccess@Level2", 
            },
            usernameExistMssg: "This username already exist. Please choose another one.",
        });
    }

    // If the admin doesn't exist in the database:
    // TODO: This still needs to be unit tested.
    if (!admin)
    {
        const setCredentialErrorMssg = "It would seem that the token wasn't linked to the admin invite."; 
        return res.status(404).render("main/adminSetCredentialError", {
            title: "Admin Set Credential Error", 
            error: "The token wasn't found due the admin account not being in the system from a failed invite.",
            mssg: setCredentialErrorMssg,
        });  
    }

    // If the admin already has an active account with their general email in the database:
    // TODO: This still needs to be unit tested. 
    if (admin.isActive)
    {
        const setCredentialErrorMssg = `This admin account seems to already exist. 
                                   Please refer to the <a href="/admin/forgot-username">forgot Username</a>, or
                                   <a href="/admin/forgot-password">forgot password</a> links to recover this 
                                   account if you forgot your login credentials.`;
        return res.status(404).render("main/adminSetCredentialError", {
            title: "Admin Set Credential Active", 
            error: "This account is already active", 
            mssg: setCredentialErrorMssg,
        }); 
    }

    // Test if the admin token has expired:
    // TODO: This still needs to be unit tested.
    if (admin.tokenExpiresAt && admin.tokenExpiresAt < new Date())
    {
        return res.status(400).render("adminActivateError", { 
            error: "Activation link expired" 
        }); 
    }

    const hashedPassword = await bcrypt.hash(setPassword, 10); 

    await prisma.admin.update({
        where: { activationToken: userToken },
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

/** |Password & Username Recovery|
 * ==> Routes: /forgot-username; /forgot-password; and /reset-password/:token
 * 
 * ==> What these routes can do: 
 * -> Username recovery
 * -> Password reset
 * -> Email-based admin identity flow
 * -> Token expiration logic
 * -> No account enumeration leaks
 * -> Production-grade nodemailer integration. 
 */
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

// adminRoute.get("/reset-password", (req, res) => res.render('adminUtils/adminResetPasswordExpired')); 

module.exports = adminRoute; 