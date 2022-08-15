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
router.post('/login', bodyParser.json(),
(req, res)=> {

const { email, password } = req.body;
console.log(password);
const strQry = 
`
SELECT email, password
FROM users 
WHERE email = '${email}';
`;
db.query(strQry, async (err, results)=> {
        
// In case there is an error
if(err) throw err;
// When user provide a wrong email
if(!results.length) {
res.status(401).json( 
{msg: 'You provided the wrong email.'} 
);
}
        
await compare(password, 
results[0].password,
(cmpErr, cmpResults)=> {
if(cmpErr) {
res.status(401).json(
{
msg: 'You provided the wrong password'
}
)
}
            
if(cmpResults) {
const token = 
jwt.sign(
    {
    id: results[0].id,
    // username: results[0].username,
    email: results[0].email,
    password: results[0].password
    },
    process.env.TOKEN_KEY, 
    {
    expiresIn: '1h'
    }, (err) => {
        if(err) throw err
    }  
    );
                
    // Login
    res.status(200).json({
        msg: 'Logged in',
        token,
        results: results[0]
    })                
        }
    });
})
})