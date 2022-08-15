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
    })

router.post("/users", bodyParser.json(), async (req, res) => {
  try {
    const bd = req.body;
    if (bd.usertype === "" || bd.usertype === null) {
      bd.usertype = "user";
    }

    const emailQ = "SELECT email from users WHERE ?";
    let email = {
      email: bd.email,
    };
    let date = {
      date: new Date().toISOString().slice(0, 10)
      // date: new Date().toLocaleDateString(),
    };
    let cart = {
      cart: null,
    };

    db.query(emailQ, email, async (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        res.json({
          msg: "Email Exists",
        });
      } else {
        // Encrypting a password
        // Default value of salt is 10.
        bd.password = await hash(bd.password, 10);
        // Query
        const strQry = `
        
        ALTER TABLE users AUTO_INCREMENT = 1;
        
        INSERT INTO users(firstname, lastname, email, usertype, contact, address, password, joindate)  
        VALUES(?, ?, ?, ?, ?, ?, ?, ?);
        `;
        db.query(
          strQry,
          [
            bd.firstname,
            bd.lastname,
            bd.email,
            bd.usertype,
            bd.contact,
            bd.address,
            bd.password,
            date.date,
          ],
          (err, results) => {
            if (err) throw err;
            const payload = {
              user: {
                firstname: bd.firstname,
                lastname: bd.lastname,
                email: bd.email,
                usertype: bd.usertype,
                contact: bd.contact,
                address: bd.address,
                cart: cart.cart,
              },
            };
            jwt.sign(
              payload,
              process.env.jwtSecret,
              {
                expiresIn: "365d",
              },
              (err, token) => {
                if (err) throw err;
                res.json({
                  msg: "Registration Successful",
                  user: payload.user,
                  token: token,
                });
                // res.json(payload.user);
              }
            );
          }
        );
      }
    });
  } catch (e) {
    console.log(`Registration Error: ${e.message}`);
  }
});