document.addEventListener("DOMContentLoaded", function () {
  console.log("Map script loaded");

  var lat = typeof parkingLat !== "undefined" ? parkingLat : 34.0209;
  var lng = typeof parkingLng !== "undefined" ? parkingLng : -6.8416;

  var map = L.map("map").setView([lat, lng], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  var marker = L.marker([lat, lng], { draggable: true }).addTo(map);

  function updateInputs(lat, lng) {
    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lng;

    var apiKey = "f83385bdcb40428caff7f2998405d08c";
    var url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("OpenCage Data:", data);
        if (data.results.length > 0) {
          let address = data.results[0].components;

          document.getElementById("rue").value = address.road || "";
          document.getElementById("ville").value = address.city || address.town || "";
          document.getElementById("codePostal").value = address.postcode || "";
          document.getElementById("pays").value = address.country || "";
        }
      })
      .catch((error) => console.error("Error fetching location:", error));
  }

  marker.on("dragend", function (e) {
    var position = marker.getLatLng();
    updateInputs(position.lat, position.lng);
  });

  map.on("click", function (e) {
    marker.setLatLng(e.latlng);
    updateInputs(e.latlng.lat, e.latlng.lng);
  });
});
