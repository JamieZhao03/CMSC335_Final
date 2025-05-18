function getDistance(lat1, lon1, lat2, lon2) {
    const pointA = L.latLng(lat1, lon1);
    const pointB = L.latLng(lat2, lon2);
    return pointA.distanceTo(pointB); // meters
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const resultEl = document.getElementById("result");
    const map = L.map("map").setView([0, 0], 2);
  
    let marker1, marker2, line;
  
    // Add tile layer to map
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
  
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent form submit
  
      const lat1 = parseFloat(form.pointA_lat.value);
      const lon1 = parseFloat(form.pointA_lon.value);
      const lat2 = parseFloat(form.pointB_lat.value);
      const lon2 = parseFloat(form.pointB_lon.value);
  
      if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
        resultEl.textContent = "Please enter valid coordinates.";
        return;
      }
  
      // Remove previous map markers/lines
      if (marker1) map.removeLayer(marker1);
      if (marker2) map.removeLayer(marker2);
      if (line) map.removeLayer(line);
  
      // Add new markers
      marker1 = L.marker([lat1, lon1]).addTo(map).bindPopup("Point A").openPopup();
      marker2 = L.marker([lat2, lon2]).addTo(map).bindPopup("Point B").openPopup();
  
      // Draw line between points
      line = L.polyline([[lat1, lon1], [lat2, lon2]], { color: "blue" }).addTo(map);
      map.fitBounds(line.getBounds(), { padding: [20, 20] });
  
      // Calculate and display distance
      const distance = getDistance(lat1, lon1, lat2, lon2);
      resultEl.textContent = `Distance: ${(distance / 1000).toFixed(2)} km (${distance.toFixed(0)} meters)`;
    });
  });