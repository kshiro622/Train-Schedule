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

    // Initial variables
    var trainName = '';
    var destination = '';
    var firstTrain = '';
    var frequency = '';
    var nextArrival = '';
    var currentDate = moment().format("YYYY-MM-DD");
    var currentDateTime = moment().format("YYY-MM-DD HH:mm");

    // Firebase call that happens on page load and value updates.
    database.ref().on("value", function(snapshot) {

        $('.data').empty();

        // Console.log the value of this snapshot
        console.log(snapshot.val());

        snapshot.forEach(function(childSnapshot) {
            var trainName = childSnapshot.val().trainName;
            var destination = childSnapshot.val().destination;
            var frequency = childSnapshot.val().frequency;
            var firstTrain = childSnapshot.val().firstTrain;
            var timeSince = moment().diff(firstTrain, 'minutes');
            var minutesAway = String(parseInt(frequency) - (parseInt(timeSince) % parseInt(frequency)));
            var nextArrival = moment(currentDateTime).add(minutesAway, "minutes").format("HH:mm");
            $('.trainName').append('<p>' + trainName + '</p>');
            $('.destination').append('<p>' + destination + '</p>');
            $('.frequency').append('<p>' + frequency + '</p>');
            $('.nextArrival').append('<p>' + nextArrival + '</p>');
            $('.minutesAway').append('<p>' + minutesAway + '</p>');
        });

        // If it fails, cue error handling.
    }, function(errorObject) {

        // Log a read error and its error code.
        console.log("The read failed: " + errorObject.code);

    });

    $('button').on('click', function() {

        // Take the input from each box and store it in a variable.
        // We'll need to push these variables to firebase and also use them to determine what gets displayed.

        var trainName = $('#train-name').val();
        var destination = $('#destination').val();
        var firstTrainVal = $('#first-train').val();
        var firstTrain = currentDate + " " + firstTrainVal;
        var frequency = $('#frequency').val();
        if (trainName.length > 0 && destination.length > 0 && firstTrain.length > 0 && frequency > 0) {
            // Push to database.
            database.ref().push({
                trainName: trainName,
                destination: destination,
                firstTrain: firstTrain,
                frequency: frequency
            });

            // Empty input fields.
            $('input').val('');

        } else {
            alert('All fields are required.');
        }

        // Don't refresh.
        return false;
    });

});
