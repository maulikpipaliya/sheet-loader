const connectToDatabase = require("./db.config");
const XLSX = require("xlsx");
const dfd = require("danfojs-node");

const dbConnection = connectToDatabase();

dbConnection.end();

const filePath = "./duplicate.xlsx";
const listOfDupCols = ["Name"];
const columnsToDelete = ["Phone Number"];



/**
 * @param {*} filePath = path of the file to be read
 *
 */
const sheetToJSON = (filePath) => {
    const workbook = XLSX.readFile(filePath);
    var sheetNameList = workbook.SheetNames;
    const arr = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
    // console.log(arr);
    return arr;
};



/**
 *
 * ["Name","Age","Email","Phone","Address","City","State","Zip","Country","Company","Website","Notes"]
 * Dup = ["Name","Age"]
 * returns key = "18Maulik" (since it's sorted)
 * @author Mihir Doshi
 */
const stringifyKey = (arr, itr, listOfDupCols) => {
    let key = "";
    for (i = 0; i < listOfDupCols.length; i++)
        key += arr[itr][listOfDupCols[i]].trim();
    return key.trim();
};


/**
 * @param {*} arr = array of objects
 * @param {*} listOfDupCols = array of columns to be checked for duplicates
 * 
 */
const getUniqueAndDuplicateRows = (arr, duplicateCols) => {
    const mapKeyRow = {};

    var unique = [];
    var duplicate = [];
    const totalRows = arr.length;

    duplicateCols.sort();

    // rowKey = "18Maulik"
    for (let i = 0; i < totalRows; i++) {
        let rowKey = stringifyKey(arr, i, duplicateCols);
        console.log(rowKey);

        console.log(mapKeyRow[rowKey]);

        // map doesnt have the key at all
        if (mapKeyRow[rowKey] === undefined) {
            //append to unique values array
            unique.push(arr[i]);
            mapKeyRow[rowKey] = i;
            // console.log(unique);
        } else {
            //append to duplicate array
            duplicate.push(arr[i]);
        }
    }

    return {
        unique,
        duplicate,
    };
};

/**
 *
 * @param {*} arr  = array of objects to delete from
 * @param {*} columnsToDelete  = array of columns to delete
 */
 const deleteColumns = (arr, columnsToDelete) => {
    arr.forEach((element) => {
        columnsToDelete.forEach((column) => {
            delete element[column];
        });
    });
};

// getUniqueAndDuplicateRows(sheetToJSON(filePath));
const { unique, duplicate } = getUniqueAndDuplicateRows(
    sheetToJSON(filePath),
    listOfDupCols
);

// console.log(unique);

console.table(unique);
console.table(duplicate);



deleteColumns(unique, columnsToDelete);

// Function to drop the listed columns and return it in JSON object array

// df = new dfd.DataFrame(unique);
// const answer = df.toJSON(df.drop({ columns: ["Phone Number"], inplace: true }));
// df.print();