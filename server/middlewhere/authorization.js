const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = async (req, res, next) => {
    try {
        const token = req.header('token')
        if (!token) res.status(401).send('please send token')

        const payload = jwt.verify(token, process.env.jwtSecret)
        req.user = payload.user;
        next()

    } catch (error) {
        console.log(error)
        res.status(500).send('token expired')
    }
}