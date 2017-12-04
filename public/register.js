var reg_err = 0;

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

reg_err=getCookie("register_id");
console.l
$(document).ready(function(){
  if (reg_err == 1) {
  	document.getElementById('reg_flag').style.visibility="visible";
  } else if (reg_err == 0 || reg_err == null || reg_err == undefined) {
  	document.getElementById('reg_flag').style.display= 'none';
  }
})