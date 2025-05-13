# CMSC335_Final
Who Submitted the Project in the Submit Server - Name and directory id of the group member that uploaded the application to the submit server.

Group Members - Jamie Zhao (118853666), Annika Kulkarni (118747668)

App Description - A geocaching diary where you record coordinates of caches you found, list all recorded locations, and find distances between geocaches. 

YouTube Video Demo Link - Link to a YouTube video that provides a demo of your application. This video is very important. We will not grade a project unless a YouTube video is provided. The video does not need to have audio (narration).

APIs Information - Leaflet API https://leafletjs.com/reference.html 

Contact Email - jzhao111@terpmail.umd.edu, annika14@terpmail.umd.edu

Deployed App Link - Link to the online deployment of the app (e.g., link to Render entry).

# Notes

## index.js: 
We are going to have endpoints to different EJS files detailed below. Get ejs endpoints to display HTML. Data is added and processed in a MongoDB database

"/find"
- displays the map for finding coordinates

"add"
"addPoint"
"list"
"listPoint"
"distance"
"distancePoint" 
"



 - requires MongoDB
 - processes MongoDB into HTML
 - res.sends processed coordinates into HTML


 

## index.ejs:
HOME page: just HTML display of links to relevant tasks below
Contain links to tasks
- Find Coordinates (findpoint.ejs)
- Add New Geocache (form.ejs
- List All Geocaches (list.ejs
- Find Distance between Geocaches (distance.ejs)

## findpoint.ejs
- HTML and API map stuff
Find the coordinates of any point on a map
- API stuff, handled by someone else
Endpoint named "/find" is called with a get request in .js to display this

## form.ejs
- HTML form
Form that takes in user input:
- Name of Location (string)
- Latitude (float)
- Longitude (float)
- Notes
Endpoint named "/add" is called with a get request in .js to display this
Action upon submit that calls an endpoint called "/addPoint" that then is a post request to process the info and return HTML displaying the info submitted

## list.ejs
Displays HTML button that says "List Locations"
Action upon button click that calls an endpoint called "/listPoints" that then is a post request to process the info and return HTML displaying the list of points
with Name, Latitude, Longitude as headings in a table.
Endpoint named "/list" is called with a get request in .js to display this

## distance.ejs
Displays HTML of a form with two inputs
Error catching for valid coordinates (within range) - done with API, put comment for now
Action upon submit that calls an endpoint called "/distancePoints" that then is a post request to process the info and return HTML that is the calculated distance between
the first and second inputted point with  "Distance between X and Y: ____ units)
Endpoint named "/distance" is called with a get request in .js to display this




## style.css
color scheme: green




