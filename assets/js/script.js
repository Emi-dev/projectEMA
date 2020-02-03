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


$(document).ready(function() {
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
        console.log("map button clicked!");
        $("#mapModal").modal("show");
        $("#mapContent").text(city + ", " + state);

        window.initMap = function() {
            // The location of Uluru
            var uluru = {lat: -25.344, lng: 131.036};
            // The map, centered at Uluru
            var map = new google.maps.Map(
                $("#map"), {zoom: 4, center: uluru});
            // The marker, positioned at Uluru
            var marker = new google.maps.Marker({position: uluru, map: map});
        }
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
                //var event = response._embedded.events[0];
                var eventList = response._embedded.events;
                
                eventList.forEach(function(event) {
                    // musician's name
                    var musicianName = $("<h2>").addClass("musicianName").text(event.name);

                    // event URL
                    var eventURL = $("<a>").attr({href: event.url, target: "_blank"}).text("Click here for the ticket information");

                    // event date
                    var eventDateTime = $("<h3>").addClass("ui header").text(event.dates.start.localDate + ", " +  event.dates.start.localTime);

                    var venue = event._embedded.venues[0];
                    
                    // venue's name
                    var venueName = $("<div>").text(venue.name);

                    // venue's city
                    var venueCityCountry = $("<div>").text(venue.city.name + ", " + venue.country.name);

                    // map button
                    var mapButton = $("<button>").addClass("ui primary button mapBtn").attr("type", "submit").text("Map");
                    
                    // create the division "event" and append all to it
                    var eventInfo = $("<div>").addClass("searchResult ui info ignored message");
                    eventInfo.append(musicianName, eventURL, eventDateTime, venueName, venueCityCountry, mapButton);

                    // venue's url
                    if("outlets" in event) { // if outlet property (contains venue's URL) exists
                        venueURL = $("<a>").attr({href: event.outlets[0].url, target: "_blank"}).text("Venue information");
                        eventInfo.append(venueURL);
                    }
                    
                    // append event to body
                    $("body").append(eventInfo);
                });
            } else {    // if invalid value(s) entered: responded data doesn't include any event data.
                $("#errorMsg").text("invalid input");
            }        
        });      
    }

    function clearDisplay() {
        $(".searchResult").remove();
        $("#errorMsg").text("");
    }
});