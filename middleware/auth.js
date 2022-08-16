const jwt = require("jsonwebtoken");
require('dotenv').config()
module.exports = function (req, res, next) {
 //Get token from request header
 const token = req.header("x-auth-token");
 //Check if not token is valid
 if (!token) {
   return res.status(401).json({ msg: "No token, authorization denied" });
 }
 try {
  // Decoding the token and getting user attached to the token
   const decoded = jwt.verify(token, process.env.SECRETKEY);
  // Storing User data in req.user
   req.user = decoded.user;
   next();
 } catch (err) {
   res.status(401).json({ msg: "Token is not valid" });
 }
};

//  Creating a token and setting an expiry date
     jwt.sign(
      req.body,
      process.env.jwtSecret,
      {
        expiresIn: "365d",
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );