//Initial Firebase Congifiguation
var config = {
  apiKey: "AIzaSyBjhon0-cIYtELUMFxUT0isynUMCxaNp9Y",
  authDomain: "food-truckr.firebaseapp.com",
  databaseURL: "https://food-truckr.firebaseio.com",
  projectId: "food-truckr",
  storageBucket: "food-truckr.appspot.com",
  messagingSenderId: "463131017710"
};

firebase.initializeApp(config);

var database = firebase.database();

var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var markersRef = firebase.database().ref("markers");
var trucksRef = firebase.database().ref("trucks");

connectedRef.on("value", function(snap) {
  if (snap.val()) {
    var con = connectionsRef.push(true);
    con.onDisconnect().remove();
  }
});

var map;
var locationsObj = {};
var markerArr = [];
var initialDisplaySet = false;
var currentLocation = {};

//Class that will store marker-related data, instances to be passed to firebase
 class MarkerDataObj {
   constructor(lat, lng, truckName) {
     this.markerID = "";
     this.lat = lat;
     this.lng = lng;
     this.truckName = truckName;
     this.upvotes = 0;
     this.downvotes = 0;
     this.recentActivity = "Pinned";
     this.recentActivityTime = "";
   }
 }

 //Called  on initial page load and on when any child modified. For initial page load,
 //iterate over child nodes (data related to individual markers), create initial markers
 //for display with embedded data, and pin those markers to map. The data in the markers
 //will be used to generate populate the stats-modals on a click event. Addinf reference to the markers
 //in array to manipulate or remove markers
 markersRef.on('value', function(snapshot) {

  if (initialDisplaySet == false) {
    snapshot.forEach(function(childNodes) {

      var markerID = (childNodes.key).toString();
      var lat = childNodes.val().lat;
      var lng = childNodes.val().lng;
      var truckName = childNodes.val().truckName;
      var upvotes = childNodes.val().upvotes;
      var downvotes = childNodes.val().downvotes;
      var recentActivity = childNodes.val().recentActivity;
      var recentActivityTime = childNodes.val().recentActivityTime;

      var marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map,
        title: truckName,
        markerID: markerID,
        upvotes: upvotes,
        downvotes: downvotes,
        recentActivity: recentActivity,
        recentActivityTime: recentActivityTime
      });

      markerArr.push(marker);

      //Enclosing reference to marker
      function attachClickEvent(marker) {
        google.maps.event.addListener(marker, "click", function() {
          $("#truck-name").text(marker.title);
          $("#num-of-upvotes").text(marker.upvotes);
          $("#num-of-downvotes").text(marker.downvotes);
          $("#activity").text(marker.activity);
          $("#stats-modal").modal("show");
        });
      }
       attachClickEvent(marker);
    });
  }
    initialDisplaySet = true;
});

//This is called when Google maps API done loading. Add any fuctionality here we want triggered at that point.
function initMap() {
  var denverCenter = {lat: 39.742043, lng: -104.991531};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: denverCenter
  });
}

/*Center map on user's current location within a predetermined radius (possibly drop pin at user's current)
location*/
function displayNearbyTrucks() {

}

/*Call this on modal button on modal btn click event*/
function verifyTruckLocation() {

}

//Retrieves
function getUserCurrentLocation() {
  var infoWindow = new google.maps.InfoWindow;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

//Retrieves and returns user's current location with deferred promise - implement if needed
var getUserCurrentLocationWithPromise = function() {
  var infoWindow = new google.maps.InfoWindow;
  var deferred = new $.Deferred();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var position = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      deferred.resolve(position);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  return deferred.promise();
}


//Drops pin at current user location
function dropPinAtUserCurrentLocation() {
  var infoWindow = new google.maps.InfoWindow;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      position.coords.latitude
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
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

$("#pin-truck-btn").on("click", function() {
   getUserCurrentLocation();
});

$("#truck-query").on("click", function(event) {
  event.preventDefault();

  //Query YELP or otherwise confirm that entered data is a food truck
  /*getUserCurrentLocationWithPromise().then(function(position) --> use promise if immediate location call problematic */

    var newMarkerData = new MarkerDataObj(currentLocation.lat, currentLocation.lng, "newTruck");
    var newKey = markersRef.push().key;
    newMarkerData.markerID = newKey;
    //ADD: Truck ID to MarkerData Object if possible with YELP API call

    //New marker dropped with custom data to be stored in and updated with firebase
    var marker = new google.maps.Marker({
      position: {lat: newMarkerData.lat, lng: newMarkerData.lng},
      map: map,
      title: newMarkerData.truckName,
      markerID: newMarkerData.newKey,
      upvotes: newMarkerData.upvotes,
      downvotes: newMarkerData.downvotes,
      recentActivity: newMarkerData.recentActivity,
      recentActivityTime: newMarkerData.recentActivityTime
    });

    map.setZoom(18);
    map.panTo(marker.position);

    //Push new marker
    markerArr.push(marker);

    //Enclosing reference to marker
    function attachClickEvent(marker) {
      google.maps.event.addListener(marker, "click", function() {
        $("#truck-name").text(marker.title);
        $("#num-of-upvotes").text(marker.upvotes);
        $("#num-of-downvotes").text(marker.downvotes);
        $("#activity").text(marker.activity);
        $("#stats-modal").modal("show");
      });
    }

    attachClickEvent(marker);

    //Push new marker to firebase
    var updates = {};
    updates['/markers/' + newKey] = newMarkerData;
    updates['/trucks/' + newMarkerData.truckName + '/' + newKey] = newMarkerData;
    database.ref().update(updates);
  //});
});

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

//TESTING
function changeMarkerTest() {
  for(var i = 0; i < 5; i++) {
     markerArr[i].title = "Scott";
     markerArr[i].upvotes = 100;
     markerArr[i].downvotes = 20;
  }
}

//TESTING
/*setTimeout(function() {
  dropPinAtUserCurrentLocation();
}, 3000);*/

/*setTimeout(function() {
  getUserCurrentLocation();
}, 5000);*/
