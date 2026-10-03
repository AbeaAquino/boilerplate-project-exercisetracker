const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

// Store users
let users = [];
let userId = 1;

// Create a new user
app.post('/api/users', (req, res) => {
  const username = req.body.username;

  const newUser = {
    username: username,
    _id: String(userId++),
    exercises: []
  };

  users.push(newUser);

  res.json({
    username: newUser.username,
    _id: newUser._id
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json(
    users.map(user => ({
      username: user.username,
      _id: user._id
    }))
  );
});

// Add an exercise
app.post('/api/users/:_id/exercises', (req, res) => {
  const user = users.find(user => user._id === req.params._id);

  if (!user) {
    return res.json({ error: 'User not found' });
  }

  const description = req.body.description;
  const duration = Number(req.body.duration);

  const date = req.body.date
    ? new Date(req.body.date)
    : new Date();

  const exercise = {
    description: description,
    duration: duration,
    date: date.toDateString()
  };

  user.exercises.push(exercise);

  res.json({
    username: user.username,
    _id: user._id,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date
  });
});

// Get user's exercise log
app.get('/api/users/:_id/logs', (req, res) => {
  const user = users.find(user => user._id === req.params._id);

  if (!user) {
    return res.json({ error: 'User not found' });
  }

  let exercises = [...user.exercises];

  if (req.query.from) {
    const fromDate = new Date(req.query.from);

    exercises = exercises.filter(exercise => {
      return new Date(exercise.date) >= fromDate;
    });
  }

  if (req.query.to) {
    const toDate = new Date(req.query.to);

    exercises = exercises.filter(exercise => {
      return new Date(exercise.date) <= toDate;
    });
  }

  if (req.query.limit) {
    exercises = exercises.slice(0, Number(req.query.limit));
  }

  res.json({
    username: user.username,
    count: exercises.length,
    _id: user._id,
    log: exercises
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
