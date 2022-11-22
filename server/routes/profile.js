const router = require('express').Router()
const multer = require('multer');
const authorization = require('../middlewhere/authorization')
const path = require('path')
const pool = require('../db')
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage
})

router.get('/profile', authorization, async (req, res) => {
    try {
        const user_id = req.user;
        const user = await pool.query('select * from userprofile where user_id = $1', [user_id])
        res.json(user?.rows?.[0])
    } catch (error) {
        console.log(error)
    }
})
router.post('/upload-profile', authorization, upload.single('profile'), async (req, res) => {
    const img_url = `http://localhost:5000/profile/${req.file.filename}`
    const user_id = req.user
    const userExist = await pool.query('select user_id from userprofile where user_id = $1', [user_id])
    if (userExist.rows?.length == 0) await pool.query('insert into userprofile (user_id, img_url) values($1, $2)', [user_id, img_url])
    else await pool.query('update userprofile set img_url = $1 where user_id = $2', [img_url, user_id])

    res.json({
        img_url: img_url
    })

})



module.exports = router


// const authorization = require('../middlewhere/authorization');
// const pool = require('../db')

// const router = require('express').Router()

// router.post('/profile-upload', authorization, async (req, res) => {
//     try {
//         const { name, image } = req.body;
//         let id = req.user
//         const profile = await pool.query('insert into userprofile( user_img, user_name) values ($1, $2) where user_id = $3', [image, name, id])
//         res.json('profile uploaded')
//     } catch (error) {
//         console.log(error)
//         res.status(500).json('server error')
//     }
// })
// router.get('/profile', authorization, async (req, res) => {
//     try {
//         const id = req.user;
//         const profile = await pool.query('select * from userprofile where user_id = $1', [id])
//         if (profile?.rows?.length === 0) return res.json('No profile detailed')
//         res.json(profile?.rows[0])

//     } catch (error) {
//         console.log(error)
//     }
// })
// module.exports = router;



