//Initial Token Check
window.onload = function() {
  onStartup();
};

function onStartup() {
  if(getCookie("token") == null) {
    notloggedin();
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
        notloggedin();
      }
      else if(response.error == 0) { //valid
      	var username = document.getElementById('username');
      	username.innerHTML = response.name;

        //stuff
      }
    });
  }
  return false;
}

//Student ID Search
$(function() { //shorthand document.ready function
    $('#searchID').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        studentSearch();
    });
});

function studentSearch() {
	var idnumber = document.getElementById('search');
	var bag = document.getElementById('bagsearch');
	var title = document.getElementById('title');
  var studentName = document.getElementById('studentName');
  var studentInfo = document.getElementById('studentInfo');
  var bagsubmit = document.getElementById('bagsubmit');

  title.innerHTML = 'Please Wait...';
  studentName.innerHTML = 'Please Wait...';
  studentInfo.innerHTML = '';
  bag.disabled = true;
  bagsubmit.disabled = true;

  $("#studentModal").modal();

  var token = getCookie("token");

  var urlstring = "https://script.google.com/macros/s/AKfycbyKkt4S9bOnGHHYdtx5dqk3mRV3ckz0JJM88WXq_8IXlY77aJZc/exec?token=" + token + "&id=" + idnumber.value + "&content=4";

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": urlstring,
    "method": "GET"
  }

  $.ajax(settings).done(function (response) {
    //console.log(response);
    if(response.error == 0) {
      title.innerHTML = response.name + " (" + response.class + ")";
      studentName.innerHTML = response.name + " (" + response.class + ")";
      studentInfo.innerHTML = response.fname + " has " + response.bagsout + " bags checked out and " + response.bagsin + " bags returned.";
      bag.disabled = false;
      bagsubmit.disabled = false;
    }
    else if(response.error == 3) {
      title.innerHTML = "Unable to find ID";
      studentName.innerHTML = "Unable to find ID";
      studentInfo.innerHTML = "If the student is in Orchestra and this is their first checkout for this year, please click here.<br>Otherwise, try scanning again.";
    }
    else if(response.error == 1) {
      notloggedin();
    }
    else{
      title.innerHTML = 'Error (' + response.error + ')';
      studentName.innerHTML = 'Error (' + response.error + ')';
      studentInfo.innerHTML = 'An error occurred. Please try again.';
    }
  });

  return false;
}

//Checkout Bag Function
$(function() { //shorthand document.ready function
    $('#checkoutBag').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        checkoutBag();
    });
});

function checkoutBag() {
  var token = getCookie("token");

  var idnumber = document.getElementById('search');
	var bag = document.getElementById('bagsearch');
  var bagsubmit = document.getElementById('bagsubmit');
  var checkoutSuccess = document.getElementById('checkoutSuccess');
  var checkoutAlert = document.getElementById('checkoutAlert');

  bagsubmit.disabled = true;
  bagsubmit.innerHTML = "Please Wait...";
  checkoutSuccess.innerHTML = '';
  checkoutAlert.innerHTML = '';

  var urlstring = "https://script.google.com/macros/s/AKfycbyKkt4S9bOnGHHYdtx5dqk3mRV3ckz0JJM88WXq_8IXlY77aJZc/exec?token=" + token + "&bag=" + bag.value + "&id=" + idnumber.value + "&content=5";

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": urlstring,
    "method": "GET"
  }

  $.ajax(settings).done(function (response) {
    if(response.error == 0) {
    	bag.value = '';
    	checkoutSuccess.innerHTML = "Success! Bag #" + response.data[1] + "was checked out to " + response.name + "!";

      studentSearch();
    }
    else if(response.error == 4) {
      checkoutAlert.innerHTML = "This bag has already been checked out. Please check your bag number.";

      bagsubmit.disabled = false;
    }
    else if(response.error == 1) {
      notloggedin();
    }
    else {
      checkoutAlert.innerHTML = "An error occurred. Please try again.";

      bagsubmit.disabled = false;
    }
    bagsubmit.innerHTML = "Checkout Bag";
  });
}

//Sign Out / Not Logged In Scripts
function notloggedin() {
	var redirectlink = "https://dvhsbluecrew.github.io/wfc/index.html";
  	window.location.replace(redirectlink);
}

//Sign Out Function
function signout() {
  var token = getCookie("token");

  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  var signoutbutton = document.getElementById('signinlink');
  signoutbutton.innerHTML = "Please Wait...";

  var urlstring = "https://script.google.com/macros/s/AKfycbwf392-istjSgvNWVR10L_PFLbLhQuq8L-xr_3culH12E1NJko/exec?token=" + token + "&type=2";

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": urlstring,
    "method": "GET"
  };

  $.ajax(settings).done(function (response) {
    var redirectlink = "https://dvhsbluecrew.github.io/";
    window.location.replace(redirectlink);
  });
}

//Get cookie function
function getCookie(name) {
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}