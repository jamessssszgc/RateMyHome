$(document).ready(function(){

  userid = getCookie("userid");
  if (userid != '') {
    $("#myinput").show();
    $("#noinput").hide();
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
