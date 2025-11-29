const prisma = require("../../lib/prisma.js");
const passport = require("passport");

const adminLoginController = async(req, res, next) => {
    const adminFoundFromUsername = await prisma.admin.findUnique({ where: { username: req.body.adminUsername, }}); 

    /** |Note|
     * adminFoundFromUsername => Username is correct, password is incorrect. 
    */

    // If the admin exist, check lockout BEFORE Passport authenticates: 
    if (adminFoundFromUsername)
    {
        if (adminFoundFromUsername.lockoutUntil && adminFoundFromUsername.lockoutUntil > new Date())
        {
            const lockoutMssg = Object.values(adminFoundFromUsername.lockoutUntil);
            console.log(lockoutMssg); // Testing
            return res.status(403).render("main/admin", {
                title: "Prolific Gaming",
                user: admin,
                lockoutInitiated: true,
                failedAttempt: false, 
                mssg: "Account locked. Try again later", 
            });
        }
    }

    passport.authenticate("local", async(err, user, info) => {
        if (err) return next(err);

        // Authentication failed:
        if (!user)
        {
            if (req.body.adminUsername)
            {
                await prisma.admin.update({
                    where: { username: req.body.adminUsername }, 
                    data: {
                        failedLoginAttempts: { increment: 1 },
                        lockoutUntil: {
                            set: (adminFoundFromUsername.failedLoginAttempts >= 5)
                            ? new Date(Date.now() + 15 * 60 * 1000) // lock for 15 mins
                            : null,
                        },
                    },
                });
            }

            return res.status(401).render("main/admin", {
                title: "Prolific Gaming",
                user: adminFoundFromUsername,
                lockoutInitiated: false,
                failedAttempt: true,
                mssg: "Invalid Credentials",
            });
        }

        // SUCCESS -> Reset attempts:
        await prisma.admin.update({
            where: { id: adminFoundFromUsername.id },
            data: {
                failedLoginAttempts: 0,
                lockoutUntil: null,
            },
        });

        req.logIn(user, err => {
            if (err) return next(err);
            return res.redirect("/admin/dashboard");
        });

    })(req, res, next);
}

module.exports = {
    adminLoginController, 
}