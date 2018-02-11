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
  var urlstring = "https://script.google.com/macros/s/AKfycbyKkt4S9bOnGHHYdtx5dqk3mRV3ckz0JJM88WXq_8IXlY77aJZc/exec?token=" + token + "&content=2";

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
    $node = $('<tr><td>' + results.data[i][0] + '</td><td>' + results.data[i][1] + '</td><td>' + results.data[i][2] + '</td><td>' + results.data[i][3] + '</td><td><a href="javascript:void(0);" onclick="studentSearch(' + results.data[i][4] + ')">View Info</a></td></tr>');
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

//Refresh Table
function refreshtable() {
  $("#tableresults tbody tr").remove();
  var $node = null;
  $node = $('<tr><td></td><td>Data is loading, please wait...</td><td></td><td></td><td></td></tr>');
  $node.prependTo("#tablebody");

  var token = getCookie("token");
  gettabledata(token);
}

//Student Search
function studentSearch(ID) {
  var studentName = document.getElementById('studentName');
  var studentInfo = document.getElementById('studentInfo');
  var studentBalance = document.getElementById('studentBalance');

  studentName.innerHTML = 'Please Wait...';
  studentInfo.innerHTML = '';
  studentBalance.innerHTML = '';

  $("#modalout tbody tr").remove();
  $("#modalin tbody tr").remove();

  $("#studentModal").modal();

  var token = getCookie("token");

  var urlstring = "https://script.google.com/macros/s/AKfycbyKkt4S9bOnGHHYdtx5dqk3mRV3ckz0JJM88WXq_8IXlY77aJZc/exec?token=" + token + "&id=" + ID + "&content=4";

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": urlstring,
    "method": "GET"
  }

  $.ajax(settings).done(function (response) {
    console.log(response);
    if(response.error == 0) {
      studentName.innerHTML = response.name + " (" + response.class + ")";
      studentInfo.innerHTML = response.fname + " has " + response.bagsout + " bags checked out and " + response.bagsin + " bags returned.";
      studentBalance.innerHTML = "Remaining Balance: $" + response.owed + ".";

      for (var i = response.data.length - 1; i >= 0; i--) {
        var $node = null;

        if(response.data[i][1] == false) {
          $node = $('<tr><td><a href="javascript:void(0);" onclick="bagSearch(' + response.data[i][0] + ')">Bag #' + response.data[i][0] + '</a></td></tr>');
          $node.prependTo("#modaloutbody");
        }
        else {
          $node = $('<tr><td><a href="javascript:void(0);" onclick="bagSearch(' + response.data[i][0] + ')">Bag #' + response.data[i][0] + '</a></td></tr>');
          $node.prependTo("#modalinbody");
        }
      }
    }
    else if(response.error == 1) {
      notloggedin();
    }
    else{
      studentName.innerHTML = 'Error (' + response.error + ')';
      studentInfo.innerHTML = 'An error occurred. Please try again.';
    }
  });

  return false;
}

//Bag Search / Form submit
$(function() { //shorthand document.ready function
    $('#search').on('submit', function(e) { //use on if jQuery 1.7+
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
    console.log(response);
    if(response.error == 0 || response.error == 6) {
      bagNumber.innerHTML = "Bag #" + response.bag + " (" + response.name + ")";

      if(response.timeout !== "") {
        if(response.timereturned !== "") {
          if(response.balance > 0) {
            bagState.innerHTML = "This bag has been returned, but still carries a balance.";
            bagBalance.innerHTML = "Remaining Balance: $" + response.balance;
            bagCheckout.innerHTML = response.timeout + ", by " + response.checkedoutby;
            bagReturn.innerHTML = response.timereturned + ", by " + response.returnedby;
          }
          else {
            bagState.innerHTML = "This bag has been returned and paid.";
            bagBalance.innerHTML = "Remaining Balance: $" + response.balance;
            bagCheckout.innerHTML = response.timeout + ", by " + response.checkedoutby;
            bagReturn.innerHTML = response.timereturned + ", by " + response.returnedby;
          }
        }
        else {
          bagState.innerHTML = "This bag has been checked out to " + response.name + ".";
          bagBalance.innerHTML = "Remaining Balance: $" + response.balance;
          bagCheckout.innerHTML = response.timeout + ", by " + response.checkedoutby;
          bagReturn.innerHTML = "N/A";
        }
      }
      else {
        bagState.innerHTML = "This bag has not been checked out."
        bagBalance.innerHTML = '';
        bagCheckout.innerHTML = "N/A";
        bagReturn.innerHTML = "N/A";
      }

      bagNotes.innerHTML = response.notes;
    }
    else if(response.error == 1) {
      notloggedin();
    }
    else{
      bagState.innerHTML = 'Error (' + response.error + ')';
      bagBalance.innerHTML = 'An error occurred. Please try again.';
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

//Table Sort (for automatic sort, disables reverse order)
function sortTableAuto(n) {
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
    }
  }
}

//Table Search Functions
function tableNameSearch() {
  var input, filter, table, tr, td, i;
  input = document.getElementById("searchname");
  filter = input.value.toUpperCase();
  table = document.getElementById("tableresults");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}

function tableClassSearch() {
  var input, filter, table, tr, td, i;
  input = document.getElementById("searchclass");
  filter = input.value.toUpperCase();
  table = document.getElementById("tableresults");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
  sortTableAuto(0);
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