const express = require('express')
const app = express()
const cors = require('cors')
var bodyParser = require('body-parser');

//middle where
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json()) //for access req.body
app.use(cors()) //return values to client

//register route
app.use('/auth', require('./routes/jwtAuth'))

//profile route
app.use("/profile", express.static('upload/images'))
app.use('/', require('./routes/profile'))



app.listen(5000, () => {
    console.log('app run 5000')
})