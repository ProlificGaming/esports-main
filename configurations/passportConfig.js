// ES Modules:
// import { Strategy as LocalStrategy } from "passport-local";
// import bcrypt from "bcryptjs";
// import { PrismaClient } from "../generated/prisma"; 

// Common JS Modules:
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// const { PrismaClient } = require("../generated/prisma"); 
const prisma = require("../lib/prisma.js"); 

// Grab generated database from the generated folder. 
// const prisma = new PrismaClient(); 

function InitializePassport(passport){
    passport.use(
        new LocalStrategy({usernameField: "adminUsername", passwordField: "adminPassword"}, async (username, password, done) => {
            try {
                const admin = await prisma.admin.findUnique({ where: { username: username } });
                if (!admin) return done(null, false, { message: "No admin found" }); 
                // if (!admin.isActive) return done(null, false, { message: "Account not activated" }); 

                const isMatch = await bcrypt.compare(password, admin.password); 
                if (!isMatch) return done(null, false, { message: "Incorrect password" }); 

                return done(null, admin); 
            } 
            catch (err) {
                return done(err);
            }
        })
    );

    passport.serializeUser((admin, done) => {
        done(null, admin.id)
    }); 

    passport.deserializeUser(async (id, done) => {
        try {
            const admin = await prisma.admin.findUnique({ where: { id: id } });
            done(null, admin);
        }
        catch (err) {
            done(err);
        }
    }); 
}


module.exports = InitializePassport; 