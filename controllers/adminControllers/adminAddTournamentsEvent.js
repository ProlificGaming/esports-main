const prisma = require('../../lib/prisma.js');
const cloudinaryHelpers = require("../../utils/cloudinaryHelpers.js");

/** |Notes|
 * => toLocaleString():
 * The toLocaleString() method of Dates instances returns a string with a language-sensitive 
 * representation of this date in the local timezone. In implementations with Intl.DateTimeFormat API
 * support, this method delegates to Intl.DateTimeFormat. 
 * 
 * -> options: An object adjusting the output format. Corresponds to the options parameter of the 
 * Intl.DateTimeFormat() constructor. If weekday, year, month, days, dayPeriod, hour, minutes, second,
 * and fractionalSecondDigits are all undefined, they year, month, day, hour, minute, second will be set to "numeric". 
 * In implementations withouts Intl.DateTimeFormat support, this parameter is ignored. 
 */

// adminAddTournamentsEventsPost(): Post method route for the tournaments link. 
const adminAddTournamentsEventsPost = async (req, res) => {
    const {name, type, game, startDate, time, playerCount, description } = req.body;

    console.log("Tournament Name: ", name); // Testing 
    console.log("Tournament Type: ", type); // Testing 
    console.log("Tournament Game: ", game); // Testing 
    console.log("Tournament Start Date: ", startDate); // Testing
    console.log("Tournament Time: ", time); // Testing 
    console.log("Tournament Player Count: ", playerCount); // Testing
    console.log("Tournament Description: ", description); // Testing  

    const playerCountInt = parseInt(playerCount); 

    const d = new Date(startDate); // Testing 
    console.log("New Date: ", d); // Testing
  
    // Time Conversion:
    const [hours24, minutes] = time.split(':'); 
    d.setHours(parseInt(hours24, 10));
    d.setMinutes(parseInt(minutes, 10)); 

    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true // Ensure 12-hour format with AM/PM
    }; 

    const time12h = d.toLocaleString('en-US', options); 
    console.log(time12h); // Testing

    let northAmericaTimeZones = [
        {utc: "Eastern Time", zone: "America/New_York"},
        {utc: "Central Time", zone: "America/Chicago"},
        {utc: "Mountain Time", zone: "America/Denver"},
        {utc: "Pacific Time", zone: "America/Los_Angeles"},
        {utc: "Alaska Time", zone: "America/Anchorage"},
        {utc: "Hawaii", zone: "Pacific/Honolulu"},
    ];

    northAmericaTimeZones.forEach((timeZone) => {
        if (timeZone.zone.includes('_'))
        {
            let [america, state] = timeZone.zone.split('/');
            state = state.replace('_', ' ');
            console.log(`${d.toLocaleString('en-US', { timeZone: timeZone.zone })} => ${america}/${state} (${timeZone.utc})`);
        }
        else 
        {
            let [america, state] = timeZone.zone.split('/'); 
            state = state.replace('_', ' ');
            console.log(`${d.toLocaleString('en-US', { timeZone: timeZone.zone })} => ${america}/${state} (${timeZone.utc})`);
        }
    });
    console.log('\n'); // Testing 

    await prisma.tournamentLog.create({
        data: {
            name: name,
            type: type,
            game: game,
            startDate: d,
            time: time12h,
            playerCount: playerCountInt,
            description: description,
            status: "DRAFT", 
            createdById: req.user.id,
        }
    }); 

    res.redirect('/admin/dashboard/tournaments');
}

// adminAddTournamentImagesPost(): Post method that will allow the admin to add images/banners.
const adminAddTournamentImagesPost = async (req, res) => {
    try {
        console.log(req.params.tournamentId); // Testing 
        console.log("FILE: ", req.file); // Testing 

        const tournament = await prisma.tournamentLog.findUnique({
            where: {
                name: req.params.tournamentId,
            },
        });

        if (tournament.bannerPublicId){
            await cloudinaryHelpers.deleteFromCloudinary(tournament.bannerPublicId); 
        }

        await prisma.tournamentLog.update({
            where: {
                name: req.params.tournamentId,
            },
            data: {
                bannerUrl: req.file.path,
                bannerPublicId: req.file.filename,
            }, 
        });

        return res.redirect('/admin/dashboard/tournaments'); 

    }catch(err){
        // TODO: View later to add template if needed. 
        console.error(err);
        return res.status(500).send("Banner update failed"); 
    }
}

// adminDeleteTournamentImages(): Post method that will allow the admin to delete the images/banners.
const adminDeleteTournamentImagesPost = async (req, res) => {
    const { tournamentId } = req.params;
    
    const tournament = await prisma.tournamentLog.findUnique({
        where: { name: tournamentId },
    });
    console.log(tournament); // Testing  

    await cloudinaryHelpers.deleteFromCloudinary(tournament.bannerPublicId);

    await prisma.tournamentLog.update({
        where: { name: tournament.name },
        data: {
            bannerPublicId: null,
            bannerUrl: null, 
        }
    }); 
    
    res.redirect("/admin/dashboard/tournaments"); 
}

module.exports = {
    adminAddTournamentsEventsPost, 
    adminAddTournamentImagesPost, 
    adminDeleteTournamentImagesPost,
}