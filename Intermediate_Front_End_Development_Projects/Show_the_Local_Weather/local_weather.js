$(document).ready(function() {

  $(document).ajaxStart(function(){
    $("#load").css("display", "block");
  });

  $(document).ajaxComplete(function(){
    $("#load").css("display", "none");
  });
  //Get location with HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var city;
      var state_country;
      var long = position.coords.longitude;
      var lat = position.coords.latitude;
      var apikey = "AIzaSyAylC4pTiRGwIc2nWZ-RAhKfecP4-L7fQc";
      var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&key=" + apikey;

   //Request location data from google api
  $.getJSON(url, function(data){
    var loc = data.results[3].formatted_address;
    var locList = loc.split(",");
    state_country = locList[1];
    city = locList[0];
    //Remove accents from city names
    function removeAccents(str) {
      var accents    = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
      var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
      str = str.split('');
      var strLen = str.length;
      var i, x;
      for (i = 0; i < strLen; i++) {
        if ((x = accents.indexOf(str[i])) != -1) {
          str[i] = accentsOut[x];
        }
      }
      return str.join('');
    }
    //Get city name with accents removed
    var cityNoAccent = removeAccents(city);
    //Get date
    var d = new Date().toString();
    var dateArray = d.split(" ");
    dateArray.splice(4,3);
    $("#date").html(dateArray.join(" "));
    $("#location").html(loc);

      //------ Get Weather Data from Weather Underground based on location data ------//
      var apiWeath = "https://api.wunderground.com/api/2e93b87da8eafc8b/conditions/q/"+state_country+"/"+cityNoAccent+".json";

      $.getJSON(apiWeath, function(info) {
        var tempF = info.current_observation.temp_f + '\xB0' + "F";
        var tempC = info.current_observation.temp_c + '\xB0' + "C";
        var weather = info.current_observation.weather;
        var windDirection = info.current_observation.wind_dir;
        var windMph = info.current_observation.wind_mph + " MPH";
        var windKph = info.current_observation.wind_kph + " KPH";
        $("#temp").html(tempF);
        $("#temp").on("click", function(info) {
          var htmlString = $( this ).html();
            if(htmlString == tempF) {
              $("#temp").html(tempC);
            } else {
              $("#temp").html(tempF);
            }
      });

      var background_icons = {"cloudy": "<i class='wi wi-cloudy'></i>",
                              "rain": "<i class='wi wi-rain'></i>",
                              "snow": "<i class='wi wi-snow'></i>",
                              "wind": "<i class='wi wi-strong-wind'></i>",
                              "sun": "<i class='wi wi-day-sunny'></i>",
                              "fog": "<i class='wi wi-fog'></i>"
                             };
      //Display weather icon depending on weather conditions
      var desc = weather.toLowerCase();
      if(desc.includes("sun") || desc.includes("clear")) {
        $("#icon").html(background_icons.sun);
      } else if(desc.includes("cloud")) {
        $("#icon").html(background_icons.cloudy);
      } else if(desc.includes("rain") || desc.includes("drizzle") || desc.includes("showers") || desc.includes("mist")) {
        $("#icon").append(background_icons.rain);
      } else if(desc.includes("snow")) {
        $("#icon").html(background_icons.snow);
      } else if(desc.includes("wind")) {
        $("#icon").html(background_icons.wind);
      } else if(desc.includes("fog")) {
        $("#icon").html(background_icons.fog);
      }
      //Wind data
      $("#direction").html(windDirection);
      $("#speed").html(windMph);
      $("#speed").on("click", function(info) {
        var thisString = $( this ).html();
        if(thisString == windMph) {
          $("#speed").html(windKph);
        } else {
          $("#speed").html(windMph);
        }
      });

        //----- Get forecast data from Weather Underground based on location data -----//
        var apiForecast = "https://api.wunderground.com/api/2e93b87da8eafc8b/forecast/q/"+state_country+"/"+cityNoAccent+".json";

        $.getJSON(apiForecast, function(value) {
           var tr;
           var forecasts = value.forecast.simpleforecast.forecastday;
           for(var i = 0; i < forecasts.length; i++) {
            tr = $("<tr/>");

            tr.append("<td>" + forecasts[i].date.weekday + "</td>");
            var cond = forecasts[i].conditions.toLowerCase();
            if(cond.includes("sun") || cond.includes("clear")) {
            tr.append("<td>" + background_icons.sun + " " + cond + "</td>");
            } else if(cond.includes("cloud") || cond.includes("overcast")) {
            tr.append("<td>" + background_icons.cloudy + " " + cond + "</td>");
            } else if(cond.includes("rain") || cond.includes("drizzle") || cond.includes("showers") || cond.includes("mist")) {
            tr.append("<td>" + background_icons.rain + " " + cond + "</td>");
            } else if(cond.includes("snow")) {
            tr.append("<td>" + background_icons.snow + " " + cond + "</td>");
            } else if(cond.includes("wind")) {
            tr.append("<td>" + background_icons.wind + " " + cond + "</td>");
            } else if(cond.includes("fog")) {
            tr.append("<td>" + background_icons.fog + " " + cond + "</td>");
          }

          tr.append("<td>" + forecasts[i].high.celsius + "\xB0C/" + forecasts[i].high.fahrenheit + "\xB0F"+ "</td>");
          $("table").append(tr);
          }
        });
      });
    });
  });
 }
});
