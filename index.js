const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Store users
let users = [];
let userId = 1;

// Create a new user
app.post('/api/users', (req, res) => {
  const username = req.body.username;

  const newUser = {
    username: username,
    _id: String(userId++)
  };

  users.push(newUser);

  res.json(newUser);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
