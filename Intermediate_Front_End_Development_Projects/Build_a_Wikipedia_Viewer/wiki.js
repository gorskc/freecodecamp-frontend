$(document).ready(function(){
  var input;
  var url;
  $(".search2").hide();
  //Switch from search icon to search bar with buttons
  $(".search1").on("click", function(){
    //$(".shown").hide("slow");
    $(".search2").show("slow");
    $(".search1").hide("slow");
  });

  //search after pressing Enter
var callback = function() {
  //Prevents page from reloading and clearing data on keyup
  event.preventDefault();
  input = $("#searchStyle").val();
  url = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search="+input+"&limit=10";

  //Get search results from Wikipedia
  $.getJSON(url, function(val){
    var titles = val[1];
    var descriptions = val[2];
    var links = val[3];

    //Clears search results if any data exists
    if ($('.results').text() !== '') {
      $('.results').empty();
    }

    //Loops through results and creates new HTML elements
    $.each(titles, function(index, value){
      var textTitle = '<div id="searchResult"><h3 id="title"><a target="_blank" href='+links[index]+'>'+titles[index]+'</a></h3>';
      var textDescription = '<p id="description">'+descriptions[index]+'<p></div>';

      $(".results").append(textTitle+textDescription);
    });

  });
};

$(".searchBox").keypress(function() {
    if (event.which == 13) callback();
});

$('#searchButton').click(callback);

});
