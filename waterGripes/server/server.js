const express = require('express');
const path = require('path');
const { urlencoded, json } = require('body-parser')
const db = require('../database-mysql/helpers.js');
// const sendEmail = require('./emailHelper.js');
const app = express();

app.use(urlencoded({ extended: false }))
app.use(json())


app.use(express.static(path.resolve(__dirname, '../dist/waterGripes')));

///////////gripe endpoints///////////////

//endpoint to retrive all existing gripes
app.get('/gripes', (req, res) => {

  db.getAllGripes()
    .then((gripes) => {
      console.log('got all gripes server response');
      res.send(gripes);
    })
    .catch((err) => {
      console.error(err);
    });
  
});

app.get('/gripes/:id', (req, res) => {
  const  id = req.params.id;
  db.gripeById(id)
    .then((gripe) => {
      console.log('got your gripe server response');
      res.send(gripe);
    })
    .catch((err) => {
      console.error(err);
    });
});


////////end points to handle page breaks from Ang6 router///

app.get('/login', (req, res) => {
  res.redirect('/');
});

app.get('/userHome', (req, res) => {
  res.redirect('/');
});

app.get('/addGripe', (req, res) => {
  res.redirect('/');
});

//get get location might handle in browser
// app.get('/getLocation', (req, res) => {

//   //grab geolaction data
//   // from data get lat , long, block #, street, cross street, zip code
//   // add send back to client to be put in post req for gripes
//   // console.log(req.connection.remoteAddress.slice(7));
//   res.send('getting location');
// })

//add a gripe to db.
app.post('/gripes', (req, res)=>{
  const gripe = req.body;
  console.log('post gripe', gripe);
  db.submitGripe(gripe)
    .then((response) => {
      console.log(response);
      res.send(response);
    })
    .catch((err) => {
      console.error(err);
    });
})

///update gripe vote
app.patch(`/gripes/:id`, (req, res) => {
  const { id, votes } = req.body;
  db.updateGripe({ id, votes })
    .then((change) => {
      return db.checkVotes({ id })
    })
    .then(response => {
      const votes = response[0].votes
      return votes > 0
        ? db.setStatus(id, 'Unresolved')
        :db.setStatus(id, 'Resolved');
    })
    .then((response) => {
      res.send(response);
    })
    .catch(err => console.error(err));
    });

//get a google map for gripe
app.get('/gripe/:id/map', (req, res) => {
  // const gripeId = req.params.id;
  // console.log(gripeId);
  
  // db.gripeById(gripeId)
  //   .then(gripe => {
  //     console.log(gripe);
  //     //make GET to google for map
  //   })
  //   .then((map) => {
  //     res.send(map)
  //   })
  //   .catch(err => console.error(err));
  res.send('getting map')
});

///user endpoints//////////
app.post('/users', (req, res) => {
  const user = req.body;
  console.log('user created');
  db.createUser(user)
    .then(user => {
      console.log(user, 'added to system');
      res.send(user);
    })
    .catch(err => console.error(err));
});



module.exports = app;
//comments