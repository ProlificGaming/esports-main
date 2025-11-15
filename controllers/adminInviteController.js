const crypto = require("node:crypto");
const { PrismaClient } = require("../generated/prisma");
const mailSys = require("../utils/mailer.js");

const prisma = new PrismaClient(); 

const inviteAdmin = async(req, res) => {
    const { email } = req.body;

    try{
        // Generate token + expiration (e.g., 24 hours)
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); 

        const newAdmin = await prisma.admin.create({
            data: {
                email: email,
                activationToken: token,
                tokenExpiresAt: expiresAt,
                isActive: false, 
            },
        });

        // Send email invite:
        const activationLink = `${process.env.TEMP_BASE_URL}/admin/activate/${token}`;
        await mailSys.sendInvite(email, activationLink); 

        res.status(200).json({ message: `Invite sent to ${email}`, admin: newAdmin });
    }
    catch (err){
        res.status(500).json({ error: "Failed to invite admin." });  
    }
}

module.exports = { inviteAdmin };