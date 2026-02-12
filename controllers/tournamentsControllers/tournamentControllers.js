const prisma = require('../../lib/prisma.js'); 

// gameSelections: Will hold all the applications game selections that are ran in tournaments: 
const gameSelections = [
    { game: 'Marvel Rivals', present: false },
    { game: 'Call of Duty Warzone', present: false },
    { game: 'Apex Legends', present: false },
    { game: 'Valorant', present: false },
    { game: 'Overwatch', present: false },
    { game: 'Rocket League', present: false }, 
    { game: 'Fortnite', present: false },
    { game: 'King of Fighters', present: false }, 
];

// tournamentsControllerGet(): The main page to view all the tournaments in the application. 
const tournamentsControllerGet = async(req, res) => {
    const tournaments = await prisma.tournamentLog.findMany(); // All tournaments

    const homepageTournamentSection = await prisma.frontendLayout.findUnique({ // Homepage Tournament Section Aspect Ratio
        where: { sectionName: "homepageTournamentSection"},
    });

    const tournamentspageTournamentSection = await prisma.frontendLayout.findUnique({ // Tournaments Page Tournament Section Aspect Ratio
        where:{ sectionName: "tournamentspageTournamentsSection"}
    }); 

    tournaments.forEach((tournament) => { // Search through all tournaments for the presence of the game ip. 
        gameSelections.forEach((selection) => {
            if (tournament.game === selection.game)
            {
                selection.present = true; 
            }
        }); 
    });

    await prisma.frontendLayout.update({ // Update Tournaments Page Tournament Section Aspect Ratio.  
        where: { sectionName: tournamentspageTournamentSection.sectionName },
        data: { SectionAspectRatio: homepageTournamentSection.SectionAspectRatio }, 
    }); 

    console.log("Homepage Tournament Section: ", tournaments.length); // Testing 
    console.log("Tournaments Page Tournament Section: ", tournamentspageTournamentSection); // Testing
    console.log("Game Selections: ", gameSelections); // Testing 

    res.render('main/tournaments/tournaments', {
        user: req.user, 
        tournaments: tournaments,
        tournamentsAr: tournamentspageTournamentSection,
        gameSelections: gameSelections, 
    }); 
}

// tournamentControllerGet(): Get method for an individual tournament or event. 
const tournamentControllerGet = async(req, res) => {
    const { tournamentId } = req.params;

    const tournament = await prisma.tournamentLog.findUnique({ // Fetching for the correct tournament/event
        where: { name: tournamentId },
    });

    const homepageTournamentSectionAr = await prisma.frontendLayout.findUnique({
        where: { sectionName: "homepageTournamentSection" },
    });

    const tournamentspageTournamentsSectionAr = await prisma.frontendLayout.findUnique({
        where: { sectionName: "tournamentspageTournamentsSection" }, 
    });

    await prisma.frontendLayout.update({
        where: { sectionName: tournamentspageTournamentsSectionAr.sectionName },
        data: { SectionAspectRatio: homepageTournamentSectionAr.SectionAspectRatio },
    }); 

    let tournamentGame = null;
    switch(tournament.game)
    {
        case 'Apex Legends':
            tournamentGame = 'apex-legends-bg';
            break;
        case 'Call of Duty Warzone': 
            tournamentGame = 'warzone-bg';
            break;
        case 'Marvel Rivals':
            tournamentGame = 'rivals-bg';
            break;
        case 'Valorant':
            tournamentGame = 'valorant-bg';
            break;
        case 'Overwatch':
            tournamentGame = 'overwatch-bg';
            break;
        case 'Rocket League':
            tournametGame = 'rocket-league-bg';
            break;
        case 'Fortnite':
            tournamentGame = 'fortnite-bg';
            break;
        case 'King of Fighters':
            tournamentGame = 'kof-bg';
            break;
        default:
            tournamentGame = null
    }

    for(const key in tournament.timeZones){
        console.log("Timezone: ", tournament.timeZones[key]); // Testing 
        
    }

    try{
        res.status(200).render('main/tournaments/tournament', {
            title: tournamentId,
            user: req.user,
            tournament: tournament,
            tournamentGame: tournamentGame,
            tournamentAr: tournamentspageTournamentsSectionAr,
        }); 

    }catch(err){
        // TODO: View later, to add error handling template if needed. 
        res.status(500).send("I'm sorry, but we can't find this specific tournament right now."); 
        console.error(err); // Testing
    }
}

module.exports = {
    tournamentsControllerGet, 
    tournamentControllerGet, 
}