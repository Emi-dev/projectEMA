var apiKey = "rPPNfm65VyGvXeDMXOhSXr3XsxhUllbU";
var queryURL;

$(document).ready(function() {

    queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&keyword=eltonjohn&city=London&apikey=" + apiKey;

        
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        var musician = response._embedded.events[0].name;
        $("#musicianName").text(musician);
    });

    $("#searchBtn").on("click", function(event) {
        
    
    });
});