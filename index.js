const express = require('express'),
	morgan = require('morgan'),
	fs = require('fs'),
	path = require('path'),
	bodyParser = require('body-parser'),
	uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models');
const passport = require('passport'); 
const auth = require('./auth');


const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myflix', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log URL request data to log.txt text file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.static('public'));

// Initialize Passport before using auth
app.use(passport.initialize());

// Initialize Passport and use the auth module
auth(app);

app.get('/', (req, res) => {
	res.send('This is the default route endpoint');
});


  
// Login route for generating JWT tokens
app.post('/login', passport.authenticate('jwt', { session: false }), (req, res) => {
passport.authenticate('local', { session: false }, (error, user, info) => {
    if (error || !user) {
    return res.status(400).json({
        message: 'Incorrect username or password.',
    });
    }
    req.login(user, { session: false }, (error) => {
    if (error) {
        res.send(error);
    }
    const token = generateJWTToken(user.toJSON());
    return res.json({ user, token });
    });
})(req, res);
});

// Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }),(req, res) => {
	Movies.find()
		.then((movies) => {
			res.status(200).json(movies);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Get movie by title
app.get('/movies/title/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ title: req.params.Title }) // Use "title" in lowercase and req.params.Title as it's defined in your route
      .then((movie) => {
        if (!movie) {
          return res.status(404).send('Error: ' + req.params.Title + ' was not found');
        }
        res.status(200).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });
  

  app.get('/movies/genre/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {

    Movies.find({ genre: req.params.Genre }) // Use 'Movie' instead of 'movies'
      .then((movies) => {
        console.log('Movies found:', movies);
        if (movies.length === 0) {
          return res.status(404).send('Error: no movies found with the ' + req.params.Genre + ' genre type.');
        } else {
          res.status(200).json(movies);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });
  
  
  
  

// Get movies by director name
app.get('/movies/directors/:Director', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.find({ director: req.params.Director })
		.then((movies) => {
			if (movies.length == 0) {
				return res.status(404).send('Error: no movies found with the director ' + req.params.Director + ' name');
			} else {
				res.status(200).json(movies);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Get data about a director by name
app.get('/movies/director_description/:Director', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.findOne({ 'Director.Name': req.params.Director })
		.then((movie) => {
			if (!movie) {
				return res.status(404).send('Error: ' + req.params.Director + ' was not found');
			} else {
				res.status(200).json(movie.Director);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Get data about a genre by genre name
app.get('/movies/genre_description/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.findOne({ 'Genre.Name': req.params.Genre })
		.then((movie) => {
			if (!movie) {
				return res.status(404).send('Error: ' + req.params.Genre + ' was not found');
			} else {
				res.status(200).json(movie.Genre.Description);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.find()
		.then((users) => {
			res.status(200).json(users);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOne({ Username: req.params.Username })
		.then((user) => {
			if (!user) {
				return res.status(404).send('Error: ' + req.params.Username + ' was not found');
			} else {
				res.json(user);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Create a new user
app.post('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOne({ Username: req.body.Username })
		.then((user) => {
			if (user) {
				return res.status(400).send(req.body.Username + ' already exists');
			} else {
				Users.create({
					Username: req.body.Username,
					Password: req.body.Password,
					Email: req.body.Email,
					Birthday: req.body.Birthday,
				})
					.then((user) => {
						res.status(201).json(user);
					})
					.catch((error) => {
						console.error(error);
						res.status(500).send('Error: ' + error);
					});
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send('Error: ' + error);
		});
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    const username = req.params.Username;
    const movieId = req.params.MovieID;
  
    // Check if movieId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).send('Error: Invalid Movie ID');
    }
  
    Users.findOneAndUpdate(
      { Username: username },
      {
        $addToSet: { FavoriteMovies: new mongoose.Types.ObjectId(movieId) }, // Use 'new'
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send('Error: User was not found');
        } else {
          res.json(updatedUser);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// Update a users data by username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$set: {
				Username: req.body.Username,
				Password: req.body.Password,
				Email: req.body.Email,
				Birthday: req.body.Birthday,
			},
		},
		{ new: true }
	)
		.then((user) => {
			if (!user) {
				return res.status(404).send('Error: No user was found');
			} else {
				res.json(user);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Remove a movie to a user's list of favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$pull: { FavoriteMovies: req.params.MovieID },
		},
		{ new: true }
	)
		.then((updatedUser) => {
			if (!updatedUser) {
				return res.status(404).send('Error: User not found');
			} else {
				res.json(updatedUser);
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send('Error: ' + error);
		});
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndRemove({ Username: req.params.Username })
		.then((user) => {
			if (!user) {
				res.status(404).send('User ' + req.params.Username + ' was not found');
			} else {
				res.status(200).send(req.params.Username + ' was deleted.');
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Delete movie from favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }),(req, res) => {
    const username = req.params.Username;
    const movieId = req.params.MovieID;
  
    // Check if movieId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).send('Error: Invalid Movie ID');
    }
  
    Users.findOneAndUpdate(
      { Username: username },
      {
        $pull: { FavoriteMovies: new mongoose.Types.ObjectId(movieId) }, // Use 'new' and $pull to remove the movie
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send('Error: User was not found');
        } else {
          res.json(updatedUser);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });
  

app.use((err, req, res, next) => {
	console.log(err);
	console.error(err.stack);
});

app.listen(8080, (req, res) => {
	console.log('App listening on port 8080');
});