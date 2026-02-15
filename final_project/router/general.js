const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Task 10
public_users.get('/', (req, res) => {
    new Promise((resolve, reject) => {
        resolve(books);
    })
    .then((bookList) => {
        return res.status(200).json(bookList);
    })
    .catch((err) => {
        return res.status(500).json({ message: "Error retrieving books" });
    });
});

//Task 11
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    })
    .then((bookDetails) => {
        return res.status(200).json(bookDetails);
    })
    .catch((err) => {
        return res.status(404).json({ message: err });
    });
});

//Task 12
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();

    new Promise((resolve, reject) => {
        const results = Object.values(books).filter(book =>
            book.author.toLowerCase() === author
        );

        if (results.length > 0) {
            resolve(results);
        } else {
            reject("No books found by that author");
        }
    })
    .then((booksByAuthor) => {
        return res.status(200).json(booksByAuthor);
    })
    .catch((err) => {
        return res.status(404).json({ message: err });
    });
});

//Task13
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();

    new Promise((resolve, reject) => {
        // Search all books for matching title
        const results = Object.values(books).filter(book =>
            book.title.toLowerCase() === title
        );

        if (results.length > 0) {
            resolve(results);
        } else {
            reject("No books found with that title");
        }
    })
    .then((booksByTitle) => {
        return res.status(200).json(booksByTitle);
    })
    .catch((err) => {
        return res.status(404).json({ message: err });
    });
});





public_users.post("/register", (req,res) => {
  
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
        username.push({"username": username, "password": password});
        return res.status(201).json({message: "User successfully registered. Now you can log in!"});

    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
 const author = req.params.author;
 const results = Object.values(books).filter(b => b.author.toLowerCase() === author.toLowerCase());

 if (results.length === 0) {
    return res.status(403).json({message: "No books have been found from this author!"});
 }
 res.json(results);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  const results = Object.keys(books).map(key => books[key]).filter(book => book.title.toLowerCase() === title);

  if (results.length === 0) {
    return res.status(403).json({message: "No books based on title have been found!"});

  }
  res.json(results);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(403).json({message: "Book not found!"});
  }
  res.json(books[isbn].reviews);
});

module.exports.general = public_users;
