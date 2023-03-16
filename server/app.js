const express = require("express");
const app = express();

var geohash = require('ngeohash');

const axios = require('axios');
const util = require('util');
var spotifyWebApi = require('spotify-web-api-node');
const res = require("express/lib/response");
const SpotifyWebApi = require("spotify-web-api-node");

// Client ID : 657a16b519154096bd1b8e53e8659b8e
// Client Secret : 1dd2a6650aa145cc91ee28251a535a90

//&keyword=USC&segmentId=KZFzniwnSyZfZ7v7nE&radius=10&unit=miles&geoPoint=9q5cs

app.get('/events', (request, response) => {

    console.log(":::: REQUEST QUERY ====> " + request.query)
    
    if(request.query.location == "Current")
    {
        console.log(":::: INSIDE CURRENT LOCATION IF BLOCK :::: " );
        getEventInformation(request)
    }
    else{
        console.log(":::: INSIDE OTHER LOCATION ELSE BLOCK :::: " );
        console.log(":::: REQUEST QUERY LOCATION ====> " + request.query.location)
        var userInputLocation = request.query.location
        var GOOGLE_MAPS_GEOCODING_API = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDIsb56RJSWv3s13xBfukGsVt_VuwO4wOM&address='
        GOOGLE_MAPS_GEOCODING_API += userInputLocation

        axios.get(GOOGLE_MAPS_GEOCODING_API)
             .then(responseGeoData => {
                console.log(":::: GOOGLE API FETCHED LOCATION : ", responseGeoData)

                var latitude = responseGeoData.data["results"][0]["geometry"]["location"]["lat"]
                var longitude = responseGeoData.data["results"][0]["geometry"]["location"]["lng"]

                console.log(":::: LATITUDE - "+ latitude + " :::: LONGITUDE - " + longitude );

                request.query.latitude = latitude;
                request.query.longitude = longitude;

                getEventInformation(request)
             }).catch( error => {
                console.error(error);
                response.header("Access-Control-Allow-Origin", "*");
                response.send(JSON.stringify(''));
                console.log("Geo Response Sent as Null!");
            });
    }

    //Event Search API call
    function getEventInformation(request)
    {
        console.log(request.query.latitude);
        console.log(request.query.longitude);

        console.log(":::: GEOHASH :::  ", geohash.encode(request.query.latitude, request.query.longitude, precision=7));

        var hashCoordinates = geohash.encode(request.query.latitude, request.query.longitude, precision=7);

        var TICKETMASTER_URL_PATH = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=xA2tBAPVCATlPhDfWMeAOSXAG3ZDr4zR&sort=date,asc';

        var segmentId = '';

        //-------
        request.query.category = 'Music';

        if (request.query.category != "Default")
        {
            if (request.query.category == "Music")
            {
                segmentId = "KZFzniwnSyZfZ7v7nJ"
            }
            else if (request.query.category == "Sports")
            {
                segmentId = "KZFzniwnSyZfZ7v7nE"
            }
            if (request.query.category == "ArtsTheatre")
            {
                segmentId = "KZFzniwnSyZfZ7v7na"
            }
            else if (request.query.category == "Film")
            {
                segmentId = "KZFzniwnSyZfZ7v7nn"
            }
            else if (request.query.category == "Miscellaneous")
            {
                segmentId = "KZFzniwnSyZfZ7v7n1"
            }
        }

        var keyword = request.query.keyword;
        var radius = request.query.distance;
        var geoPoint = hashCoordinates;

        console.log(":::: Keyword : ", keyword);
        console.log(":::: Radius : ", radius);        
        console.log(":::: geoPoint : ", hashCoordinates);

        TICKETMASTER_URL_PATH += "&keyword=" + keyword;
        TICKETMASTER_URL_PATH += "&segmentId=" + segmentId;
        TICKETMASTER_URL_PATH += "&radius=" + radius;
        TICKETMASTER_URL_PATH += "&unit=miles";
        TICKETMASTER_URL_PATH += "&geoPoint=" + geoPoint;

        // TICKETMASTER_URL_PATH = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=xA2tBAPVCATlPhDfWMeAOSXAG3ZDr4zR&sort=date,asc&keyword=USC&segmentId=KZFzniwnSyZfZ7v7nE&radius=10&unit=miles&geoPoint=9q5cs';
    
        console.log("TICKETMASTER : ", TICKETMASTER_URL_PATH);
        
        axios.get(TICKETMASTER_URL_PATH)
            .then(responseEventData => {
                console.log("TICKET MASTER EVENT DATA: ", responseEventData.data)

                response.header("Access-Control-Allow-Origin", "*");
                response.send(JSON.stringify(responseEventData.data));
                console.log("Event Response Sent!");
                
            })
            .catch( error => {
                console.error(error);
            });
    }
});

//Auto-Complete API call
app.get('/autocomplete', (request, response) => {

    console.log(":::: REQUEST QUERY ====> " + request.query);

    var keyword = request.query.keyword;
    console.log(":::: Keyword : ", keyword)
    axios.get('https://app.ticketmaster.com/discovery/v2/suggest?apikey=xA2tBAPVCATlPhDfWMeAOSXAG3ZDr4zR&keyword=' + keyword)
         .then(result => {
            response.header("Access-Control-Allow-Origin", "*");
            response.send(JSON.stringify(result.data._embedded));
            console.log("Auto-complete Response Sent!");
         })
         .catch(err =>{
            console.log(err);
         });
});


//Search Artist Spotify API call
app.get('/spotify', (request, response) => {

    console.log(":::: REQUEST QUERY ====> " + request.query.artist);

    var SPOTIFY_API_CALL = new SpotifyWebApi({
        clientId: '657a16b519154096bd1b8e53e8659b8e',
        clientSecret: '1dd2a6650aa145cc91ee28251a535a90'
    });

    SPOTIFY_API_CALL.clientCredentialsGrant()
        .then(
                function(data)
                {
                    console.log("Access Token : " + data.body['access_token']);

                    SPOTIFY_API_CALL.setAccessToken(data.body['access_token']);

                    SPOTIFY_API_CALL.searchArtists(request.query['artist'])
                        .then(
                            function(data)
                            {
                                console.log(":: ARTISTS :: " + data.body);

                                response.header("Access-Control-Allow-Origin", "*");
                                response.send(JSON.stringify(data.body));
                                console.log("Spotify Artists Response Sent!");
                            },

                            function(error)
                            {
                                console.log("Error Message when fetching Spotify API : " + error);
                            }
                        );
                },

                function(error)
                {
                    console.log("Error Message when fetching Spotify API : " + error);
                }

);
});

// Event Details API call
app.get('/eventDetails', (request, response) => {

    console.log(":::: REQUEST QUERY ====> " + request.query);
    console.log(":::: EVENT ID ====> " + request.query.id);

    axios.get('https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=xA2tBAPVCATlPhDfWMeAOSXAG3ZDr4zR&id=' + request.query.id)
         .then(result => {
            console.log("RESULT FOR EVENT DETAILS ::: "+ result);
            response.header("Access-Control-Allow-Origin", "*");

            if(result.data.hasOwnProperty("_embedded"))
            {
                console.log("RESULT DATA : " + result.data)
                response.send(JSON.stringify(result.data));
            }
            else
            {
                console.log("_embedded property not found for Event Details! Sending empty response.");
                response.send(JSON.stringify({}));
            }
            console.log("Event details Response Sent!");
         })
         .catch(err => {
            console.log("Error Message : " + err);
         })
})

// Venue Details API call
app.get('/venueDetail', (request, response) => {

    console.log(":::: REQUEST QUERY ====> " + request.query);
    console.log(":::: KEYWORD ====> " + request.query.keyword);

    axios.get('https://app.ticketmaster.com/discovery/v2/venues?apikey=xA2tBAPVCATlPhDfWMeAOSXAG3ZDr4zR&keyword=' + request.query.keyword)
         .then(result => {
            console.log(result);
            response.header("Access-Control-Allow-Origin", "*");

            if(result.data.hasOwnProperty("_embedded"))
            {
                response.send(JSON.stringify(result.data._embedded));
            }
            else
            {
                console.log("_embedded property not found for Venue! Sending empty response.");
                response.send(JSON.stringify({}));
            }
            console.log("Venue details Response Sent!");
         })
         .catch(err => {
            console.log("Error Message : " + err);
         })
})


app.listen(3000, (req, res) => {
    console.log("Express API is running on Port 3000!");
})
