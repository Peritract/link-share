// Basic middleware - for each request, log the method and route

const logRoute = (req, res, next) => {

    // Log the request details
    console.log(req.method, req.originalUrl);

    // Pass the request onto the next layer
    next();
}

module.exports = logRoute;