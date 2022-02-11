const mysql = require("mysql");
const dotenv =  require('dotenv');
const path = require('path')

//absolute is required
dotenv.config({
    path:path.resolve(__dirname, './.env')
});


const connectToDatabase = () => {
    try {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
        });

        //if connection is successful
        if (
            connection.connect(function (err) {
                if (err) {
                    console.log("Error connecting to database");
                    return;
                }
                console.log("Connection to database established");
            })
        );
        return connection;
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectToDatabase;
