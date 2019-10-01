var socket = io.connect('ws://vegvesen.herokuapp.com');
//var socket = io.connect('http://localhost:5000');

socket.on('all-users', function (users) {
    printUsers(users);
});

document.getElementById("myForm").addEventListener("submit", function (e) {

    e.preventDefault();

    var bruker = e.target['fname'].value
    var klasse = e.target['klasse'].value

    socket.emit('new-user', { user: bruker, klasse: klasse, aktiv: false });

    e.target.reset();
});
setTimeout(() => {
    socket.emit('init');
}, 200)

socket.on('init-user-load', (users) => {
    console.log('all users', users);
})

socket.on('new-user-emitted', function (users) {
    printUsers(users);
});

function printUsers(users) {
    var ul = document.getElementById('kandidater');
    ul.innerHTML = null;
    users.forEach(element => {
        var li = document.createElement('li');
        li.setAttribute('class', `list-group-item ${element.aktiv ? 'active' : 'inactive'}`);
        li.innerHTML = `${li.innerHTML} ${element.user} (${element.klasse})`

        ul.appendChild(li);
    });
}

function printKlasse() {
    var klasser = [
        {
            "id": 1,
            "klassekode": "A",
            "navn": "Tung motorsykkel",
            "status": "AKTIV",
            "endretDatoTid": null
        },
        {
            "id": 2,
            "klassekode": "B",
            "navn": "Personbil",
            "status": "AKTIV",
            "endretDatoTid": null
        },
        {
            "id": 3,
            "klassekode": "C",
            "navn": "Lastebil",
            "status": "AKTIV",
            "endretDatoTid": null
        },
        {
            "id": 4,
            "klassekode": "BE",
            "navn": "Personbil med tilhenger",
            "status": "AKTIV",
            "endretDatoTid": null
        },
        {
            "id": 5,
            "klassekode": "D",
            "navn": "Buss",
            "status": "AKTIV",
            "endretDatoTid": null
        },
        {
            "id": 6,
            "klassekode": "D1",
            "navn": "Minibuss",
            "status": "AKTIV",
            "endretDatoTid": null
        },
        {
            "id": 7,
            "klassekode": "T",
            "navn": "Traktor",
            "status": "AKTIV",
            "endretDatoTid": null
        }
    ];

    var select = document.getElementById('klasser');
    klasser.forEach(element => {
        var option = document.createElement('option');
        option.setAttribute('value', element.klassekode);
        option.innerHTML = `${option.innerHTML} ${element.navn} (${element.klassekode})`
        select.appendChild(option);
    });
}

printKlasse();