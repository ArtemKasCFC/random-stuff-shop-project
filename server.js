const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

mongoose.connect(process.env.DATABASE).then(() => console.log('DB is connected'));

const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log(`The server is running on the port ${port}`));
