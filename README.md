# CMSC335_Final
Who Submitted the Project in the Submit Server - Name and directory id of the group member that uploaded the application to the submit server.

Group Members - Jamie Zhao (118853666), Annika Kulkarni (118747668)

App Description - A geocaching diary where you record coordinates of caches you found, list all recorded locations, and find distances between geocaches. 

YouTube Video Demo Link - Link to a YouTube video that provides a demo of your application. This video is very important. We will not grade a project unless a YouTube video is provided. The video does not need to have audio (narration).

APIs Information - Leaflet API https://leafletjs.com/reference.html 

Contact Email - jzhao111@terpmail.umd.edu, annika14@terpmail.umd.edu

Deployed App Link - Link to the online deployment of the app (e.g., link to Render entry).

# Notes

## Node.js: 
We are going to have endpoints to different EJS files detailed below. Get ejs endpoints to display HTML

distance.ejs endpoint
 - requires MongoDB
 - processes MongoDB into HTML
 - res.sends processed coordinates into HTML
 

## index.ejs:
HOME page: just HTML, called with res.render("index")
Contain links to tasks

## form.ejs


## list.ejs


## distance.ejs
Displays HTML of a form with two inputs
Error catching for valid coordinates (within range) 


## style.css
color scheme: green




