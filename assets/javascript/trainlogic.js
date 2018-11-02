//---------------------------------
// Global Varialbles - Initialize Firebase
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
var trains = [];

// Timer variables
var displayTimerId = 0; // display timer id for setInterval/clearInterval
var displayTimerRunning = false; // flags for the wait timer so we don't spawn multiple timers  
const displayInterval = 15; // Update the display four times / minute

// Fire off the timer event to refresh the display periodically
startDisplayTimer();

//---------------------------------
// Button handler for adding Trains
//---------------------------------
$("#add-train-btn").on("click", function (event) {
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

  // Logs train state to console for debugging
  console.log("------------on click add event ---------------");
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTime);
  console.log(newTrain.frequency);
  console.log("----------------------------------------------");

  // alert("Train Schedule successfully added");

  // Clears the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#firstTime-input").val("");
  $("#frequency-input").val("");
});

//---------------------------------
// Button handler for deleting trains 
//---------------------------------
$(document).on("click", ".btn-delete", function () {
  var name = $(this).attr("data-name");
  var confirmed = confirm("Removing entry for " + name + ". Confirm deletion:");
  if (confirmed) {
    console.log("on Delete() - deleting train: " + name)
    deleteTrain(name);
  }
});


//---------------------------------
// Firebase event handler for adding trains to the database and a row in the html when a user adds an entry
//---------------------------------
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trnName = childSnapshot.val().name;
  var trnDest = childSnapshot.val().destination;
  var trnFirst = childSnapshot.val().firstTime;
  var trnFreq = childSnapshot.val().frequency;

  // Train Info - log for debugging
  console.log("------------ on child added event ---------------");
  // console.log(trnName);
  // console.log(trnDest);
  // console.log("First Time: " + trnFirst);
  // console.log("Frequency: " + trnFreq);
  // console.log("-------------------------------------------------");

  // Save the read train data and additional metadata into a sorted array of train objects
  var train = {};
  train.name = trnName;
  train.destination = trnDest;
  train.firstTime = trnFirst;
  train.frequency = trnFreq;
  trains.push(train);

  // Refresh the board with the newly added train (although the display timer will do this too)
  updateBoardDisplay(trains);
});

/*******************************/
/*    Timer Events / Functions */
/***************************** */
//------------------------
// startDisplayTimer()  - kicks off an interval to vamp until we want to update the display board
//------------------------
function startDisplayTimer() {
  if (!displayTimerRunning) {
    displayTimerRunning = true;
    displayTimerId = setInterval(updateDisplayTimer, displayInterval * 1000);
  }
}

//------------------------
// stopDisplayTimer()  - cancels the update timer, never needed to be called in this app for the moment
//------------------------
function stopDisplayTimer() {
  if (displayTimerRunning) {
    clearInterval(displayTimerId);
    displayTimerRunning = false;
  }
}

//---------------------
// updateDisplayTimer() - periodically refresh the display board
//----------------------
function updateDisplayTimer() {
  console.log("updateDisplayTimer() -- refreshing display");
  updateBoardDisplay(trains);
}


function calculateMinutesToArrival(arrivalTime) {
  var duration = moment.duration(arrivalTime.diff(moment()));
  return Math.round(duration.asMinutes());
}

//------------------------------------
// updateBoarDisplay(trains) - main UI logic for this application.  
//        1. query the passed array of train objects
//        2. calculate and store the metadata (e.g., next arrival time)
//        3. sort the array by metadata
//        3. clear the current display board
//        4. reconstruct the UI table with the data/metadata in sorted order
//------------------------------------
function updateBoardDisplay(trains) {

  // Compute and store new arrival times in train item
  for (var i = 0;
    (i < trains.length); i++) {
    var train = trains[i];
    train.nextArrival = calculateNextArrivalTime(train.firstTime, train.frequency);
    train.minutesAway = calculateMinutesToArrival(train.nextArrival);
  }

  // Sort the master train array by arrival times 
  trains.sort(function (a, b) {
    return a.minutesAway - b.minutesAway;
  });

  // Empty the display board
  $("#train-table > tbody").empty();

  // Add the trains back to the board
  for (var i = 0;
    (i < trains.length); i++) {
    addTrainToBoard(trains[i]);
  }
}

//------------------------------------
// addTrainToBoard(train) - create/attach a row of the UI display board table
//------------------------------------
function addTrainToBoard(train) {

  // Create and attach a delete button, add train id as key field for deletes
  var btn = $("<button>").addClass("btn-delete px-2 ml-4");
  btn.attr("data-name", train.name);

  // Place a spiffy graphic on it
  var img = $("<img>").attr("src", "assets/images/delete.jpg");
  img.css("height", "15px");

  btn.append(img);

  // Create a new table row and populate with the formatted data
  var newRow = $("<tr>").append(
    $("<td>").text(train.name.toUpperCase()).addClass("col-name"),
    $("<td>").text(train.destination.toUpperCase()).addClass("col-city"),
    $("<td>").text(numberWithCommas(train.frequency)).addClass("col-freq"),
    $("<td>").text(train.nextArrival.format('MM/DD hh:mm A')).addClass("col-time"),
    $("<td>").text(numberWithCommas(train.minutesAway)).addClass("col-number"),
    $(btn)
  );

  // Append the new row to the DOM table
  $("#train-table > tbody").append(newRow);
}

//----------------------------------------
// deleteTrain(name) - delete the train from the master trains array based on its name and refresh screen
//----------------------------------------
function deleteTrain(name) {

  // TODO!!! -  Remove the train from the firebase database
  //  database.ref(). ...

  // Remove train from master array
  var train = {};
  for (var i = 0; i < trains.length; i++) {
    if (trains[i].name === name) {
      train = trains[i];
      break;
    }
  }

  // Remove train from master array
  for (var i = 0; i < trains.length; i++) {
    if (trains[i].name === name) {
      trains.splice(i, 1);
    }
  }

  // Refresh the display -- it should update as a consequence of a database event
  updateBoardDisplay(trains);
}

//---------------------------------
// calculteNextArrivalTime() - Use the first Train time, the frequency and current time to determine when the 
//                             time of next arrival is.
//     Logic:  next arrival time is the first start time or first start time plus frequency internval that
//             comes after the current time.   
//     Assumptions:  Each day is a new day, so all first times are assumed to start sometime today
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
  // console.log("calculateNextArrivalTime(): " + nextArrivalTime.format("MM/DD HH:mm A", "X"));

  return nextArrivalTime;
}

/*************************/
/*  Utility Functions    */
/*************************/

// numbersWithCommas(x) - format the number to a string with commas (presumably for display)
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}