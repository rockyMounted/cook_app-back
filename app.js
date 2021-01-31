const express = require('express');
// const morgan = require('morgan');
const bodyParser = require("body-parser");
const tasksRoutes = require('./routes/recipes');
const path = require('path');

const app = express();

// app.use(morgan('combined'));
app.use(bodyParser.json());



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header");
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  next();
});

app.use((req, res, next) => {
  setTimeout(() => {
    next();
  },500)
})

app.use('/recipes', tasksRoutes);

app.use((err, req, res, next) => {
  const { message } = err;
  res.json({ status: 'ERROR', message });
})
app.use(express.static(path.join(__dirname, 'public')));

app.listen(8080, () => console.log(`listening on port 8080`))