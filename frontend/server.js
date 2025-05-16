const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'django-insecure-&ddj@r+6x@z+0mea5&ax48+*hh!#lb8(g2nedz8u8!a28ai!(#',
  resave: false,
  saveUninitialized: true
}));

// Show login page at root '/'
app.get('/', (req, res) => {
  res.render('login', { error: null });
});

// Handle login (POST to /login)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const response = await axios.post(
      'http://backend:8000/api/token/',
      { username, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    req.session.token = response.data.access;
    req.session.username = username;
    res.redirect('/home');
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    res.render('login', { error: 'Login failed. Please try again.' });
  }
});

// Show home page
app.get('/home', (req, res) => {
  if (!req.session.token) {
    return res.redirect('/');
  }
  res.render('home', { username: req.session.username });
});

// Handle logout
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Frontend server running at http://backend:${PORT}`);
});
