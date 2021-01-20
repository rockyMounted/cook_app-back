const express = require('express');
// const morgan = require('morgan');
const bodyParser = require("body-parser");
const tasksRoutes = require('./routes/recipes');
const path = require('path');

const app = express();

// app.use(morgan('combined'));
app.use(bodyParser.json());
app.use('/recipes', tasksRoutes);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use((err, req, res, next) => {
  const { message } = err;
  res.json({ status: 'ERROR', message });
})
app.use(express.static(path.join(__dirname, 'public')));

app.listen(8080, () => console.log(`listening on port 8080`))