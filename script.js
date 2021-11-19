let map;
let markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 3,
    center:{lat:35.7465,lng:39.4629},
  });
  map.addListener("click", (event) => {
    addMarker(event.latLng);
  });
  
  //https://developers.google.com/maps/documentation/javascript/examples/places-searchbox#maps_places_searchbox-javascript
  const card = document.getElementById("pac-card");
  const input = document.getElementById("pac-input");
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
  const searchBox = new google.maps.places.SearchBox(input);

  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      // Create a marker for each place.
      addMarker(place.geometry.location);

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}
//https://developers.google.com/maps/documentation/javascript/examples/marker-remove#maps_marker_remove-javascript

function addMarker(location) {
  const marker = new google.maps.Marker({
    position: location,
    map: map,
    draggable:true,
  });
  markers.push(marker);
  var infoWindow = new google.maps.InfoWindow({
    content:"<p>Marker Location:" + marker.getPosition() + "</p>",
  });

  marker.addListener('click', function(){
    infoWindow.open(map, marker);
  });
}

function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

function clearMarkers() {
    setMapOnAll(null);
  }

function deleteMarkers() {
    clearMarkers();
    markers = [];
  }
