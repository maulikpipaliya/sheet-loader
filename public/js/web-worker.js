importScripts(
    "https://unpkg.com/read-excel-file@5.2.26/bundle/read-excel-file.min.js"
);
importScripts(
    "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.0/xlsx.full.min.js"
);
//webworker
onmessage = (event) => {
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(event.data);
    fileReader.onload = (event) => {
        //use the data
        let data = event.target.result;
        //parse the data
        let workbook = XLSX.read(data, {
            type: "binary"
        });
        workbook.SheetNames.forEach(sheet => {
            let rowObject = XLSX.utils.sheet_to_row_object_array(
                workbook.Sheets[sheet]
            );
            //console.log(rowObject);
            this.postMessage(rowObject);
        });
    }
};

onerror = (event) => {
    console.log("Web-Worker-Error:");
}