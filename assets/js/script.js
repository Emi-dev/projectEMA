var apiKey = "rPPNfm65VyGvXeDMXOhSXr3XsxhUllbU";
var queryURL;
var musician;
var city;

$(document).ready(function() {
    // search button event handler
    $("#searchBtn").on("click", function(event) {
        // get the musican's name entered in the input element and assign the value to the variable "musician"
        musician = $("#musicianInput").val().trim();
        // get the city anme entered in the input element and assign the value to the variable "city"
        city = "&city=" + $("#cityInput").val().trim();
        // call the function "accessAPI"
        accessAPI();        
    });

    // function to call API and get the music event data
    function accessAPI() {
        // assign the API call url to the variable "queryURL"
        queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&keyword=" + musician + city + "&apikey=" + apiKey;
        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            // check if input(s) is(are) valid and event data included in the response.
            if(Object.keys(response)[0] === "_embedded") {
                var result = response._embedded.events[0];
                var eventList = JSON.stringify(response._embedded.events);
                console.log("eventList: ", eventList);

                // musician's name
                var musicianName = $("<h2>").addClass("musicianName").text(result.name);

                // event URL
                var eventURL = $("<a>").attr("href", result.url).text("Click here for " + result.name + "'s Event Ticket Information");

                // event date
                var eventDateTime = $("<h3>").text(result.dates.start.localDate + ", " +  result.dates.start.localTime);

                var venue = result._embedded.venues[0];
                
                // venue's name
                var venueName = $("<div>").text(venue.name);

                // venue's city
                var venueCityCountry = $("<div>").text(venue.city.name + ", " + venue.country.name);
                
                // create the division "result" and append all to it
                var eventInfo = $("<div>").addClass("container");
                eventInfo.append(musicianName, eventURL, eventDateTime, venueName, venueCityCountry);

                // venue's url
                if("outlets" in result) { // if outlet property (contains venue's URL) exists
                    venueURL = $("<a>").attr("href", result.outlets[0].url).text(venue.name + "'s information");
                    eventInfo.append(venueURL);
                }
                
                // append result to body
                $("body").append(eventInfo);
            } else {    // if invalid value(s) entered: responded data doesn't include any event data.
                $("#errorMsg").text("invalid input");
            }        
        });      
    }
});