const jwt = require("jsonwebtoken");

const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
      response.status(401);
      response.json({message : "Invalid JWT Token"});
    } else {
      jwt.verify(jwtToken, "alsdfjl;asejglejksjeg", async (error, payload) => {
        if (error) {
          response.status(401);
          response.json({message : "Invalid JWT Token"});
        } else {
          next();
        }
      });
    }
  };

module.exports = {authenticateToken};