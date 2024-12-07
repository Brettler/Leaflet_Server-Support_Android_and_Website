const loginService = require('../services/login');
// We are using cryptography, to ensure that no one else will be able to impersonate users
const jwt = require('jsonwebtoken');
const key = process.env.JWT_SECRET;

const processLogin = async (req, res) => {
    // Check credentials
    const user = await loginService.getCredentials(req.body.username, req.body.password);
    if (user) {
        // Correct username and password
        // We now want to generate the JWT.
        const data = { username: req.body.username }
        // Generate the token.
        const token = jwt.sign(data, key)
        // Return the token to the browser
        res.status(201).send(token);
    }
    else
        // Incorrect username/password. The user should try again.
        res.status(404).send('Invalid username and/or password')
}

module.exports = { processLogin }
