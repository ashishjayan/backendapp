var request = require("request");
var express = require("express");
var bodyparser = require("body-parser");
const { dialogflow } = require("actions-on-google");
var app = express();
const mysql = require("mysql2");
//

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set("port", process.env.PORT || 5000);

var con = mysql.createConnection({
  host: "35.193.222.192",
  port: 3306,
  user: "root",
  password: "omariscool",
  database: "taskdb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.post("/webhook", (req, res) => {
  console.log("Send the code my way bro!");
  if (!req.body) return res.sendStatus(400);

  res.setHeader("Content-Type", "application/json");
  console.log(req.body.result);
  // var intentName = req.body.result.metadata;
  // if (intentName == "getGradeForCLass") {
  //   return res.json({
  //     speech: "luces apagadas",
  //     displayText: "luces apagadas",
  //     source: "webhook-echo-sample"
  //   });
  // }
  return res.json({
    speech: "luces apagadas",
    displayText: "luces apagadas",
    source: "webhook-echo-sample"
});

app.get("/student-grade", async (req, res) => {
  const className = req.query.className;
  const studentNumber = await con
    .promise()
    .query(
      `select StudentNum from Student where FirstName = "Ananda" and LastName = "Poudel"`
    );
  console.log(studentNumber[0]);
  res.json(studentNumber[0][0]);
});

app.listen(app.get("port"), () => {
  console.log("Express server started on port", app.get("port"));
});

git add . 
git commit -m "Helo"
git push