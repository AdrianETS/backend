'use strict'

var MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');


var uri = "mongodb://localhost:27017/";

function getAllexcursions() {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    client.connect().then((client) => {
      var db = client.db('mountaineering_club')

      db.collection("excursions").aggregate(
        [
          {
            $lookup: {
              from: "members",
              localField: "users_id",
              foreignField: "_id",
              as: "members_info"
            }
          }
        ]
      ).toArray(function (err, result) {
        if (err) throw err;
        resolve(result);

      });
    })
  })
}

function getExcursionById(id) {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    client.connect().then((client) => {
      var db = client.db('mountaineering_club');

      /*db.collection('excursions').findOne({ _id: ObjectID(id) }, function (err, result) {
        if (err) throw err;
        resolve(result);
      })*/
      db.collection("excursions").aggregate(
        [
          { $match: { _id: ObjectID(id)}},
          {
            $lookup: {
              from: "members",
              localField: "users_id",
              foreignField: "_id",
              as: "members_info"
            }
          }
        ]
      ).toArray(function (err, result) {
        if (err) throw err;
        if (result[0]){
          resolve(result[0]);
        } else {
          reject("Not found");
        }
        //resolve(result);

      });
    })
  })
}

function addExcursion(excursion) {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    client.connect().then((client) => {
      var db = client.db('mountaineering_club');
      excursion._id = ObjectID(excursion._id);
      excursion.date = new Date(excursion.date);
      excursion.users_id = excursion.users_id.map(id => ObjectID(id));
      db.collection('excursions').insertOne((excursion), function (err, result) {
        if (err) throw err;
        resolve(result);
      })
    })
  })
}


function editExcursion(excursion) {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    client.connect().then((client) => {
      var db = client.db('mountaineering_club');
      excursion._id = ObjectID(excursion._id);
      excursion.date = new Date(excursion.date);
      excursion.users_id = excursion.users_id.map(id => ObjectID(id));
      db.collection('excursions').updateOne({ _id: excursion._id }, { $set: excursion }, function (err, result) {
        if (err) throw err;
        getExcursionById(excursion._id).
        then(excursion => resolve(excursion))
      })
    })
  })
}

function deleteExcursion(id) {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    client.connect().then((client) => {
      var db = client.db('mountaineering_club');

      db.collection('excursions').deleteOne({ _id: ObjectID(id) }, function (err, result) {
        if (err) throw err;
        resolve(result);
      })
    })
  })
}

module.exports = { addExcursion, editExcursion, deleteExcursion, getAllexcursions, getExcursionById }