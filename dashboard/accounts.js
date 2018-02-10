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
        gettabledata(response.token);
      }
    });
  }
  return false;
}

//Get table data
function gettabledata(token) {
  var token = getCookie("token");
  var urlstring = "https://script.google.com/macros/s/AKfycbyKkt4S9bOnGHHYdtx5dqk3mRV3ckz0JJM88WXq_8IXlY77aJZc/exec?token=" + token + "&content=10";

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": urlstring,
    "method": "GET"
  };

  $.ajax(settings).done(function (response) {
    //console.log(response);

    if(response.error == 0) {
      addtotable(response);
    }
    else {
      notloggedin();
    }
  });
}

//Populate Table
function addtotable(results) {
  $("#tableresults tbody tr").remove();

  for (var i = results.data.length - 1; i >= 0; i--) {
    var $node = null;

    if(results.data[i][2] == 1) {
      var active = "Yes";
    }
    else {
      var active = "No";
    }

    if(results.data[i][3] == 1) {
      var permissions = "Full Permissions";
    }
    else if(results.data[i][3] == 2) {
      var permissions = "Checkout Only";
    }

    $node = $('<tr><td>' + results.data[i][0] + '</td><td>' + results.data[i][1] + '</td><td>' + active + '</td><td>' + permissions + '</td><td><a href="javascript:void(0);" onclick="deleteaccount(' + results.data[i][1] + ')>Delete Account</a></td></tr>');
    $node.prependTo("#tablebody");
  }
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

//Create New Account Function
$(function() { //shorthand document.ready function
    $('#addaccount').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        createaccount();
    });
});

function createaccount() {
  var token = getCookie("token");

  var modaltitle = document.getElementById('modalTitle');
  var valid = document.getElementById('valid');
  var drinkpass = document.getElementById('drinkpass');
  var guestpass = document.getElementById('guestpass');

  $("#myModal").modal();

  modaltitle.innerHTML = 'Please Wait...';
  valid.innerHTML = 'We are creating your new account...';
  drinkpass.innerHTML = '';
  guestpass.innerHTML = '';

  //Get values from form
  var newname = document.getElementById('name').value;
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var permissions = document.getElementById('permissions').value;

  if(permissions == "Checkout Permissions Only") {
    var perm = 2;
  }
  else if(permissions == "Full Dashboard Permissions") {
    var perm = 1;
  }

  var urlstring = "https://script.google.com/macros/s/AKfycbyKkt4S9bOnGHHYdtx5dqk3mRV3ckz0JJM88WXq_8IXlY77aJZc/exec?token=" + token + "&newname=" + newname + "&username=" + username + "&password=" + password + "&permissions=" + perm + "&content=11";

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": urlstring,
    "method": "GET"
  }

  $.ajax(settings).done(function (response) {
    var newnamefield = document.getElementById('name');
    var usernamefield = document.getElementById('username');
    var passwordfield = document.getElementById('password');
    newnamefield.value = "";
    usernamefield.value = "";
    passwordfield.value = "";

    modaltitle.innerHTML = 'Success!';
    valid.innerHTML = 'Your new username is: ' + response.data[0];
    drinkpass.innerHTML = 'This account belongs to: ' + response.data[1];
    guestpass.innerHTML = '';

    refreshtable();
  });
}

//Delete Account Function
function deleteaccount(username) {
  var token = getCookie("token");
  var urlstring = "https://script.google.com/macros/s/AKfycbyKkt4S9bOnGHHYdtx5dqk3mRV3ckz0JJM88WXq_8IXlY77aJZc/exec?token=" + token + "&content=12&username=" + username;

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": urlstring,
    "method": "GET"
  };

  $.ajax(settings).done(function (response) {
    console.log(response);

    if(response.error == 0) {
      refreshtable();
    }
    else {
      notloggedin();
    }
  });
}

//Refresh Table
function refreshtable() {
  $("#tableresults tbody tr").remove();
  var $node = null;
  $node = $('<tr><td></td><td>Data is loading, please wait...</td><td></td><td></td><td></td></tr>');
  $node.prependTo("#tablebody");
  
  var token = getCookie("token");
  gettabledata(token);
}


//begin old stuff

//Form submit
$(function() { //shorthand document.ready function
    $('#searchID').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        formsubmit();
    });
});

function formsubmit() {
  var modaltitle = document.getElementById('modalTitle');
  var valid = document.getElementById('valid');
  var drinkpass = document.getElementById('drinkpass');
  var guestpass = document.getElementById('guestpass');

  $("#myModal").modal();

  modaltitle.innerHTML = 'Please Wait...';
  valid.innerHTML = '';
  drinkpass.innerHTML = '';
  guestpass.innerHTML = '';

  //Get values from form
  var idnumber = document.getElementById('search').value;
  var token = getCookie("token");

  var urlstring = "https://script.google.com/macros/s/AKfycbzxPD0XVTHnUWMctHFjPiEzwnSX2CrFhtOqQux_6mAFT4cmbdsh/exec?id=" + idnumber + "&token=" + token;

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": urlstring,
    "method": "GET"
  }

  $.ajax(settings).done(function (response) {
    modaltitle.innerHTML = response.name + ' (' + response.idnum + ')';

    if(response.error == 0) {
      valid.innerHTML = '<div class="d-inline bg-success">Success! You checked the student in at ' + response.checkintime + '.</div>';

      if(response.drinkpass2 == 1) {
        drinkpass.innerHTML = 'Student has ' + response.drinkpass2 + ' drink pass.';
      }
      else if(response.drinkpass2 > 1) {
        drinkpass.innerHTML = 'Student has ' + response.drinkpass2 + ' drink passes.';
      }
      if(response.guestpass > 0) {
        guestpass.innerHTML = 'Student has a guest: ' + response.guestname + '. Please verify the guest\'s ID.';
      }
    }
    else if(response.error == 2) {
      valid.innerHTML = '<div class="d-inline bg-warning">This student was checked in by ' + response.checkinstaff + ' at ' + response.checkintime + '.</div>';

      if(response.drinkpass2 == 1) {
        drinkpass.innerHTML = 'Student has ' + response.drinkpass2 + ' drink pass.';
      }
      else if(response.drinkpass2 > 1) {
        drinkpass.innerHTML = 'Student has ' + response.drinkpass2 + ' drink passes.';
      }
      if(response.guestpass > 0) {
        guestpass.innerHTML = 'Student has a guest: ' + response.guestname + '. Please verify the guest\'s ID.';
      }
    }
    else if(response.error == 3){
      valid.innerHTML = '<div class="d-inline bg-danger">We were unable to find a valid ticket with student ID #' + response.idnum + '.</div>';
      drinkpass.innerHTML = 'Try scanning the card again.';
    }
    else {
      notloggedin();
    }
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