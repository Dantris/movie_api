const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');

app.use(bodyParser.json());

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

let users = [
  {
    id: 1,
    name: 'Kim',
    favoriteMovies: [],
  },
  {
    id: 2,
    name: 'Joe',
    favoriteMovies: ['The Fountain'],
  },
];

let movies = [
  {
    'Title': 'The Fountain',
    'Description':
      'As a modern day scientist, Tommy is struggling with mortality, desperately searching for the medical breakthrough that will save the life of his cancer-stricken wife, Izzi.',
    'Genre': {
      'Name': 'Drama',
      'Description':
        'In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
    },
    'Director': {
      'Name': 'Darren Aronofsky',
      'Bio': 'Darren bio ...',
    },
    'ImageURL':
      'https://m.media-amazon.com/images/M/MV5BMTU5OTczMTcxMV5BMl5BanBnXkFtZTC´cwNDg3MTEzMw@@._V1_UX182_CR0,0,182,268_AL_.jpg',
    'Featured': false,
  },
  {
    'Title': 'Requiem for a Dream',
    'Description':
      'A dark and intense drama that explores addiction and its consequences.',
    'Genre': {
      'Name': 'Drama',
      'Description':
        'In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
    },
    'Director': {
      'Name': 'Darren Aronofsky',
      'Bio': 'Darren bio ...',
    },
    'ImageURL': 'Link to the movie poster image',
    'Featured': false,
  },
  {
    'Title': 'Eternal Sunshine of the Spotless Mind',
    'Description':
      'Blends science fiction elements with a deep emotional story about memory and love.',
    'Genre': {
      'Name': 'Drama',
      'Description':
        'In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
    },
    'Director': {
      'Name': 'Michel Gondry',
      'Bio': 'Michel Gondry bio ...',
    },
    'ImageURL': 'Link to the movie poster image',
    'Featured': false,
  },
  {
    'Title': 'Black Swan',
    'Description':
      'A psychological thriller with elements of drama and horror, starring Natalie Portman as a ballet dancer.',
    'Genre': {
      'Name': 'Drama',
      'Description':
        'In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
    },
    'Director': {
      'Name': 'Darren Aronofsky',
      'Bio': 'Darren bio ...',
    },
    'ImageURL': 'Link to the movie poster image',
    'Featured': false,
  },
  {
    'Title': 'Tree of Life',
    'Description':
      'A visually stunning film that delves into themes of life, death, and the universe.',
    'Genre': {
      'Name': 'Drama',
      'Description':
        'In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
    },
    'Director': {
      'Name': 'Terrence Malick',
      'Bio': 'Terrence Malick bio ...',
    },
    'ImageURL': 'Link to the movie poster image',
    'Featured': false,
  },
  {
    'Title': 'Interstellar',
    'Description': 'Explores space exploration, time, and the human spirit.',
    'Genre': {
      'Name': 'Drama',
      'Description':
        'In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
    },
    'Director': {
      'Name': 'Christopher Nolan',
      'Bio': 'Christopher Nolan bio ...',
    },
    'ImageURL': 'Link to the movie poster image',
    'Featured': false,
  },
  {
    'Title': 'Melancholia',
    'Description':
      'A psychological drama with a sci-fi twist, exploring the relationships of two sisters during an impending planetary collision.',
    'Genre': {
      'Name': 'Drama',
      'Description':
        'In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
    },
    'Director': {
      'Name': 'Lars von Trier',
      'Bio': 'Lars von Trier bio ...',
    },
    'ImageURL': 'Link to the movie poster image',
    'Featured': false,
  },
  {
    'Title': 'Sunshine',
    'Description':
      'A sci-fi drama about a group of astronauts sent to reignite the dying sun.',
    'Genre': {
      'Name': 'Drama',
      'Description':
        'In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
    },
    'Director': {
      'Name': 'Danny Boyle',
      'Bio': 'Danny Boyle bio ...',
    },
    'ImageURL': 'Link to the movie poster image',
    'Featured': false,
  },
  {
    'Title': 'The Lovely Bones',
    'Description':
      'Blends drama and elements of fantasy to tell the story of a young girl watching over her family from the afterlife.',
    'Genre': {
      'Name': 'Drama',
      'Description':
        'In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
    },
    'Director': {
      'Name': 'Peter Jackson',
      'Bio': 'Peter Jackson bio ...',
    },
    'ImageURL': 'Link to the movie poster image',
    'Featured': false,
  },
  {
    'Title': 'Another Earth',
    'Description':
      'An indie film that combines drama and science fiction, exploring the discovery of a parallel Earth.',
    'Genre': {
      'Name': 'Drama',
      'Description':
        'In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
    },
    'Director': {
      'Name': 'Mike Cahill',
      'Bio': 'Mike Cahill bio ...',
    },
    'ImageURL': 'Link to the movie poster image',
    'Featured': false,
  },
  {
    'Title': 'Moon',
    'Description':
      'A minimalist sci-fi drama that is a character study of a man working alone on a lunar base.',
    'Genre': {
      'Name': 'Drama',
      'Description':
        'In film and television, drama is a category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
    },
    'Director': {
      'Name': 'Duncan Jones',
      'Bio': 'Duncan Jones bio ...',
    },
    'ImageURL': 'Link to the movie poster image',
    'Featured': false,
  },
];

// CREATE
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('users need names');
  }
});

// UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user');
  }
});

// UPDATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

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

  let user = users.find((user) => user.id == id);

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

// READ
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// READ
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie');
  }
});

// READ
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre');
  }
});

// READ
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.Director.Name === directorName
  ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director');
  }
});

app.listen(8080, () => console.log('listening on 8080'));
