//endpost which will upload files and seperate

var express = require("express");
var flash = require("express-flash");
var bodyParser = require("body-parser");
var sessions = require("express-session");
var cookieParser = require("cookie-parser");
var csurf = require("csurf");
var path = require("path");
var md5 = require("md5");
var dotenv = require("dotenv");

const app = express();

const fileRouter = require("./fileUpload.router");
const tableRouter = require('./tableRoutes')
const imageUpload = require("./fileUpload.middleware");
const { ExcelToJSON } = require("./excelToJson");

dotenv.config();

var PORT = process.env.PORT || 5001;

//var base_url = `http://localhost:${PORT}/`;
var base_url = "";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

var backendRoute = express.Router();
backendRoute.use(flash());
backendRoute.use(bodyParser.urlencoded({ extended: true }));
backendRoute.use(bodyParser.json());
backendRoute.use(
  sessions({
    secret: "@#$%@%^#^%&*SDFGS^%@DD$$%!@%!~~afsdfasdf)(*",
    resave: true,
    saveUninitialized: true,
  })
);
backendRoute.use(cookieParser());
backendRoute.use(csurf({ cookie: true }));
backendRoute.get(base_url + "", function (req, res) {
  res.render("backend/index", {
    title: "S-Loader | Login",
    base_url: base_url,
    csurfToken: req.csrfToken(),
  });
});

backendRoute.post(base_url + "/auth", function (req, res) {
  session = req.session;
  //var username = req.body.username;
  //var password = req.body.password;
  // if (username != "" && password !=""){
  // 		var fixusername = username.replace(/[^a-zA-Z0-9]/g,"")
  // 		var fixpassword = md5(password)
  // 		dbcon.crquery("SELECT * from users where username='"+fixusername+"' and password='"+fixpassword+"' limit 1", function(rows){
  // 			//if (err) throw err;
  // 			if (rows.length == ""){
  // 				req.flash('message_login', 'Username or password maybe wrong!');
  // 				res.redirect(base_url+'');
  // 			}else{
  // 				var addsession = fixpassword;
  // 				session.uniqueID = addsession;
  // 				session.userid = rows['0']['id'];
  // 				session.username = rows['0']['username'];
  // 				session.email = rows['0']['email'];
  // 				res.redirect(base_url+'/dashboard');
  // 			}
  // 		});
  // }else{
  // 		req.flash('message_login', 'Field cannot be empty!');
  // 		res.redirect(base_url+'');
  // }
  res.redirect(base_url + "/dashboard");
});

//General logout path
backendRoute.get(base_url + "/adminiku/logout", function (req, res) {
  res.redirect(base_url + "/");
});

//viewdetails page's logout path
backendRoute.get(base_url + "/logout", function (req, res) {
  res.redirect(base_url + "/");
});

backendRoute.get("/dashboard", (req, res) => {
  res.render("backend/dashboard", {
    title: "S-Loader | DashBoard",
    base_url: base_url,
    csurfToken: req.csrfToken(),
    username: "Sudo",
    listtb: [
      {
        tb_name: "Intern",
        idmain: "0",
        tbnameman: "",
        createdmain: "",
        alias: "",
      },
      {
        tb_name: "Employee",
        idmain: "1",
        tbnameman: "",
        createdmain: "",
        alias: "",
      },
    ],
  });
});

backendRoute.get("/dashboard/uploadsingle", (req, res) => {
  res.render("backend/uploadsingle", {
    title: "S-Loader | Upload-Single",
    base_url: base_url,
    csurfToken: req.csrfToken(),
    username: "Sudo",
    listtb: [
      {
        tb_name: "Intern",
        idmain: "0",
        tbnameman: "",
        createdmain: "",
        alias: "",
      },
      {
        tb_name: "Employee",
        idmain: "1",
        tbnameman: "",
        createdmain: "",
        alias: "",
      },
    ],
  });
});

backendRoute.get("/dashboard/uploadmultiple", (req, res) => {
  res.render("backend/uploadmultiple", {
    title: "S-Loader | Upload-Multiple",
    base_url: base_url,
    csurfToken: req.csrfToken(),
    username: "Sudo",
    listtb: [
      {
        tb_name: "Intern",
        idmain: "0",
        tbnameman: "",
        createdmain: "",
        alias: "",
      },
      {
        tb_name: "Employee",
        idmain: "1",
        tbnameman: "",
        createdmain: "",
        alias: "",
      },
    ],
  });
});

backendRoute.get("/dashboard/tablealias", (req, res) => {
  res.render("backend/createtablealias", {
    title: "S-Loader | Create-Table",
    base_url: base_url,
    csurfToken: req.csrfToken(),
    username: "Sudo",
    listtb: [
      {
        tb_name: "Intern",
        idmain: "0",
        tbnameman: "",
        createdmain: "",
        alias: "",
      },
      {
        tb_name: "Employee",
        idmain: "1",
        tbnameman: "",
        createdmain: "",
        alias: "",
      },
    ],
  });
});

backendRoute.get("/dashboard/listingdata/original", (req, res) => {
  res.render("backend/listing", {
    title: "S-Loader | Listing",
    base_url: base_url,
    csurfToken: req.csrfToken(),
    username: "Sudo",
    listtb: [
      {
        tb_name: "Intern",
        idmain: "0",
        tbnameman: "",
        createdmain: "",
        alias: "",
      },
      {
        tb_name: "Employee",
        idmain: "1",
        tbnameman: "",
        createdmain: "",
        alias: "",
      },
    ],
  });
});

backendRoute.post("/dashboard/uploaddatasingle", imageUpload.single('file'), async (req, res) => {
  //API to uplaod a single file on the server
  let data = {
    title: "S-Loader | Analyze-grouping",
    base_url: base_url,
    csurfToken: req.csrfToken(),
    username: "Sudo",
    tbname: req.file.filename
  };

  ExcelToJSON(req.file.path, res, data);
});

backendRoute.post("/dashboard/uploaddatamultiple", imageUpload.array('file', 5), (req, res) => {
  //API to upload multiple files on the server
  // req.files.forEach(file => {
  //   let data = {
  //     title: "S-Loader | Analyze-grouping",
  //     base_url: base_url,
  //     csurfToken: req.csrfToken(),
  //     username: "Sudo",
  //     tbname: file.filename
  //   };
  //   ExcelToJSON(file.path, res, data);
  // });
  res.render("backend/analyze-grouping", {
    title: "S-Loader | Analyze-grouping",
    base_url: base_url,
    csurfToken: req.csrfToken(),
    username: "Sudo",
    tbname: "student",
    fieldlist: ["0", "id", "Age", "Name", "City", "Country"]
  });
});

backendRoute.post("/dashboard/createtablealias", (req, res) => {
  //API to create a table
  //OR create a table alias
  res.status(200).send("successfull");
});

backendRoute.get("/dashboard/detaildata/:idmain", (req, res) => {
  //To view the date in the file or table
  res.render("backend/viewdetail", {
    title: "S-Loader | View - Details",
    base_url: base_url,
    csurfToken: req.csrfToken(),
    username: "Sudo",
    tbname: "student",
    postrowdata: [
      {
        date_a_created: "2012-01-13 T11:00:00",
      },
    ],
    fieldata: ["date_a_created"],
    idtable: req.params.idmain,
  });
});

backendRoute.get("/dashboard/exports/:idmain", (req, res) => {
  //To download data from the server
  res.status(200).send("successfull");
});

backendRoute.get("/dashboard/analyze/:idmain", (req, res) => {
  //To Analyze the data of the server
  res.render("backend/analyze", {
    title: "S-Loader | Analyze Data",
    base_url: base_url,
    csurfToken: req.csrfToken(),
    username: "Sudo",
    tbname: "student",
  });
});

backendRoute.get("/dashboard/chart/:idmain", (req, res) => {
  //To create a chart out of the data from the server
  res.render("backend/chart", {
    title: "S-Loader | Chart",
    base_url: base_url,
    csurfToken: req.csrfToken(),
    username: "Sudo",
    tbname: "student",
  });
});

backendRoute.post("/dashboard/analyze-grouping", (req, res) => {
  var tableDetails = JSON.parse(req.body.tableDetails);
  tableDetails = {
    ...tableDetails,
    unique: req.body.FieldUnique,
    projection: req.body.FieldProjection,
  };
  res.render("backend/analyze-grouping-result", {
    title: "S-Loader | Analyze-grouping-result",
    base_url: base_url,
    csurfToken: req.csrfToken(),
    username: "Sudo",
    tbname: tableDetails.tbname,
    fieldchooseresult: "result",
  });
});

app.use('/api/upload', fileRouter)
app.use('/api/table', tableRouter)

app.use("/", backendRoute);

app.listen(PORT, () => {
  console.log(`App is listerning on ${PORT}`);
});
