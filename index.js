const bodyParser = require('body-parser');
const express = require('express');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Models = require('./models')

const Movies = Models.Movie;
const Users = Models.User;

const app = express();

mongoose.connect('mongodb://localhost:27017/myflix', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to log requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const logEntry = `${req.url} - ${timestamp}`;
  fs.appendFile('log.txt', logEntry + '\n', (err) => {
    if (err) {
      console.error('Error logging request:', err);
    }
  });
  next();
});

// default text response when at /
app.get('/', (req, res) => {
  res.send('Welcome to myflix!');
})

// Serve the "documentation.html" file from the "public" folder
app.get('/documentation.html', (req, res) => {
  const docPath = path.join(__dirname, 'public', 'documentation.html');
  fs.readFile(docPath, (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).type('html').send(data);
    }
  });
});

// CREATE users
app.post('/users', async (req, res) => {
  await Users.findOne({ Name: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users
      .create({
        Username: req.body.Name,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) => {res.status(201).json(user)})
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error ' + error);
  });
});


// Get a user by username
app.get('/users/:Username', async (req, res) => {
  const Username = req.params.Username;
  console.log('Searching for user with Username:', Username);

  await Users.findOne({ Username: Username })
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        console.log('User not found:', Username);
        res.status(404).send('User not found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// Get all users
app.get('/users', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// Delete a user
app.delete('/users/:Username', async (req, res) => {
  const Username = req.params.Username;
  await Users.findOneAndRemove({ Username: Username })
    .then((user) => {
      if (!user) {
        res.status(404).send(Username + ' was not found');
      } else {
        res.status(200).send(Username + ' was deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});



// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username },
    { $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }) // This line makes sure the updated document is returned
  then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
  });
});


// UPDATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = Users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array.`);
  } else {
    res.status(400).send('no such user');
  }
});

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = Users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title != movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id}'s array.`);
  } else {
    res.status(400).send('no such user');
  }
});

// DELETE
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`user ${id} has been deleted.`);
  } else {
    res.status(400).send('no such user');
  }
});

// return JSON object when at /movies
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
  });
});

// READ movie titles
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
  });
});


// READ genre
app.get('/genre/:Name', (req, res) => {
  Genres.findOne({ Name: req.params.Name })
    .then((genre) => {
      if (!genre) {
        // Handle the case when the genre is not found.
        res.status(404).send('Genre not found');
      } else {
        res.json(genre.Description);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});


// READ
app.get('/director/:Name', (req, res) => {
  Directors.findOne({ Name: req.params.Name})
  .then((director) => {
    res.json(director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
  });
});

app.listen(8080, () => console.log('listening on 8080'));
