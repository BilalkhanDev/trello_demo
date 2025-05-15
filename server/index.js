require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./app/config/db');
const routes = require('./app/routes/index');
const morgan = require('morgan');
const cors = require('cors');
const http = require("http");
const server = http.createServer(app);
const {createAdminUser}=require('./app/seeder/admin')
const { initSocket } = require("./app/config/sockets");

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  morgan.token('id', (req) => req.id || 'no-id');
  app.use(morgan(':method :url :status :response-time ms - :id'));
}

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize socket.io with the HTTP server
initSocket(server);

// Seeder and DB connect
const runSeeder = async () => {
  try {
    await connectDB();
    await createAdminUser();
    console.log('Seeder ran successfully');
  } catch (err) {
    console.error('Error running seeder:', err);
  }
};
runSeeder();

// *** THIS IS THE FIX ***
// Listen on the HTTP server (not the express app)
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
