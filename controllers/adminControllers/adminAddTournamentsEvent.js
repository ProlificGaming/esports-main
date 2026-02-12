const prisma = require('../../lib/prisma.js');
const cloudinaryHelpers = require("../../utils/cloudinaryHelpers.js");
const generateSingleElimBrackets = require("../../utils/generateSingleElimBrackets.js"); 
const { format } = require('date-fns');

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
    const {name, type, game, startDate, time, playerCount, bracketCount, description } = req.body;

    console.log("Tournament Name: ", name); // Testing 
    console.log("Tournament Type: ", type); // Testing 
    console.log("Tournament Game: ", game); // Testing 
    console.log("Tournament Start Date: ", startDate); // Testing
    console.log("Tournament Time: ", time); // Testing 
    console.log("Tournament Player Count: ", playerCount); // Testing
    console.log("Tournament Bracket Count: ", bracketCount); // Testing 
    console.log("Tournament Description: ", description); // Testing  

    const playerCountInt = parseInt(playerCount); 
    const bracketCountInt = parseInt(bracketCount); 

    // Formatting the date: 
    const [year, month, date] = startDate.split('-');
    const d = new Date(year, month - 1, date); // Testing 
    console.log("New Date: ", d); // Testing
    const dateFormatted = format(new Date(d.getFullYear(), d.getMonth(), d.getDate()), '(eee) MMM-dd-yyyy'); 
    console.log('Date Format: ', dateFormatted); // Testing 
  
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

    let internationalTimeZones = [
        {utc: "Western European Time", zone: "Europe/London", BCP47: "en-GB"},
        {utc: "Central European Time", zone: "Europe/Paris", BCP47: "fr-FR"},
        {utc: "Japan Standard Time", zone: "Asia/Tokyo", BCP47: "ja-JP"}, 
        {utc: "Hong Kong Time", zone: "Asia/Hong_Kong", BCP47: "en-HK"},
        {utc: "Gulf Standard Time", zone: "Asia/Dubai", BCP47: "en-AE"},
        {utc: "Australian Standard Time", zone: "Australia/Sydney", BCP47: "en-AU"},
        {utc: "Brasilia Time", zone: "America/Sao_Paulo", BCP47: "pt-BR"},
    ];


    let domesticTimeZones = {}; 
    let majorInternationalTimeZones = {}; 

    // Implementing domestic timezones: 
    northAmericaTimeZones.forEach((timeZone, index) => {
        if (timeZone.zone.includes('_'))
        {
            let [america, state] = timeZone.zone.split('/');
            state = state.replace('_', ' ');
            console.log(`${d.toLocaleString('en-US', { timeZone: timeZone.zone })} => ${america}/${state} (${timeZone.utc})`);
            console.log(`${format(new Date(d.getFullYear(), d.getMonth(), d.getDate()), '(eee) MMM-dd-yyyy')}`);
            console.log('\n'); // Testing 
            domesticTimeZones[`timezone${index}`] = {
                utc: timeZone.utc, 
                date: format(new Date(d.getFullYear(), d.getMonth(), d.getDate()), '(eee) MMM-dd-yyyy'),
                zone: `${america}/${state}`,
                time: d.toLocaleString('en-US', { timeZone: timeZone.zone, hour: 'numeric', minute: 'numeric', hour12: true }),
            }
        }
        else 
        {
            let [america, state] = timeZone.zone.split('/'); 
            state = state.replace('_', ' ');
            console.log(`${d.toLocaleString('en-US', { timeZone: timeZone.zone })} => ${america}/${state} (${timeZone.utc})`);
            console.log(`${format(new Date(d.getFullYear(), d.getMonth(), d.getDate()), '(eee) MMM-dd-yyyy')}`);
            console.log('\n'); // Testing
            domesticTimeZones[`timezone${index}`] = {
                utc: timeZone.utc,
                date: format(new Date(d.getFullYear(), d.getMonth(), d.getDate()), '(eee) MMM-dd-yyyy'), 
                zone: timeZone.zone,
                time: d.toLocaleString('en-US', { timeZone: timeZone.zone, hour: 'numeric', minute: 'numeric', hour12: true }),
            }
        }
    });
    console.log('\n'); // Testing 

    // Implementing international timezones: 
    const intD = new Date(year, month - 1, date); 
    intD.setHours(parseInt(hours24, 10)); 
    intD.setMinutes(parseInt(minutes, 10)); 

    internationalTimeZones.forEach((timeZone, index) => {
        if (timeZone.zone.includes('_'))
        {
            let [region, city] = timeZone.zone.split('/');
            city = city.replace('_', ' '); 

            let dateFormat = intD.toLocaleDateString(timeZone.BCP47, { timeZone: timeZone.zone, year: 'numeric', month: 'numeric', day: 'numeric' }); 
            const [iDate, iMonth, iYear] = dateFormat.split('/');

            majorInternationalTimeZones[`timezone${index}`] = {
                utc: timeZone.utc,
                date: format(new Date(iYear, iMonth, iDate), '(eee) MMM-dd-yyyy'), 
                zone: `${region}/${city}`,
                time: intD.toLocaleString(timeZone.BCP47, { timeZone: timeZone.zone, hour: "numeric", minute: "numeric", hour12: true })
            }
        }
        else
        {
            let dateFormat = intD.toLocaleDateString(timeZone.BCP47, { timeZone: timeZone.zone, year: 'numeric', month: 'numeric', day: 'numeric' });
            const [iDate, iMonth, iYear] = dateFormat.split('/');

            majorInternationalTimeZones[`timezone${index}`] = {
                utc: timeZone.utc,
                date: format(new Date(iYear, iMonth, iDate), '(eee) MMM-dd-yyyy'),
                zone: timeZone.zone,
                time: intD.toLocaleString(timeZone.BCP47, { timeZone: timeZone.zone, hour: "numeric", minute: "numeric", hour12: true }), 
            }
        }

    });
    console.log(majorInternationalTimeZones); // Testing 

    // London Timezone: 
    // let londonDateFormat = intD.toLocaleDateString('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: 'numeric', day: 'numeric' }); 
    // console.log(londonDateFormat); // Testing 
    // const [londonDate, londonMonth, londonYear] = londonDateFormat.split('/');
    // majorInternationalTimeZones[`timezone${index}`] = {
    //     utc: "Western European Time",
    //     date: format(new Date(londonYear, londonMonth, londonDate), '(eee) MMM-dd-yyyy'),
    //     zone: "Europe/London",
    //     time: intD.toLocaleString('en-GB', { timeZone: 'Europe/London', hour: 'numeric', minute: 'numeric', hour12: true }), 
    // }

    await prisma.tournamentLog.create({
        data: {
            name: name,
            type: type,
            game: game,
            startDate: dateFormatted,
            time: time12h,
            playerCount: playerCountInt,
            bracketCount: bracketCountInt,
            description: description,
            status: "DRAFT", 
            createdById: req.user.id,
            timeZones: domesticTimeZones, 
            intTimeZ: majorInternationalTimeZones,
        }
    }); 

    // Find the new tournament/event that was just created: 
    const newTournament = await prisma.tournamentLog.findUnique({
        where: { name: name }, 
    });

    // Generating bracket logic for the tournament:
    if (bracketCount !== 0)
    {
        const brackets = generateSingleElimBrackets(bracketCount);
        console.log("Brackets: ", brackets); // Testing 

        await prisma.bracket.createMany({
            data: brackets.map(b => ({
                ...b,
                tournamentId: newTournament.id, 
            })), 
        });
    }

    res.redirect('/admin/dashboard/tournaments');
}

// adminUpdateDeleteTournamentEventsPost(): Post method to update or delete individual tournament/event fields. 
/** |TODO|
 * (1) There will be an error when the user updates a tournament log with the same name from another existing 
 * tournament log in the database. Error handler should be added for this specific type of error. 
 * (2) Fix the start date value to display only the month, day, year, and UTC - standard time zone. 
 * (3) Make sure the "Single-Elimination Brackets" are also deleted if the "bracketCount" for the 
 * tournament is greater than 0. 
 */
const adminUpdateDeleteTournamentEventsPost = async(req, res) => {
    console.log(req.body.action); // Testing  
    try{
        if (req.body.action === 'update')
        {
            const { updateName, updateType, updateGame, updateStartDate, updateTime, updatePlayerCount, updateBracketCount, updateDescription } = req.body;

            const updatePlayerCountInt = parseInt(updatePlayerCount);  
            const updateBracketCountInt = parseInt(updateBracketCount); 

            const d = new Date(updateStartDate); // Testing 
            console.log("New Date: ", d); // Testing
            const dateFormatted = format(new Date(d.getFullYear(), d.getMonth(), d.getDate()), '(eee) MMM-dd-yyyy'); 
            console.log('Date Formatted: ', dateFormatted); // Testing 
  
            // Time Conversion:
            const [hours24, minutes] = updateTime.split(':'); 
            d.setHours(parseInt(hours24, 10));
            d.setMinutes(parseInt(minutes, 10)); 

            const options = {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true // Ensure 12-hour format with AM/PM
            }; 

            const time12h = d.toLocaleString('en-US', options); 
            console.log(time12h); // Testing

            
            console.log("Update Id: ", req.params.updateId); // Testing
            await prisma.tournamentLog.update({
                where: { name: req.params.updateId},
                data: {
                    name: updateName,
                    type: updateType,
                    game: updateGame,
                    startDate: dateFormatted,
                    time: time12h,
                    playerCount: updatePlayerCountInt,
                    bracketCount: updateBracketCountInt,
                    description: updateDescription,
                }
            });

        }
        else if (req.body.action === 'delete')
        {
            const tournament = await prisma.tournamentLog.findUnique({
                where: { name: req.params.updateId },
            });
            
            // Delete from cloudinary if the tournament log had an iamge attached to it.
            if (tournament.bannerPublicId){
                await cloudinaryHelpers.deleteFromCloudinary(tournament.bannerPublicId); 
            }

            // Delete the tournament log from the tournament log table. 
            await prisma.tournamentLog.delete({
                where: { name: req.params.updateId },
            });
        }

        res.redirect('/admin/dashboard/tournaments'); 
    } catch(err){
        // TODO: View later to add template if needed.
        console.error(err); // Testing 
        res.status(500).send("Tournament update failed.");
    }
}

// adminPublicTournamentEventsPost(): Post method that will allow the admin to make the tournament 'public' from the queue.
const adminPublicTournamentEventsPost = async (req, res) => {
    const tournaments = await prisma.tournamentLog.findMany(); 
    
    let tournamentNames = [];
    let publicValue = "PUBLIC";
    let draftValue = "DRAFT"; 

    tournaments.forEach((tournament) => {
        for (let key in req.body){
            if (tournament.name === key)
            {
                if (tournament.status === publicValue)
                {
                    tournamentNames.push({ name: key, value: draftValue });
                }
                else
                {
                    tournamentNames.push({ name: key, value: publicValue }); 
                }
            }
        }
    });

    // for (let key in req.body){
    //     tournamentNames.push({name: key, value: publicValue});
    // }
    console.log(tournamentNames); // Testing

    const promises = tournamentNames.map(({name, value}) =>
        prisma.tournamentLog.update({
            where: {name: name},
            data: {status: value},
        })
    );
    console.log("Promise: ", promises); // Testing

    // Wait for all updates to complete:
    await Promise.all(promises);

    res.redirect('/admin/dashboard/tournaments'); 
}

// adminAddTournamentImagesPost(): Post method that will allow the admin to 'add' images/banners.
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

// adminDeleteTournamentImages(): Post method that will allow the admin to 'delete' the images/banners.
const adminDeleteTournamentImagesPost = async (req, res) => {
    const { tournamentId } = req.params;
    
    const tournament = await prisma.tournamentLog.findUnique({
        where: { name: tournamentId },
    });

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
    adminUpdateDeleteTournamentEventsPost,
    adminPublicTournamentEventsPost,
    adminAddTournamentImagesPost, 
    adminDeleteTournamentImagesPost,
}