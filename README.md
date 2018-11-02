# TrainTimes

## Fictional Train Scheduler
 Train Times is a basic application that allows the user to schedule trains and track their arrival times.   The intent of the application is to demonstrate the firebase backend as well as the manipulation of date / time objects using javascript libraries.  Thematically it attempts to evoke the switchboards that you may see in train stations across the US.

 The basic application loads any trains that are stored remotely in the firebase database.  From here, the user may use the form to add any new train schedules.   It allows for the entry of a train name,  first train time in military time and frequency of departures in minutes.   

 Things to note:
 1) the program uses a common database, other users on other broweers may add trains and they would be reflected here
 2) there is a timer running to refresh the display board four times per minute
 3) Basic delete functionality is implemented with the buttons. 

## Getting Started
To get started,  copy the program to a clean directory and run "index.html" in your browser.   The program is ready to start automatically.  

## Prerequisites
A modern browser and an internet connection.   Chrome works best, but others should be fine too.
A modern IDE - it was developed using Visual Studio Code, but any text editor would work, including notepad.
GitHub 
GitBash installed locally

## Installing
1.  Find a Locate an empty directory on your hard drive
2.  Open a bash terminal in that directory
3.  Clone the unit-4-game repo down using  Git   
         "git clone https://github.com/five0ffour/TrainTimes.git"
4.  Open index.html in your favorite browser
        It should display the game board and prompt you for an entry
5.  Consider pointing firebase to your own local repository by changing the configuration in trainlogic.js

## Developer notes
index.html:  main entry point and user interface   
trainlogic.js:  all of the application logic, timers, firebase and event handlers  
  
## Future Enhancements
1) Implement actual train schedules using an API (Amtrak was not avaialble at the time of this writing)  
2) Extend delete functionality to the database  
3) Allow users to sort / search for trains  

### Maintentance App  

## Built With
jQuery 3.3.1 - JavaScript library  
Google Firebase 4.12.0 - realtime database
Bootstrap 4.0.0 - UI framework

## Authors
Michael Galarneau - Initial work - Five0ffour

## Acknowledgments
font: https://www.dafont.com/digital-7.font
favicon:  https://www.iconfinder.com/icons/299096/calendar_clock_icon
wallpaper:  Days of Wonder - Ticket to Ride -https://www.daysofwonder.com/tickettoride/en/