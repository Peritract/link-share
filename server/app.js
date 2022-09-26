const express = require("express");
const cors = require("cors");

const logRoute = require('./logRoute'); // middleware

let links = require("./links"); // Hard-coded data
let nextId = links.length; // Current value for the id of new posts

// Create the app
const app = express();

// Set up required middleware
app.use(express.json()) // Read in the body of POST requests
app.use(cors()) // Allow the app to communicate with external requests
app.use(logRoute) // Log each route as the request comes in

// Base root
app.get("/", (req, res) => {
    res.send({ message: "Welcome to the link sharing API." });
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

// Create a new link
app.post("/links", (req, res) => {

    // Extract the data
    const data = req.body;

    // Add an id to the data
    data["id"] = nextId;

    // Set the starting number of votes
    data["votes"] = 0;

    // Increment the nextId for next time
    nextId += 1;

    // Add the link to the collection
    links.push(data);

    // Report success
    res.status(201).send(data);
})

// Get a single link by id
app.get("/links/:id", (req, res) => {

    // Extract the id from the URL
    const id = parseInt(req.params.id);

    // Filter the links for the relevant id
    const filteredLinks = links.filter(l => l.id == id);

    // If there is exactly one link remaining
    if (filteredLinks.length == 1) {

        // Send it back
        res.send(filteredLinks[0]);

    } else {

        // Report the error in a user-friendly way
        res.status(404).send({ error: "Unable to locate link." })
    }

})

// Delete a link based on its id
app.delete("/links/:id", (req, res) => {

    // Extract the id from the URL
    const id = parseInt(req.params.id);

    // Filter the array of links to exclude that id
    links = links.filter(l => l.id != id);

    // Report success
    res.send({ message: "Link deleted successfully." })

})

// Add a vote to a link based on id
app.put("/links/:id", (req, res) => {

    // Extract the id from the URL
    const id = parseInt(req.params.id);

    // Loop through the links
    links.forEach(l => {

        // If the id matches
        if (l.id == id) {

            // Update the vote count
            l.votes += 1;

            // Report that the voting worked
            res.send({ message: "Successfully voted on link. "})
        }
    })

    // If nothing got sent before now, then there was no matching link to vote on
    res.status(404).send({ error: "Unable to locate link." })
})

module.exports = app;