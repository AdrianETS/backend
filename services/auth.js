var bcrypt = require('bcrypt');
let membersDao = require("../dao/membersDao.js");
var jwt = require('jsonwebtoken');
 
function login(req, res) {
    console.log("Password: "+req.body.password);
    console.log("Email: "+req.body.email);
    membersDao.login(req.body.email, req.body.password)
        .then(user => {
            let token = jwt.sign({ id: user._id }, "Adrians_secret", {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        })
        .catch(err => res.status(401).send({ auth: false, token: null, err }))
}
 
module.exports = {login}