var socket = io.connect('https://vegvesen.herokuapp.com');
//var socket = io.connect('http://localhost:5000');

document.getElementById("myForm").addEventListener("submit", function (e) {

    e.preventDefault();

    var bruker = e.target['fname'].value

    socket.emit('login', { user: bruker });
});