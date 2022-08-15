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
router('/users', (req, res, next)=> {

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
                `INSERT INTO users(email, password)
                VALUES(?, ?, ?, ?, ?, ?, ?);`;
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
    `SELECT id, username, useremail, userpassword, userRole, phone_number,join_data, cart
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

// Cart

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
//
module.exports = {
    devServer: {
        Proxy: '*'
    }
}
