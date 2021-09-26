<?php

//Geonames API 




ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    // Initialize cURL

    $url= "http://api.geonames.org/countryInfoJSON?country=".$_REQUEST['iso2']."&username=petertm";

    $ch= curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    // Store the data
    $geoData = curl_exec($ch);
    
    // End the cURL
    curl_close($ch);

    // Decode JSON response
    $rc_code = json_decode($geoData, true);
    $geoName['iso2'] = $rc_code['geonames'][0]['countryCode'];
    $geoName['iso3'] = $rc_code['geonames'][0]['isoAlpha3'];
    $geoName['areaInSqKm'] = $rc_code['geonames'][0]['areaInSqKm'];
    $geoName['continentName'] = $rc_code['geonames'][0]['continentName'];
    $geoName['countryName'] = $rc_code['geonames'][0]['countryName'];
    $geoName['north'] = $rc_code['geonames'][0]['north'];
    $geoName['population'] = $rc_code['geonames'][0]['population'];
    $geoName['south'] = $rc_code['geonames'][0]['south'];
    $geoName['west'] = $rc_code['geonames'][0]['west'];
    $geoName['capital'] = $rc_code['geonames'][0]['capital'];
    $geoName['east'] = $rc_code['geonames'][0]['east'];

    
    //Country Borders API

    $geoJSON = json_decode(file_get_contents("../json/countryBorders.geo.json"), true);
    $geoJsonCountries = $geoJSON['features'];
    $countryBorder = null;
   

    foreach($geoJsonCountries as $country){
        if($country['properties']['iso_a3'] == $geoName['iso3']){
            $countryBorder = $country['geometry'];
            $latBorder = $country['properties'];
            $lngBorder = $country['properties'];
        break;
        }
    }

    //Open Cage Api

    // Initialize cURL

    $url = "https://api.opencagedata.com/geocode/v1/json?q=".  $geoName['iso2'] ."&key=200a79aaae3747c6ade4bd658a9800e9";
    

    $ch= curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    // Store the data
    $countryData = curl_exec($ch);
    
    // End the cURL
    curl_close($ch);

    // Decode JSON response
    $openCage = json_decode($countryData, true);

    $openCageCode['lat']= $openCage['results'][0]['geometry']['lat'];
    $openCageCode['lng']= $openCage['results'][0]['geometry']['lng'];


  

   



//--------------------------Open Weather-----------------------------

// Initialize URL

$url= "api.openweathermap.org/data/2.5/weather?lat=". $openCageCode['lat']."&lon=".$openCageCode['lng']."&units=metric&appid=9c3343f9f61590108b1990b9d4e90bb4";

$ch= curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

// Store the data
$weatherData = curl_exec($ch);

// End the cURL
curl_close($ch);

// Decode JSON response
$ow_code = json_decode($weatherData, true);
$openWeather['clouds'] = $ow_code['clouds']['all'];
$openWeather['windSpeed'] = $ow_code['wind']['speed'];
$openWeather['main'] = $ow_code['weather'][0]['main'];
$openWeather['humidity'] = $ow_code['main']['humidity'];
$openWeather['description'] = $ow_code['weather'][0]['description'];
$openWeather['pressure'] = $ow_code['main']['pressure'];
$openWeather['icon'] = 'http://openweathermap.org/img/wn/' . $ow_code['weather'][0]['icon'] . '@2x.png';
$openWeather['feelsLike'] = $ow_code['main']['feels_like'];
$openWeather['min'] = $ow_code['main']['temp_min'];
$openWeather['max'] = $ow_code['main']['temp_max'];




//---------------Corvid Stats Api--------------

// //Initialise cURL
$ch3 = curl_init("https://covid-19-data.p.rapidapi.com/country/code?format=json&code=" . $geoName['iso2']);

// Set cURL options
curl_setopt_array($ch3, array(
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_SSL_VERIFYHOST => false,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_HTTPHEADER => array(
   "x-rapidapi-host: covid-19-data.p.rapidapi.com",
"x-rapidapi-key: c5938c321emsh089ccac416fe021p1c16c3jsnc162b790f31d"
    ),
));

// Store data and error codes
$coronaData = curl_exec($ch3);

// End the cURL
curl_close($ch3);

// Decode JSON response
$corona = json_decode($coronaData, true);
$coronaCases['confirmed'] = $corona[0]['confirmed'];
$coronaCases['deaths'] = $corona[0]['deaths'];
$coronaCases['recovered'] = $corona[0]['recovered'];
$coronaCases['critical'] = $corona[0]['critical'];




// // //---------------------Travel Brief API--------------------------

// Initialize cURL

$url= "https://travelbriefing.org/". $geoName['iso3']. "?format=json";

    $ch= curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    // Store the data
    $tbData = curl_exec($ch);
    
    // End the cURL
    curl_close($ch);

    // Decode JSON response
    $tb_code = json_decode($tbData, true);
    $travel_Brief['currency_code']= $tb_code['currency']['code'];
    $travel_Brief['currency_symbol']= $tb_code['currency']['symbol'];
    $travel_Brief['rateVSdollar']= $tb_code['currency']['rate'];
    $travel_Brief['currency_name']= $tb_code['currency']['name'];
    $travel_Brief['drinkingWater']= $tb_code['water']['short'];
    $travel_Brief['time_zone']= $tb_code['timezone']['name'];
    $travel_Brief['telephone']= $tb_code['telephone']['calling_code'];
    $travel_Brief['weather']['january']= $tb_code['weather']['January']['tAvg'];
    $travel_Brief['weather']['february']= $tb_code['weather']['February']['tAvg'];
    $travel_Brief['weather']['march']= $tb_code['weather']['March']['tAvg'];
    $travel_Brief['weather']['april']= $tb_code['weather']['April']['tAvg'];
    $travel_Brief['weather']['may']= $tb_code['weather']['May']['tAvg'];
    $travel_Brief['weather']['june']= $tb_code['weather']['June']['tAvg'];
    $travel_Brief['weather']['july']= $tb_code['weather']['July']['tAvg'];
    $travel_Brief['weather']['august']= $tb_code['weather']['August']['tAvg'];
    $travel_Brief['weather']['september']= $tb_code['weather']['September']['tAvg'];
    $travel_Brief['weather']['october']= $tb_code['weather']['October']['tAvg'];
    $travel_Brief['weather']['november']= $tb_code['weather']['November']['tAvg'];
    $travel_Brief['weather']['december']= $tb_code['weather']['December']['tAvg'];


//  //--------------------------cities API




$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://geo-services-by-mvpc-com.p.rapidapi.com/cities/significant?sort=population%2Cdesc&language=en&countrycode=". $geoName['iso2']."&pourcent=0.05&limit=10",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"x-rapidapi-host: geo-services-by-mvpc-com.p.rapidapi.com",
		"x-rapidapi-key: c5938c321emsh089ccac416fe021p1c16c3jsnc162b790f31d"
	],
]);

$c_response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

$cityData = json_decode($c_response, true);
 
 

//Initialize Curl

$url = "http://api.aviationstack.com/v1/flights?flight_status=active&access_key=a671a76d7c4fceffa598928515d5f389&limit=100";
    

    $ch= curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    // Store the data
    $allFlights = curl_exec($ch);
    
    // End the cURL
    curl_close($ch);

    // Decode JSON response
    $flightFata = json_decode($allFlights, true);

    $flightArray= [];

    foreach($flightFata['data'] as $flight){
        if($flight['live']!=null){
        
        array_push($flightArray, $flight);
       
        }
    }
   



     $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['geoName']= $geoName;
    $output['openCage']= $openCageCode;
    $output['border'] = $countryBorder;
    $output['openWeatherData']= $openWeather;
    $output['coronaStats']= $coronaCases;
    $output['travelBrief']= $travel_Brief;
    $output['cityData']= $cityData['data'];
    $output['flightData']= $flightArray;
    
    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);







?>