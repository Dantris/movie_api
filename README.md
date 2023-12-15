# Movie API BACKEND

## Introduction
This `movie_api` is a backend service designed to manage and retrieve movie data. Built with Node.js and 
Express, and utilizing MongoDB for data storage, this API offers a robust platform for movie-related operations.

## Features
- **CRUD Operations:** Create, Read, Update, and Delete movie data.
- **Filtering and Sorting:** Advanced query capabilities for filtering and sorting movie data.
- **Authentication:** Secure endpoints with user authentication.
- **Data Validation:** Ensures data integrity with Mongoose schemas.

## Getting Started
### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Installation
1. Clone the repository: `git clone https://github.com/your-username/movie_api.git`
2. Navigate to the project directory: `cd movie_api`
3. Install dependencies: `npm install` or `yarn install`

### Configuration
- Create a `.env` file in the project root.
- Add the following keys:
  - `MONGODB_URI=<your_mongodb_connection_string>`
  - `PORT=<desired_port_number>`
  - `SECRET_KEY=<your_secret_key_for_jwt>`

### Running the Application
- Start the server: `npm start` or `yarn start`
- The API will be available at `http://localhost:<PORT>`

## API Endpoints
### Movies
- `GET /movies`: Get all movies.
- `POST /movies`: Create a new movie.
- `GET /movies/:id`: Get a single movie by ID.
- `PUT /movies/:id`: Update a movie by ID.
- `DELETE /movies/:id`: Delete a movie by ID.

### Users
- `POST /users`: Register a new user.
- `POST /users/login`: Authenticate a user.

## Models
### Movie
- `title`: String, required
- `director`: String
- `year`: Date
- `genre`: String

### User
- `username`: String, required
- `password`: String, required

## Contributing
Contributions are welcome! Please read our contributing guidelines for details.

## License
This project is licensed under the [MIT License](LICENSE).

## Contact
For any queries or suggestions, please contact us at `email@example.com`.
