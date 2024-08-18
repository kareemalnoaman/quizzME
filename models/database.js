const mysql = require('mysql2')
const connection = mysql.createPool({
  connectionLimit: 40,
  host: 'localhost',
  user: 'root',
  password: 'root1234',
  database: 'quizzme'
})

module.exports = connection