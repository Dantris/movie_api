const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const movieSchema = mongoose.Schema({
  title: { type: String, required: true }, // Use lowercase for field names to match your database
  description: { type: String, required: true },
  genre: { type: String },
  director: {
    name: String, // Use lowercase for subfields
    bio: String, // Use lowercase for subfields
  },
  actors: [String],
  imagePath: String,
  featured: Boolean
});


let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }]
});

userSchema.pre('save', async function (next) {
  console.log('Pre-save middleware called');

  if (!this.isModified('Password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);

    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.validatePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.Password);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};


let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;