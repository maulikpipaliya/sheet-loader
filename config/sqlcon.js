const mysql = require("mysql")
var connection = mysql.createConnection({
	"host": "localhost",
	"user": "root",
	"password": "",
	"database": "datauploaddb"
})


function crquery(query, callback) 
{
    connection.query(query,function(err,rows){
        if(err) throw err;
        	return callback(rows);
        
    });
}

function transactionquery(query, query2, callback) 
{
    connection.beginTransaction(function(err) {
		  if (err) { 
		  	errEk = "mysqlerror"
            return errEk; 
          }

		  connection.query(query,function(err,rows){
			    if (err) { 
			      connection.rollback(function() {
			        	errEk = "mysqlerror"
            			return errEk;
			      });
			    }
			 
			    var log = rows.insertId;
			 
			    connection.query(query2,function(err,rows){
			      if (err) { 
			        connection.rollback(function() {
			          	errEk = "mysqlerror"
            			return errEk;
			        });
			      }  
			      connection.commit(function(err) {
			        if (err) { 
			          connection.rollback(function() {
				            errEk = "mysqlerror"
            				return errEk;
			          });
			        }
			        return callback(rows);
			        connection.end();
			      });
			    });
		  });
	});
}

module.exports = {
    crquery: crquery,
    transactionquery: transactionquery
}