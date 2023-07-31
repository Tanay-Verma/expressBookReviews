const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if( !username || !password){
    return res.status(400).json({message: "Invalid input"});
  }

  if(isValid(username)){
    users.push({username, password});
    return res.status(201).json({message: `User ${username} created successfully`});
  }
  else{
    return res.status(403).json({message: "User already exists"});
  }
});


// Get the book list available in the shop
public_users.get("/",async function (req, res) {
  //Write your code here
  let booksFetched = await require("./booksdb.js")
  return res.status(200).json(booksFetched);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (isbn > 10 || isbn < 1) {
    return res.status(400).json({ message: "Invalid input" });
  }
  const book = await books[isbn]
  return res.status(200).json(book);
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  console.log(bookKeys);
  const filtered_bookKeys = await bookKeys.filter(
    (key) => books[key].author === author
  );
  if(filtered_bookKeys.length === 0){
    return res.status(404).json({message: "No book found"})
  }
  const filtered_books = await filtered_bookKeys.map((key) => {
    return books[key];
  });
  return res.status(200).json(filtered_books);
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const filtered_bookKeys = await bookKeys.filter(
    (key) => books[key].title === title
  );
  if(filtered_bookKeys.length === 0){
    return res.status(404).json({message: "No book found"})
  }
  const filtered_books = await filtered_bookKeys.map((key) => {
    return books[key];
  });
  return res.status(200).json(filtered_books);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (isbn > 10 || isbn < 1) {
    return res.status(400).json({ message: "Invalid input" });
  }
  const book = books[isbn];
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
