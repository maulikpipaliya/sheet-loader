var express = require("express")
var backendRoute = express.Router()
var bodyParser = require("body-parser")
var dbcon = require("./../config/sqlcon")
var sessions = require('express-session')
var flash = require('express-flash')
var cookieParser = require('cookie-parser')
var csurf = require('csurf')
var md5 = require("md5")
var dateFormat = require("dateformat")
var fs = require('fs')
var path = require('path')
var uniqid = require('uniqid')
var multer = require('multer')
var nodeExcel = require('excel-export')
var xlstojson = require("xls-to-json-lc")
var xlsxtojson = require("xlsx-to-json-lc")
var Chart = require('chart.js')
var base_url = "/adminiku"
var datenow = new Date()
var radio = "";
var featuredtblist = ""
//post
var fieldheadertok = []
var fieldheader = []
var fieldrow = []
var fieldrowfinal = []
var fieldheader2 = "";
var fieldheadertok2 = ""
var fieldrow2 = []
var fieldheader3 = []
var fieldheaderok3 = ""
//endpost
var exceltojson;
	var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {   	
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
    var upload = multer({ //multer settings
                    storage: storage,
                    fileFilter : function(req, file, callback) { //file filter
                        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                        	
                            return callback(new Error('Wrong extension type'));
                        }
                        callback(null, true);
                    }
    }).single('file');
    var uploadmultiple = multer({ //multer settings
                    storage: storage,
                    fileFilter : function(req, file, callback) { //file filter
                        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                        	
                            return callback(new Error('Wrong extension type'));
                        }
                        callback(null, true);
                    }
    }).array('file',4);
backendRoute.use(flash());
backendRoute.use(bodyParser.urlencoded({ extended: false }))
backendRoute.use(bodyParser.json())
backendRoute.use(sessions({
	secret: '@#$%@%^#^%&*SDFGS^%@DD$$%!@%!~~afsdfasdf)(*',
	resave: true,
	saveUninitialized: true
}));
backendRoute.use(cookieParser());
backendRoute.use(csurf({ cookie: true }));
backendRoute.get(base_url+'', function(req, res){
	res.render('backend/index',{
		"title": "Digital Data Analized Tools | Login",
		"base_url": base_url,
		"csurfToken": req.csrfToken()
	})
	
});
backendRoute.post(base_url+'/auth', function(req, res){
	session = req.session;
	var username = req.body.username
	var password = req.body.password
	if (username != "" && password !=""){
			var fixusername = username.replace(/[^a-zA-Z0-9]/g,"")
			var fixpassword = md5(password)
			dbcon.crquery("SELECT * from users where username='"+fixusername+"' and password='"+fixpassword+"' limit 1", function(rows){
				//if (err) throw err;
				if (rows.length == ""){
					req.flash('message_login', 'Username or password maybe wrong!');
					res.redirect(base_url+'');
				}else{
					var addsession = fixpassword;
					session.uniqueID = addsession;
					session.userid = rows['0']['id'];
					session.username = rows['0']['username'];
					session.email = rows['0']['email'];
					res.redirect(base_url+'/dashboard');
				}
				
			});
	}else{
			req.flash('message_login', 'Field cannot be empty!');
			res.redirect(base_url+'');
	}
	
});
backendRoute.get(base_url+'/dashboard', function(req, res){
	session = req.session;
	if (session.uniqueID){
		dbcon.crquery("SELECT a.`tb_name` AS tb_name, a.`created` AS created, b.`alias` AS alias FROM projectupld a LEFT JOIN alias b ON a.`id`=b.`tb_id` WHERE user_id = '"+session.userid+"';", function(rows){
			res.render('backend/dashboard',{
				"title": "Upload Single File",
				"base_url": base_url,
				"csurfToken": req.csrfToken(),
				"username": session.username,
				"listtb": rows
			})
		})
	}else{
		res.redirect(base_url+'');
	}
});
backendRoute.get(base_url+'/dashboard/uploadsingle', function(req, res){
	session = req.session;
	if (session.uniqueID){
		dbcon.crquery("SELECT a.`tb_name` AS tb_name, a.`created` AS created, b.`alias` AS alias FROM projectupld a LEFT JOIN alias b ON a.`id`=b.`tb_id` WHERE user_id = '"+session.userid+"';", function(rows){
			res.render('backend/dashboard',{
				"title": "Upload Single File",
				"base_url": base_url,
				"csurfToken": req.csrfToken(),
				"username": session.username,
				"listtb": rows
			})
		})
	}else{
		res.redirect(base_url+'');
	}
});
backendRoute.get(base_url+'/dashboard/uploadmultiple', function(req, res){
	session = req.session;
	if (session.uniqueID){
		dbcon.crquery("SELECT a.`tb_name` AS tb_name, a.`created` AS created, b.`alias` AS alias FROM projectupld a LEFT JOIN alias b ON a.`id`=b.`tb_id` WHERE user_id = '"+session.userid+"';", function(rows){
			res.render('backend/uploadmultiple',{
				"title": "Upload Multiple Files",
				"base_url": base_url,
				"csurfToken": req.csrfToken(),
				"username": session.username,
				"listtb": rows
			})
		})
	}else{
		res.redirect(base_url+'');
	}
});
backendRoute.post(base_url+'/dashboard/uploaddatamultiple', function(req, res){
	session = req.session;
	if (session.uniqueID){
	        uploadmultiple(req,res,function(err){
	            if(err){
	                 res.json({error_code:1,err_desc:err});
	                 return;
	            }
	            if(!req.files){
	                res.json({error_code:1,err_desc:"No file passed"});
	                return;
	            }
	            var ab = 0;
		                    var a = 0;
		                    var b = 0;
		                    var getvaluestring = ""
		                    var varlength = ""
		                    var headerdblength = ""
		                    var tbname = "data_"+Math.floor(Date.now() / 1000);
		                    var datenowformat = dateFormat(datenow, "yyyy-mm-dd hh:MM:ss");
	            for(var i=0;i<req.files.length;i++){ //looping
	            	var resreturn = [];
	            	var fieldheadertok = [];
	            	if(req.files[i].originalname.split('.')[req.files[i].originalname.split('.').length-1] === 'xlsx'){
		                exceltojson = xlsxtojson;
		            } else {
		                exceltojson = xlstojson;
		            }
		            try {
		            	featuredtblist = req.body.tbname
		                exceltojson({
		                    input: req.files[i].path,
		                    output: null,
		                    lowerCaseHeaders:true
		                }, function(err,result){
		                	if(err) {
		                        return res.json({error_code:1,err_desc:err, data: null});
		                    } 
		                    	fieldrow = []
			                    result.forEach(function(row){
			                    	var getfvalue = []
			                    	if (a == 0){
			                    		fieldheadertok = []
				                    	Object.keys(row).forEach(function(key) {
											fieldheader.push(key + " varchar(255)")
											fieldheadertok.push(key)
										})
										fieldheader2 = fieldheader.join(',');
										fieldheadertok2 = fieldheadertok.join(',');
				                    }
				                    varlength = fieldheadertok.length
				                    for (var j=0;j<varlength;j++){
				                    	getfvalue.push("'"+row[fieldheadertok[j]]+"'")
				                    	
				                    }
				                    
				                    getvaluestring = getfvalue.join(',')
				                    fieldrow.push("('"+datenowformat+"',"+getvaluestring+")")
									a++
									
			                    })
		                    	var collectdata = fieldrow.join(",")
		                    	if (featuredtblist != ""){
		                    		 dbcon.crquery("DESC "+featuredtblist, function(rowsdec){
											headerdblength = rowsdec.length - 2
											
										if (headerdblength === varlength){
											
						                    	dbcon.transactionquery("UPDATE projectupld SET updated='"+datenowformat+"' WHERE tb_name='"+featuredtblist+"' AND user_id='"+session.userid+"'" , "INSERT INTO "+featuredtblist+" (date_a_created,"+fieldheadertok2+") values "+collectdata, function(rows){
						                    		console.log('successful uploaded!')
						                    		
												});
					                    	resreturn.push('success')
										}else{
											resreturn.push('error')
										}

									})
								}else{
										console.log('Tbl Error ' + i)
								}
		                })  // end exceltojson functions
		            } catch (e){
		                res.json({error_code:1,err_desc:"Corupted excel files"});
		            }
	            } //end looping
	            req.flash('message_status_upload', 'Files exported!')
				res.redirect(base_url+'/dashboard/uploadsingle')
	        })
	}else{
		res.redirect(base_url+'');
	}
});
backendRoute.post(base_url+'/dashboard/uploaddatasingle', function(req, res){
	session = req.session;
	if (session.uniqueID){
	        upload(req,res,function(err){
	            if(err){
	                 res.json({error_code:1,err_desc:err});
	                 return;
	            }
	            
	            if(!req.file){
	                res.json({error_code:1,err_desc:"No file passed"});
	                return;
	            }
	            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
	                exceltojson = xlsxtojson;
	            } else {
	                exceltojson = xlstojson;
	            }
	            try {
	            	radio = req.body.grouping
	            	featuredtblist = req.body.tbname
	                exceltojson({
	                    input: req.file.path,
	                    output: null,
	                    lowerCaseHeaders:true
	                }, function(err,result){
	                    if(err) {
	                        return res.json({error_code:1,err_desc:err, data: null});
	                    } 
	                    var ab = 0;
	                    var a = 0;
	                    var b = 0;
	                    var getfvalue = []
	                    var getvaluestring = ""
	                    var varlength = ""
	                    var headerdblength = ""
	                    var tbname = "data_"+Math.floor(Date.now() / 1000);
	                    var datenowformat = dateFormat(datenow, "yyyy-mm-dd hh:MM:ss");
	                    result.forEach(function(row){
	                    	var getfvalue = []
	                    	if (a == "0"){
	                    	 fieldheadertok = [];
		                    	Object.keys(row).forEach(function(key) {
									fieldheader.push(key + " varchar(255)")
									fieldheadertok.push(key)
								})
								fieldheader2 = fieldheader.join(',');
								fieldheadertok2 = fieldheadertok.join(',');
		                    }
		                    varlength = fieldheadertok.length
		                    for (var i=0;i<varlength;i++){
		                    	getfvalue.push("'"+row[fieldheadertok[i]]+"'")
		                    	
		                    }
		                    
		                    getvaluestring = getfvalue.join(',')
		                    fieldrow.push("('"+datenowformat+"',"+getvaluestring+")");
							a++
							
	                    })
	                    var collectdata = fieldrow.join(",")
	                    
		                    if (radio == "Separate Table"){ //Check RADIO value
		                    	dbcon.transactionquery("CREATE TABLE "+tbname+" (id_a_stand INT(255) NOT NULL AUTO_INCREMENT, date_a_created datetime, "+fieldheader2+", PRIMARY KEY(id_a_stand))","INSERT INTO projectupld (tb_name, user_id, created) VALUES ('"+tbname+"','"+session.userid+"','"+datenowformat+"')", function(rows){
									dbcon.crquery("INSERT INTO "+tbname+" (date_a_created,"+fieldheadertok2+") values "+collectdata, function(rows){
										req.flash('message_status_upload', 'Data uploaded in separate table!')
										res.redirect(base_url+'/dashboard/uploadsingle')
									})
								});
		                    }else{ //RADIO condition
		                    	if (featuredtblist != ""){
				                    dbcon.crquery("DESC "+featuredtblist, function(rowsdec){
											headerdblength = rowsdec.length - 2
										if (headerdblength == varlength){
					                    	dbcon.transactionquery("UPDATE projectupld SET updated='"+datenowformat+"' WHERE tb_name='"+featuredtblist+"' AND user_id='"+session.userid+"'" , "INSERT INTO "+featuredtblist+" (date_a_created,"+fieldheadertok2+") values "+collectdata, function(rows){
													req.flash('message_status_upload', 'Data uploaded in same table!')
													res.redirect(base_url+'/dashboard/uploadsingle')
											});
				                    	}else{
						                		res.send("Error! Column not match!")
						                }
									})
								}else{
										res.send("Tbl error!")
								}
		                    } //End Check RADIO value*/
 
	  
	                });
	                
	            } catch (e){
	                res.json({error_code:1,err_desc:"Corupted excel file"});
	            }
	            
	        })
	}else{
		res.redirect(base_url+'');
	}
});
backendRoute.get(base_url+'/logout', function(req, res){
	req.session.destroy(function(){
		res.redirect("/adminiku");
	});
	
});
backendRoute.get('/read', function(req, res){
	
	fs.readFile('demofile1.html', function(err, data) {
		    res.writeHead(200, {'Content-Type': 'text/html'});
		    res.write(data);
		    res.end();
	});
});
backendRoute.get(base_url+'/dashboard/tablealias', function(req, res){
	session = req.session;
	if (session.uniqueID){
		dbcon.crquery("SELECT a.id as id, a.`tb_name`, b.`alias` FROM `projectupld` a LEFT JOIN alias b ON a.`id`=b.`tb_id` WHERE a.`user_id` = '"+session.userid+"' AND b.`alias` IS NULL", function(rows){
			
			res.render('backend/createtablealias',{
				"title": "Create Table Alias",
				"base_url": base_url,
				"csurfToken": req.csrfToken(),
				"username": session.username,
				"listtb": rows
			})
		})
	}else{
		res.redirect(base_url+'');
	}
})
backendRoute.post(base_url+'/dashboard/createtablealias', function(req, res){
	let tbid = req.body.tbid
	let alias = req.body.alias
	let date = dateFormat(datenow, "yyyy-mm-dd hh:MM:ss");
	session = req.session;
	if (session.uniqueID){
		dbcon.crquery("INSERT INTO alias (alias, tb_id, created) VALUES ('"+alias+"','"+tbid+"','"+date+"')", function(rows){
			req.flash('message_alias', 'Alias inserted!');
			res.redirect(base_url+'/dashboard/tablealias')
		})
	}else{
		res.redirect(base_url+'');
	}
})
backendRoute.get(base_url+'/dashboard/listingdata/original', function(req, res){
	let typerequest = req.params.type
	session = req.session;
	if (session.uniqueID){
			dbcon.crquery("SELECT a.id as idmain, a.tb_name as tbnamemain, a.created as createdmain, b.alias as alias  FROM projectupld a LEFT JOIN alias b ON a.`id`=b.`tb_id` WHERE a.`user_id` ='"+session.userid+"'", function(rows){
			
				res.render('backend/listing',{
					"title": "Listing Data",
					"base_url": base_url,
					"csurfToken": req.csrfToken(),
					"username": session.username,
					"listtb": rows,
					"dateFormat": dateFormat
				})
			})
		
	}else{
		res.redirect(base_url+'');
	}
})
backendRoute.get(base_url+'/dashboard/detaildata/:id', function(req, res){
	let idtable = req.params.id
	session = req.session;
	if (session.uniqueID){
			dbcon.crquery("SELECT * from projectupld where id='"+idtable+"' AND user_id='"+session.userid+"' limit 1", function(rows){
			
				if (rows.length != 0){
					let postarray = []
					let postrowdata = []
					let postfield = ""
					dbcon.crquery("DESC "+rows[0].tb_name, function(fieldata){
						dbcon.crquery("SELECT * from "+rows[0].tb_name+" order by id_a_stand DESC", function(rowsdata){
								//Paging Section
								var rowdatalength = rowsdata.length;
								var totalRecord = rowdatalength,
									        pageSize = 10,
									        pageCount = Math.ceil(rowdatalength/10),
									        currentPage = 1,
									        varrowsdata = rowsdata,
									        rowsdataArrays = [], 
									        recordlist = [];
								var urlpaging = base_url+"/dashboard/detaildata/"+idtable;
								while (rowsdata.length) {
									rowsdataArrays.push(rowsdata.splice(0, pageSize));
								}
									    
								if (typeof req.query.page !== 'undefined') {
									        currentPage = +req.query.page;
								}
								recordlist = rowsdataArrays[+currentPage - 1];
							fieldata.forEach( function(fieldata) {
								var postfield = fieldata.Field
								postarray.push(postfield)
									
							});
							res.render('backend/listingdetail',{
								"title": "Listing Data",
								"base_url": base_url,
								"csurfToken": req.csrfToken(),
								"username": session.username,
								"fieldata": postarray,
								"dateFormat": dateFormat,
								"idtable": idtable,
								"tbname": rows[0].tb_name,
								'data': recordlist,
								'url': urlpaging,
								'pageSize': pageSize,
								'totalRecord': totalRecord,
								'pageCount': pageCount,
								'currentPage': currentPage,
							})
						})
					})
					
				}else{
					req.flash('message_datalist', 'Data is empty!')
					res.redirect(base_url+'/dashboard/listingdata/original')
				}
			})
		
	}else{
		res.redirect(base_url+'');
	}
})
backendRoute.get(base_url+'/dashboard/viewdetail/:idrec/:idtable', function(req, res){
	let idrec = req.params.idrec
	let idtable = req.params.idtable
	session = req.session;
	if (session.uniqueID){
		dbcon.crquery("SELECT * from projectupld where id='"+idtable+"' AND user_id='"+session.userid+"' limit 1", function(rows){
			
			if (rows.length != 0){
				let postarray = []
				let postrowdata = []
				let postfield = ""
				dbcon.crquery("DESC "+rows[0].tb_name, function(fieldata){
						dbcon.crquery("SELECT * from "+rows[0].tb_name+" WHERE id_a_stand='"+idrec+"' ", function(rowsdata){
							fieldata.forEach( function(fieldata) {
								var postfield = fieldata.Field
								postarray.push(postfield)
									
							});
							res.render('backend/viewdetail',{
								"title": "Listing Data",
								"base_url": base_url,
								"csurfToken": req.csrfToken(),
								"username": session.username,
								"fieldata": postarray,
								"postrowdata": rowsdata,
								"dateFormat": dateFormat,
								"idtable": idtable,
								"tbname": rows[0].tb_name
							})
						})
				})
			}
		})
	}else{
		res.redirect(base_url+'');
	}
})
backendRoute.get(base_url+'/dashboard/exports/:id', function(req, res){
	let idtable = req.params.id
	session = req.session;
	if (session.uniqueID){
		dbcon.crquery("SELECT * from projectupld where id='"+idtable+"' AND user_id='"+session.userid+"' limit 1", function(rows){
			if (rows.length != 0){
				dbcon.crquery("DESC "+rows[0].tb_name, function(rowfield){
					var fielddata = [];
					var field = '';
							rowfield.forEach( function(rowfield) {
								var field = rowfield.Field;
								fielddata.push(field);
								
							});
							var markers = [];
							for (var i = 0; i < rowfield.length; ++i) {
								if (i==0){
									markers[i] = { caption:""+fielddata[i]+"", type:"number", width:300 }
								}else{
									markers[i] = { caption:""+fielddata[i]+"", type:"string", width:300 }
								}
							    
							}
							
							var conf={}
					    	conf.cols= markers;
					        dbcon.crquery("SELECT * from "+rows[0].tb_name+" order by id_a_stand DESC", function(rowsdata){
					        		
					        		var data = []
					        		var result = ''
					        		var pushnow = []
					        		var markersdata = []
							        arr=[]
							        
							            for(i=0;i<rowsdata.length;i++){
							            	var mastervalue = []
							            	for(j=0;j<rowfield.length;j++){
							            		pushnow[j] =  rowsdata[i][rowfield[j].Field] 
							            		mastervalue.push(pushnow[j])
							            	}
							               arr.push(mastervalue)
							            }
							            
							            conf.rows=arr
								    var result=nodeExcel.execute(conf)
								    res.setHeader('Content-Type','application/vnd.openxmlformates');
								    res.setHeader("Content-Disposition","attachment;filename="+"export-result.xlsx")
								    res.end(result,'binary');
							})
				})
			}
		})
	}else{
		res.redirect(base_url+'')
	}
})
backendRoute.get(base_url+'/dashboard/analyze/:id', function(req, res){
	let idtable = req.params.id
	session = req.session;
	if (session.uniqueID){
		dbcon.crquery("SELECT * from projectupld where id='"+idtable+"' AND user_id='"+session.userid+"' limit 1", function(rows){
			if (rows.length != 0){
				res.render('backend/analyze',{
					"title": "Analyze Data",
					"base_url": base_url,
					"csurfToken": req.csrfToken(),
					"username": session.username,
					"dateFormat": dateFormat,
					"idtable": idtable,
					"tbname": rows[0].tb_name
				})
			}
		})
	}else{
		res.redirect(base_url+'')
	}
})
backendRoute.post(base_url+'/dashboard/analyzed/', function(req, res){
	let todo = req.body.ad
	let tbname = req.body.tbname
	session = req.session;
	if (session.uniqueID){
		var fielddata = []
		var j = 0
		if (todo == 1){ //check duplicate
				dbcon.crquery("DESC "+tbname, function(rowfield){
						rowfield.forEach( function(rowfield) {
								var field = rowfield.Field;
								if (j > 1){
									fielddata.push(field);
								}
								j++
								
						});
						res.render('backend/analyze-checkduplicate',{
							"title": "Check Duplicate Data",
							"base_url": base_url,
							"csurfToken": req.csrfToken(),
							"username": session.username,
							"dateFormat": dateFormat,
							"tbname": tbname,
							"fieldlist": fielddata
						})
				})
				
		}else{ //grouping data
				dbcon.crquery("DESC "+tbname, function(rowfield){
						rowfield.forEach( function(rowfield) {
								var field = rowfield.Field;
								if (j > 1){
									fielddata.push(field);
								}
								j++
								
						});
						res.render('backend/analyze-grouping',{
							"title": "Grouping Data",
							"base_url": base_url,
							"csurfToken": req.csrfToken(),
							"username": session.username,
							"dateFormat": dateFormat,
							"tbname": tbname,
							"fieldlist": fielddata
						})
				})
		}
	}else{
		res.redirect(base_url+'')
	}
})
backendRoute.post(base_url+'/dashboard/analyze-grouping/', function(req, res){
	let fieldlist = req.body.fieldlist
	let fieldchoose = req.body.selectfield
	let tbname = req.body.tbname
	let fieldchooseresult = ''
	let text = ''
	var fieldarray = fieldlist.split(",");
	if (typeof fieldchoose === 'string'){
		fieldchooseresult = fieldchoose
	}else{
		fieldchooseresult = fieldchoose.join(',')
	}
	session = req.session;
	if (session.uniqueID){
		dbcon.crquery("SELECT * FROM "+tbname, function(rowsdataoriginal){
		
			dbcon.crquery("SELECT *, COUNT(id_a_stand) AS result FROM "+tbname+" GROUP BY "+fieldchooseresult, function(rowsdata){
				res.render('backend/analyze-grouping-result',{
								"title": "Grouping Data",
								"base_url": base_url,
								"csurfToken": req.csrfToken(),
								"username": session.username,
								"dateFormat": dateFormat,
								"tbname": tbname,
								"rowsdata": rowsdata,
								"totaldata": rowsdataoriginal.length,
								"fieldarray": fieldarray,
								"fieldarraynum": fieldarray.length,
								"fieldchooseresult": fieldchooseresult
				})
			})
		})
	}else{
		res.redirect(base_url+'')
	}
})
backendRoute.post(base_url+'/dashboard/analyze-duplicate/', function(req, res){
	let fieldchoose = req.body.selectfield
	let tbname = req.body.tbname
	let fieldchooseresult = ''
	let text = ''
	if (typeof fieldchoose === 'string'){
		fieldchooseresult = fieldchoose
	}else{
		fieldchooseresult = fieldchoose.join(',')
	}
	session = req.session;
	if (session.uniqueID){
		dbcon.crquery("SELECT * FROM "+tbname, function(rowsdataoriginal){
		
			dbcon.crquery("SELECT *, COUNT(id_a_stand) AS result FROM "+tbname+" GROUP BY "+fieldchooseresult+" HAVING result > 1", function(rowsdata){
				if (rowsdata.length != 0){
					if (rowsdata.length == 1){
						txt = "There is "+rowsdata.length+" duplicate data of "+rowsdataoriginal.length+" records"
					}else{
						txt = "There are "+rowsdata.length+" duplicate data of "+rowsdataoriginal.length+" records"
					}
					
				}else{
					txt = "No duplicate data on table "+tbname+". Base on field "+fieldchooseresult
				}
				res.render('backend/analyze-checkduplicate-result',{
								"title": "Check Duplicate Data",
								"base_url": base_url,
								"csurfToken": req.csrfToken(),
								"username": session.username,
								"dateFormat": dateFormat,
								"tbname": tbname,
								"txt": txt,
								"fieldchooseresult": fieldchooseresult
				})
			})
		})
	}else{
		res.redirect(base_url+'')
	}
})
backendRoute.post(base_url+'/dashboard/exports-data/duplicate', function(req, res){
	let tbname = req.body.tbname
	let fieldchooseresult = req.body.fieldchooseresult
	session = req.session;
	if (session.uniqueID){
				dbcon.crquery("DESC "+tbname, function(rowfield){
					var fielddata = [];
					var field = '';
							rowfield.forEach( function(rowfield) {
								var field = rowfield.Field;
								fielddata.push(field);
								
							});
							var markers = [];
							for (var i = 0; i < rowfield.length; ++i) {
								if (i==0){
									markers[i] = { caption:""+fielddata[i]+"", type:"number", width:300 }
								}else{
									markers[i] = { caption:""+fielddata[i]+"", type:"string", width:300 }
								}
							    
							}
							markers[i] = { caption:"ResultDuplicate", type:"string", width:300 }
							var conf={}
					    	conf.cols= markers;
					        dbcon.crquery("SELECT *, COUNT(id_a_stand) AS resultin FROM "+tbname+" GROUP BY "+fieldchooseresult+" HAVING resultin > 1", function(rowsdata){
					        		
					        		var data = []
					        		var result = ''
					        		var pushnow = []
					        		var markersdata = []
							        arr=[]
							        
							            for(i=0;i<rowsdata.length;i++){
							            	var mastervalue = []
							            	var lastdata = rowsdata[i].resultin
							            	var lastdatafix = lastdata.toString()
							            	for(j=0;j<=rowfield.length;j++){
							            		if (j == rowfield.length){
							            			pushnow[j] = lastdatafix
							            		}else{
							            			pushnow[j] = rowsdata[i][rowfield[j].Field]
							            		}
							            		mastervalue.push(pushnow[j])
							            	}
							               arr.push(mastervalue)
							            }
							            
							            conf.rows=arr
								    var result=nodeExcel.execute(conf)
								    res.setHeader('Content-Type','application/vnd.openxmlformates');
								    res.setHeader("Content-Disposition","attachment;filename="+"export-data-duplicate-result.xlsx")
								    res.end(result,'binary');
							})
				})
	}else{
		res.redirect(base_url+'')
	}
})
backendRoute.post(base_url+'/dashboard/exports-data/unique', function(req, res){
	let tbname = req.body.tbname
	let fieldchooseresult = req.body.fieldchooseresult
	session = req.session;
	if (session.uniqueID){
				dbcon.crquery("DESC "+tbname, function(rowfield){
					var fielddata = [];
					var field = '';
							rowfield.forEach( function(rowfield) {
								var field = rowfield.Field;
								fielddata.push(field);
								
							});
							var markers = [];
							for (var i = 0; i < rowfield.length; ++i) {
								if (i==0){
									markers[i] = { caption:""+fielddata[i]+"", type:"number", width:300 }
								}else{
									markers[i] = { caption:""+fielddata[i]+"", type:"string", width:300 }
								}
							    
							}
							markers[i] = { caption:"ResultUnique", type:"string", width:300 }
							var conf={}
					    	conf.cols= markers;
					        dbcon.crquery("SELECT *, COUNT(id_a_stand) AS resultin FROM "+tbname+" GROUP BY "+fieldchooseresult+" HAVING resultin = 1", function(rowsdata){
					        		
					        		var data = []
					        		var result = ''
					        		var pushnow = []
					        		var markersdata = []
							        arr=[]
							        
							            for(i=0;i<rowsdata.length;i++){
							            	var mastervalue = []
							            	var lastdata = rowsdata[i].resultin
							            	var lastdatafix = lastdata.toString()
							            	for(j=0;j<=rowfield.length;j++){
							            		if (j == rowfield.length){
							            			pushnow[j] = lastdatafix
							            		}else{
							            			pushnow[j] = rowsdata[i][rowfield[j].Field]
							            		}
							            		mastervalue.push(pushnow[j])
							            	}
							               arr.push(mastervalue)
							            }
							            
							            conf.rows=arr
								    var result=nodeExcel.execute(conf)
								    res.setHeader('Content-Type','application/vnd.openxmlformates');
								    res.setHeader("Content-Disposition","attachment;filename="+"export-data-unique-result.xlsx")
								    res.end(result,'binary');
							})
				})
	}else{
		res.redirect(base_url+'')
	}
})
backendRoute.post(base_url+'/dashboard/exports-data/grouping', function(req, res){
	let tbname = req.body.tbname
	let fieldchooseresult = req.body.fieldchooseresult
	session = req.session;
	if (session.uniqueID){
				dbcon.crquery("DESC "+tbname, function(rowfield){
					var fielddata = [];
					var field = '';
							rowfield.forEach( function(rowfield) {
								var field = rowfield.Field;
								fielddata.push(field);
								
							});
							var markers = [];
							for (var i = 0; i < rowfield.length; ++i) {
								if (i==0){
									markers[i] = { caption:""+fielddata[i]+"", type:"number", width:300 }
								}else{
									markers[i] = { caption:""+fielddata[i]+"", type:"string", width:300 }
								}
							    
							}
							markers[i] = { caption:"ResultGrouping", type:"string", width:300 }
							var conf={}
					    	conf.cols= markers;
					        dbcon.crquery("SELECT *, COUNT(id_a_stand) AS resultin FROM "+tbname+" GROUP BY "+fieldchooseresult+"", function(rowsdata){
					        		
					        		var data = []
					        		var result = ''
					        		var pushnow = []
					        		var markersdata = []
							        arr=[]
							        
							            for(i=0;i<rowsdata.length;i++){
							            	var mastervalue = []
							            	var lastdata = rowsdata[i].resultin
							            	var lastdatafix = lastdata.toString()
							            	for(j=0;j<=rowfield.length;j++){
							            		if (j == rowfield.length){
							            			pushnow[j] = lastdatafix
							            		}else{
							            			pushnow[j] = rowsdata[i][rowfield[j].Field]
							            		}
							            		mastervalue.push(pushnow[j])
							            	}							            	
							               arr.push(mastervalue)
							            }
							        conf.rows=arr
								    var result=nodeExcel.execute(conf)
								    res.setHeader('Content-Type','application/vnd.openxmlformates');
								    res.setHeader("Content-Disposition","attachment;filename="+"export-data-grouping-result.xlsx")
								    res.end(result,'binary');
							})
				})
	}else{
		res.redirect(base_url+'')
	}
})
backendRoute.get(base_url+'/dashboard/chart/:id', function(req, res){
	let idtable = req.params.id
	session = req.session;
	if (session.uniqueID){
		dbcon.crquery("SELECT * from projectupld where id='"+idtable+"' AND user_id='"+session.userid+"' limit 1", function(rows){
			if (rows.length != 0){
				dbcon.crquery("SELECT date_a_created, COUNT(id_a_stand) AS countresult FROM "+rows['0'].tb_name+" GROUP BY SUBSTR(date_a_created,1,10) ORDER BY date_a_created DESC", function(rowsdata){
						let chartlabel = []
						let chartdata = []
						rowsdata.forEach(function(data){
							chartlabel.push(dateFormat(data.date_a_created, "dd-mm-yyyy h:MM:ss"))
							chartdata.push(data.countresult)
						})
						res.render('backend/chartdata',{
							"title": "Chart",
							"chartlabel": chartlabel,
							"chartdata": chartdata,
							"dateFormat": dateFormat,
							"base_url": base_url,
							"username": session.username,
						})
				})
			}
		})
	}else{
		res.redirect(base_url+'')
	}
})
module.exports = backendRoute;