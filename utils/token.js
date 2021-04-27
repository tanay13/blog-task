var jwt = require('jsonwebtoken');

// create json web token
const expiry = 3 * 24 * 60 * 60;
const createToken = (id, email) => {
  return jwt.sign({ id: id, email: email }, 'very strong secret', {
    expiresIn: expiry,
  });
};

module.exports = { createToken, expiry };
