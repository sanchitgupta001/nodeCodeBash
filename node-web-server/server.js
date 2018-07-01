/**
 * Created by sanchitgupta001 on 01/07/18.
 */
const express = require('express');
const hbs = require('hbs'); // Handle Bars Template Engine
const fs = require('fs');

const app = express();

// Registering Partials
hbs.registerPartials(__dirname + '/views/partials/');

// Express configs
app.set('view engine', 'hbs'); // Setting Handlebars template engine

// middlewares
app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;

  fs.appendFile('server.log', log + '\n', err => {
    if (err) {
      console.log(err);
    }
  });
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });
app.use(express.static(__dirname + '/public')); // To allow publicly accessible static resources

// Handle Bars Helpers
hbs.registerHelper('getCurrentYear', () => (new Date().getFullYear()));
hbs.registerHelper('screamIt', text => text.toUpperCase());

// HTTP route handlers
app.get('/', (req, res) => {
  res.render('home.hbs', {
    welcomeMessage: 'Hey There! Welcome',
    pageTitle: 'Home Page',
    currentYear: new Date().getFullYear(),
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    currentYear: new Date().getFullYear(),
  }); // Using template stored in views folder
});

app.listen(3000);
