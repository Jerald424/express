const { Pool } = require('pg')

const pool = new Pool({
    database: "learnjwt",
    port: 5432,
    host: "localhost",
    user: 'postgres',
    password: "admin"
})

module.exports = pool;