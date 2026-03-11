// we are using mysql2/promise package to connect to mysql database.
const mysql = require('mysql2/promise');
require('dotenv').config();
// create a connection pool to the mysql database using the credentials from the .env file.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// test the connection to the database by getting a connection from the pool and logging a success message.
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to the MySQL database successfully!');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the MySQL database:', error);
    }
}
// call the testConnection function to verify the connection to the database.
testConnection();
// export the pool object to be used in other parts of the application for executing queries.
module.exports = pool;
