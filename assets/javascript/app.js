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
    var currentDate = moment().format("YYYY-MM-DD");
    var currentDateTime = moment().format("YYY-MM-DD HH:mm");


    // Firebase call that happens on page load and when a child is added.
    database.ref().on("child_added", function(snapshot) {

            var trainName = snapshot.val().trainName;
            var destination = snapshot.val().destination;
            var frequency = snapshot.val().frequency;
            var firstTrain = snapshot.val().firstTrain;
            var timeSince = moment().diff(firstTrain, 'minutes');
            var timeSinceInt = parseInt(timeSince);
            var minutesAwayPast = String(parseInt(frequency) - (parseInt(timeSince) % parseInt(frequency)));
            var minutesAwayFuture = Math.abs(timeSince);
            var nextArrivalPast = moment(currentDateTime).add(minutesAwayPast, "minutes").format("HH:mm");
            var nextArrivalFuture = moment(firstTrain).format('HH:mm');
            $('.trainName').append('<p>' + trainName + '</p>');
            $('.destination').append('<p>' + destination + '</p>');
            $('.frequency').append('<p>' + frequency + '</p>');
            if (timeSinceInt > 0) {
                $('.minutesAway').append('<p>' + minutesAwayPast + '</p>');
                $('.nextArrival').append('<p>' + nextArrivalPast + '</p>');
            } else if (timeSinceInt === 0) {
                $('.minutesAway').append('<p>DUE</p>');
                $('.nextArrival').append('<p>' + nextArrivalFuture + '</p>');
            } else {
                $('.minutesAway').append('<p>' + minutesAwayFuture + '</p>');
                $('.nextArrival').append('<p>' + nextArrivalFuture + '</p>');
            }

            // If it fails, cue error handling.
        },
        function(errorObject) {

            // Log a read error and its error code.
            console.log("The read failed: " + errorObject.code);

        });

    // Add button on click funciton

    $('button').on('click', function() {

        // Take the input from each box and store it in a variable

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

    // Refresh page every minute
    var time = new Date().getTime();
    $(document.body).bind("mousemove keypress", function(e) {
        time = new Date().getTime();
    });

    function refresh() {
        if (new Date().getTime() - time >= 60000)
            window.location.reload(true);
        else
            setTimeout(refresh, 10000);
    }

    setTimeout(refresh, 10000);

});
