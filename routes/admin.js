const express = require('express'); 
const passport = require('passport'); 
const { PrismaClient } = require('../generated/prisma');
const bcrypt = require("bcryptjs"); 

const adminRoute = express();
const prisma = new PrismaClient(); 

// Admin get route:
adminRoute.get('/', (req, res) => {
    res.status(200).render("main/admin", {
        title: "Administration Log In",
    });
});

// Admin post route:
adminRoute.post('/', (req, res) => {
    const {adminUsername, adminPassword } = req.body;
    console.log("Admin Username: ", adminUsername); // Testing 
    console.log("Admin Password: ", adminPassword); // Testing 

    passport.authenticate("local", {
        successRedirect: "/admin/dashboard",
        failureRedirect: "/admin",
        failureFlash: true, 
    })
});

// Admin activate get route:  
adminRoute.get("/activate", (req, res) => {
    res.render("main/adminActivate");
});

// Admin activate post route: 
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
    res.render("main/adminSetCredentials", { email: admin.email });

    // Redirect the new admin back to the admin username and password to log in. 
    // res.status(200).redirect("/admin"); 
});

// Admin activate post route: 
adminRoute.post("/activate/set-credentials", async (req, res) => {
    const {email, setUsername, setPassword } = req.body;

    const admin = await prisma.admin.findUnique({ where: { email } });
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

    const hashedPassword = await bcrypt.hash(setPassword, 10); 

    await prisma.admin.update({
        where: { email },
        data: {
            username: setUsername, 
            password: hashedPassword,
            isActive: true, 
        },
    });

    res.render("main/adminActivateSuccess", { username: setUsername }); 
});

// Admin dashboard get route: 
adminRoute.get('/dashboard', EnsureAdminAuthenticated, (req, res) => {
    res.status(200).send("Admin Dashboard"); 
}); 

function EnsureAdminAuthenticated(req, res, next){
    if (req.isAuthenticated() && req.user.role === "admin")
    {
        return next();
    }
    res.redirect('/admin');  
}

module.exports = adminRoute; 