const prisma = require("../../lib/prisma.js");
const passport = require("passport");

const securityConfig = require("../../configurations/security-config.js");
const { logSecurityEvent } = require("../../utils/securityLogger.js");
const { updateLanguageServiceSourceFile } = require("typescript");

// adminLoginController(): Admin login controller for post route:
const adminLoginController = async(req, res, next) => {

    // 1) Try to fetch admin: 
    const adminFoundFromUsername = await prisma.admin.findUnique({ where: { username: req.body.adminUsername, }});
    const ip = req.ip;
    const userAgent = req.get("User-Agent") ?? "unknown";

    // Security Log Event: Testing if the username field was entered in. 
    // Note: This test isn't directly needed because the client side will
    // catch the empty field with a 'required client side prompt, however
    // this will be kept for safety measures just in case. 
    if (!adminFoundFromUsername.username)
    {
        await logSecurityEvent({
            ip,
            username: null,
            success: false, 
            reason: "Missing username field",
            userAgent,
        });

        return res.status(400).render("main/admin", {
            title: "Prolific Gaming", 
            user: adminFoundFromUsername,
            lockoutInitiated: false,
            failedAttempt: true,
            mssg: `Username is required.`,
        }); 
    } 

    /** |Note|
     * -> adminFoundFromUsername => Username is correct, password is incorrect. 
     * -> If the username is incorrect and the password is incorrect, then this
     * "log in controller" will use IP-Based or Session-Based rate limiting. This will
     * lock the user out by their IP-Address. This prevents bots from brute-forcing random
     * usernames and passwords. This is where rate-limits will be used.  
    */

    // 2) If the admin exist, check lockout BEFORE Passport authenticates: 
    if (adminFoundFromUsername)
    {
        if (adminFoundFromUsername.lockoutUntil && adminFoundFromUsername.lockoutUntil > new Date())
        {
            // Logging the account lockout from the failed login attempts. 
            await logSecurityEvent({
                ip: ip,
                userame: adminFoundFromUsername.username,
                success: false,
                reason: "Account locked (pre-auth)", 
                userAgent: userAgent,       
            }); 

            console.log("Full: ", adminFoundFromUsername.lockoutUntil); // Testing 
            console.log("Millieseconds: ", adminFoundFromUsername.lockoutUntil.getTime()); // Testing 
            console.log("Minutes: ", adminFoundFromUsername.lockoutUntil.getMinutes()); // Testing 
            console.log("Hours: ", adminFoundFromUsername.lockoutUntil.getHours()); // Testing 
            console.log("Date: ", adminFoundFromUsername.lockoutUntil.getDate()); // Testing 
            console.log("Days: ", adminFoundFromUsername.lockoutUntil.getDay()); // Testing 
            console.log("Year: ", adminFoundFromUsername.lockoutUntil.getFullYear()); // Testing 
            console.log("Month: ", adminFoundFromUsername.lockoutUntil.getMonth() + 1); // Testing 
            console.log("New Date: ", new Date()); // Testing 

            console.log("Attempts after lockout: ", adminFoundFromUsername.attemptsAfterLockout); // Testing 
            const remainingMs = adminFoundFromUsername.lockoutUntil.getTime() - Date.now();
            console.log("Remaining Ms: ", remainingMs); // Testing 
            const remainingMins = Math.max(1, Math.ceil(remainingMs / (60 * 1000)));
            console.log(remainingMins); // Testing 

            return res.status(400).render("main/admin", {
                title: "Prolific Gaming",
                user: adminFoundFromUsername,
                lockoutInitiated: true,
                failedAttempt: false, 
                mssg: `Account locked. You've been locked out for ${remainingMins} minutes. Please try again later.`,
            });
        }
    }

    passport.authenticate("local", async(err, user, info) => {
        if (err) return next(err);

        // Authentication failed:
        if (!user)
        {
            // Test: If the username was correctly found. 
            const usernameFound = await prisma.admin.findUnique({
                where: { username: req.body.adminUsername },
            });
            
            // ---Second Method For Lockout Logic---
            // If the username is not null, then perform lockout logic with the Admin database: 
            // Note: This "Lockout Logic Method" will not read a null data field and will
            // prevent errors from being thrown. You won't need to worry about username 
            // having an empty field because this will be handled on the client side. 
            // -> Lockout Rule: The username not being null/correct will produce a 15 minute lockout if the
            // password credentials are incorrect. 
            // -> Lockout Rule: The username being null/incorrect and the password being incorrect together will produce
            // a 10 minute lockout. 
            if (usernameFound !== null)
            {
                if (usernameFound.failedLoginAttempts >= securityConfig.MAX_LOGIN_ATTEMPTS)
                {
                    securityConfig.USER_LOCKED_OUT = true; 
                    await prisma.admin.update({
                        where: { username: usernameFound.username },
                        data:{ lockoutUntil: { set: new Date(Date.now() + 15 * 60 * 1000) } },
                    });
                }
                else 
                {
                    await prisma.admin.update({
                        where: { username: usernameFound.username },
                        data: { failedLoginAttempts: { increment: 1} },
                    });
                }
                securityConfig.user_authentication_failed_mssg = `Invalid password credentials`;

                await logSecurityEvent({
                    ip: ip,
                    username: usernameFound.username,
                    success: false,
                    reason: (securityConfig.USER_LOCKED_OUT)
                    ? "Failed login (account locked)"
                    : "Failed login (wrong password)",
                    userAgent: userAgent, 
                });
            }
            else
            {
                securityConfig.user_authentication_failed_mssg = `Username is invalid`;

                await logSecurityEvent({
                    ip: ip,
                    username: usernameFound.username,
                    success: false,
                    reason: "Failed login (wrong username)", 
                    userAgent: userAgent, 
                }); 
            }

            // ---First Method For Lockout Logic---
            // Note: This method won't be used since it is trying to read a null data field.
            // We also don't need to test for a empty/null username field since the client
            // side is handling all of that. 
            // if (req.body.adminUsername)
            // {
            //     await prisma.admin.update({
            //         where: { username: req.body.adminUsername }, 
            //         data: {
            //             failedLoginAttempts: { increment: 1 },
            //             lockoutUntil: {
            //                 set: (adminFoundFromUsername.failedLoginAttempts >= 5)
            //                 ? new Date(Date.now() + 15 * 60 * 1000) // lock for 15 mins
            //                 : null,
            //             },
            //         },
            //     });
            // }

            // If usernameFound is null -> Then the username was incorrect/not found.
            // In that case, we do not touch the Admin Database (no per-user record),
            // but our IP-based rate limiter is already in place before this controller. 
            return res.status(401).render("main/admin", {
                title: "Prolific Gaming",
                user: adminFoundFromUsername,
                lockoutInitiated: false,
                failedAttempt: true,
                mssg: securityConfig.user_authentication_failed_mssg,
            });
        }

        // SUCCESS -> Reset attempts:
        // 'user' is what Passport's LocalStrategy returns. 
        // We will reset all the 'lockout logic' for the lockout
        // field columns in the Admin database table. 
        await prisma.admin.update({
            where: { id: adminFoundFromUsername.id },
            data: {
                failedLoginAttempts: 0,
                lockoutUntil: null,
            },
        });

        await logSecurityEvent({
            ip: ip,
            username: adminFoundFromUsername.username,
            success: true,
            reason: "Successful login", 
            userAgent: userAgent,
        });

        // Login the admin in via passport. 
        req.logIn(user, err => {
            if (err) return next(err);
            return res.redirect("/admin/dashboard");
        });

    })(req, res, next);
}

module.exports = {
    adminLoginController, 
}