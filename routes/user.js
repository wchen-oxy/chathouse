var express = require('express');
var router = express.Router();
let User = require('../models/user.model');
let IndexUser = require('../models/index.user.model');
var firebase = require('firebase');
const mongoose = require('mongoose');

router.post('/', (req, res) => {
  const uid = req.body.uid;
  const newUser = new User.Model({
       uid:uid 
      });
      newUser.save()
      .then(() => res.json('User added!'))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.delete('/', (req, res) => {
  User.Model.deleteMany().then(()=> res.json("Deleted All!"));
  mongoose.connection.deleteModel('User');
})

router.get('/index', (req, res) => {
 
  // Get Basic Info for User
  const username = req.query.username;
  IndexUser.Model.findOne({username:username}).then(
    result => {
      res.json(result)
    }
  )
  .catch(err => 
    res.send(err))
            
})

router.post('/index', (req, res) => {
  const uid = req.body.uid;
  const username = req.body.username;
  const private = req.body.private;
  const indexUser = IndexUser.Model({
    uid: uid,
    username: username,
    private: private
  });
  indexUser.save()
  .then(() => res.json('User Indexed!'))
  .catch(err => res.status(400).json('Error: ' + err));
})

router.post('/available', (req, res) => {
    const username = req.body.username;
    console.log(username);
    IndexUser.Model.findOne({username: username}).then(
      result => 
      {
        console.log(result);
        if (result) 
        {
          console.log("true");
          res.json(true);
        }
        else {
          res.json(false);
        }
      }
    )
    .catch(
      err => {
        console.log(err);
        res.send(err);
      }
    

    )
  }
)
// router.post('/register', (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;

//       firebase.auth().createUserWithEmailAndPassword(email, password)
    
//       .then(
//         ()=> {
//           //FIXME WHY DOESN'T (user) => {} work anymore?
//           // userData.user.sendEmailVerification();
//           firebase.auth().currentUser.sendEmailVerification();
//           res.send("Succesfully registed! Check you email for a verification link.")
          
//         }
//         )
//           // .then(window.location.replace('/'))
//       .catch( (error) => {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // [START_EXCLUDE]
//         if (errorCode === 'auth/weak-password') {
//           res.send('The password is too weak.');
//         } else {
//           res.send(errorMessage);
//         }
//         console.log(error);
//         // [END_EXCLUDE]
//       });

// });

// router.get('/test', (req, res, next) => {
//   res.send("Success!")
// })


// PREVIOUS MONGODB CODE

// /* GET users listing. */
// router.get('/login', function(req, res, next) {
//   const email = req.body.email;
//   const password = req.body.password;

//   const user = new User({
//     email,
//     password,
//   });
  
//   User.find({email: user.email})
//   .then(users => res.json(users))
//   .catch(err => res.status(400).json('Error: ' + err));

//   // res.send('respond with a resource');
// });

// router.route('/add').post((req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   const firstName = req.body.firstName;
//   const lastName = req.body.lastName;

//   const newUser = new User({
//     email,
//     password,
//     firstName,
//     lastName,
//   });
  
//   newUser.save().then(() => res.json('User added!'))
//   .catch(err => res.status(400).json('Error: ' + err));

//   // const matchingUsers = User.find()
//   // .then(users => res.json(users))
//   // .catch(err => res.status(400).json('Error: ' + err));

//   // if (matchingUsers) {
//   //   console.log(matchingUsers);
//   // }

// })

module.exports = router;
