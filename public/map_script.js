var map;
var infowindow;
var Bahen = {lat: 43.6591063, lng: -79.3973723};
var radius = 1000;
var zoom = 15;
var center = Bahen;
var hometype = 'condo';
var placeid = 0;
var service;
var userid = '';



function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();

}



function initMap() {
  $("#placeholder").empty();

  var mylat = getCookie("lat");
  var mylng = getCookie("lng");
  center = {lat:parseFloat(mylat),lng:parseFloat(mylng)}
  console.log(center);
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: zoom
  });

  var request = {
    location: center,
    radius: radius,
    keyword: hometype
  };


  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request,callback);
  var marker = new google.maps.Marker({
    position: center,
    animation: google.maps.Animation.BOUNCE 
    // animation for bounce
  })

  marker.setMap(map);
  var myUni = new google.maps.Circle({
    center: center,
    radius: radius+500,
    strokeColor: "#0000FF",
    strokeOpacity: 0.2,
    strokeWeight: 2,
    fillColor: "#0000FF",
    fillOpacity: 0.2
  });
  myUni.setMap(map); 
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
      listItem(results[i]);
    }
  }
}

function createMarker(place) {

  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {

    infowindow.setContent(place.name);

    $("html, body").animate( { scrollTop: $("#" + place.id).offset().top - 50 }, 2000);
    $("#" + place.id).css("background-color", "#C0C0C0");

    infowindow.open(map, this);

  });
}

function setRadius(r) {
  switch (r) {
    case 2000:
      zoom = 14; break;
    case 1000:
      zoom = 15; break;
    case 500:
      zoom = 15; break;
  }
  initMap();
  radius = r;
}


function setHomeType(t) {
  hometype = t;
  initMap();
}


//list all places around
function listItem(item) {

  $(document).ready( function() {

    $("#placeholder").append("<div class='panel listing row' id=" + item.id + "></div>");

    var img_html = "";

    if (typeof(item.photos) !== "undefined"){
      var img_url = item.photos[0].getUrl({'maxWidth': 120, 'maxHeight': 120});
      img_html = "<div class='imageholder col-sm-4' ><img src=" + img_url + " height='120px' width='120px'></div>";
    }
    else{
      img_html = "<div class='imageholder col-sm-4' ><img src='./blackball.jpg' height='120px' width='120px'></div>";
    }

    var place_name = "<div class='listing col-sm-8 Name' ><a href='detail/" + item.place_id + "'>" + item.name + "</a><div>";
    var place_address = "<div class=' listing col-sm-8 Address' >" + item.vicinity + "</div>";

    $("#" + item.id).append(img_html);
    $("#" + item.id).append(place_name);
    $("#" + item.id).append(place_address);

  })
}


//set up the offset for scrolling in page 3
$(document).ready(function(){
  userid = getCookie("userid");
  if (userid != '' && userid!=null) {
    dispuser = "Login as " + userid;
    document.getElementById('loginbtn').style.display= 'none';
    document.getElementById('registerbtn').style.display= 'none';
    document.getElementById('loginas').innerHTML=dispuser;
    document.getElementById('logoutbtn').style.visibility="visible";
  } else {
    document.getElementById('loginbtn').style.visibility="visible";
    document.getElementById('registerbtn').style.visibility="visible";
    document.getElementById('loginas').innerHTML="";
    document.getElementById('logoutbtn').style.display= 'none';
  }

  initMap();
  console.log(document.cookie)
  var offset = 30;
  $('#myNav li a').click(function(event) {
    event.preventDefault();
    $($(this).attr('href'))[0].scrollIntoView();
    scrollBy(0, -offset);
  });
})


window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        $("#toTop").css("display","block");
    } else {
        $("#toTop").css("display","block");
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 

}




