require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require("./config/dbconn");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const conn = require("./config/dbconn");
const fs = require('fs');
app.post('/login', bodyParser.json(),
(req, res)=> {
})

// Express app
const app = express();
// Express app
// const app = express.app();
// Configuration 
const middleware = require("./middleware/ErrorHandling")
const port = parseInt(process.env.PORT) || 4000;

// Set header
// app.use(cors());
app.use(cors({
    origin: ['http://127.0.0.1:8080', 'http://localhost:8080'],
    credentials: true
}));
app.use(express.json(), 
    express.urlencoded({
    extended: true})
);
// 
app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
});

// home
app.get('/', (req, res)=> { 
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// ====================================================
// Users
app.post('/users', bodyParser.json(),(req, res)=> {
    let {email, password} = req.body; 
        // If the userRole is null or empty, set it to "user".
        if(userRole.length === 0) {
            userRole = "user";
        }
        // Check if a user already exists
        let strQry =
        `SELECT email, password
        FROM users
        WHERE LOWER(email) = LOWER('${email}')`;
        db.query(strQry, 
        async (err, results)=> {
        if(err){
        throw err
        }else {
            if(results.length) {
            res.status(409).json({msg: 'User already exist'});
            }else {    
                // Encrypting a password
                // Default value of salt is 10. 
                    password = await hash(password, 10);
                // Query
                strQry = 
                `INSERT INTO users(userName, userEmail, userpassword, userRole, phone_number, join_data)
                VALUES(?, ?, ?, ?, ?, ?);`;
                db.query(strQry, 
                [email, password],
                (err, results)=> {
                    if(err){
                        throw err;
                    }else {
                        res.status(201).json({msg: `number of affected row is: ${results.affectedRows}`});
                    }
                })
            }
        }
    });
})

//Get all the users by the ID
app.get('/users/:user_id', (req, res)=> {
    const strQry =
    `SELECT id, userName, userEmail, userpassword, userRole, phone_number, join_data, cart
    FROM users
    WHERE user_id = ?;
    `;
    db.query(strQry, [req.params.user_id], (err, results) => {
        if(err) throw err;
        res.setHeader('Access-Control-Allow-Origin','*')
        res.json({
            status: 204,
            results: (results.length < 1) ? "Data not found" : results
        })
    })

  });

  //Get all the users
app.get("/", bodyParser.json(), (req, res) => {
    try {
      con.query("SELECT * FROM users", (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

  // Update users
app.put("/users/:id", middleware, bodyParser.json(), (req, res) => {
    const { userName, userEmail, userpassword, userRole } = req.body;
  
    const user = {
      userName,
      userEmail,
      userpassword,
      userRole,
      phone_number
    };
    // Query
    const strQry = `UPDATE users
       SET ?
       WHERE id = ${req.params.id}`;
    db.query(strQry, user, (err, data) => {
      if (err) throw err;
      res.json({
        msg: "User info Updated",
      });
    });
  });
  
  // Delete users
  app.delete("/users/:id", middleware, (req, res) => {
    if (req.user.usertype === "Admin") {
      // Query
      const strQry = `
        DELETE FROM users 
        WHERE id = ?;
        `;
      db.query(strQry, [req.params.id], (err, data, fields) => {
        if (err) throw err;
        res.json({
          msg: "Item Deleted",
        });
      });
    } else {
      res.json({
        msg: "Only Admins permissions!",
      });
    }
  });

//   ===============================================
// Cart items
app.post("/users/:id/cart", middleware, bodyParser.json(), (req, res) => {
    try {
      let { id } = req.body;
      const qCart = ` SELECT cart
      FROM users
      WHERE id = ?;
      `;
      db.query(qCart, req.user.id, (err, results) => {
        if (err) throw err;
        let cart;
        if (results.length > 0) {
          if (results[0].cart === null) {
            cart = null;
          } else {
            cart = JSON.parse(results[0].cart);
          }
        }
        const strProd = `
      SELECT *
      FROM products
      WHERE id = ${id};
      `;
        db.query(strProd, async (err, results) => {
          if (err) throw err;
  
          let product = {
            Id: results[0].Id,
            prodName: results[0].prodName,
            prodimg: results[0].prodDesc,
            prodType: results[0].prodType,
            prodPrice: results[0].prodPrice,
            prodImg_URL: results[0].prodImg_URL,
            prodSerial_Code: results[0].prodSerial_Code,
            brandName: results[0].brandName,
            totalamount: results[0].totalamount,
            userid: results[0].userid,
          };
  
          cart.push(product);
          // res.send(cart)
          const strQuery = `UPDATE users
      SET cart = ?
      WHERE (id = ${req.user.id})`;
          db.query(strQuery, /*req.user.id */ JSON.stringify(cart), (err) => {
            if (err) throw err;
            res.json({
              results,
              msg: "Product added to Cart",
            });
          });
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  });
  
  // delete one item from cart
  app.delete("/users/:id/cart/:prodid", middleware, (req, res) => {
    const dCart = `SELECT cart
    FROM users
    WHERE id = ?`;
    db.query(dCart, req.user.id, (err, results) => {
      if (err) throw err;
      let item = JSON.parse(results[0].cart).filter((x) => {
        return x.prodid != req.params.prodid;
      });
      // res.send(item)
      const strQry = `
    UPDATE users
    SET cart = ?
    WHERE id= ? ;
    `;
        db.query(
          strQry,
          [JSON.stringify(item), req.user.id],
          (err, data, fields) => {
            if (err) throw err;
            res.json({
              msg: "Item Removed from Cart",
            });
          }
        );
    });
  });

  const login = require("./models/login");
app.use("/login", login);
  
const register = require("./models/register");
app.use("/register", register);

// ======================================================
// Products functionalities
app.get('/products', (req, res)=> {
    const strQry = `
    SELECT id, prodName, prodDesc, prodType, prodPrice, prodImg_URL, prodSerial_Code, brandName, brandLogoImg_URL
    FROM products;
    `
    db.query(strQry, (err, results)=> {
        if(err) throw err;
        res.status(200).json({
            results: results
        })
    })
});

app.get('/products/:id', (req, res)=> {
    const strQry = `
    SELECT id, prodName, prodDesc, prodType, prodPrice, prodImg_URL, prodSerial_Code, brandName, brandLogoImg_URL
    FROM products
    WHERE id = ?;
    `
    db.query(strQry, [req.params.id], (err, results)=> {
        if(err) throw err;
        res.status(200).json({
            results: results
        })
    })
});

//aDDING A NEW POST
app.post("/", bodyParser.json(), (req, res) => {
    const {
      Id,
      prodName,
      prodDesc,
      prodType,
      prodPrice,
      prodImg_URL,
      prodSerial_Code,
      brandName,
      brandLogoImg_URL,
    } = req.body;
    try {
      con.query(
        `INSERT INTO users (Id,prodName,
          prodDesc,
          prodType,
          prodPrice,
          prodImg_URL,
          prodSerial_Code,
          brandName,
          brandLogoImg_URL,) VALUES ("${Id}", "${prodName}", "${prodDesc}", "${prodType}", "${prodPrice}", "${prodImg_URL}", "${prodSerial_Code}", "${brandName}", "${brandLogoImg_URL}")`,
        (err, result) => {
          if (err) throw err;
          res.send(result);
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
  app.put("/:id", bodyParser.json(), (req, res) => {
    const {
      Id,
      prodName,
      prodDesc,
      prodType,
      prodPrice,
      prodImg_URL,
      prodSerial_Code,
      brandName,
      brandLogoImg_URL,
    } = req.body;
    try {
      conn.query(
        `UPDATE users
         SET  prodName = "${Id} "${prodName}", prodDesc = "${prodDesc}", prodType = "${prodType}", prodPrice = "${prodPrice}", prodImg_URL = "${prodImg_URL}", prodSerial_Code = "${prodSerial_Code}", brandName = "${brandName}", brandLogoImg_URL = "${brandLogoImg_URL}"
         WHERE user_id=${req.params.id}`,
        (err, result) => {
          if (err) throw err;
          res.send(result);
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
  app.delete("/:id", bodyParser.json(),(req, res) => {
    try {
      con.query(
        `DELETE FROM users WHERE user_id=${req.params.id}`,
        (err, result) => {
          if (err) throw err;
          res.send(result);
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

//   ===============================================
 //Login
 app.post("/login", bodyParser.json(),(req, res) => {
    try {
      let sql = "SELECT * FROM users WHERE ?";
      let user = {
        email: req.body.email,
      };
      con.query(sql, user, async (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
          res.send("Email not found please register");
        } else {
          //Decryption
          //Accepts the password stored in the db and the password given by the user(req.body)
          const isMatch = await bcrypt.compare(
            req.body.password,
            result[0].password
          );
          //If the password does not match
          if (!isMatch) {
            res.send("Password is Incorrect");
          } else {
            const payload = {
              user: {
                Id: result[0].Id,
                prodName: result[0].prod_name,
                prodDesc: result[0].prod_desc,
                prodType: result[0].prod_type,
                prodPrice: result[0].prod_price,
                prodImg_URL: result[0].prod_img_url,
                prodSerialCode: result[0].prod_serial_code,
                brandName: result[0].brandName,
                brandlogo_img_url: result[0].brandlogo-img_url,
              },
            };
            //Creating a token and setting an expiry date
            jwt.sign(
              payload,
              process.env.jwtSecret,
              {
                expiresIn: "365d",
              },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
  //Verify
  app.get("/users", bodyParser.json(), (req, res) => {
    const token = req.header("x-auth-token");
    jwt.verify(token, process.env.jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({
          msg: "Unauthorized Access!",
        });
      } else {
        res.status(200);
        res.send(decodedToken);
      }
    });
  });
  const middleware1 = require("../middleware/auth");
  app.get("/", middleware1, (req, res) => {
    try{
      let sql = "SELECT * FROM users";
      con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
    }
  });
  // Importing the dependencies
  const nodemailer = require('nodemailer');
  app.post('/forgot-psw', (req, res) => {
      try {
      let sql = "SELECT * FROM users WHERE ?";
      let user = {
        email: req.body.email,
      };
      con.query(sql, user, (err, result) => {
        if (err) throw err;
        if(result === 0) {
          res.status(400), res.send("Email not found")
        }
        else {
          // Allows me to connect to the given email account || Your Email
          const transporter = nodemailer.createTransport({
            host: process.env.MAILERHOST,
            port: process.env.MAILERPORT,
            auth: {
              user: process.env.MAILERUSER,
              pass: process.env.MAILERPASS,
            },
          });
          // How the email should be sent out
        var mailData = {
          from: process.env.MAILERUSER,
          // Sending to the person who requested
          to: result[0].email,
          subject: 'Password Reset',
          html:
            `<div>
              <h3>Hi ${result[0].full_name},</h3>
              <br>
              <h4>Click link below to reset your password</h4>
              <a href="https://user-images.githubusercontent.com/4998145/52377595-605e4400-2a33-11e9-80f1-c9f61b163c6a.png">
                Click Here to Reset Password
                user_id = ${result[0].user_id}
              </a>
              <br>
              <p>For any queries feel free to contact us...</p>
              <div>
                Email: ${process.env.MAILERUSER}
                <br>
                Tel: If needed you can add this
              <div>
            </div>`
        };
        // Check if email can be sent
        // Check password and email given in .env file
        transporter.verify((error, success) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email valid! ', success)
          }
        });
        transporter.sendMail(mailData,  (error, info) => {
          if (error) {
            console.log(error);
          } else {
            res.send('Please Check your email', result[0].user_id)
          }
        });
        }
      });
    } catch (error) {
      console.log(error);
    }
  })
  // Rest Password Route
  app.put('/users/:id', middleware1,bodyParser.json(), (req, res) => {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      user_id: req.params.id,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      if (result === 0) {
        res.status(400), res.send("User not found");
      } else {
        let newPassword = `UPDATE users SET ? WHERE user_id = ${req.params.id}`;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const updatedPassword = {
          prod_name: result[0].prod_name,
          prod_desc: result[0].prod_desc,
          prod_type: result[0].prod_type,
          prod_price: result[0].prod_price,
          prodImg_URL: result[0].prodImg_URL,
          prod_serial_code: result[0].prod_serial_code,
          brand_name: result[0].brand_name,
          // Only thing im changing in table
          password: hash,
        };
        con.query(newPassword, updatedPassword, (err, result) => {
          if (err) throw err;
          console.log(result);
          res.send("Password Updated please login");
        });
      }
    });
  })

  //Register Route
//The Route where Encryption starts
app.post("/register", middleware1,bodyParser.json(),(req, res) => {
    try {
      let sql = "INSERT INTO users SET ?";
      const {
          prodName,
          prodDesc,
          prodType,
          prodPrice,
          prodImg_URL,
          prodSerial_Code,
          brandName,
          brandLogoImg_URL,
      } = req.body;
     
      //Start of Hashing/Encryption
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      let user = {
        prodName,
        userEmail,
      
      };
      con.query(sql, user, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(`User ${(user.userName, user.userEmail)} created Successfully`);
      });
    } catch (error) {
      console.log(error);
    }
  });

  app.post('/register',bodyParser.json(), 
    (req, res)=> {
    return controller.register(req, res);
    })

app.post("/users", bodyParser.json(), async (req, res) => {
  try {
    const bd = req.body;
    if (bd.usertype === "" || bd.usertype === null) {
      bd.usertype = "user";
    }

    const emailQ = "SELECT email from users WHERE ?";
    let email = {
      Email: bd.Email,
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
        
        INSERT INTO users(id, userName, userEmail, userpassword, userRole, phone_number, join_data)  
        VALUES(?, ?, ?, ?, ?, ?, ?, ?);
        `;
        db.query(
          strQry,
          [
            bd.userName,
            bd.userEmail,
            bd.userpassword,
            bd.userRole,
            bd.phone_number,
            bd.join_data
          ],
          (err, results) => {
            if (err) throw err;
            const payload = {
              user: {
                userName: bd.userName,
                lastname: bd.userEmail,
                userpassword: bd.userpassword,
                userRole: bd.userRole,
                phone_number: bd.phone_number,
                join_data: bd.join_data,
                cart: cart.cart,
              },
            };
          }
        );
      }
    });
  } catch (e) {
    console.log(`Registration Error: ${e.message}`);
  }
});

module.exports = app
