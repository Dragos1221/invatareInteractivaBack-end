const express = require('express')
const bodyParser = require("body-parser");
const route = require('./routes')
const app = express()
var cors = require('cors');
app.use(bodyParser.json());

const {connection}  = require("./database");
app.use(cors());
app.get('/questions', function (req, res) {
  connection.query('select * from Questions', (err, rows, fields) => {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({status : 'fail'}))
      return;
    }
    res.send(JSON.stringify(rows))
  })
})

app.get("/results/:id", (req, res) => {
  connection.query(`SELECT * from Results WHERE userId=${req.params.id}`, (err, rows, fields) => {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({status : 'fail'}))
      return;
    }
    res.send(JSON.stringify(rows[0]))
  })
});

app.post("/results/:id", (req, res) => {
  console.log("daaa" , req.params.id)
  connection.query(`INSERT INTO Results (userId, chapter1, chapter2, chapter3, chapter4, chapter5) VALUES(${req.params.id}, ${req.body.chapter1}, ${req.body.chapter2}, ${req.body.chapter3}, ${req.body.chapter4}, ${req.body.chapter5}) ON DUPLICATE KEY UPDATE chapter1=${req.body.chapter1}, chapter2=${req.body.chapter2}, chapter3=${req.body.chapter3}, chapter4=${req.body.chapter4}, chapter5=${req.body.chapter5}`, (err, rows, fields) => {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({status : 'fail'}))
      return;
    }
    res.send(JSON.stringify({
      status : 'ok'
    }))
  })
})

app.post("/login", (req, res) => {
  connection.query(`SELECT * from Users WHERE username='${req.body.username}' AND password='${req.body.password}'`, (err, rows, fields) => {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({status : 'fail'}))
      return;
    }
    if (rows.length === 1)
      res.send(JSON.stringify({
        loginStatus : 'ok',
        id:rows[0].id,
        nume:rows[0].nume
      }))
    else
      res.send(JSON.stringify({
        loginStatus : 'fail'
      }))
  })
});

app.post("/register", (req, res) => {
  connection.query("INSERT INTO `Users` (`username`, `password` , `nume`) VALUES ('"+req.body.username+"', '"+req.body.password+"','"+ req.body.nume+"')", (err, result) => {
    if (err) {
      console.log(err)
      res.send(JSON.stringify({status : 'fail'}))
      return
    }
    connection.query("INSERT INTO `Results` (`userId`, `chapter1`,`chapter2`,`chapter3`,`chapter4`,`chapter5`) VALUES ('"+result.insertId+"',0,0,0,0,0)", (err, result) => {
      if (err) {
        console.log(err)
        res.send(JSON.stringify({status : 'fail'}))
        return
      }
      res.send(JSON.stringify({
        status: 'ok',
        results:result
      }))
    })
  })
})

 
app.listen(3123, ()=>{
  console.log("am portnit");
})
