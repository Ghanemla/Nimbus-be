const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('./Models/User');

dotenv.config();

mongoose.connect(process.env.DB);
const jwtSecret = process.env.JWT_SECRET;
const app = express();

app.get('/test', (req, res) => {
  res.json('test ok')
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const createdUser = await User.create({ username, password })
  jwt.sign({ userId: createdUser._id }, jwtSecret, (err, token) => {
    if (err) {
      throw err
    }
    res.cookie('token', token).sendStatus(201).json('ok')
  })
})
app.listen(9000)

//Kudj6sYxLV1Jzkj7