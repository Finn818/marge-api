const express = require('express');
const router = express.Router();
const db = require('../config/dbconn.js')
// const auth = require('./authentication')

const path = require('path');
const bodyParser = require('body-parser');

const userMiddleware = require('../middleware/ErrorHandling.js');
const fs = require('fs');


// ================================================