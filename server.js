const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;

let fname = "Ananda";
let lname = "Poudel";

app.use(bodyParser.json());
var connection = mysql.createConnection({
  host: "35.193.222.192",
  port: 3306,
  user: "root",
  password: "omariscool",
  database: "taskdb"
});

app.get("/", (req, res) =>
  res.json({
    project: "task-api",
    message: "Welcome! to our new LMS",
    time: Date.now()
  })
);

app.get("/post-water-data", async (req, res) => {
  const dayCount = req.query.dayCount;
  const waterLevel = req.query.waterLevel;
  try {
    const waterData = await connection
      .promise()
      .query(
        `INSERT INTO water (dayCount,moistureLevel) Values (${dayCount},${waterLevel})`
      );
    res.send({ result: "Sucessfully added a new record!!" });
  } catch (err) {
    res.send({ result: "Could not insert data!!" });
  }
});

app.get("/get-water-data", async (req, res) => {
  const waterData = await connection.promise().query(`select * from water`);
  res.json(waterData[0]);
});
// -------------------------------------------------------------------------------------------

app.post("/webhook", async (req, res) => {
  console.log("000000000000000000000000000");
  console.log("000000000000000000000000000");
  console.log("000000000000000000000000000");
  console.log("000000000000000000000000000");
  console.log("000000000000000000000000000");
  console.log(req.body);
  console.log("Send the code my way bro!");
  if (!req.body) return res.sendStatus(400);

  res.setHeader("Content-Type", "application/json");

  console.log(req.body.result.metadata.intentName);

  var intent = req.body.result.metadata.intentName;
  if (intent == "getGradeForClass") {
    console.log("inside", intent);
    //DONE
    const course = req.body.result.parameters.class;
    const data = await connection.promise()
      .query(`select * from StudentGrade where CourseNum = (select CourseNum from Course where CourseTitle = '${course}') and StudentNum = (select StudentNum from Student where FirstName = '${fname}' and LastName = '${lname}')
    `);
    return res.json({
      speech: `The grade that you have in ${
        data[0][0].CourseNum
      }  ${course} is ${data[0][0].Grade}`,
      displayText: `The grade that you have in ${
        data[0][0].CourseNum
      }  ${course} is ${data[0][0].Grade}`,
      source: "webhook-echo-sample"
    });
  } else if (intent == "getTheGrade") {
    console.log("inside", intent);
    //NOT DONE

    const course = req.body.result.parameters.class;
    const assignment = req.body.result.parameters.assignment;
    const number = req.body.result.parameters.number;
    console.log(course, " ", number);
    const data = await connection.promise()
      .query(`select * from Assignment where CourseNum = (select CourseNum from Course where CourseTitle = '${course}') and AssignmentNum = '${number}'
  `);

    console.log(data[0][0]);

    return res.json({
      speech: `You have gotten ${data[0][0].ObtainedPoints} out of ${
        data[0][0].TotalPoints
      } in  ${data[0][0].CourseNum} ${course} for ${assignment} ${number}`,
      displayText: `You have gotten ${data[0][0].ObtainedPoints} out of ${
        data[0][0].TotalPoints
      } in  ${data[0][0].CourseNum} ${course} for ${assignment} ${number}`,
      source: "webhook-echo-sample"
    });
  } else if (intent == "getGpa") {
    console.log("inside", intent);
    ///DONEs

    const data = await connection.promise()
      .query(`select * from Student where FirstName = '${fname}' and LastName = '${lname}'
    `);

    return res.json({
      speech: `${fname} ${lname} has a Grade point average of ${
        data[0][0].GPA
      }`,
      displayText: `${fname} ${lname} has a Grade point average of ${
        data[0][0].ClassStanding
      }`,
      source: "webhook-echo-sample"
    });
  } else if (intent == "getTeacher") {
    console.log("inside", intent);
    //////DONE
    const className = req.body.result.parameters.class;
    const data = await connection.promise()
      .query(`select * from Faculty where FacultyNum = (select FacultyNum from Section where CourseNum = (select CourseNum from Course where CourseTitle= '${className}'))
    `);

    return res.json({
      speech: `The teacher for the class ${className} is  ${
        data[0][0].LastName
      } ${data[0][0].FirstName}`,
      displayText: `The teacher for the class ${className} is  ${
        data[0][0].LastName
      } ${data[0][0].FirstName}`,
      source: "webhook-echo-sample"
    });
  } else if (intent == "changeStudent") {
    fname = req.body.result.parameters.firstname;
    lname = req.body.result.parameters.lastname;
    console.log("inside", intent);
    //NOT DONE
    return res.json({
      speech: `Student has been changed to ${fname} ${lname}`,
      displayText: `Student has been changed to ${fname} ${lname}`,
      source: "webhook-echo-sample"
    });
  } else {
    console.log("inside", intent);
    return res.json({
      speech: "Can you say that again bro?",
      displayText: "mmmmm",
      source: "webhook-echo-sample"
    });
  }
});

app.listen(port, () => console.log(`task listening on port ${port}!`));
