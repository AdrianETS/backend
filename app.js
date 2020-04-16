const bodyParser = require('body-parser');
let membersDao = require("./dao/membersDao.js");
let excursionsDao = require('./dao/excursionsDao');
let auth = require("./services/auth");
const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true })); app.use(bodyParser.json()); app.use(bodyParser.raw());

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/members/list', cors(), (req, res)=>{
    membersDao.getAllMembers()
    .then(members=>res.send(members));
})

app.get('/excursions/list', cors(), (req, res)=>{
    excursionsDao.getAllexcursions()
    .then(members=>res.send(members));
})


app.get("/members/:id", cors(), (req, res)=>{
    membersDao.getMemberById(req.params.id)
    .then(result=>{
        result.password = "";
        res.send(result)
    });
})

app.get("/excursions/:id", cors(), (req, res)=>{
    excursionsDao.getExcursionById(req.params.id)
    .then(result=>res.send(result));
})

app.get("/members/delete/:id", cors(), (req, res)=>{
    membersDao.deleteMember(req.params.id)
    .then(result=>res.send(result));
})

app.get("/excursions/delete/:id", cors(), (req, res)=>{
    excursionsDao.deleteExcursion(req.params.id)
    .then(result=>res.send(result));
})

app.post("/members", cors(),  (req, res)=>{
    membersDao.addMember(req.body)
    .then(result=>res.send(result));
})

app.post("/excursions", cors(), (req, res)=>{
    excursionsDao.addExcursion(req.body)
    .then(result=>res.send(result));
})

app.put("/members", cors(),  (req, res)=>{
    membersDao.editMember(req.body)
    .then(result=>res.send(result));
})

app.put("/excursions", cors(), (req, res)=>{
    excursionsDao.editExcursion(req.body)
    .then(result=>res.send(result));
})

app.post("/login", cors(), (req, res)=>{
    auth.login(req, res);
})

app.options('*', cors());


