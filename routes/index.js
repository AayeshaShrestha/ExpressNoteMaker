var express = require('express');
var router = express.Router();
var Users = require('../models/users');
var Notes = require('../models/notes');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/signup',function(req, res){
  res.render('signup');
});

router.post('/signup',function(req, res){
  console.log('req...', req.body);

  var user = new Users({
    username : req.body.username,
    password : req.body.password
    //repassword : req.body.repassword
  });

  if(req.body.username != '' && req.body.password != '' && req.body.repassword != '') {
      if(req.body.password == req.body.repassword){
        var promise = user.save();
        promise.then((user) => {
          console.log('user signed with values', user);
          res.redirect('/newNotes');
        });
      }
      else{
      console.log("passwords donot match");
      }
  }else{
    console.log("Please fill all the fields");
  }
});

router.post('/login',function(req,res){
  console.log(req.body);
  if(req.body.username && req.body.password){
    Users.findOne({username : req.body.username, password : req.body.password}, function(err, user){
      if(user != null){
        console.log('Logged in with ', user);
        res.redirect('/viewNotes');
      }else{
        console.log('User not valid');
      }
    });
  }else{
    console.log("Please enter username and password");
  }

});

router.get('/login',function(req, res){
  res.render('login');
});

router.get('/newNotes', function(req, res) {
  res.render('newNote');
});

router.get('/viewNotes',function(req, res){
  Notes.find().exec(function(err, notes){
    res.render('viewNotes', {notes});
    //console.log(notes);
  });
});

router.post('/saveNote',function(req, res, next){
  //console.log('req....',req.body);

  var note = new Notes({
    title : req.body.title,
    description : req.body.description
  });

  var promise = note.save();
  promise.then((note) => {
    console.log("Your note is ", note);

    Notes.find().exec(function(err, notes){
      res.render('viewNotes', {notes});
      //console.log(notes);
    });
  })
});

router.get('/deleteNote/:id', function(req, res){
  console.log(req.params.id);
  Notes.remove({ _id : req.params.id }, function(err, delNote){
    res.redirect('/viewNotes');
  });
})

module.exports = router;
