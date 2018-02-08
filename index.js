//Run onload function on startup
window.onload = function() {
  signinstartup();
};

function signinstartup() {
	var signinform = document.getElementById('signinform');
	var alreadysignedin = document.getElementById('alreadysignedin');
	var loginnamefield = document.getElementById('loginname');
	var continueasfield = document.getElementById('continueas');

	//First, check for cookies.
	if(getCookie("token") == null) {
		signinform.removeAttribute('hidden');
	}
	else {
		var token = getCookie("token");

		//Send it to the login server to verify login
		var urlstring = "https://script.google.com/macros/s/AKfycbwf392-istjSgvNWVR10L_PFLbLhQuq8L-xr_3culH12E1NJko/exec?type=0&token=" + token;

		var settings = {
		  "async": true,
		  "crossDomain": true,
		  "url": urlstring,
		  "method": "GET"
		}

		$.ajax(settings).done(function (response) {
			console.log(response);
		  if(response.error == 2) { //invalid
		  	document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
		  	signinform.removeAttribute('hidden');
		  }
		  else if(response.error == 0) { //valid
		  	document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
		  	document.cookie = "token=" + response.token + "; path=/";
		  	loginnamefield.innerHTML = response.name;
		  	continueasfield.innerHTML = "Continue as " + response.name;

		  	alreadysignedin.removeAttribute('hidden');
		  }
		});
	}
	return false;
}

//Username Sign In Function
$(function() { //shorthand document.ready function
    $('#signinform').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        usernamesignin();
    });
});

function usernamesignin() {
	var modalTitle = document.getElementById('modalTitle');
	var modalBody = document.getElementById('valid');

	$("#myModal").modal();
	modalTitle.innerHTML = 'Please Wait...';
	modalBody.innerHTML = 'Signing you in...';

	var username = document.getElementById('inputUsername').value;
	var password = document.getElementById('inputPassword').value;

	//Send it to the login server to verify login
	var urlstring = "https://script.google.com/macros/s/AKfycbwf392-istjSgvNWVR10L_PFLbLhQuq8L-xr_3culH12E1NJko/exec?type=1&username=" + username + "&password=" + password;

	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": urlstring,
	  "method": "GET"
	}

	$.ajax(settings).done(function (response) {
		console.log(response);
	  if(response.error == 1) { //invalid

	  	modalTitle.innerHTML = 'Invalid Username or Password!';
	  	modalBody.innerHTML = 'The username and/or password you provided is invalid. Please try again.';

	  	document.getElementById("inputPassword").value = "";
	  }
	  else if(response.error == 0) { //valid
	  	document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
	  	document.cookie = "token=" + response.token + "; path=/";
	  	
	  	var redirectlink = "https://dvhsbluecrew.github.io/wfc/dashboard/index.html";
	  	window.location.replace(redirectlink);
	  }
	});
}

//Already Signed In Function
$(function() { //shorthand document.ready function
    $('#alreadysignedin').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        continuesignin();
    });
});

function continuesignin() {
	var redirectlink = "https://dvhsbluecrew.github.io/wfc/dashboard/index.html";
	window.location.replace(redirectlink);
}

function signout() {
	document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
	alreadysignedin.setAttribute('hidden','true');
	signinform.removeAttribute('hidden');
}

function getCookie(name) {
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return (value != null) ? unescape(value[1]) : null;
}