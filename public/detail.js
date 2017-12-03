$(document).ready(function(){

  console.log("===================== working on third view")
  userid = getCookie("userid");
  if (userid != '' && userid!=null) {
    $("#myinput").show();
    $("#noinput").hide();
    $(".button").prop("disabled",true)
    $("#button_"+userid).prop("disabled",false)
    $("#button_"+userid).removeClass("btn btn-default disabled").addClass("btn btn-default");
    dispuser = "Login as " + userid;
    document.getElementById('loginbtn').style.display= 'none';
    document.getElementById('registerbtn').style.display= 'none';
    document.getElementById('loginas').innerHTML=dispuser;
    document.getElementById('logoutbtn').style.visibility="visible";
    
  } else {
    $("#myinput").hide();
    $("#noinput").show();

    document.getElementById('loginbtn').style.visibility="visible";
    document.getElementById('registerbtn').style.visibility="visible";
    document.getElementById('loginas').innerHTML="";
    document.getElementById('logoutbtn').style.display= 'none';

  }

  var offset = 30;
  $('#myNav li a').click(function(event) {
    event.preventDefault();
    $($(this).attr('href'))[0].scrollIntoView();
    scrollBy(0, -offset);
  });
})




function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();

}


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