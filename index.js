require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require("./config/dbconn");
// Error handling
const createError = require('./middleware/ErrorHandling');
// Express app
const app = express();
// Express router
const router = express.Router();
// Configuration 
const port = parseInt(process.env.PORT) || 4000;

// Set header
// app.use(cors());
app.use(cors({
    origin: ['http://127.0.0.1:8080', 'http://localhost:8080'],
    credentials: true
}));
app.use(router, express.json(), 
    express.urlencoded({
    extended: true})
);
// 
app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
});

// home
router.get('/', (req, res)=> { 
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Users
router.post('/users', (req, res)=> {

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
router.get('/users/:user_id', (req, res)=> {
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

// Cart items
router.post("/users/:id/cart", middleware, bodyParser.json(), (req, res) => {
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
            cart = [];
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
  router.delete("/users/:id/cart/:prodid", middleware, (req, res) => {
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

// Products functionalities
router.get('/products', (req, res)=> {
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

router.get('/products/:id', (req, res)=> {
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

// Update users
router.put("/users/:id", middleware, bodyParser.json(), (req, res) => {
    const { firstname, lastname, email, address, usertype } = req.body;
  
    const user = {
      username,
      lastname,
      email,
      address,
      usertype,
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
  router.delete("/users/:id", middleware, (req, res) => {
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