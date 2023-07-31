const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      return false;
    }
  }
  return true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      if (users[i].password === password) {
        return true;
      } else {
        return false;
      }
    }
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: "Invalid input" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: username,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).json({message:"User successfully logged in"});
  }
  else{
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.data;
  let book = books[isbn];
  let reviews = book.reviews;
  book.reviews = {...reviews, [username]:review}
  books[isbn] = book;
  return res.status(200).json(books);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.user.data;
  let book = books[isbn];
  let reviews = book.reviews;
  delete book.reviews[username];
  books[isbn] = book;
  return res.status(200).json(books);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
