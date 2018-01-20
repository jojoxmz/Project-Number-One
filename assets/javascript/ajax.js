// Creating our ajax call for yelp API

function testSearchTerm(searchTerm) {

  const client_id = 'UBoDtdxOKSgJELPqsAtwag';
  const client_secret = 'DluMc4r2kSvoSRdksiaNDNqkXiA9fFJKRPPWFruza63FtNGeRJrYaqCIN3StcVNZ';
  const corsHeroku = 'https://cors-anywhere.herokuapp.com/';

    var regEx = /[-'":]/g

    fetch(`${corsHeroku}https://api.yelp.com/oauth2/token?client_id=${client_id}&client_secret=${client_secret}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ grant_type: 'client_credentials' })
    })
    .then((response) => response.json())
    .then((responseJSON) => responseJSON.access_token)
    .then((accessToken) => {
      fetch(corsHeroku + "https://api.yelp.com/v3/businesses/search?term=" + searchTerm + "&categories=foodtrucks&latitude=39.742043&longitude=-104.991531", {
        method: 'GET',
        headers: {
          'authorization': `Bearer ${accessToken}`,
        }
      })
      .then(response =>  response.json())
      .then(response => {
        console.log(searchTerm);
        console.log(response);


      console.log(response.businesses.length)
       console.log(response.businesses[1])

      if(response.businesses.length == 0) {
         $("#noFoodTruckFound").show();
         $("#search-term").val("");
         return false;
       } else if (response.businesses.length > 0) {
         for(var i = 0; i < response.businesses.length; i++) {
           if((response.businesses[i].name).toUpperCase().replace(regEx, '') == searchTerm.toUpperCase().replace(regEx, '')) {
             return true;
           } else {
             $("#noFoodTruckFound").show();
             $("#search-term").val("");
             return false;
           }
         }
       }
     });
    });
});
