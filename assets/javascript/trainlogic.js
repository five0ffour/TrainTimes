//---------------------------------
// Initialize Firebase
//---------------------------------
var config = {
  apiKey: "AIzaSyALvv--swEeTKKU1Cqs826-QXAS6d32wsg",
  authDomain: "traintimes-891b6.firebaseapp.com",
  databaseURL: "https://traintimes-891b6.firebaseio.com",
  projectId: "traintimes-891b6",
  storageBucket: "traintimes-891b6.appspot.com",
  messagingSenderId: "875927816301"
};
firebase.initializeApp(config);

var database = firebase.database();

// Button handler for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trnName = $("#train-name-input").val().trim();
  var trnDest = $("#destination-input").val().trim();
  var trnFirst = $("#firstTime-input").val().trim();
  var trnFreq = $("#frequency-input").val().trim();

  // Creates local object for holding train data
  var newTrain = {
    name: trnName,
    destination: trnDest,
    firstTime: trnFirst,
    frequency: trnFreq
  };

// Write train data to the database
database.ref().push(newTrain);

  // Logs everything to console for debugging
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTime);
  console.log(newTrain.frequency);

  alert("Train Schedule successfully added");

  // Clears the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#firstTime-input").val("");
  $("#frequency-input").val("");
});

//---------------------------------
// Firebase event handler for adding trains to the database and a row in the html when a user adds an entry
//---------------------------------
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trnName = childSnapshot.val().name;
  var trnDest = childSnapshot.val().destination;
  var trnFirst = childSnapshot.val().firstTime;
  var trnFreq = childSnapshot.val().frequency;

  // Employee Info
  console.log(trnName);
  console.log(trnDest);
  console.log("First Time: " + trnFirst);
  console.log("Frequency: " + trnFreq);

  // Prettify the train start
  var trnNextArrival = calculateNextArrivalTime(trnFirst, trnFreq);
  // var trnMinutesAway = trnNextArrival.clone().subtract(moment(), "HH:mm");
  var duration = moment.duration(trnNextArrival.diff(moment()));
  var trnMinutesAway = Math.round(duration.asMinutes());

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trnName),
    $("<td>").text(trnDest),
    $("<td>").text(trnFreq),
    $("<td>").text(trnNextArrival.format('hh:mm A')),
    $("<td>").text(trnMinutesAway)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});

//---------------------------------
// calculteNextArrivalTime - Use the first Train time, the frequency and current time to determine when the 
// time of next arrival is.
//     Logic:  next arrival time is the first start time or first start time plus frequency internval that
//             comes after the current time.   
//     Assumptions:  Each day is a new day,  so all first times are assumed to start sometime today
//---------------------------------
function calculateNextArrivalTime(startTime, frequencyMinutes) {

  // Create a moment object based on the current date and start time
  var todayString = moment().format("MM/DD/YYYY ") + startTime;   

  // Create a moment object of the first valid start time today
  var nextArrivalTime = moment(todayString, "MM/DD/YYYY HH:mm");

  // Get today date/time as of this moment
  var currentTime = moment();

  // Loop/increment and compare the next time against the current time until we have the next available
  while (nextArrivalTime < currentTime) {
     nextArrivalTime.add(frequencyMinutes, "minutes");
  }

  // Log the result for debugging
  console.log("calculateNextArrivalTime(): " + nextArrivalTime.format("HH:mm A", "X"));

  return nextArrivalTime;
}