const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Define a middleware to check if the user is logged in
app.use((req, res, next) => {
  const username = req.query.username || req.body.username;
  if (username) {
    // If a username is provided, store it in local storage
    res.locals.username = username;
    next();
  } else {
    // If no username is provided, redirect to the login page
    res.redirect('/login');
  }
});

// Define a route to render the login form
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// Define a route to render the chat form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});

// Define a route to handle sending messages
app.post('/send', (req, res) => {
  const { message } = req.body;
  const username = res.locals.username;

  // Store the message in a file
  fs.appendFile('messages.txt', `${username}: ${message}\n`, (err) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

// Define a route to retrieve and display messages
app.get('/messages', (req, res) => {
  fs.readFile('messages.txt', 'utf8', (err, data) => {
    if (err) throw err;
    const messages = data.split('\n').filter(Boolean);
    res.json(messages);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
