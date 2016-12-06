$(document).ready(function() {
    //Initialize Firebase
    var config = {
        apiKey: "AIzaSyDTAgakT4peXawRtYKv6BC-m3aadN1sJuU",
        authDomain: "train-schedule-52c4b.firebaseapp.com",
        databaseURL: "https://train-schedule-52c4b.firebaseio.com",
        storageBucket: "train-schedule-52c4b.appspot.com",
        messagingSenderId: "312423588840"
    };
    firebase.initializeApp(config);
    // Variable to reference the database
    var database = firebase.database();
});
