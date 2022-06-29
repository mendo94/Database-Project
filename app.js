const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const formidable = require('formidable');
const path = require('path');

const VIEWS_PATH = path.join(__dirname, '/views');
const __basedir = __dirname;
global.models = require('./models');

const PORT = 8080;
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'));

app.use(
  session({
    secret: 'somesecret',
    resave: true,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded());

app.set('views', VIEWS_PATH);
app.set('view engine', 'mustache');

app.use(express.static('static'));
app.use('/js', express.static('static'));
app.use('/css', express.static('static'));
app.use('/img', express.static('static'));
app.use('/uploads', express.static('static'));

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

app.get('/homepage', async (req, res) => {
  const { first_name, last_name } = req.session.user;
  res.render('room-dashboard-display', {
    first_name: first_name,
    last_name: last_name,
    username: req.session.user.username,
  });
});

app.get('/room-view/:roomId', async (req, res) => {
  const room = await models.Room.findByPk(req.params.roomId);
  const { first_name, last_name } = req.session.user;
  console.log(room);
  res.render(`homepage`, {
    currentRoom: room.name,
    roomId: room.id,
    first_name: first_name,
    last_name: last_name,
  });
});

app.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.redirect('/registration');
});

app.get('/', (req, res) => {
  res.redirect('/users/registration');
});

///////////////////////////////////////////////////////////////

// table for household
app.get('/household-members', (req, res) => {
  res.render('household-members');
});

app.get('/create-room', (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
