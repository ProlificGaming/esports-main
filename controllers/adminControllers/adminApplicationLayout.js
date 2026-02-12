const prisma = require('../../lib/prisma.js'); 

const homepageTournamentAspectRatio = [
    { ratio: "ar-1-1", current: false },
    { ratio: "ar-3-2", current: false },
    { ratio: "ar-4-3", current: false },
    { ratio: "ar-6-1", current: false },
    { ratio: "ar-16-9", current: false}, 
];

// adminApplicationLayoutGet(): Admin Application Get Route.
const adminApplicationLayoutGet = async (req ,res) => {
    const homepageTournamentSection = await prisma.frontendLayout.findUnique({
        where: { sectionName: "homepageTournamentSection" },
    });

    homepageTournamentAspectRatio.forEach((aspectRatio) => {
        if (aspectRatio.ratio === homepageTournamentSection.SectionAspectRatio)
        {
            aspectRatio.current = true;
        }
        else
        {
            aspectRatio.current = false; 
        }
    }); 

    res.render("adminDashboard/sidebarLinks/adminApplicationLayout", {
        username: req.user.username,
        role: req.user.role,
        tournamentAspectRatio: homepageTournamentAspectRatio, 
    });
}

// adminTournamentApplicationLayoutPost(): Admin tournament application layout post route. 
const adminTournamentApplicationLayoutPost = async (req, res) => {
    let aspectRatio = null;

    for (let key in req.body){
        aspectRatio = key; 
    }
    
    homepageTournamentAspectRatio.forEach(async(ar) => {
        if (ar.ratio === aspectRatio)
        {
            if (ar.current)
            {
                ar.current = false; 
                await prisma.frontendLayout.update({
                    where: { sectionName: "homepageTournamentSection" },
                    data: { SectionAspectRatio: null },
                });
            }
            else
            {
                ar.current = true; 
                await prisma.frontendLayout.update({
                    where: { sectionName: "homepageTournamentSection" },
                    data: { SectionAspectRatio: aspectRatio }, 
                })
            }
        }
    }); 

    res.redirect('/admin/dashboard/application-layout');
}


module.exports = {
    adminApplicationLayoutGet,
    adminTournamentApplicationLayoutPost, 
}