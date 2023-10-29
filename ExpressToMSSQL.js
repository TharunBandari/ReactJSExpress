var mssql =require('mysql');
var exp = require('express');
var cors=require('cors');
var bparser=require('body-parser');
bparserInit=bparser.urlencoded({extended:false});
var app = exp();
app.use(cors());
app.use(exp.json());

mssqlconnection=mssql.createConnection({
    host:'localhost',
    database:'world',
    user:'root',
    password:'root',
    port:3306
});
 
function checkConnection(error){
    if(error == undefined){
        console.log("Connected to the database......");    
     }
     else{
         console.log("error code :" + error.errno)
         console.log(error.message);
     }
}

function feedback(error){
    if(error != undefined){
        console.log(error.errno);
        console.log(error.message);
    }else
        console.log("Open the browser and visit http://localhost:8001/welcome")
 
}
app.listen(8001, feedback)
 

function processResults(error, results){
    queryresults=results;
    console.log(results);
}
 
function displayAllUsers(request, response){
    mssqlconnection.connect(checkConnection);
    mssqlconnection.query('select * from users',processResults);
    response.send(queryresults);
}
app.get('/getAll',displayAllUsers)
 

function GetUserById(request, response){
    var userid = request.query.uid;
    mssqlconnection.query('select  * from usersnpx where userid=?',[userid],processResults);   
    response.send(queryresults);
}
app.get('/getById',GetUserById)

function GetUserByemailid(request, response){
    var emailid = request.query.uid;
    mssqlconnection.query('select  * from usersnpx where emailid=?',[emailid],processResults);   
    response.send(queryresults);
}
app.get('/getByemailid',GetUserByemailid)

var statusMessage="";
function checkInsertStatus(error){
    statusMessage=(error == undefined)?"<B>Insert Successful</b>":
    "<b>Insert Failure" + error.message + "</b>";
}

function insertUser(request, response){
    userid=request.body.uid;
    password=request.body.password;
    emailid=request.body.emailid;
    console.log (userid + "\t\t" + password + "\t\t" + emailid);
    mssqlconnection.connect(checkConnection);
    mssqlconnection.query(
        'insert into users values (?,?,?)',
        [userid,password,emailid], checkInsertStatus);
        response.send(JSON.stringify(statusMessage));
}

app.post('/insertUser',bparserInit,insertUser)

var statusMessage="";
function checkDeleteStatus(error){
    statusMessage=(error == undefined)?"<B>Delete Successful</b>":
    "<b>Delete Failure" + error.message + "</b>";
}

function deleteUser(request, response){
    userid=request.query.uid;
    console.log (userid);
    mssqlconnection.connect(checkConnection);
    mssqlconnection.query(
        'DELETE FROM users WHERE userid = ?',
        [userid], checkDeleteStatus);
        response.send(JSON.stringify(statusMessage));
}

app.delete('/deleteUser',deleteUser)

var statusMessage="";
function checkUpdateStatus(error){
    statusMessage=(error == undefined)?"<B>Updation Successful</b>":
    "<b>Updation Failure" + error.message + "</b>";
}

function updateUser(request, response){
    userid=request.body.uid;
    password=request.body.password;
    emailid=request.body.emailid;
    console.log (userid + "\t\t" + password + "\t\t" + emailid);
    mssqlconnection.connect(checkConnection);
    mssqlconnection.query(
        'UPDATE users SET password = ?, emailid = ? WHERE userid = ?',
        [password, emailid, userid], checkUpdateStatus);
        response.send(JSON.stringify(statusMessage));
}

app.put('/updateUser',bparserInit,updateUser)

