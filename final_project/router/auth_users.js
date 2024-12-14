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

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const { isbn } = req.params;
    const newReview = req.body.review;

    if (isbn) {
        // get the reviews object
        const book = books[isbn];
        const { reviews } = book;
        const { username } = req.session.authorization;

        let message = '';

        // check if there are any reviews 
        if (isObjEmpty(reviews)) {
            // add the new review
            reviews[username] = newReview;

            message = "Your review has been added";
        } else {
            // loop through the review keys
            for (const reviewUsername of Object.keys(reviews)) {
                // check if the review username is the same user thats already posted a review
                if (reviewUsername === username) {
                    // modify existing review
                    reviews[username] = newReview;

                    message = `${username} existing review has been modified`;
                } else {
                    // add your new review
                    reviews[username] = newReview;
                    message = "Your review has been added";
                }
            }
        }

        return res.status(201).json({
            message: message,
            status: 201,
            book: book
        });
    }

    return res.status(404).json({ message: "the isbn does not exist" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;

    if (isbn) {
        // get the reviews object
        const book = books[isbn];
        let { reviews } = book;
        const { username } = req.session.authorization;

        if (!isObjEmpty(reviews)) {
            // filter out the user reviews
            const filterOutUserReviews = Object.entries(reviews)
    
            // reviews = filterOutUserReviews
    
            return res.status(201).json({ 
                message: `all ${username} reviews have been deleted`, 
                status: 201, 
                book: filterOutUserReviews
            });

        }

        return res.status(202).json({ message: "there are not reviews to remove" });

    }

    return res.status(404).json({ message: "the isbn does not exist" });
});

const isObjEmpty = (obj) => {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }

    return true;
};

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
