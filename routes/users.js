var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/etbot');

var db = mongoose.connection;
var UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  info: String
})



var User = db.model('User', UserSchema)

router.get('/login', function (req, res, next) {
  res.render('login')
})

/* GET users listing. */
router.post('/auth/register', function (req, res, next) {

  User.findOne({ 'name': req.body.user }, function (err, data) {
    if (data == null) {
      var newUser = new User({ name: req.body.name, age: req.body.age.toString(), info: req.body.info })
      newUser.save(function (err, pdu) {
        if (!err) {
          res.json({
            status: "success",
            info: "注册成功",
            _id: pdu._id
          })
        }
      })
    } else {
      console.log("err")
    }
  })
});

router.post('/auth/login', function (req, res, next) {
  User.findOne({ 'name': req.body.name }, function (err, data) {
    if (data != null) {
      if (data.password == req.body.password) {
        res.json({
          status: "success",
          info: "登录成功",
          _id: data._id
        })
      } else {
        res.json({
          status: "error",
          info: "密码错误",
          _id: data._id
        })
      }
    } else {
      res.json({
        status: "error",
        info: "用户不存在"
      })
    }
  })
})

function getServerTime() {
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  return timestamp
}

module.exports = router;
