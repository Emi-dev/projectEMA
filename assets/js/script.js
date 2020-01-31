var apiKey = "rPPNfm65VyGvXeDMXOhSXr3XsxhUllbU";
var queryURL;
var musician;
var state;
var city;

$(document).ready(function() {
    // search button event handler
    $("#searchBtn").on("click", function(event) {
        // clear the display
        clearDisplay();
        // get the musican's name entered in the input element and assign the value to the variable "musician"
        musician = $("#musicianInput").val().trim();
        // get the state code of the selected state and assign the value to the variable "state"
        state = $("select").val();
        // get the city anme entered in the input element and assign the value to the variable "city"
        city = $("#cityInput").val().trim();
        // call the function "accessAPI"
        accessAPI();      
    });

    // function to call API and get the music event data
    function accessAPI() {
        // assign the API call url to the variable "queryURL"
        queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&countryCode=us&apikey=" + apiKey + "&keyword=" + musician + "&stateCode=" + state + "&city=" + city;
        console.log(queryURL);

        $.ajax({
            url: queryURL,
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
                    var eventURL = $("<a>").attr("href", event.url).text("Click here for " + event.name + "'s Event Ticket Information");

                    // event date
                    var eventDateTime = $("<h3>").text(event.dates.start.localDate + ", " +  event.dates.start.localTime);

                    var venue = event._embedded.venues[0];
                    
                    // venue's name
                    var venueName = $("<div>").text(venue.name);

                    // venue's city
                    var venueCityCountry = $("<div>").text(venue.city.name + ", " + venue.country.name);
                    
                    // create the division "event" and append all to it
                    var eventInfo = $("<div>").addClass("container");
                    eventInfo.append(musicianName, eventURL, eventDateTime, venueName, venueCityCountry);

                    // venue's url
                    if("outlets" in event) { // if outlet property (contains venue's URL) exists
                        venueURL = $("<a>").attr("href", event.outlets[0].url).text("Venue information");
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
        $(".container").empty();
    }
});