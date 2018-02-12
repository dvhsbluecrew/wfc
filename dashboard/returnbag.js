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
        editlinks(response.perms, response.name);
      }
    });
  }
  return false;
}

//Add Token To Links
function editlinks(perms, username) {
  usernametext.innerHTML = "Hello, " + username + "!";

  if(perms == 1) {
    document.getElementById("link3").removeAttribute('hidden');
    document.getElementById("link5").removeAttribute('hidden');
    document.getElementById("link6").removeAttribute('hidden');
    document.getElementById("link9").removeAttribute('hidden');
  }
}

//Not Logged In Redirect
function notloggedin() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  var redirectlink = "https://dvhsbluecrew.github.io/wfc/index.html";
  window.location.replace(redirectlink);
}

//Sign Out Function
function signout() {
  var token = getCookie("token");

  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  var signoutbutton = document.getElementById('signoutbutton');
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

//Return Bag Search

//Prevent bag number form from submitting
$(function() { //shorthand document.ready function
    $('#bagcheck').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
    });
});

function returnBagSearch() {
  var mbagNumber = document.getElementById('mbagNumber');
  var mbagState = document.getElementById('mbagState');
  var mbagBalance = document.getElementById('mbagBalance');
  var mbagAlert = document.getElementById('mbagAlert');
  var mSubmitAlert = document.getElementById('mSubmitAlert');
  var bag = document.getElementById('bag');
  var amount = document.getElementById('amount');
  var notes = document.getElementById('notes');
  var bagsubmit = document.getElementById('bagsubmit');

  mbagNumber.innerHTML = 'Please Wait...';
  mbagState.innerHTML = '';
  mbagBalance.innerHTML = '';
  mbagAlert.innerHTML = '';
  mSubmitAlert.innerHTML = '';
  amount.value = '';
  notes.value = '';
  bagsubmit.disabled = true;

  var token = getCookie("token");

  var urlstring = "https://script.google.com/macros/s/AKfycbyKkt4S9bOnGHHYdtx5dqk3mRV3ckz0JJM88WXq_8IXlY77aJZc/exec?token=" + token + "&bag=" + bag.value + "&content=6";

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": urlstring,
    "method": "GET"
  }

  $.ajax(settings).done(function (response) {
    //console.log(response);
    if(response.error == 0 || response.error == 6) {
      mbagNumber.innerHTML = "Bag #" + response.bag + " (" + response.name + ")";

      if(response.timeout !== "") {
        if(response.timereturned !== "") {
          if(response.balance > 0) {
            mbagState.innerHTML = "This bag has been returned, but still carries a balance.";
            mbagBalance.innerHTML = "Remaining Balance: $" + response.balance.toFixed(2);
            bagsubmit.disabled = false;
          }
          else {
            mbagAlert.innerHTML = "This bag has been returned and paid.";
            mbagBalance.innerHTML = "Remaining Balance: $" + response.balance.toFixed(2);
          }
        }
        else {
          mbagState.innerHTML = "This bag has been checked out to " + response.name + ".";
          mbagBalance.innerHTML = "Remaining Balance: $" + response.balance.toFixed(2);
          bagsubmit.disabled = false;
        }
      }
    }
    else if(response.error == 5) {
      mbagNumber.innerHTML = "Bag #" + response.bag;
      mbagAlert.innerHTML = "This bag has not been checked out."
      mbagBalance.innerHTML = '';
    }
    else if(response.error == 1) {
      notloggedin();
    }
    else{
      mbagState.innerHTML = 'Error (' + response.error + ')';
      mbagBalance.innerHTML = 'An error occurred. Please try again.';
    }

    notes.value = response.notes;
  });

  return false;
}

//Return Bag Function
$(function() { //shorthand document.ready function
    $('#returnbag').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        returnBag();
    });
});

function returnBag() {
  var token = getCookie("token");

  var bag = document.getElementById('bag');
  var amount = document.getElementById('amount');
  var notes = document.getElementById('notes');
  var bagsubmit = document.getElementById('bagsubmit');
  var mSubmitAlert = document.getElementById('mSubmitAlert');

  bagsubmit.disabled = true;
  bagsubmit.innerHTML = "Please Wait...";
  mSubmitAlert.innerHTML = '';

  var urlstring = "https://script.google.com/macros/s/AKfycbyKkt4S9bOnGHHYdtx5dqk3mRV3ckz0JJM88WXq_8IXlY77aJZc/exec?token=" + token + "&bag=" + bag.value + "&amount=" + amount.value + "&notes=" + notes.value + "&content=7";

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": urlstring,
    "method": "GET"
  }

  $.ajax(settings).done(function (response) {
    if(response.error == 0) {
      amount.value = '';
      notes.value = '';
      mSubmitAlert.innerHTML = "Request complete! Thank you for returning this bag."
    }
    else if(response.error == 6) {
      mSubmitAlert.innerHTML = "This bag has already been fully paid. Please check your bag number."
    }
    else if(response.error == 1) {
      notloggedin();
    }
    else {
      mSubmitAlert.innerHTML = "An error occurred. Please try again."
    }

    bagsubmit.innerHTML = "Return Bag";
    returnBagSearch();
  });
}

//Bag Search / Form submit
$(function() { //shorthand document.ready function
    $('#searchBag').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting

        var search = document.getElementById('search').value;
        bagSearch(search);
    });
});

function bagSearch(bag) {
  var bagNumber = document.getElementById('bagNumber');
  var bagState = document.getElementById('bagState');
  var bagBalance = document.getElementById('bagBalance');
  var bagCheckout = document.getElementById('bagCheckout');
  var bagReturn = document.getElementById('bagReturn');
  var bagNotes = document.getElementById('bagNotes');

  bagNumber.innerHTML = 'Please Wait...';
  bagState.innerHTML = '';
  bagBalance.innerHTML = '';
  bagCheckout.innerHTML = '';
  bagReturn.innerHTML = '';
  bagNotes.innerHTML = '';

  $('#studentModal').modal('hide');
  $("#bagModal").modal();

  var token = getCookie("token");

  var urlstring = "https://script.google.com/macros/s/AKfycbyKkt4S9bOnGHHYdtx5dqk3mRV3ckz0JJM88WXq_8IXlY77aJZc/exec?token=" + token + "&bag=" + bag + "&content=6";

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": urlstring,
    "method": "GET"
  }

  $.ajax(settings).done(function (response) {
    //console.log(response);
    if(response.error == 0 || response.error == 6) {
      bagNumber.innerHTML = "Bag #" + response.bag + " (" + response.name + ")";

      if(response.timeout !== "") {
        if(response.timereturned !== "") {
          if(response.balance > 0) {
            bagState.innerHTML = "This bag has been returned, but still carries a balance.";
            bagBalance.innerHTML = "Remaining Balance: $" + response.balance.toFixed(2);
            bagCheckout.innerHTML = response.timeout + ", by " + response.checkedoutby;
            bagReturn.innerHTML = response.timereturned + ", by " + response.returnedby;
          }
          else {
            bagState.innerHTML = "This bag has been returned and paid.";
            bagBalance.innerHTML = "Remaining Balance: $" + response.balance.toFixed(2);
            bagCheckout.innerHTML = response.timeout + ", by " + response.checkedoutby;
            bagReturn.innerHTML = response.timereturned + ", by " + response.returnedby;
          }
        }
        else {
          bagState.innerHTML = "This bag has been checked out to " + response.name + ".";
          bagBalance.innerHTML = "Remaining Balance: $" + response.balance.toFixed(2);
          bagCheckout.innerHTML = response.timeout + ", by " + response.checkedoutby;
          bagReturn.innerHTML = "N/A";
        }
      }
    }
    else if(response.error == 5) {
      bagNumber.innerHTML = "Bag #" + response.bag;
      bagState.innerHTML = "This bag has not been checked out."
      bagBalance.innerHTML = '';
      bagCheckout.innerHTML = "N/A";
      bagReturn.innerHTML = "N/A";
    }
    else if(response.error == 1) {
      notloggedin();
    }
    else{
      bagState.innerHTML = 'Error (' + response.error + ')';
      bagBalance.innerHTML = 'An error occurred. Please try again.';
    }

    bagNotes.innerHTML = response.notes;
  });

  return false;
}

//Table Sort Function
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("tableresults");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc"; 
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;      
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

//Get parameters from URL function
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//Get cookie function
function getCookie(name) {
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}