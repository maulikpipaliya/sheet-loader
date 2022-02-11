//for web-worker
let worker = new Worker("/js/web-worker.js");
let inputs = document.getElementsByClassName("input-file");
let output = {};
let index = 0;
for (let i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener("change", () => {
    worker.postMessage(inputs[i].files[0]);
  });
}

worker.onmessage = (event) => {
    //let table = String(`table-${index}`);
    if (Object.keys(output).length < 5) {
        //Get all the rows from JSON object of Excel file
        let rows = [];

        for (let i = 0; i < event.data.length; i++) {
            rows = [
                ...rows,
                event.data[i]
            ];
        }

        //Declare how a table look like
        //Add the table on the final list of tables
        output = {
            ...output,
            [`table-${index}`]: {
                columns: Object.keys(rows[0]),
                unqiue: [],
                projection: [],
                rows: rows
            }
        };
        //Increase the index
        index = index + 1;
        console.log(output);
        sendExcel();
    }
}
