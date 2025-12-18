const rateLimit = require("express-rate-limit"); 
const slowDown = require("express-slow-down"); 

/** |Notes|
 * WGO: This protects you when there is no matching username (no per-user record to lock), and also adds safety 
 * net even for real users. 
 * TODO: Will later add 'express-slow-down' on top.
 */

// 1) Basics login rate limiter: 10 attempts per IP per 10 minutes.
// Basic brute-force protection per IP:
const adminLoginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10,                  // limit each IP to 10 login requests per window
    message: "Too many login attempts. Please try agin later.",
    standardHeaders: true,   // Return rate limit info in the 'RateLimit-*' headers
    legacyHeaders: false,
}); 

// 2) Progessive slowing: delays kick in after 5 attempts:
const adminLoginSlowdown = slowDown({
    windowMs: 10 * 60 * 1000,
    delayAfter: 5,              // Start slowing after 5 attempts
    delayMs: 1000,              // First slow: 1 second
    maxDelayMs: 15000,          // Max slow: 15 seconds
});

module.exports = {
    adminLoginLimiter,
    adminLoginSlowdown,
};