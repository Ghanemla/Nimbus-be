const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const User = require('./Models/User');

dotenv.config();

mongoose.connect(process.env.DB);
const jwtSecret = process.env.JWT_SECRET;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));

app.get('/test', (req, res) => {
  res.json('test ok')
})

app.get('/profile', (req, res) => {
  const token = req.cookies?.token
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) {
        throw err
      }
      res.json(userData)
    })
  } else {
    res.status(401).json('no token')
  }

})

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const createdUser = await User.create({ username, password })
    jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
      if (err) {
        throw err
      }
      res.cookie('token', token).json({ id: createdUser._id, username }).status(201)
    })
  } catch (error) {
    if (error) throw error
    res.json('error').status(500)
  }


})
app.listen(9000)

//Kudj6sYxLV1Jzkj7