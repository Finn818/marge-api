const express = require('express');
const router = express.Router();
const db = require('../config/dbconn.js')
// const auth = require('./authentication')
const bcrypt = require('bcrypt');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const userMiddleware = require('../middleware/ErrorHandling.js');
const fs = require('fs');
router.post('/register',bodyParser.json(), 
     (req, res)=> {
    
// let {email, password} = req.body; 
//     // If the userRole is null or empty, set it to "user".
//     if(userRole.length === 0) {
//     userRole = "user";
//     }
//     // Check if a user already exists
//     let strQry =
//     `SELECT email, password
//     FROM users
//     WHERE LOWER(email) = LOWER('${email}')`;
//     db.query(strQry, 
//     async (err, results)=> {
//     if(err){
//     throw err
//     }else {
//         if(results.length) {
//         res.status(409).json({msg: 'User already exist'});
//         }else {
             
                
//     // Encrypting a password
//     // Default value of salt is 10. 
//         password = await hash(password, 10);
    
//     // Query
//     strQry = 
//     `INSERT INTO users(email, password)
//     VALUES(?, ?, ?, ?, ?, ?, ?);`;
//     db.query(strQry, 
//     [email, password],
//     (err, results)=> {
//     if(err){
//     throw err;
//     }else {
//     res.status(201).json({msg: `number of affected row is: ${results.affectedRows}`});
//     }
    })
//     }
//     }
//     });
// });