let adminDashboardSidebarLinks = [
    {name: "/dashboard", current: false},
    {name: "/dashboard/appearance", current: false},
    {name: "/dashboard/invite", current: false}, 
    {name: "/dashboard/tournaments", current: false}, 
    {name: "/dashboard/application-layout", current: false},
];

function adminDashboardSidebarLinksMiddleware(req, res, next){
    adminDashboardSidebarLinks.forEach((link) => {
        if (link.name === req.path)
        {
            link.current = true;
        }
        else
        {
            link.current = false; 
        }
    });

    res.locals.sidebarLinks = adminDashboardSidebarLinks; 
    next(); 
}

module.exports = adminDashboardSidebarLinksMiddleware;