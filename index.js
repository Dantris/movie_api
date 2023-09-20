const express = require('express');
const app = express();
const port = 8080;

// Middleware for logging requests using Morgan
const morgan = require('morgan');
app.use(morgan('dev'));

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Express GET route for /movies
app.get('/movies', (req, res) => {
  const topMovies = [
    { title: 'Movie 1', rating: 9 },
    { title: 'Movie 2', rating: 8.5 },
    { title: 'Movie 3', rating: 7.5 },
    { title: 'Movie 4', rating: 9.5 },
    { title: 'Movie 5', rating: 8.5 },
    { title: 'Movie 6', rating: 8 },
    { title: 'Movie 7', rating: 7 },
    { title: 'Movie 8', rating: 8 },
    { title: 'Movie 9', rating: 8.5 },
    { title: 'Movie 10', rating: 6 },
  ];
  res.json(topMovies);
});

// Express GET route for /
app.get('/', (req, res) => {
  res.send('Welcome to my movie API!');
});

// Serve documentation.html using express.static
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
