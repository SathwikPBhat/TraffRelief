const mongoose = require('mongoose');

const connectDB = (url) => {
    mongoose.connect(url)
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('Database connection error:', err));
}

module.exports = connectDB;