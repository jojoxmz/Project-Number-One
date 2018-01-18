var map;
var locationsObj = {};

function initMap() {
  var denverCenter = {lat: 39.742043, lng: -104.991531};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: denverCenter
  });
  var marker = new google.maps.Marker({
    position: denverCenter,
    map: map
  });
};

//Call to FourSquare API to obtain location data for testing purposes. Actual location data will be user input.
var queryUrl = "https://api.foursquare.com/v2/venues/explore?client_id=NCFDMIMRBLCB1MNHTEXODLIWB2KWDVQBQ50ZTCYQ3X05N43Y&client_secret=JPMDM31IHWHU35E4EVKGG3BGVYWEZ4DHWHIHDP4YSQFBYSOB&v=20170801&ll=39.742043,-104.991531&query=food truck&limit=20";
$.ajax({
  url: queryUrl,
  method: 'GET'
}).done(function(response) {

  var locationsArray= response.response.groups[0].items;

  /*Create object of different locations for initial testing purposes. Will be using
  user geolocation for actual app*/
  for(var i=0; i< locationsArray.length; i++) {
    console.log(locationsArray[i].venue.location.lat + " " + locationsArray[i].venue.location.lng);
    locationsObj["location-" + i] = new Object();
    locationsObj["location-" + i]["lat"] = locationsArray[i].venue.location.lat;
    locationsObj["location-" + i]["lng"] = locationsArray[i].venue.location.lng;
  };

  iterateObjAndPin(locationsObj);
});


function pinMarker(lat, lng) {
  var newLoc = {lat: lat, lng: lng};
  var marker = new google.maps.Marker({
    position: newLoc,
    map: map
  });
}

//Add new truck data with location to firebase and display new pin - called on event listener
function addNewTruckAndPin() {

}

/*Center map on user's current location within a predetermined radius (possibly drop pin at user's current)
location*/
function displayNearbyTrucks() {

}

/*Center map on user's current location within a predetermined radius (possibly drop pin at user's current)
location*/
function verifyTruckLocation() {

}

//Iterates object with stored location and pins marker at that location
function iterateObjAndPin(obj) {
  var result = "";
  var locToPin = {};

  for (var key in obj) {
    result = key + " , " + obj[key];
    if (key == "lat") {
      locToPin.lat = obj[key];
    } else if (key == "lng") {
      locToPin.lng = obj[key];
    }

    if(locToPin.hasOwnProperty("lat") && locToPin.hasOwnProperty("lng")) {
      pinMarker(locToPin.lat, locToPin.lng);
    }

    if(obj[key] !== null && typeof obj[key] === "object") {
      iterateObjAndPin(obj[key]);
    }
  }
}

//Event listeners
