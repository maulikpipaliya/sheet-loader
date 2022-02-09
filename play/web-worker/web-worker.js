// onmessage = function(event) {
//     console.log('File received from main script');
//     console.log(event.data);
//     postMessage("the msg");
// }

importScripts(
    "https://unpkg.com/read-excel-file@5.2.26/bundle/read-excel-file.min.js"
);
importScripts(
    "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.2/xlsx.full.min.js"
);

// onmessage = function(event) {
//   readXlsxFile(event.data).then((rows) => {
//     // `rows` is an array of rows
//     // each row being an array of cells.
//     postMessage(rows)
//   })
// }

onmessage = function (event) {
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(event.data);
    fileReader.onload = (event) => {
        let data = event.target.result;
        let workbook = XLSX.read(data, { type: "binary" });
        console.log(workbook);
        workbook.SheetNames.forEach((sheet) => {
            let rowObject = XLSX.utils.sheet_to_row_object_array(
                workbook.Sheets[sheet]
            );
            console.log(rowObject);
            this.postMessage(rowObject);
        });
    };
};
