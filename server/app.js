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

// Get a single link by position in the array
app.get("/links/:index", (req, res) => {

    // Extract the index from the URL
    const index = parseInt(req.params.index);

    // If the index value is within bounds
    if (0 <= index && index < links.length) {

        // Send the relevant link
        res.send(links[index]);

    } else {

        // Report the error in a user-friendly way
        res.status(404).send({ error: "Unable to locate link." })
    }

})

// Delete a link based on its position in the array
// A bit hacky - if we had a real database, or even a better fake one, we'd be using IDs
app.delete("/links/:index", (req, res) => {

    // Extract the index from the URL
    const index = parseInt(req.params.index);

    // If the index value is within bounds
    if (0 <= index && index < links.length) {

        // Snip out one element at the index position
        links = links.splice(index, 1);

    } else {

        // Report the error in a user-friendly way
        res.status(404).send({ error: "Unable to delete link." })
    }

})

module.exports = app;