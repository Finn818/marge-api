const express = require('express');
const router = express.Router();
const db = require('../config/dbconn.js')
// const auth = require('./authentication')
const bcrypt = require('bcrypt');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const userMiddleware = require('../middleware/ErrorHandling.js');

const middleware = require("../middleware/ErrorHandling")
