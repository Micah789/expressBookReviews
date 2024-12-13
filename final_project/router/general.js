const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
          users.push({ "username": username, "password": password });
          return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
          return res.status(404).json({ message: "User already exists!" });
        }
      }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    if (req.params.isbn) {
        const isbn = req.params.isbn;
        const getBook = books[isbn];
        return res.send(JSON.stringify(getBook, null, 4));
    } else {
        return res.status(403).json({ message: "This book does not exist" })
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    if (req.params.author) {
        const author = req.params.author;

        const getBookAuthor = Object.values(books).filter(book => book.author == author);

        if (getBookAuthor) {
            return res.send(JSON.stringify(getBookAuthor, null, 4));
        } else {
            return res.status(403).json({ message: "This author did not write this book" });
        }
    } else {
        return res.status(403).json({ message: "This author did not write this book" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    if (req.params.title) {
        const title = req.params.title;

        const getBookByTitle = Object.values(books).filter(book => book.title == title);

        if (getBookByTitle) {
            return res.send(JSON.stringify(getBookByTitle, null, 4));
        } else {
            return res.status(403).json({ message: "This title of this book does not exist" });
        }
    } else {
        return res.status(403).json({ message: "This title of this book does not exist" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    if (req.params.isbn) {
        const isbn = req.params.isbn;
        const book = books[isbn];
        const { reviews } = book;
        return res.send(JSON.stringify({"reviews": reviews}, null, 4));
    } else {
        return res.status(403).json({ message: "This book does not exist" })
    }
});

module.exports.general = public_users;
