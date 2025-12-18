function injectTheme(req, res, next){
    res.locals.theme = req.user?.theme || "orange-theme";
    next(); 
}

module.exports = injectTheme; 