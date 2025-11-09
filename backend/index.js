require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin.js');
const loginRoute = require('./routes/login.js');
const statsRoute = require('./routes/stats.js')
const staffRoute = require('./routes/staff.js');
const connectDB = require('./db/connection.js');

app.use(cors());
// custom JSON parser that tolerates non-strict JSON (uses JSON5 fallback)
const customJsonParser = require('./middlewares/json-parser');
app.use(customJsonParser);
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
    connectDB(process.env.MONGO_URL);
   
})

app.use('/admin', adminRoutes);
app.use('/staff', staffRoute);
app.use('/user', loginRoute);
app.use('/stats', statsRoute);
