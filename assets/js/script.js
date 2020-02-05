// global variable diclarations for Ticketmaster API
var TicketmasterApiKey = "rPPNfm65VyGvXeDMXOhSXr3XsxhUllbU";
var ticketmasterURL;
var musician;
var state;
var city;
var startDate;
var endDate;
// global variable diclarations for Google Map API
var googleMapApiKey = "AIzaSyB5CY7yODBMjjWjHL6QD5QR2F4I3d_1NjM";
var venueMapInfo = [];
var latitude = 0;
var longitude = 0;

var map;
var marker;
var latlng;
var infowindow;
function initMap() {
    latlng = new google.maps.LatLng(latitude, longitude);
    infowindow = new google.maps.InfoWindow();
    // The map, centered at latlng
    map = new google.maps.Map(document.getElementById('mapContent'), {zoom: 17, center: latlng});
    // The marker, positioned at latlng
    marker = new google.maps.Marker({position: latlng, map: map});

    // var request = {
    //     query: document.getElementById("mapHeader").textContent,
    //     fields: ['name', 'geometry'],
    //   };
    
    //   var service = new google.maps.places.PlacesService(map);
    
    //   service.findPlaceFromQuery(request, function(results, status) {
    //     if (status === google.maps.places.PlacesServiceStatus.OK) {
    //       for (var i = 0; i < results.length; i++) {
    //         createMarker(results[i]);
    //       }
    //       map.setCenter(results[0].geometry.location);
    //     }
    //   });
}    

$(document).ready(function() {
    // date/time picker
    $("#dateTime").calendar();

    // search button event handler
    $("#searchBtn").on("click", function(event) {
        // clear the display
        clearDisplay();
        // get the musican's name entered in the input element and assign the value to the variable "musician"
        musician = $("#musicianInput").val();

        // get the city anme entered in the input element and assign the value to the variable "city"
        city = $("#cityInput").val();
        
        // get the state code of the selected state and assign the value to the variable "state"
        state = $("select").val();

        // get the start date (format: 2020-02-01T17:00:00Z)
        //startDate = "2020-02-01T17:00:00Z";
        // get the end date (format: 2020-02-29T22:00:00Z)
        //endDate = "2020-02-29T22:00:00Z";
        // call the function "accessTicketmasterAPI"
        accessTicketmasterAPI();      
    });

    // map button event handler
    $(document).on("click", ".mapBtn", function(event) {
        event.preventDefault();
        event.stopPropagation();    // prevent event bubbling
        // show the modal
        $("#mapModal").modal("show");
        // get which event's map button is clicked
        var dataEvent = parseInt($(this).attr("data-event"));
        // display the venue name in the map modal header
        $("#mapHeader").text(venueMapInfo[dataEvent].name);
        // assign the latitude and longitude of the venue to the variables for the map
        latitude = parseFloat(venueMapInfo[dataEvent].lat);
        longitude = parseFloat(venueMapInfo[dataEvent].lon);
        initMap();
    });

    // event division event handler - open the ticket website in a new tab
    $(document).on("click", ".searchResult", function(event) {
        window.open($(this)[0].children[1].href, '_blank');
    });

    // function to call Ticketmaster API and get the music event data
    function accessTicketmasterAPI() {
        // assign the API call url to the variable "ticketmasterURL"
        ticketmasterURL = "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&countryCode=us&apikey=" + TicketmasterApiKey + "&keyword=" + musician + "&stateCode=" + state + "&city=" + city;
        // ticketmasterURL = "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&countryCode=us&apikey=" + TicketmasterApiKey + "&keyword=" + musician + "&stateCode=" + state + "&city=" + city + "&startDateTime=" + startDate + "&endDateTime= " + endDate;
        console.log(ticketmasterURL);

        $.ajax({
            url: ticketmasterURL,
            method: "GET"
        }).then(function(response) {
            // check if input(s) is(are) valid and event data included in the response.
            if(Object.keys(response)[0] === "_embedded") {
                var eventList = response._embedded.events;
                
                for(var i = 0; i < eventList.length; i++) {
                    var event = eventList[i];
                    // musician's name
                    var musicianName = $("<h2>").addClass("musicianName").text(event.name);

                    // event date and time formatting using Moment.js
                    var momentObj;
                    var isDateTBA = event.dates.start.localDate === undefined;
                    var isTimeTBA = event.dates.start.localTime === undefined;
                  
                    var momentDateTime;
    
                    if(!isDateTBA) {
                        momentObj = moment(event.dates.start.localDate);
                    }

                    if(!isTimeTBA) {
                        var time = event.dates.start.localTime.split(":");
                        momentObj.set({hours: time[0], minutes: time[1]});
                    }
                    
                    if(!isDateTBA ) {
                        if(!isTimeTBA) {
                            momentDateTime = momentObj.format("dddd, MMMM DD, YYYY, hh:mm a");
                        } else {
                            momentDateTime = momentObj.format("dddd, MMMM DD, YYYY,") + " Time:TBA";
                        }
                    } else {
                        if(!isTimeTBA) {
                            momentDateTime = "Date:TBA, " + momentObj.format("hh:mm a");
                        } else {
                            momentDateTime = "Date:TBA, Time:TBA";
                        }
                    }

                    var eventDateTime = $("<h3>").addClass("ui header").text(momentDateTime);
                   
                    var venue = event._embedded.venues[0];
                    
                    // venue's name
                    var venueName = $("<div>").addClass("venueName").text(venue.name);

                    // venue's city
                    var venueCityCountry = $("<div>").text(venue.city.name + ", " + venue.state.stateCode + " , " + venue.country.name);

                    // map button
                    var mapButton = $("<button>").addClass("ui primary button mapBtn").attr({type: "submit", "data-event": i}).text("Map");
                    
                    // event URL
                    var eventURL = $("<a>").attr({href: event.url, target: "_blank"});
                    // create the division "event" and append all to it
                    var eventInfo = $("<div>").addClass("searchResult ui container info ignored message");
                    eventInfo.append(musicianName, eventURL, eventDateTime, venueName, venueCityCountry, mapButton);

                    // venue's url
                    if("outlets" in event) { // if outlet property (contains venue's URL) exists
                        venueURL = $("<a>").attr({href: event.outlets[0].url, target: "_blank"}).text("Venue information");
                        eventInfo.append(venueURL);
                    }

                    // append event to body
                    $("body").append(eventInfo);

                    // store the venue's location in the object array, "venueMapInfo"
                    var venueLatitude = venue.location.latitude;
                    var venueLongitude = venue.location.longitude;
                    var venueLocation = {lat: venueLatitude, lon: venueLongitude, name: venueName.text()};
                    venueMapInfo.push(venueLocation);
                };
            } else {    // if invalid value(s) entered: responded data doesn't include any event data.
                $("#errorMsg").text("No result found");
            }        
        });      
    }

    function clearDisplay() {
        $(".searchResult").remove();
        $("#errorMsg").text("");
        venueMapInfo = [];
    }
});