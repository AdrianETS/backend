'use strict'

var MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

var uri = "mongodb://localhost:27017/";

//persistencia

function getAllMembers() {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    client.connect().then((client) => {
      var db = client.db('mountaineering_club')

      db.collection('members').find().toArray(function (err, result) {
        if (err) throw err;
        resolve(result)
      })
    })
  })
}

function getMemberById(id) {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    client.connect().then((client) => {
      var db = client.db('mountaineering_club');

      db.collection('members').findOne({ _id: ObjectID(id) }, function (err, result) {
        if (err) throw err;
        resolve(result);
      })
    })
  })
}

function deleteMember(id) {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    client.connect().then((client) => {
      var db = client.db('mountaineering_club');

      db.collection('members').deleteOne({ _id: ObjectID(id) }, function (err, result) {
        if (err) throw err;
        resolve(result);
      })
    })
  })
}

function addMember(user) {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    client.connect().then((client) => {
      var db = client.db('mountaineering_club');
      //user._id = ObjectID(); not necessary, assigned automatically
      user.birthDate = new Date(user.birthDate);
      user.password = bcrypt.hashSync(user.password, saltRounds);
      db.collection('members').insertOne((user), function (err, result) {
        if (err) throw err;
        resolve(result);
      })
    })
  })
}



function editMember(user) {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    client.connect().then((client) => {
      var db = client.db('mountaineering_club');
      user._id = ObjectID(user._id);
      user.birthDate = new Date(user.birthDate);
      editPassword(user)
      //cuando se concatenan then el parámetro de la arrow de un then es lo que devuelve el resolve de la anterior
      //de suerte que el resolve user de editPassword es lo que denominamos preparedUser en la siguiente línea
        .then(preparedUser => db.collection('members').updateOne({ _id: user._id }, { $set: preparedUser }, function (err, result) {
          if (err) throw err;
          resolve(result);
        }));
    })
  })
}

function editPassword(user) {
  return new Promise((resolve, reject) => {
    console.log("1The provided pass is" + user.password);
    if (user.password == "") {
      console.log("2The provided pass is" + user.password);
      getMemberById(user._id).then(loadedUser => {
        user.password = loadedUser.password;
        console.log("the loaded user is " + JSON.stringify(loadedUser));
        console.log("3The loaded pass is" + user.password);
        resolve(user);
      })
    } else {
      user.password = bcrypt.hashSync(user.password, saltRounds);
      resolve(user);
    }
  })
}

function login(email, password) {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    client.connect().then((client) => {
      var db = client.db('mountaineering_club');

      db.collection('members').findOne({ email: email }, function (err, result) {
        if (err) throw err;
        if (result && bcrypt.compareSync(password, result.password)) {
          console.log("Login successful");
          resolve(result);
        } else {
          console.log("Login not successful");
          reject(result);
        }
      })
    })
  })
}

module.exports = { getAllMembers, getMemberById, addMember, editMember, deleteMember, login }