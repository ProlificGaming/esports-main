// Express + node modules: 
const express = require('express');
const path = require('node:path');

// User/Password authentication + Prisma-Session-Store:
const session = require('express-session'); 
const passport = require('passport'); 
const { PrismaSessionStore } = require('@quixo3/prisma-session-store'); 
// const { PrismaClient } = require("./generated/prisma");
const prisma = require("./lib/prisma.js");
// const passportConfig = require("./configurations/passportConfig.js");
const InitializePassport = require("./configurations/passportConfig.js");

// Default routes: 
const adminRoute = require('./routes/admin.js');
const tournamentRoute = require('./routes/tournaments.js'); 

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000; 

// Acquire the prisma client to begin querying:
// const prisma = new PrismaClient(); 

// Set EJS as the templating engine:
app.set('view engine', 'ejs'); 

// Enables the application to parse data from the POST method:
app.use(express.urlencoded({ extended: true }));

// Serving static assets:
app.use(express.static("public")); 

// Enables json use:
app.use(express.json());
console.log(Object.keys(prisma)); 

/** |Deep Notes|
 * => email functionality:
 * I don't want the Admin to register as a Admin, but to be invited in 
 * as an Admin since they are an employee. Is it possible to have them sign in with
 * an email that I already have linked in the database, and then from there they can 
 * change there username and password to whatever they want.
 * 
 * -> This is called controlled administrative access: We will use the
 * activation-token + email-invite version.
 * 1. Updated Prisma schema (adds token + expiration)
 * 2. Admins invitation generator (for you / superadmin use)
 * 3. Email invite system (using Nodemailer)
 * 4. Secure activation routes
 * 5. EJS template for the email + activation page. 
 * 
 * -> When using nodemailer - make sure to set EMAIL_USER and EMAIL_PASS in .env, and enable "App Passwords"
 * for Gmail or use a real SMTP (Simple Mail Transfer Protocol) service (like Mailgun, SendGrid, or Resend).
 * 
 * ===> |Enforceable username + password creation system for admin-invite workflow|
 * => Production-ready setup:
 * -> Username rules
 * -> Password rules
 * -> Validation functions
 * -> Integration inside your "Activate Admin Invite" endpoint
 * -> Error messages for frontend
 * -> Optional: password strength meter (if you want it)
 * 
 * ===> Express-Rate-Limiting (Per-user lockout and per-IP limiting): 
 * -> Correct username + wrong password (User DB lockout)
 * -> Wrong Username + wrong password (Use rate limit, no DB lockout)
 * -> Already locked users (block before Passport)
 * -> Clean integration with your existing adminRoute + passport.authenticate("local")
 */

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
app.get("/", async (req, res) => {
    const tournamentLog = await prisma.tournamentLog.findMany(); 

    let tournaments = []; 
    let timeZonesArr = []; 

    // If the tournament status is 'PUBLIC' then the tournament will be displayed in the tournament section.
    tournamentLog.forEach((tournament) => {
        if (tournament.status === 'PUBLIC')
        {
            tournaments.push(tournament); 
        }
    });

    // ...
    tournamentLog.forEach((tournament) => {
        for (const key in tournament.timeZones){
            Object.assign(tournament.timeZones[key], { name: tournament.name }); 
            timeZonesArr.push(tournament.timeZones[key]); 
        }
    });

    timeZonesArr.forEach((timeZone) =>{
        console.log(timeZone); // Testing
    });
    console.log('\n'); // Testing 

    // Will display each tournament in the chosen aspect ratio. 
    const tournamentSectionAspectRatio = await prisma.frontendLayout.findUnique({
        where: { sectionName: "homepageTournamentSection" },
    });

    res.status(200).render("main/index", {
        title: "Prolific Gaming",
        user: req.user,
        tournamentSectionAR: tournamentSectionAspectRatio,
        tournamentLog: tournaments,
        timeZones: timeZonesArr, 
    });
});

// Other routes:
app.use('/admin', adminRoute);
app.use('/tournaments', tournamentRoute); 

app.listen(PORT, () => {
    console.log(`The application is listening on PORT ${PORT}`); 
});