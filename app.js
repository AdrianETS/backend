const bodyParser = require('body-parser');
let membersDao = require("./dao/membersDao.js");
let excursionsDao = require('./dao/excursionsDao');
const express = require('express');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true })); app.use(bodyParser.json()); app.use(bodyParser.raw());

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/members/list', (req, res)=>{
    membersDao.getAllMembers()
    .then(members=>res.send(members));
})

app.get('/excursions/list', (req, res)=>{
    excursionsDao.getAllexcursions()
    .then(members=>res.send(members));
})


app.get("/members/:id", (req, res)=>{
    membersDao.getMemberById(req.params.id)
    .then(result=>res.send(result));
})

app.get("/excursions/:id", (req, res)=>{
    excursionsDao.getExcursionById(req.params.id)
    .then(result=>res.send(result));
})

app.get("/members/delete/:id", (req, res)=>{
    membersDao.deleteMember(req.params.id)
    .then(result=>res.send(result));
})

app.get("/excursions/delete/:id", (req, res)=>{
    excursionsDao.deleteExcursion(req.params.id)
    .then(result=>res.send(result));
})

app.post("/members", (req, res)=>{
    membersDao.addMember(req.body)
    .then(result=>res.send(result));
})

app.post("/excursions", (req, res)=>{
    excursionsDao.addExcursion(req.body)
    .then(result=>res.send(result));
})

app.put("/members", (req, res)=>{
    membersDao.editMember(req.body)
    .then(result=>res.send(result));
})

app.put("/excursions", (req, res)=>{
    excursionsDao.editExcursion(req.body)
    .then(result=>res.send(result));
})


