require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin.js');
const loginRoute = require('./routes/login.js');

const connectDB = require('./db/connection.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
    connectDB(process.env.MONGO_URL);
   
})

app.use('/admin', adminRoutes);
app.use('/user', loginRoute);