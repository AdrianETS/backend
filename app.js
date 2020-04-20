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
app.get('/members/list', cors(), (req, res) => {
    console.log(req.query.token);
    //a los parámetros de la url, accedemos con .query. van a ir después del ? en formato clave-valor 
    //con .body lo cogemos del propio body (post)
    //en params van dentro de la url y hay que especificarle el mapeo 
    auth.checkToken(req.query.token)
        .then(result => membersDao.getAllMembers())
        .then(members => res.send(members))
        .catch(() => res.status(401).json({
            error: 'Unauthorized'
        }));
})

app.get('/excursions/list', cors(), (req, res) => {
    auth.checkToken(req.query.token)
        .then(result => excursionsDao.getAllexcursions())
        .then(members => res.send(members))
        .catch(() => res.status(401).json({
            error: 'Unauthorized'
        }));
})


app.get("/members/:id", cors(), (req, res) => {
    auth.checkToken(req.query.token)
        .catch(() => res.status(401).json({
            error: 'Unauthorized'
        }))
        .then(result => membersDao.getMemberById(req.params.id))
        .then(result => {
            result.password = "";
            res.send(result)
        });
})

app.get("/excursions/:id", cors(), (req, res) => {
    auth.checkToken(req.query.token)
        .catch(() => res.status(401).json({
            error: 'Unauthorized'
        }))
        .then(() => excursionsDao.getExcursionById(req.params.id))
        .then(result => res.send(result));
})

app.get("/members/delete/:id", cors(), (req, res) => {
    membersDao.deleteMember(req.params.id)
        .then(result => res.send(result));
})

app.get("/excursions/delete/:id", cors(), (req, res) => {
    excursionsDao.deleteExcursion(req.params.id)
        .then(result => res.send(result));
})

app.post("/members", cors(), (req, res) => {
    membersDao.addMember(req.body)
        .then(result => res.send(result));
})

app.post("/excursions", cors(), (req, res) => {
    excursionsDao.addExcursion(req.body)
        .then(result => res.send(result));
})

app.put("/members", cors(), (req, res) => {
    auth.checkToken(req.query.token)
        .then(result => membersDao.editMember(req.body))
        .then(result => res.send(result))
        //cuando en un then hay un reject buscará el próximo. Los then que estén antes NO se ejecutarán. 
        //Si ponemos el catch y hay then después entonces SÍ se ejecutarán
        .catch(result => {
            let err, status;
            [err, status] = result;
            if (!status) {
                //si no viene estatus le damos un 500 para "forzar" al navegador a que lo interprete de tal manera
                status = 500;
                err = "Generic error";
            }
            res.status(status).json({
                error: err,
            });
        });
})

app.put("/excursions", cors(), (req, res) => {
    excursionsDao.editExcursion(req.body)
        .then(result => res.send(result));
})

app.post("/login", cors(), (req, res) => {
    auth.login(req, res);
})

app.options('*', cors());


