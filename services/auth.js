var bcrypt = require('bcrypt');
let membersDao = require("../dao/membersDao.js");
var jwt = require('jsonwebtoken');

function login(req, res) {
    console.log("Password: " + req.body.password);
    //en el formulario expresamos en formato clave valor y podemos recuperarlos aquí con req.body.password
    console.log("Email: " + req.body.email);
    membersDao.login(req.body.email, req.body.password)
        .then(user => {
            let token = jwt.sign({ id: user._id }, "Adrians_secret", {
                expiresIn: 86400
            });
            res.status(200).send({ auth: true, token: token, userName: user.name, _id: user._id });
        })
        .catch(err => res.status(401).send({ auth: false, token: null, err }))
}

function checkToken(token) {
    return new Promise((resolve,reject) =>{
        jwt.verify(token, "Adrians_secret", function (err, decoded) {
            if (err || !token) {
                reject(["Unauthorized", 401]);
            } else {
                resolve();
            }
        });
    })

}

module.exports = { login, checkToken }