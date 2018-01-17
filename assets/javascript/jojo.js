var userMapInput={lat: 39.710850, lng: -105.081505};

function initMap() {
        var uluru = {lat: 39.742043, lng: -104.991531};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
        var newMarker= new google.maps.Marker({
          position: userMapInput,
          map: map
        });
      };

    var userInputSearch="";
	var queryUrl = "https://api.foursquare.com/v2/venues/explore?client_id=NCFDMIMRBLCB1MNHTEXODLIWB2KWDVQBQ50ZTCYQ3X05N43Y&client_secret=JPMDM31IHWHU35E4EVKGG3BGVYWEZ4DHWHIHDP4YSQFBYSOB&v=20170801&ll=39.742043, -104.991531&query=food truck " + userInputSearch + "&limit=20";

	$.ajax({
		url: queryUrl,
		method: 'GET'
	}).done(function(response) {
		// console.log(response);
		// console.log(response.response.groups[0].items[0].venue);

		var locationsArray= response.response.groups[0].items;
		var newLocationsArray= _.sortBy(locationsArray.)
		console.log(locationsArray);

		for(var i=0; i< locationsArray.length; i++){
			// console.log(locationsArray[i].venue);
		};

	});