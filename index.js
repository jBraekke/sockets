// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require("path");
var io = require('socket.io')(server);

const users = [];
const list = [];
const statuser = ['KLARGJORT', 'LOGGET_PAA', 'STARTET', 'INNSYN_PAAGAAR', 'AVSLUTTET']
const fornavn = ['Bjarne', 'Lise', 'Hans', 'Johannes', 'Line', 'Sara', 'Henrich', 'Lisa', 'Morten']
const etternavn = ['Hansen', 'Normann', 'Monsen', 'Larsen', 'Henriksen', 'Lichmann', 'Mortensen']

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
  socket.emit('all-users', users);

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

  setInterval(() => {
    if (list.length > 0) {
      const status = statuser[Math.floor(Math.random() * statuser.length)];
      const item = list[Math.floor(Math.random() * list.length)];
      item.status = status;

      socket.emit('all-list', list);
    }
  }, 3000)

  setInterval(() => {
    if (list.length > 0) {
      const status = statuser[0];
      let fnavn = fornavn[Math.floor(Math.random() * fornavn.length)];
      let enavn = etternavn[Math.floor(Math.random() * etternavn.length)];

      const item = {
        "id": 3,
        "klasse": {
          "id": 2,
          "klassekode": "B",
          "navn": "Personbil",
          "aktor": "TRAFIKANT"
        },
        "startetDatoTid": null,
        "levertDatoTid": null,
        "kandidat": {
          "id": 3,
          "fornavn": fnavn,
          "etternavn": enavn,
          "fodselsnr": "19011888014",
          "fodselsdato": "2000-05-01"
        },
        "innloggetDatoTid": null,
        "avsluttetDatoTid": null,
        "status": status,
        "provetype": "DROP_IN",
        "tilgjengeligTidMinutter": 90,
        "bruktTidMinutter": 0,
        "plass": 0
      }

      list.push(item);

      socket.emit('all-list', list);
    }
  }, 5000)

});