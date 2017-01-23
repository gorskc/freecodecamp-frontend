$( document ).ready(function() {

var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

channels.forEach(function(el){
  var game, logo, name, url, tr, td1, td2, td3;
  $.getJSON('https://wind-bow.gomix.me/twitch-api/streams/' + el + '?callback=?', function(results){
    $.getJSON('https://wind-bow.gomix.me/twitch-api/channels/' + el + '?callback=?', function(data){
      var tbody = document.getElementById("body");

      if(results.stream === null) {
        game = "Offline";
      } else if(results.stream === undefined) {
        game = "Account Closed";
      } else if(results.stream) {
        game = results.stream.game;

      }

      var rows = document.getElementsByTagName(tr);

      var tr = results.stream ? tbody.insertRow(0) : tbody.insertRow(-1);

      results.stream ? tr.className = 'online' : tr.className = 'offline';

      logo = data.logo;
      name = data.display_name;
      url = data.url;

      td1 = tr.insertCell(0);
      td2 = tr.insertCell(1);
      td3 = tr.insertCell(2);
      var img = document.createElement('img');
      img.src = logo;
      td1.appendChild(img);
      td2.innerHTML = name;
      td3.innerHTML = game;

    });
  });

});

  $(".filter").click(function() {
    var status = $(this).attr('id');
    if (status === "showall") {
      $(".online").show();
      $(".offline").show();
    } else if (status === "online") {
      $(".online").show();
      $(".offline").hide();
    } else if(status === "offline") {
      $(".offline").show();
      $(".online").hide();
    }
  });



  $("#search").keyup(function(){
    var input = $("#searchStr");
    var text = input.val();
    $('#body tr').each(function() {
      var list = $(this).find('td').text();
      if(list.toLowerCase().indexOf(text.toLowerCase()) > -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });
});
