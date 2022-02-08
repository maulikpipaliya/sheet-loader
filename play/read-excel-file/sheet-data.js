const fileInput = document.getElementById("fileInput");
console.log(fileInput);


fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];

    console.log("file");

    readXlsxFile(file).then(function (rows) {

        console.log(rows);
        createTableHeadings(rows[0]);
        rows.shift();
        createTableData(rows);
    });
});

const createTableHeadings = (headingRow) => {
    

    const table = document.getElementById("table-data");
    const tableHeadings = document.createElement("thead");
    const tableHeadingRow = document.createElement("tr");

    headingRow.forEach((heading) => {
        const tableHeading = document.createElement("th");
        tableHeading.innerText = heading;
        tableHeadingRow.appendChild(tableHeading);
    });

    tableHeadings.appendChild(tableHeadingRow);

    table.appendChild(tableHeadings);
};

const createTableData = (data) => {
    console.log("data");
    console.log(data);

    const table = document.getElementById("table-data");
    const tableBody = document.createElement("tbody");

    

    data.forEach((row) => {
        const tableRow = document.createElement("tr");
        row.forEach((cell) => {
            const tableCell = document.createElement("td");
            tableCell.innerText = cell;
            tableRow.appendChild(tableCell);
        });

        tableBody.appendChild(tableRow);
    });

    table.appendChild(tableBody);
};