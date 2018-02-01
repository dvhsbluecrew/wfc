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
		var token = getCookie(token);

		//Send it to the login server to verify login
		var urlstring = "https://script.google.com/macros/s/AKfycbwf392-istjSgvNWVR10L_PFLbLhQuq8L-xr_3culH12E1NJko/exec?&token=" + token;

		var settings = {
		  "async": true,
		  "crossDomain": true,
		  "url": urlstring,
		  "method": "GET"
		}

		$.ajax(settings).done(function (response) {
			console.log(response);
		  if(response.error == 2) { //invalid
		  	document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		  	signinform.removeAttribute('hidden');
		  }
		  else if(response.error == 0) { //valid
		  	document.cookie = "token=" + response.token;
		  	loginnamefield.innerHTML = response.name;
		  	continueasfield.innerHTML = "Continue As " + response.name;

		  	alreadysignedin.removeAttribute('hidden');
		  }
		});

		alreadysignedin.removeAttribute('hidden');
	}
}



$(function() { //shorthand document.ready function
    $('#signinform').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        usernamesignin();
    });
});

function usernamesignin() {
	document.cookie = "token=9YTO";
}




function getCookie(name) {
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return (value != null) ? unescape(value[1]) : null;
}




//Begin BP Signin Code
//Token Sign In
// $(function() { //shorthand document.ready function
//     $('#tokensignin').on('submit', function(e) { //use on if jQuery 1.7+
//         e.preventDefault();  //prevent form from submitting
//         tokensignin();
//     });
// });

// function tokensignin() {
// 	var modalTitle = document.getElementById('modalTitle');
// 	var modalBody = document.getElementById('valid');

// 	$("#myModal").modal();
// 	modalTitle.innerHTML = 'Please Wait...';
// 	modalBody.innerHTML = 'Signing you in...';

// 	var accesstoken = document.getElementById('accesstoken').value;

// 	var urlstring = "https://script.google.com/macros/s/AKfycbwf392-istjSgvNWVR10L_PFLbLhQuq8L-xr_3culH12E1NJko/exec?&token=" + accesstoken;

// 	var settings = {
// 	  "async": true,
// 	  "crossDomain": true,
// 	  "url": urlstring,
// 	  "method": "GET"
// 	}

// 	$.ajax(settings).done(function (response) {
// 	  if(response.error == 1) {
// 	  	$("#myModal").modal();

// 		modalTitle.innerHTML = 'Invalid Token!';
// 	  	modalBody.innerHTML = 'The access token you provided is invalid. Please try again.';

// 	  	document.getElementById("accesstoken").value = "";
// 	  }
// 	  else if(response.error == 4) {
// 	  	$("#myModal").modal();

// 	  	modalTitle.innerHTML = 'Expired Token!';
// 	  	modalBody.innerHTML = 'Hi, ' + response.checkinstaff + '! You were inactive for more than two hours so you must obtain a new access token. Please sign in again with a new access token.';

// 	  	document.getElementById("accesstoken").value = "";
// 	  }
// 	  else if(response.error == 3) {
// 	  	var redirectlink = "https://dvhsbluecrew.github.io/scanner/scanner.html?token=" + accesstoken;
// 	  	window.location.replace(redirectlink);
// 	  }
// 	});

// 	return false;
// }

// //Username Sign In
// $(function() { //shorthand document.ready function
//     $('#fcsignin').on('submit', function(e) { //use on if jQuery 1.7+
//         e.preventDefault();  //prevent form from submitting
//         fcsignin();
//     });
// });

// function fcsignin() {
// 	var modalTitle = document.getElementById('modalTitle');
// 	var modalBody = document.getElementById('valid');

// 	$("#myModal").modal();
// 	modalTitle.innerHTML = 'Please Wait...';
// 	modalBody.innerHTML = 'Signing you in...';

// 	var username = document.getElementById('username').value;
// 	var password = document.getElementById('password').value;

// 	var urlstring = "https://script.google.com/macros/s/AKfycbwDhsc4tJHfqDy9TC4Ku65SH7FOOOVGmqZZ7ETfRgCCpNOTy6Q/exec?&username=" + username + "&password=" + password;

// 	var settings = {
// 	  "async": true,
// 	  "crossDomain": true,
// 	  "url": urlstring,
// 	  "method": "GET"
// 	}

// 	$.ajax(settings).done(function (response) {
// 	  if(response.error == 1) {
// 	  	$("#myModal").modal();

// 		modalTitle.innerHTML = 'Invalid Username or Password!';
// 	  	modalBody.innerHTML = 'The username and/or password you provided is invalid. Please try again.';

// 	  	document.getElementById("password").value = "";
// 	  }
// 	  else if(response.error == 0) {
// 	  	var redirectlink = "https://dvhsbluecrew.github.io/dashboard/index.html?token=" + response.token;
// 	  	window.location.replace(redirectlink);
// 	  }
// 	});

// 	return false;
// }