const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

app.use(router);

router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));


const mysql = require('mysql2'); 
var connection = mysql.createConnection ({
host: process.env.MYSQL_HOST, 
user: process.env.MYSQL_USERNAME, 
password: process.env.MYSQL_PASSWORD, 
database: process.env.MYSQL_DATABASE
});

connection.connect(function(err){
    if(err) throw err;
    console.log(`Connected DB: ${process.env.MYSQL_DATABASE}`);

    });

// Insert
router.post("/insert_student", function(req, res) {
    let student = req.body.personal_info;
    console.log(student);
    if(!student) {
        return res.status(400).send({error: true, message: "Please provide student infomation"})
    }
    connection.query("INSERT INTO personal_info SET ? ", student, function(error, results) {
        if(error) throw error;
        return res.send({error: false, data: results.affectedRows, message: "New student has been created successfully."})
    });
});

// Update
router.put("/update_student", function(req, res) {
    let StudentID = req.body.personal_info.StudentID; //primary key
    let student = req.body.personal_info;
    if(!StudentID || !student) {
        return res.status(400).send({error: student, message: "Please provide student infomation"});
    }
    connection.query("UPDATE personal_info SET ? WHERE StudentID = ?", [student,StudentID], function(error, results) {
        if(error) throw error;
        return res.send({error: false, data: results.affectedRows, message: "Student has been updated successfully."})
    });
});
//Delete
router.delete("/delete_student/:id", function(req, res) {
    const studentId = parseInt(req.params.id);
    // let StudentID = req.body.personal_info.StudentID;
    if(!studentId) {
        return res.status(400).send({error: true, message: "Please provide studentID"})
    }
    connection.query("DELETE FROM personal_info WHERE StudentID = ?", studentId, function(error, results) {
        if(error) throw error;
        return res.send({error: false, data: results.affectedRows, message: "Student has been deleted successfully."})
    });
});
//Select
router.get("/select_student/:id", function(req, res){
    const studentId = parseInt(req.params.id);
    if(!studentId) {
        return res.status(400).send({error: true, message: "Please provide studentID"})
    }
    connection.query("SELECT * FROM personal_info WHERE StudentID = ?", studentId, function(error, results) {
        if(error) throw error;
        return res.send({error: false, data: results[0], message: "Student retrieved"})
    });
});
//Select All
router.get("/SelectAll_students", function(req, res){
    connection.query('SELECT * FROM personal_info', function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Student list.' });
        });
});

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port: ${process.env.PORT}`);
})