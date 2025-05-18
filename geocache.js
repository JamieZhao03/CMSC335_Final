require("dotenv").config();
const express = require("express");
const path = require("path");
const readline = require("readline");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();


const PORT = process.argv[2];
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));
app.use(express.urlencoded({ extended: true }));

let db, points;

(async () => {
  const uri = process.env.MONGO_CONNECTION_STRING;
  const databaseName = process.env.MONGO_DB_NAME;
  const collectionName = process.env.MONGO_COLLECTION;
  const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

  try {
    await client.connect();
    db = client.db(databaseName);
    points = db.collection(collectionName);

    app.listen(PORT, () => {
      console.log(`Web server started and running at http://localhost:${PORT}`);
      promptUser();
    });
  } catch (e) {
    console.error("MongoDB connection failed:", e);
  }
})();

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/find", (req, res) => {
  res.render("find");
});

app.get("/add", (req, res) => {
  res.render("form");
});

app.post("/addPoint", async (req, res) => {
  const { name, latitude, longitude, notes } = req.body;
  const point = {
    name,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    notes
  };
  await points.insertOne(point);
  const date = new Date().toString();
  res.send(`<h1>New Geocache Added</h1>
            <strong>Name:</strong> ${name}<br>
            <strong>Latitude:</strong> ${latitude}<br>
            <strong>Longitude:</strong> ${longitude}<br>
            <strong>Notes:</strong> ${notes}<br><br>
            <a href="/">HOME</a>`);
});

app.get("/list", (req, res) => {
  res.render("list");
});

app.post("/listPoints", async (req, res) => {
  const allPoints = await points.find({}).toArray();
  const rows = allPoints.map(p => 
    `<tr>
      <td>${p.name}</td>
      <td>${p.latitude}</td>
      <td>${p.longitude}</td>
    </tr>`).join("");
  res.send(`<h1>All Geocache Locations</h1>
            <table border="1">
              <tr><th>Name</th><th>Latitude</th><th>Longitude</th></tr>
              ${rows}
            </table>
            <br><a href="/">HOME</a>`);
});

app.get("/distance", (req, res) => {
  res.render("distance");
});

app.post("/distancePoints", async (req, res) => {
    const {
      aType, bType,
      pointA_name, pointA_lat, pointA_lon,
      pointB_name, pointB_lat, pointB_lon
    } = req.body;
  
    let lat1, lon1, lat2, lon2;
  
    // Point A processing
    if (aType === "name") {
      const a = await points.findOne({ name: pointA_name });
      if (!a) {
        return res.send(`<h1>Error</h1>
          Point A name not found.<br>
          <a href="/distance">Try Again</a>`);
      }
      lat1 = a.latitude;
      lon1 = a.longitude;
    } else {
      lat1 = parseFloat(pointA_lat);
      lon1 = parseFloat(pointA_lon);
      if (isNaN(lat1) || isNaN(lon1)) {
        return res.send(`<h1>Error</h1>
          Invalid coordinates for Point A.<br>
          <a href="/distance">Try Again</a>`);
      }
    }
  
    // Point B processing
    if (bType === "name") {
      const b = await points.findOne({ name: pointB_name });
      if (!b) {
        return res.send(`<h1>Error</h1>
          Point B name not found.<br>
          <a href="/distance">Try Again</a>`);
      }
      lat2 = b.latitude;
      lon2 = b.longitude;
    } else {
      lat2 = parseFloat(pointB_lat);
      lon2 = parseFloat(pointB_lon);
      if (isNaN(lat2) || isNaN(lon2)) {
        return res.send(`<h1>Error</h1>
          Invalid coordinates for Point B.<br>
          <a href="/distance">Try Again</a>`);
      }
    }
    //distance for the point gotten here
    const distance = getDistance(lat1, lon1, lat2, lon2).toFixed(2);
    const date = new Date().toString();
  
    res.send(`<h1>Distance Between Points</h1>
              <strong>Point A:</strong> (${lat1}, ${lon1})<br>
              <strong>Point B:</strong> (${lat2}, ${lon2})<br>
              <strong>Distance:</strong> ${distance} km<br><br>
              <a href="/">HOME</a>`);
  });

//JAMIE make it API instead of placeholder
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let marker1, marker2, line;

function getDistance(lat1, lon1, lat2, lon2) {
  const pointA = L.latLng(lat1, lon1);
  const pointB = L.latLng(lat2, lon2);
  return pointA.distanceTo(pointB); // in meters
}

function calculateDistance() {
  const lat1 = parseFloat(document.getElementById('pointA_lat').value);
  const lon1 = parseFloat(document.getElementById('pointA_lon').value);
  const lat2 = parseFloat(document.getElementById('pointB_lat').value);
  const lon2 = parseFloat(document.getElementById('pointB_lon').value);

  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    alert("Please enter valid numeric coordinates.");
    return;
  }

  // Remove old markers and line
  if (marker1) map.removeLayer(marker1);
  if (marker2) map.removeLayer(marker2);
  if (line) map.removeLayer(line);

  // Add new markers
  marker1 = L.marker([lat1, lon1]).addTo(map).bindPopup("Point A").openPopup();
  marker2 = L.marker([lat2, lon2]).addTo(map).bindPopup("Point B");

  // Draw line
  line = L.polyline([[lat1, lon1], [lat2, lon2]], { color: 'blue' }).addTo(map);

  // Zoom map to fit
  map.fitBounds(line.getBounds(), { padding: [20, 20] });

  // Calculate and show distance
  const distanceMeters = getDistance(lat1, lon1, lat2, lon2);
  const distanceKm = (distanceMeters / 1000).toFixed(2);

  document.getElementById('result').textContent =
    `Distance: ${distanceKm} kilometers (${distanceMeters.toFixed(0)} meters)`;
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function promptUser() {
  rl.question("Type 'stop' to shut down the server: ", (input) => {
    if (input === "stop") {
      console.log("Shutting down the server");
      process.exit(0);
    } else {
      console.log(`Invalid command: ${input}`);
    }
    promptUser();
  });
}
