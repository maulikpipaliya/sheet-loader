//Confiugred connection to mysql database

const dotenv = require('dotenv');

dotenv.config();

const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE,
  port : process.env.DB_PORT
});
 
//connection.connect();
 

// // connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
// //   if (error) throw error;
// //   console.log('The solution is: ', results[0].solution);
// // });

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });

connection.end();


//Functions for excel file

//code to generate json array
const XLSX = require('xlsx');
const workbook = XLSX.readFile('duplicate.xlsx');
var sheet_name_list = workbook.SheetNames;
const arr = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
console.log(arr);


// Key generating lines

var list_of_colums_duplicate = ['Name'];
list_of_colums_duplicate =  list_of_colums_duplicate.sort();
const temp = {};
function generateKeys(arr,itr){
    var key = "";
    for(i=0;i<list_of_colums_duplicate.length;i++){
        key += arr[itr][list_of_colums_duplicate[i]];
        }
    return key;
}


// Function to seperate unique and duplicate entries from the JSON object array

var unique = [];
var duplicate = [];
for(j=0;j<10;j++){
    var key = generateKeys(arr,j);
    console.log(key);
    //call generateKeys();
    if(!temp[key]){
        
        //append to unique values array
        unique.push(arr[j]);
        temp[key] = i;
    }else{
        duplicate.push(arr[j]);
        //append to duplicate array 
    }
}
console.log(unique);
console.log(duplicate);


// for(i=0;i<arr.length;i++){
//     temp[toString()]
// }

// Function to drop the listed columns and return it in JSON object array

const dfd = require('danfojs-node');
df = new dfd.DataFrame(unique);

const answer = df.toJSON(df.drop({columns:['Phone Number'],inplace : true}));

df.print();
console.log(answer);

// list = {
//     table1 : "Name of table1",
//     numbs : 50,
//     colums : ['0',         'First Name',
//     'Last Name', 'Gender',
//     'Country',   'Age',
//     'Date',      'Id'
//   ],
//   rows : {
      
//   }
// }

// for (i){
//     create()
//     bactch([])
// }
