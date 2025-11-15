// Express + node modules: 
const express = require('express');
const path = require('node:path');

// User/Password authentication + Prisma-Session-Store:
const session = require('express-session'); 
const passport = require('passport'); 
const { PrismaSessionStore } = require('@quixo3/prisma-session-store'); 
const { PrismaClient } = require("./generated/prisma");
// const passportConfig = require("./configurations/passportConfig.js");
const InitializePassport = require("./configurations/passportConfig.js");

// Default routes: 
const adminRoute = require('./routes/admin.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000; 

// Acquire the prisma client to begin querying:
const prisma = new PrismaClient(); 

// Set EJS as the templating engine:
app.set('view engine', 'ejs'); 

// Enables the application to parse data from the POST method:
app.use(express.urlencoded({ extended: true }));

// Serving static assets:
app.use(express.static("public")); 

// Enables json use:
app.use(express.json());
console.log(Object.keys(prisma)); 

/**
 * -------------- Session Store--------------
 */
const prismaStore = new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, // Check and delete expired sessions every 2 minutes.
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
});

app.use(
    session({
        secret: process.env.SECRET_KEY,
        name: "sid",
        resave: false,
        saveUninitialized: false,
        store: prismaStore,
    })
);

/**
 * -------------- Passport Configuration --------------
 */
InitializePassport(passport);
app.use(passport.initialize()); 
app.use(passport.session());


/**
 * -------------- Default Routes --------------
 */
// Index route:
app.get("/", (req, res) => {
    res.status(200).render("main/index", {
        title: "Prolific Gaming", 
    });
});

// Other routes:
app.use('/admin', adminRoute);

app.listen(PORT, () => {
    console.log(`The application is listening on PORT ${PORT}`); 
});