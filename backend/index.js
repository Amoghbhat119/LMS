require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/route');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ---- MONGO CONNECT (single connection, explicit dbName, full logging) ----
const MONGO_URI = process.env.MONGODB_URI; // e.g. mongodb+srv://.../school
if (!MONGO_URI) {
  console.error('❌ MONGODB_URI is missing in backend .env');
  process.exit(1);
}

mongoose.set('strictQuery', true);

mongoose
  .connect(MONGO_URI, {
    dbName: 'school',          // IMPORTANT: keep case exactly as in your cluster
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ Mongo connect error:', err.message);
    process.exit(1);
  });

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongo connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.error('❌ Mongo disconnected');
});

// -------------------------------------------------------------------------

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`🚀 Server started at port no. ${PORT}`);
});
