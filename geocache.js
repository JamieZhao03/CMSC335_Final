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
  res.render("findpoint");
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
            Task completed at ${date}<br>
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
  const { pointA, pointB } = req.body;
  const a = await points.findOne({ name: pointA });
  const b = await points.findOne({ name: pointB });

  if (!a || !b) {
    return res.send(`<h1>Error</h1>
                     One or both points not found in the database.<br>
                     <a href="/distance">Try Again</a>`);
  }

  const distance = getDistance(a.latitude, a.longitude, b.latitude, b.longitude).toFixed(2);
  const date = new Date().toString();
  res.send(`<h1>Distance Between Geocaches</h1>
            <strong>Point A:</strong> ${pointA}<br>
            <strong>Point B:</strong> ${pointB}<br>
            <strong>Distance:</strong> ${distance} km<br><br>
            Task completed at ${date}<br>
            <a href="/">HOME</a>`);
});

function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = angle => angle * (Math.PI / 180);
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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
