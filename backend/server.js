const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const tokenRoutes = require('./routes/token');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api', tokenRoutes);

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
