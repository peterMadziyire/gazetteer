//starter variables
var latlng;
var genPopup; 
var border;
var flag;
var myMarker;
var cityMarker;
var flightMarker;
var cities = L.featureGroup();
var flights= L.featureGroup();
var cityIcon = L.icon({
  iconUrl: "libs/src/images/courthouse.png",
  iconSize: [20, 20],
  iconAnchor: [20, 20],
});
var locationIcon = L.icon({
  iconUrl: "libs/src/images/map.png",
  iconSize: [35, 35],
  iconAnchor: [25, 25],
});

var flightIcon = L.icon({
  iconUrl: "libs/src/images/airplane.png",
  iconSize: [20, 20],
  iconAnchor: [20, 20],
});

//-----------------reusable functions-------------------------
 function modalData(arg){

          //Populate Modal Country Info
          $(".countryName").html(arg.geoName.countryName);
          $(".capitalCity").html(arg.geoName.capital);
          $(".continentName").html(arg.geoName.continentName);
          $(".population").html(parseFloat(arg.geoName.population).toLocaleString().replace(/\.([0-9])$/, ".$10"));
          $(".areask").html(parseFloat(arg.geoName.areaInSqKm).toLocaleString().replace(/\.([0-9])$/, ".$10"));
          $(".telCode").html("+" + arg.travelBrief.telephone);
          $(".water").html(arg.travelBrief.drinkingWater);

          //Populate Modal Weather Info
          $(".current").html(Number(arg.openWeatherData.feelsLike).toFixed(2) + "&deg;C")
          $(".jan").html(Number(arg.travelBrief.weather.january).toFixed(2)  + "&deg;C");
          $(".feb").html(Number(arg.travelBrief.weather.february).toFixed(2) + "&deg;C");
          $(".march").html(Number(arg.travelBrief.weather.march).toFixed(2) + "&deg;C");
          $(".april").html(Number(arg.travelBrief.weather.april).toFixed(2) + "&deg;C");
          $(".may").html(Number(arg.travelBrief.weather.may).toFixed(2) + "&deg;C");
          $(".june").html(Number(arg.travelBrief.weather.june).toFixed(2) + "&deg;C");
          $(".july").html(Number(arg.travelBrief.weather.july).toFixed(2) + "&deg;C");
          $(".aug").html(Number(arg.travelBrief.weather.august).toFixed(2) + "&deg;C");
          $(".sept").html(Number(arg.travelBrief.weather.september).toFixed(2) + "&deg;C");
          $(".oct").html(Number(arg.travelBrief.weather.october).toFixed(2) + "&deg;C");
          $(".nov").html(Number(arg.travelBrief.weather.november).toFixed(2) + "&deg;C");
          $(".dec").html(Number(arg.travelBrief.weather.december).toFixed(2) + "&deg;C");

          //Populate Modal Currency Info

          $(".currencyName").html(arg.travelBrief.currency_name);
          $(".usd").html(Number(arg.travelBrief.rateVSdollar));
          $(".currencyCode").html(arg.travelBrief.currency_code);
          $(".symbol").html(arg.travelBrief.currency_symbol);

          //Populate Modal Covid Info
          $(".confirmed").html(parseFloat(arg.coronaStats.confirmed).toLocaleString().replace(/\.([0-9])$/, ".$10"));
          $(".critical").html(parseFloat(arg.coronaStats.critical).toLocaleString().replace(/\.([0-9])$/, ".$10"));
          $(".deaths").html(parseFloat(arg.coronaStats.deaths).toLocaleString().replace(/\.([0-9])$/, ".$10"));
          $(".recovered").html(parseFloat(arg.coronaStats.recovered).toLocaleString().replace(/\.([0-9])$/, ".$10"));

 }
      
      
//Component on mount



$(window).on("load",()=>{

 //show loader before component mounts
 
  $(".loader_container").show();

  //Get current location
 
navigator.geolocation.getCurrentPosition((position)=>{
var latitude= position.coords.latitude;
var longitude= position.coords.longitude;

//set variable latlng as the users coordinates using the geolocation function
latlng= new L.LatLng(latitude, longitude)
   

//Use Ajax to to call OpenCage API so that you can find your current location

    $.ajax({
      url: "libs/php/openCageInfo.php",
      type: "POST",
      dataType: "json",
      data: {
        lat: latitude,
        lng: longitude
      },
      success: function (results) {
        
        
      myMarker= L.marker([latitude, longitude]).bindPopup("<div>You are here!</div>").addTo(myMap);

      myMap.panTo(latlng);
    
      var iss2= results.data.iso2;
     
      
         // get All country data so that you can populate the popups and modals

         
         $.ajax({
          url: "libs/php/getData.php",
          type: "POST",
          dataType: "json",
          data: {
            iso2: iss2,
            
          },
          success: function (thisresult) {
        //if API call is successful fadeout the loader and populate modals
        if(thisresult.status.name=="ok"){

          $(".loader_container").fadeOut(2000);
          modalData(thisresult)

        }

        //create flag variable to save src link
          
          flag= `https://www.countryflags.io/${thisresult.geoName.iso2}/shiny/64.png`;
          

        //format initial leaflet poppup
            var genPopup = L.popup({className: 'gen'}).setContent(
              "<table>" +
                    "<tr>" +
                        "<td colspan='2' id='space'>" + "<div class='text-center' ><img class='flags' src=" + flag + "></div></td>" + 
                    "</tr>" +
                    "<tr>" +
                        "<td colspan='2' id='space' class='text-center'>" + "<b> " + thisresult.geoName.countryName +  " (" + thisresult.geoName.iso2 + ")" + " </b>" + "</td>" + 
                    "</tr>" + 
                   
                    "<tr>" +
                        "<td class='right'> Capital: </td>" + 
                        "<td class='left'>" + thisresult.geoName.capital + "</td>" +
                    "</tr>" + 
    
                    "<tr>" + 
                        "<td class='right'> CurrentWeather: </td>"  + 
                        "<td class='left'>" + thisresult.openWeatherData.feelsLike + " &#8451;" +
                    "</tr>" + 
                  
                    "<tr>" + 
                        "<td class='right'> TimeZone: </td>"  + 
                        "<td class='left'> " + thisresult.travelBrief.time_zone + "</td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td class='right'> Currency: </td>"  + 
                        "<td class='left'>" + thisresult.travelBrief.currency_code + " "+ thisresult.travelBrief.currency_symbol+"</td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td class='right'> Rate to $USD: </td>" + 
                        "<td class='left'>" + Number(thisresult.travelBrief.rateVSdollar).toLocaleString("en") + "</td>" +
                    "</tr>" + 
                    "<tr>" +
                        "<td class='right'> Drinking Water: </td>" + 
                        "<td class='left'> +" + thisresult.travelBrief.drinkingWater + "</td>" +
                    "</tr>" +
                    
                "</table>"


            ).setLatLng(latlng);  


           
          // Add country border 

               if (myMap.hasLayer(border)) {
            myMap.removeLayer(border);
          }
    
          border = L.geoJSON(thisresult["border"], {
            style: function (feature) {
              return { color: "#C850C0" };
            },
          }).addTo(myMap);
    
         
          myMap.fitBounds(border.getBounds()).openPopup(genPopup);


      
          // Add Major City markers  
              cities.eachLayer(function (layer) {
                cities.removeLayer(layer);
              });
        
              if(thisresult.cityData!=null){
                thisresult.cityData.forEach(city => {
                  
                  cityMarker=L.marker([city.latitude, city.longitude], {
                    icon: cityIcon,
                  }).bindPopup( "<table>" +
                  "<tr>" +
                      "<td colspan='2' id='space' class='text-center'>" + "<b> " + city.name +  " </b>" + "</td>" + 
                  "</tr>" + 
                 
                  "<tr>" +
                      "<td class='right'> Population: </td>" + 
                      "<td class='left'>" + Number(city.population).toLocaleString("en") + "</td>" +
                  "</tr>" + 
  
                  "<tr>" + 
                      "<td class='right'> Time Zone: </td>"  + 
                      "<td class='left'>" + city.timezone +
                  "</tr>" + 
                
                  
              "</table>");
                  
                  cities.addLayer(cityMarker).addTo(myMap); 
        
                });
                
                
              }else{console.log("No Significant Cities")}  
              
           
              //add flight markers

        flights.eachLayer(function(layer){
          flights.removeLayer(layer);
   })

  
      
   if(thisresult.flightData!=null){
    thisresult.flightData.forEach(flight => {
      
      flightMarker=L.marker([flight.live.latitude, flight.live.longitude], {
        icon: flightIcon,
      }).bindPopup("<table>" +
      "<tr>" +
          "<td colspan='2' id='space'>" + "<div class='text-center' >"+ flight.airline.name +"</div></td>" + 
      "</tr>" +
      "<tr>" +
          "<td colspan='2' id='space' class='text-center'>" + "<b> " + flight.aircraft.registration +  " </b>" + "</td>" + 
      "</tr>" + 
     
      "<tr>" +
          "<td class='right'> Departure Airport: </td>" + 
          "<td class='left'>" + flight.departure.airport + "</td>" +
      "</tr>" + 

      "<tr>" + 
          "<td class='right'> Departure Time: </td>"  + 
          "<td class='left'>" + flight.departure.scheduled +
      "</tr>" + 
    
      "<tr>" + 
          "<td class='right'> Arrival Airport: </td>"  + 
          "<td class='left'> " + flight.arrival.airport + "</td>" +
      "</tr>" +
      "<tr>" +
          "<td class='right'> Est. Arrival Time: </td>"  + 
          "<td class='left'>" + flight.arrival.estimated + "</td>" +
      "</tr>" +
      
      
  "</table>")
    
      flights.addLayer(flightMarker).addTo(myMap); 

    });
    
    
  }else{console.log("No Significant Cities")} 




          },
      
          error: function (request, status, error) {
            console.log(error);
          }
      
        })

         
        
  
             // Get selectbox data
  $.ajax({
    url: "libs/php/selectData.php",
    type: "POST",
    dataType: "json",
    success: function (result) {

      
      $.each(result.data, function (index) {
        $("#selectCountry").append(
          $("<option>", {
            value: result.data[index].iso2,
            text: result.data[index].name,
          })
        );
      });
     

    },
    error: function (request, status, error) {
      console.log(error);
    },
  });


      },
      error: function (request, status, error) {
        console.log(error);
      },
    });


   });

})

//Select a country to retrieve information

$(document).ready(() => {

$("#selectCountry").change(function () {
  $(".loader_container").show();
  $(".loader").show();

  var destination= $("#selectCountry").val();

// Call API to to get country info

  $.ajax({
    url: "libs/php/getData.php",
    type: "POST",
    dataType: "json",
    data: {
      iso2: destination,
      
    },
    success: function (thisresult) {
     
      //if api call is successful fadeout loader and populate data into modals and popups

      if(thisresult.status.name=="ok"){

        
        modalData(thisresult);
        $(".loader_container").fadeOut(2000);
        $(".loader").fadeOut(2000);

      }

  

     
    

      latlng= new L.LatLng(thisresult.openCage.lat, thisresult.openCage.lng)

      flag= `https://www.countryflags.io/${thisresult.geoName.iso2}/shiny/64.png`;
           


            var genPopup = L.popup({className: 'gen'}).setContent(
              "<table>" +
                    "<tr>" +
                        "<td colspan='2' id='space'>" + "<div class='text-center' ><img class='flags' src=" + flag + "></div></td>" + 
                    "</tr>" +
                    "<tr>" +
                        "<td colspan='2' id='space' class='text-center'>" + "<b> " + thisresult.geoName.countryName +  " (" + thisresult.geoName.iso2 + ")" + " </b>" + "</td>" + 
                    "</tr>" + 
                   
                    "<tr>" +
                        "<td class='right'> Capital: </td>" + 
                        "<td class='left'>" + thisresult.geoName.capital + "</td>" +
                    "</tr>" + 
    
                    "<tr>" + 
                        "<td class='right'> CurrentWeather: </td>"  + 
                        "<td class='left'>" + thisresult.openWeatherData.feelsLike + " &#8451;" +
                    "</tr>" + 
                  
                    "<tr>" + 
                        "<td class='right'> TimeZone: </td>"  + 
                        "<td class='left'> " + thisresult.travelBrief.time_zone + "</td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td class='right'> Currency: </td>"  + 
                        "<td class='left'>" + thisresult.travelBrief.currency_code + " "+ thisresult.travelBrief.currency_symbol+"</td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td class='right'> Rate to $USD: </td>" + 
                        "<td class='left'>" + Number(thisresult.travelBrief.rateVSdollar).toLocaleString("en") + "</td>" +
                    "</tr>" + 
                    "<tr>" +
                        "<td class='right'> Drinking Water: </td>" + 
                        "<td class='left'> +" + thisresult.travelBrief.drinkingWater + "</td>" +
                    "</tr>" +
                    
                "</table>"


            ).setLatLng(latlng);  

      // Add Major City markers  

      cities.eachLayer(function (layer) {
        cities.removeLayer(layer);
      });

      if(thisresult.cityData!=null){
        thisresult.cityData.forEach(city => {
          
          cityMarker=L.marker([city.latitude, city.longitude], {
            icon: cityIcon,
          }).bindPopup( "<table>" +
          "<tr>" +
              "<td colspan='2' id='space' class='text-center'>" + "<b> " + city.name +  " </b>" + "</td>" + 
          "</tr>" + 
         
          "<tr>" +
              "<td class='right'> Population: </td>" + 
              "<td class='left'>" + Number(city.population).toLocaleString("en") + "</td>" +
          "</tr>" + 

          "<tr>" + 
              "<td class='right'> Time Zone: </td>"  + 
              "<td class='left'>" + city.timezone +
          "</tr>" + 
        
          
      "</table>");
          
          cities.addLayer(cityMarker).addTo(myMap); 

        });
        
        
      }else{console.log("No Significant Cities")}  
      
   




         // Add country border 


if (myMap.hasLayer(border)) {
  myMap.removeLayer(border);
}

border = L.geoJSON(thisresult["border"], {
  style: function (feature) {
    return { color: "#C850C0" };
  },
}).addTo(myMap);


myMap.fitBounds(border.getBounds()).openPopup(genPopup);



    },

    error: function (request, status, error) {
      console.log(error);
    }

  })


})
})



//Leafleft Variables, tools and structure



var Streets= L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=EgSu4qIPBDv21qTvn3DF', {
attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
});

var Satelite= L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=EgSu4qIPBDv21qTvn3DF',{
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
});



var OpenRailwayMap = L.tileLayer(
  "https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });


  var baseMaps= {
    "Street Map": Streets,
    "Satelite": Satelite
    
    }

  var mapOverlays = {
        "Railway Tracks": OpenRailwayMap,
        "City Checker": cities,
        "Flight Tracker": flights
 
  };

  var myMap= L.map("mapid", {
    center: [0, 0],
    zoom: 6,
    layers: [Streets],
  });
   
L.control.layers(baseMaps, mapOverlays).addTo(myMap)



L.easyButton(
  "<i class='fas fa-info-circle'></i>",
  function () {
    $("#countryInfo").modal("toggle");
  },
  "Country Information"
).addTo(myMap);

L.easyButton(
  "<i class='fas fa-cloud-sun-rain'></i>",
  function () {
    $("#weatherInfo").modal("toggle");
  },
  "Weather Information"
).addTo(myMap);

L.easyButton(
  "<i class='fas fa-dollar-sign'></i>",
  function () {
    $("#currencyInfo").modal("toggle");
  },
  "Currency Information"
).addTo(myMap);



L.easyButton(
  "<i class='fas fa-ambulance'></i>",
  function () {
    $("#covidInfo").modal("toggle");
  },
  "Covid Information"
).addTo(myMap);

