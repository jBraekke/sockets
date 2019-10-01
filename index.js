// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require("path");
var io = require('socket.io')(server);
var schedule = require('node-schedule');
var fetch = require('node-fetch');

const users = [];
const list = [];

function requestOptions() {
  return {
      headers: {
          'Authorization': 'Bearer svv_oppgaveutvikler',
          'Content-Type': 'application/json'
      },
      credentials: 'include',
      method: 'GET',
  }
}


async function hentPaagaende() {

  const response = await fetch('http://localhost:8088/backend/api/prove/paagaaende', requestOptions);

  const data = await response.json();

  return data;

}

app.set('port', (process.env.PORT || 5000));

// Routing
app.use(express.static(__dirname + '/public'));

server.listen(app.get('port'), function () {
  console.log('Server listening at port %d', app.get('port'));
});

app.get('/', function (request, response) {
  response.sendFile((path.join(__dirname + '/index.html')));
});

app.get('/melder', function (request, response) {
  response.sendFile((path.join(__dirname + '/public/melder.html')));
});

io.on('connection', function (socket) {
  schedule.scheduleJob('*/2 * * * * *', async function () {
    const liste = await hentPaagaende();
    socket.emit('all-list', liste);
  });

  socket.on('new-user', user => {
    users.push(user);
    io.emit('new-user-emitted', users);
  });

  socket.on('login', user => {
    users.filter((element) => { return element.user === user.user })[0].aktiv = true
    io.emit('new-user-emitted', users);
  })

  socket.on('new-list', items => {
    if (items.length > 0) {

      while (list.length > 0) {
        list.pop();
      }

      items.forEach(element => {
        list.push(element);
      });
    }
  });
});