var map;
var infowindow;
var Bahen = {lat: 43.6591063, lng: -79.3973723};
var radius = 1000;
var zoom = 15;
var center = Bahen;
var hometype = 'condo';
var placeid = 0;
var service;



function getCookie() {
  var response=document.cookie.split(';');
  center={lat: parseFloat(response[0].slice(4)), lng: parseFloat(response[1].slice(5))};
}


function initMap() {
  getCookie();
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
        $("html, body").animate({
      scrollTop: $("#"+place.id).offset().top -50
    }, 2000);
    $("#placeholder").find($(".panel#"+placeid)).css("background-color", "white");
    placeid = place.id;
    $("#placeholder").find($(".panel#"+place.id)).css("background-color", "#C0C0C0");
    infowindow.open(map, this);
  });
}

function setRadius(r) {
  radius = r;
  if (r == 2000)
    zoom = 14;
  if (r == 1000)
    zoom = 15;
  if (r == 500)
    zoom = 15;
  initMap();
}



function setHomeType(t) {
  hometype = t;
  initMap();
}


//list all places around
function listItem(item) {
  $(document).ready( function() {
    $("<div class='panel listing row' id="+item.id+ "></div class='panel listing row' id="+item.id+ ">").appendTo("#placeholder");
    var img_html = "";
    if (typeof(item.photos) !== "undefined"){
      var img_url = item.photos[0].getUrl({'maxWidth': 120, 'maxHeight': 120});
      img_html = "<div class='imageholder col-sm-4' id="+item.id+"><img src="+img_url+" height='120px' width='120px'></div>";
    }
    else{
      img_html = "<div class='imageholder col-sm-4' id="+item.id+"><img src='./blackball.jpg' height='120px' width='120px'></div>";
    }
    $(img_html).appendTo($(".panel.listing.row#"+item.id));
    
    $("<a href='detail/"+item.place_id+"'><div class='listing col-sm-8 Name' id="+item.id+ "></div class='listing col-sm-8 Name' id="+item.id+ ">").text(item.name).appendTo($(".panel.listing#"+item.id));
    $("<div class=' listing col-sm-8 Address' id="+item.id+ "></div class='listing col-sm-8 Address' id="+item.id+ ">").text("Address:" + item.vicinity).appendTo($(".panel.listing#"+item.id));

    
  })
}




//set up the offset for scrolling in page 3
$(document).ready(function(){
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



