const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fileUpload = require('express-fileupload');
global.path = require('path');

global.models = require('./models');

const PORT = 8080;
const VIEWS_PATH = path.join(__dirname, '/views');

app.use(
  session({
    secret: 'somesecret',
    resave: true,
    saveUninitialized: false,
  })
);

app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'));
app.use(express.urlencoded());

app.use(fileUpload({
  createParentPath: true,
}));
app.set('views', VIEWS_PATH);
app.set('view engine', 'mustache');

app.use('/uploads', express.static(path.join(__dirname, '/routes/uploads')));
app.use(express.static('static'));
app.use('/js', express.static('static'));
app.use('/css', express.static('static'));
app.use('/img', express.static('static'));

///////////////////////////////////////////////////////////////
//              Setup route for client side access
///////////////////////////////////////////////////////////////

const authenticateMiddleware = require('./middleware/authenticate');
const clientRoutes = require('./routes/clientInteraction');

app.use('/client', authenticateMiddleware, clientRoutes);

const objectRoutes = require('./routes/boxItemHandling');

app.use('/object-handling', authenticateMiddleware, objectRoutes);

const userRouter = require('./routes/loginRegistration');

app.use('/users', userRouter);

const navigationRoutes = require('./routes/navigationMenu');

app.use('/navigation', authenticateMiddleware, navigationRoutes);


app.get('/', (req, res) => {
  res.redirect('/users/registration');
});

///////////////////////////////////////////////////////////////

// table for household
<<<<<<< HEAD
app.get('/homepage/household-members', (req, res) => {
  res.render('household-members')
})
=======
app.get('/household-members', (req, res) => {
  res.render('household-members');
});

app.get('/create-room', (req, res) => {});

//////////////////////////////////////////////////////////////
>>>>>>> ed6a95baa74e2a259c1e8480517d336fcc791f47

app.get('/homepage/create-room', (req, res) => {
  res.render('homepage')
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
