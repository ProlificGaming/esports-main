const express = require('express');
const tournamentsControllers = require("../controllers/tournamentsControllers/tournamentControllers.js"); 

const tournamentRoute = express.Router();

tournamentRoute.get('/', tournamentsControllers.tournamentsControllerGet); 
tournamentRoute.get('/:tournamentId', tournamentsControllers.tournamentControllerGet);

module.exports = tournamentRoute; 