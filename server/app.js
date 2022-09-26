const express = require("express");
const cors = require("cors");

const logRoute = require('./logRoute'); // middleware

const links = require("./links"); // Hard-coded data

// Create the app
const app = express();

// Set up required middleware
app.use(express.json()) // Read in the body of POST requests
app.use(cors()) // Allow the app to communicate with external requests
app.use(logRoute) // Log each route as the request comes in

// Base root
app.get("/", (req, res) => {
    res.send({ message: "Welcome to the link sharing API" });
})

// Get all the links in posted order
app.get("/links", (req, res) => {
    res.send(links);
})

// Get all the links ordered by number of votes (descending)
app.get("/popular", (req, res) => {

    // Sort the links by number of votes
    const sortedLinks = links.sort((a, b) => b.votes - a.votes);

    // Send the sorted array
    res.send(sortedLinks);
})

module.exports = app;