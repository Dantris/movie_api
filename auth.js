const crypto = require('crypto');
const jwtSecret = crypto.randomBytes(64).toString('hex');
module.exports.jwtSecret = jwtSecret;


const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport.js');

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

// Login
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', {session: false}, (error, user, info) => {
            if (error) {
                console.log(info)
                return res.status(400).json({
                    message: 'Error error',
                    user: user
                });
            }
            if (!user) {
                return res.status(400).json({
                    message: 'Error no user',
                    user: user
                });
            }
            // if (error || !user) {
            //     return res.status(400).json({
            //         message: 'Something went wrong',
            //         user: user
            //     });
            // }
            req.login(user, {session: false}, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({user, token});
            });
        })(req, res);
    });
}