var fs = require('fs');
var XLSX = require('xlsx');

function ExcelToJSON(filepath, res, response) {
    let worker_out;
    fs.readFile(filepath, (error, data) => {
        if (error) {
            console.log("Error: Not read file");
        } else {
            let workbook = XLSX.read(data);
            workbook.SheetNames.forEach(sheet => {
                let rowObject = XLSX.utils.sheet_to_row_object_array(
                    workbook.Sheets[sheet]
                );
                // console.log(rowObject);
                let rows = [];

                for (let i = 0; i < rowObject.length; i++) {
                    rows = [
                        ...rows,
                        rowObject[i]
                    ];
                }

                worker_out = {
                    tbname: response.tbname,
                    fieldlist: Object.keys(rows[0]),
                    rows: rows
                };
                console.log(worker_out);
                res.render("backend/analyze-grouping", {
                    title: response.title,
                    base_url: response.base_url,
                    csurfToken: response.csurfToken,
                    username: response.username,
                    tbname: response.tbname,
                    fieldlist: worker_out.fieldlist,
                    object: worker_out
                });
                return;
            });
        }
    });
}

module.exports = { ExcelToJSON };
