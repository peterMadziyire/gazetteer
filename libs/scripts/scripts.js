//starter variables
var latlng;
var genPopup; 
var border;
var flag;
var myMarker;
var cityMarker;
var camMarker;
var circle;
var holDate;
var dateFormat;
var cams= L.markerClusterGroup();
var cities = L.markerClusterGroup();
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


var camIcon = L.AwesomeMarkers.icon(
  {icon: 'video', 
  prefix: 'fa', 
  markerColor: 'orange', 
  iconColor: 'yellow',
  
});

var majorCityIcon = L.AwesomeMarkers.icon(
  {icon: 'city', 
  prefix: 'fa', 
  markerColor: 'red', 
  iconColor: 'white',
  
});


var testDate = moment('2021-10-01');
var time= testDate.format('dddd Do MMMM YYYY');


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
        
  var yValues=[          
  Number(arg.travelBrief.weather.january).toFixed(2),
  Number(arg.travelBrief.weather.february).toFixed(2),
  Number(arg.travelBrief.weather.march).toFixed(2),
  Number(arg.travelBrief.weather.april).toFixed(2),
  Number(arg.travelBrief.weather.may).toFixed(2),
  Number(arg.travelBrief.weather.june).toFixed(2),
  Number(arg.travelBrief.weather.july).toFixed(2),
  Number(arg.travelBrief.weather.august).toFixed(2),
  Number(arg.travelBrief.weather.september).toFixed(2),
  Number(arg.travelBrief.weather.october).toFixed(2),
  Number(arg.travelBrief.weather.november).toFixed(2),
  Number(arg.travelBrief.weather.december).toFixed(2)]

      
  var xValues = ["January","February","March","April","May","June","July","August","September","October","November","December"];


  new Chart("myChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [{
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(0,0,255,1.0)",
        borderColor: "rgba(0,0,255,0.1)",
        data: yValues,
        legend: {
          position: 'top',
        },
      }]
    },
    options: {
      legend: {display: false},
      title: {
        display: true,
        text: "Monthly Average Temperature °C"
      }
    }
  });

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

// Populate Public Holidays
if(arg.pubHols.length>0){
  var row;

arg.pubHols.forEach(function(hols){
  holDate = moment(hols.date);
  dateFormat= holDate.format('dddd, Do MMMM , YYYY');

  

  row+="<tr><td>"+hols.name+ "</td>" + "<td>" +dateFormat+ "</td> </tr>"



}) }else{
  
  row="<tr><td colspan='2' scope='2'>No Data Available</td></tr>"
  console.log("No data for this")}

$("#publicHolidays").find("tBody").html(row)

  // Populate latest News
  if (arg.news=="N/A") {
    $(".firstNewsImage").attr("src", "");
    $(".firstNewsTitle").html(" ");
    $(".firstNewsDescription").html(
      "News not available for this country."
    );
    $(".firstNewsSource").html("N/A.");
    $(".firstNewsUrl").attr("href", "");

    $(".secondNewsImage").attr("src", "");
    $(".secondNewsTitle").html(" ");
    $(".secondNewsDescription").html(
      "News not available for this country."
    );
    $(".secondNewsSource").html("N/A.");
    $(".secondNewsUrl").attr("href", "");

    $(".thirdNewsImage").attr("src", "");
    $(".thirdNewsTitle").html(" ");
    $(".thirdNewsDescription").html(
      "News not available for this country."
    );
    $(".thirdNewsSource").html("N/A.");
    $(".thirdNewsUrl").attr("href", "");

    $(".fourthNewsImage").attr("src", "");
    $(".fourthNewsTitle").html(" ");
    $(".fourthNewsDescription").html(
      "News not available for this country."
    );
    $(".fourthNewsSource").html("N/A.");
    $(".fourthNewsUrl").attr("href", "");

    $(".fifthNewsImage").attr("src", "");
    $(".fifthNewsTitle").html(" ");
    $(".fifthNewsDescription").html(
      "News not available for this country."
    );
    $(".fifthNewsSource").html("N/A.");
    $(".fifthNewsUrl").attr("href", "");
  } else {
    $(".firstNewsImage").attr("src", arg["news"]["firstImageUrl"]);
    $(".firstNewsUrl").attr("href", arg["news"]["firstUrl"]);
    $(".firstNewsTitle").html(arg["news"]["firstTitle"]);
    $(".firstNewsDescription").html(arg["news"]["firstDescription"]);
    $(".firstNewsSource").html(arg["news"]["firstSource"]);

    $(".secondNewsImage").attr("src", arg["news"]["secondImageUrl"]);
    $(".secondNewsUrl").attr("href", arg["news"]["secondUrl"]);
    $(".secondNewsTitle").html(arg["news"]["secondTitle"]);
    $(".secondNewsDescription").html(
      arg["news"]["secondDescription"]
    );
    $(".secondNewsSource").html(arg["news"]["secondSource"]);

    $(".thirdNewsImage").attr("src", arg["news"]["thirdImageUrl"]);
    $(".thirdNewsUrl").attr("href", arg["news"]["thirdUrl"]);
    $(".thirdNewsTitle").html(arg["news"]["thirdTitle"]);
    $(".thirdNewsDescription").html(arg["news"]["thirdDescription"]);
    $(".thirdNewsSource").html(arg["news"]["thirdSource"]);

    $(".fourthNewsImage").attr("src", arg["news"]["fourthImageUrl"]);
    $(".fourthNewsUrl").attr("href", arg["news"]["fourthUrl"]);
    $(".fourthNewsTitle").html(arg["news"]["fourthTitle"]);
    $(".fourthNewsDescription").html(
      arg["news"]["fourthDescription"]
    );
    $(".fourthNewsSource").html(arg["news"]["fourthSource"]);

    $(".fifthNewsImage").attr("src", arg["news"]["fifthImageUrl"]);
    $(".fifthNewsUrl").attr("href", arg["news"]["fifthUrl"]);
    $(".fifthNewsTitle").html(arg["news"]["fifthTitle"]);
    $(".fifthNewsDescription").html(arg["news"]["fifthDescription"]);
    $(".fifthNewsSource").html(arg["news"]["fifthSource"]);
  }



 }
      


//Component on mount



$(window).on("load",()=>{

 //show loader before component mounts
 
  $(".loader_container").show();

  
  //Get current location
 

  const successCallback = (position) => {

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
        console.log(thisresult)

        $("#choose").text(thisresult.geoName.countryName);
        if(thisresult.status.name=="ok"){

          $(".loader_container").fadeOut(2000);
          modalData(thisresult)

         

       


        }

        
        

        //create flag variable to save src link
          
          flag= `https://www.countryflags.io/${thisresult.geoName.iso2}/shiny/64.png`;
          

       
           
          // Add country border 

               if (myMap.hasLayer(border)) {
            myMap.removeLayer(border);
          }
    
          border = L.geoJSON(thisresult["border"], {
            style: function (feature) {
              return { color: "salmon" };
            },
          }).addTo(myMap);
    
         
          myMap.fitBounds(border.getBounds())
          
  


      
          // Add Major City markers  
              cities.eachLayer(function (layer) {
                cities.removeLayer(layer);
              });
        
              if(thisresult.cityData!=null){
                thisresult.cityData.forEach(city => {
                  
                           
                cityMarker=L.marker([city.latitude, city.longitude], {
                  icon: majorCityIcon,
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


              // add webcam markers
              cams.eachLayer(function (layer) {
                cams.removeLayer(layer);
              });


              if(thisresult.webCams.result.webcams!=null){

                console.log(thisresult.webCams.result.webcams)
                thisresult.webCams.result.webcams.forEach(cam => {
                  
                 

                  camMarker = L.marker([cam.location.latitude, cam.location.longitude], {
                    icon: camIcon
                }).bindPopup(`<b><a href="https://api.lookr.com/embed/player/${cam.id}/day"  onclick="window.open('https://api.lookr.com/embed/player/${cam.id}/day','popup','width=600,height=600,scrollbars=no,resizable=no'); return false;"><img src=${cam.image.daylight.thumbnail}></b>`);

                cams.addLayer(camMarker).addTo(myMap); 
               
                })
              
              }else{console.log("No Significant WebCams")}
            

  


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
  }

  const errorCallback = (error) => {
    console.log("Unable to retrieve your location");

    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    }
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
    enableHighAccuracy: true,
  });



//end of geoloc

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
console.log(thisresult)
        
        modalData(thisresult);
        $(".loader_container").fadeOut(2000);
        $(".loader").fadeOut(2000);

      // }

  

     
    

      latlng= new L.LatLng(thisresult.openCage.lat, thisresult.openCage.lng)

      flag= `https://www.countryflags.io/${thisresult.geoName.iso2}/shiny/64.png`;
           



      // Add Major City markers  
      cities.eachLayer(function (layer) {
        cities.removeLayer(layer);
      });

      if(thisresult.cityData!=null){
        thisresult.cityData.forEach(city => {
          
     
         cityMarker=L.marker([city.latitude, city.longitude], {
          icon: majorCityIcon,
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
      
    // add webcam markers
    cams.eachLayer(function (layer) {
      cams.removeLayer(layer);
    });


    if(thisresult.webCams.result.webcams!=null){

      console.log(thisresult.webCams.result.webcams)
      thisresult.webCams.result.webcams.forEach(cam => {
        
       

        camMarker = L.marker([cam.location.latitude, cam.location.longitude], {
          icon: camIcon
      }).bindPopup(`<b><a href="https://api.lookr.com/embed/player/${cam.id}/day"  onclick="window.open('https://api.lookr.com/embed/player/${cam.id}/day','popup','width=600,height=600,scrollbars=no,resizable=no'); return false;"><img src=${cam.image.daylight.thumbnail}></b>`);

      cams.addLayer(camMarker).addTo(myMap); 
     
      })
    
    }else{console.log("No Significant WebCams")}
  




         // Add country border 


if (myMap.hasLayer(border)) {
  myMap.removeLayer(border);
}

border = L.geoJSON(thisresult["border"], {
  style: function (feature) {
    return { color: "red" };
  },
}).addTo(myMap);


myMap.fitBounds(border.getBounds())



      }

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
        "Web Cams": cams
 
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


L.easyButton(
  "<i class='far fa-calendar-check'></i>",
  function () {
    $("#publicHolidays").modal("toggle");
  },
  "Public Holidays"
).addTo(myMap);

L.easyButton(
  "<i class='fas fa-newspaper'></i>",
  function () {
    $("#latestNews").modal("toggle");
  },
  "News"
).addTo(myMap);
