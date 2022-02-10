

const node_xj = require("xls-to-json-lc");
node_xj({
  input: "file_example_XLS_10.xls",  // input xls
  output: "output.json", // output json
  sheet: "Sheet1",  // specific sheetname
  lowerCaseHeaders:true
}, function(err, result) {
  if(err) {
    console.error(err);
  } else {
    console.log(result);
  }
});