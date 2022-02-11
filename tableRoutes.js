const connectToDatabase = require("./db.config");

const { Router } = require("express");

const router = Router({
    mergeParams: true,
});

router.post("/", (req, res) => {
    const dbConnection = connectToDatabase();

    var sql = "CREATE TABLE intern(name VARCHAR(255), address VARCHAR(255))";
    dbConnection.query(sql, function (err, result) {
    
        if (err) throw err;
  });

    dbConnection.end();
    res.send("Table created");
})

router.post("/insertrecord", (req, res) => {
    const dbConnection = connectToDatabase();

    var sql = "INSERT INTO intern(name, address) VALUES ('abc', 'xyz')";
    dbConnection.query(sql, function (err, result) {
    
        if (err) throw err;
  });

    dbConnection.end();
    res.send("inserted record");
})

router.delete("/", (req, res) => {
    const dbConnection = connectToDatabase();

    var sql = "DROP TABLE intern";
    dbConnection.query(sql, function (err, result) {
    
        if (err) throw err;
  });

    dbConnection.end();
    res.send("table deleted");
})

module.exports = router;