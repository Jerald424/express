const router = require('express').Router()
const pool = require('../db')
const bcrypt = require("bcrypt")
const jwtTokenGenerator = require('../utils/jwtTokenGenerator')
const authorization = require('../middlewhere/authorization')

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await pool.query('select * from userlogin where user_email =$1', [email])
        if (user?.rows?.length !== 0) return res.status(401).send('user already exist')

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound)
        const bcryptPassword = await bcrypt.hash(password, salt)

        const newUser = await pool.query('insert into userlogin (user_name, user_email, user_password) values ($1, $2, $3) returning *', [name, email, bcryptPassword])

        const token = jwtTokenGenerator(newUser?.rows?.[0]?.user_id)
        res.json({ token })
        await pool.query('insert into userprofile (user_id) values ($1) ', [token])


    } catch (error) {
        console.log(error)
        res.status(500).json('server error')
    }
})


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query('select * from userlogin where user_email = $1', [email])
        if (user?.rows?.length == 0) return res.status(401).json('user does not exist')
        const validPassword = await bcrypt.compare(password, user?.rows?.[0]?.user_password)

        if (!validPassword) res.status(401).send('password or user name are not match')

        const token = jwtTokenGenerator(user.rows?.[0]?.user_id)
        res.json({ token })
        await pool.query('insert into userprofile (user_id) values ($1) ', [token])


    } catch (error) {
        console.log(error)
        res.status(500).json('server error')
    }
})

router.get('/is-verify', authorization, async (req, res) => {
    try {
        res.json({
            'user_id': req.user,
            'status': true
        })

    } catch (error) {
        console.log(error)
        res.status(500).json('server error')
    }
})



module.exports = router;