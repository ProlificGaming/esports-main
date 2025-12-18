const prisma = require("../lib/prisma.js");

async function logSecurityEvent({ ip, username, success, reason, userAgent }){
    try {
        await prisma.securityLog.create({
            data: {
                ipAddress: ip, 
                username,
                success,
                reason,
                userAgent,
            },
        });
    }catch(err){
        console.error("Failed to save security log: ", err); 
        // TODO: Render a template error page here or error middleware. 
    }
}

module.exports = {
    logSecurityEvent,
}; 