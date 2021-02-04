const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('config');
const fileUpload = require('express-fileupload');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const uri = config.get('mongoURI');

mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.log('Error: ' + err))

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const adminRouter = require('./routes/api/admin');
const usersRouter = require('./routes/api/user');
const uploadRouter = require('./routes/api/upload');

app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});