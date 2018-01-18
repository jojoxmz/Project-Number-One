var map;
var locationsObj = {};
var markerArr = [];
var pos = {}
var initialDisplaySet = false;

//Class that will store marker-related data, and pass that data to firebase
 class MarkerDataObj {
   constructor(lat, lng, truckName, user,  markerID) {
     this.markerID = markerID;
     this.lat = lat;
     this.lng = lng;
     this.truckName = truckName;
     this.upvotes = 0;
     this.downvotes = 0;
     this.recentActivity = "Pinned";
     this.recentActivityUser = user;
     this.recentActivityTime = "";
   }
 }

 //Called  on initial page load and on when any child modified. For initial page load,
 //iterate over child nodes (data related to individual markers), create initial markers
 //for display with embedded data, and pin those markers to map. The data in the markers
 //will be used to generate the infowindows on a click event. Add a reference to the markers
 //in array to manipulate or remove markers
 markersRef.on('value', function(snapshot) {

  if (initialDisplaySet == false)
    snapshot.forEach(function(childNodes) {

      var markerID = (childNodes.key).toString();
      var lat = childNodes.val().lat;
      var lng = childNodes.val().lng;
      var truckName = childNodes.val().truckName;
      var upvotes = childNodes.val().upvotes;
      var downvotes = childNodes.val().downvotes;
      var recentActivity = childNodes.val().recentActivity;
      var recentActivityUser = childNodes.val().recentActivityUser;
      var recentActivityTime = childNodes.val().recentActivityTime;
      console.log(markerID);
      console.log(lat);
      console.log(lng);
      console.log(truckName);
      console.log(upvotes);
      console.log(downvotes);
      console.log(recentActivity);
      console.log(recentActivityUser);
      console.log(recentActivityTime);

      var marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map,
        title: truckName,
        markerID: markerID,
        upvotes: upvotes,
        downvotes: downvotes,
        recentActivity: recentActivity,
        recentActivityUser: recentActivityUser,
        recentActivityTime: recentActivityTime
      });

      markerArr.push(marker);
    });

    initialDisplaySet = true;
    for (var i = 0; i < markerArr.length; i++) {
      console.log(markerArr[i]);
      var newMarker = markerArr[i];
      var id = newMarker.markerID;
      console.log("The marker id is :" + id);
      newMarker.markerID = "111111";
      console.log(newMarker.markerID);
      console.log(markerArr[i].markerID);
    }

    //Attach click event listener with closure that creates infowindow based on markers
  });

//This is called when Google maps is down loading. Add any fuctionality here we want triggered at that point.
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

  markerArr.push(marker);
  console.log(markerArr[0]);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log(pos);
    });
  }
}


//FOR TESTING PURPOSES - Call to FourSquare API to obtain location data for testing purposes. Actual location data will be user input.
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

//This function can be passed or called to pin a marker at a given
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

//LIKELY WILL NOT USE THIS FUNCTION (RATHER WILL USE FOR EACH TO ITER FIREBASE OBJ)
//BUT COULD BE USEFUL LATER - KEEP FOR NOW.
/*function iterateObjAndPin(obj) {
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
      //pinMarker(locToPin.lat, locToPin.lng);
    }

    if(obj[key] !== null && typeof obj[key] === "object") {
      iterateObjAndPin(obj[key]);
    }
  }
}*/

//Retrieves and returns user's current location
function getUserCurrentLocation() {
    var infoWindow = new google.maps.InfoWindow;

      navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });

    return pos;
}

function dropPinAtUserCurrentLocation() {
    var infoWindow = new google.maps.InfoWindow;

    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(pos);
      var marker = new google.maps.Marker({
        position: pos,
        map: map
      });
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  }


//Event listeners
$("#pin-truck-btn").on("click", function() {
  (markerArr[0]).setMap(null);
  console.log(MarkerArr);
  var loc = getUserCurrentLocation();

  //******STEP TO ADD NEW PIN*******/
  //Call YELP to see if food truck matches result from YELP API - if so, retrieve truck ID and use name for truck name [or use dropdown]
  //Windowinfo will be populated based on data stored in pin on click event.
  //Create global associative array to track pins on page (cannot grab by ID like standard HTML dom).

  var newMarkerData = new MarkerDataObj(loc.lat, loc.lng, "newTruck", "greg");
  var newKey = markersRef.push().key;
  newMarkerData.markerID = newKey;
  //Add Truck ID to MarkerData Object, the

  //New marker with custom data to be stored in and updated with firebase
  var marker = new google.maps.Marker({
    position: loc,
    map: map,
    title: newMarkerData.truckName,
    markerID: newMarkerData.newKey,
    upvotes: newMarkerData.upvotes,
    downvotes: newMarkerData.downvotes,
    recentActivity: newMarkerData.recentActivity,
    recentActivityUser: newMarkerData.recentActivityUser,
    recentActivityTime: newMarkerData.recentActivityTime
  });

  //associativeMarkerArr.push(newMarker) - push marker object into array to modify/remove later

  var updates = {};
  updates['/markers/' + newKey] = newMarkerData;
  updates['/trucks/' + newMarkerData.truckName + '/' + newKey] = newMarkerData;
  database.ref().update(updates);
});

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}