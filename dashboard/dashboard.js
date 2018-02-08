//Charts API
var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: [{
      data: [15339, 21345, 18483, 24003, 23489, 24092, 12034],
      lineTension: 0,
      backgroundColor: 'transparent',
      borderColor: '#007bff',
      borderWidth: 4,
      pointBackgroundColor: '#007bff'
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: false
        }
      }]
    },
    legend: {
      display: false,
    }
  }
});

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
        document.cookie = "token=" + response.token;

        editlinks(response.token, response.name);
        gettabledata(response.token);
        
      }
    });
  }
  return false;
}

//Get table data
function gettabledata(token) {
  var token = getCookie("token");
  var urlstring = "https://script.google.com/macros/s/AKfycbyKkt4S9bOnGHHYdtx5dqk3mRV3ckz0JJM88WXq_8IXlY77aJZc/exec?token=" + token + "&content=8&tablestart=1";

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": urlstring,
    "method": "GET"
  };

  $.ajax(settings).done(function (response) {
    console.log(response);

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
    $node = $('<tr><td class="action"></td></tr>');
    $node.find("td.action").html(results.data[i][1]);
    $node.prependTo("#tablebody");
  }

  setTimeout(refreshtable(), 5000);
}

//Add Token To Links
function editlinks(token, username) {
  usernametext.innerHTML = "Hello, " + username + "!";

  document.getElementById("link0").href = "https://dvhsbluecrew.github.io/wfc/dashboard/index.html?token=" + token;
  document.getElementById("link1").href = "https://dvhsbluecrew.github.io/wfc/dashboard/index.html?token=" + token;
  document.getElementById("link2").href = "https://dvhsbluecrew.github.io/wfc/scanner/scanner.html?token=" + token;
  document.getElementById("link3").href = "https://dvhsbluecrew.github.io/wfc/dashboard/returnbag.html?token=" + token;
  document.getElementById("link4").href = "https://dvhsbluecrew.github.io/wfc/dashboard/recentactivity.html?token=" + token;
  document.getElementById("link5").href = "https://dvhsbluecrew.github.io/wfc/dashboard/bybag.html?token=" + token;
  document.getElementById("link6").href = "https://dvhsbluecrew.github.io/wfc/dashboard/bystudent.html?token=" + token;
  document.getElementById("link7").href = "https://dvhsbluecrew.github.io/wfc/dashboard/classstats.html?token=" + token;
  document.getElementById("link8").href = "https://dvhsbluecrew.github.io/wfc/dashboard/accounts.html?token=" + token;
}

//Not Logged In Redirect
function notloggedin() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  var redirectlink = "https://dvhsbluecrew.github.io/wfc/index.html";
  window.location.replace(redirectlink);
}

//Sign Out Function
function signout() {
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

//Refresh Table
function refreshtable() {
  var token = getCookie("token");
  gettabledata(token);
}

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
  var bagnumber = document.getElementById('search').value;
  var token = getCookie("token");

  var urlstring = "https://script.google.com/macros/s/AKfycbyKkt4S9bOnGHHYdtx5dqk3mRV3ckz0JJM88WXq_8IXlY77aJZc/exec?token=" + token + "&content=6";

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": urlstring,
    "method": "GET"
  }

  $.ajax(settings).done(function (response) {
    //stuff
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