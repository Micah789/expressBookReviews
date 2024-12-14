const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // check if users array is not empty 
    if (users.length > 0) {
        let userswithsamename = users.filter((user) => {
            return user.username === username;
        });

        return userswithsamename.length > 0 ? false : true;
    }

    // the username is unique and allowed to register 
    return true;
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return user.username === username && user.password === password;
    });

    return validusers.length > 0 ? true : false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        };
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const { isbn } = req.params;
    const newReview = req.body.review;

    if (isbn) {
        // get the reviews object
        const book = books[isbn];
        const { reviews } = book;
        const { username } = req.session.authorization;

        console.log(req.session.authorization, 'authorization obj')
        
        // add the new review
        // reviews.push({
        //     "username": username,
        //     "quote": newReview
        // });
    }

    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
