  var socket = io();

  $("#error").hide();

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  socket.emit("create_user", { username: getParameterByName("username") });
  socket.emit("get_users", { });

  socket.on("get_users", function(data) {
    $("#connected_users").text("users:\n" + data.users);
  });
  socket.on("create_user", function(data){
    if(data.error) {
      window.location.href = "http://localhost:8080/error?error=" + data.error;
    } else {
      return true;
    }
  });

  $("#send_message").click(function() {
    socket.emit("new_message", { username: getParameterByName("username"), message: $("#input_context").val() });
  });

  socket.on("new_message", function(data) {
    if(data.error) {
      $("#error").text("error: " + data.error);
      $("#error").show();
      setTimeout(function() {
        $("#error").hide();
      }, 8000);
    } else {
      $("#messages").append("<h5>" + data.username + " - " + data.message + "</h5>");
    }
  });