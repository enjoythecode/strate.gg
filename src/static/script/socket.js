var socket;
var pid;

// Socket Connectivity
ready(function() {
  const div = document.createElement('div');
  div.id = 'connection-info';
  div.innerHTML = '<span id="connection-info-network">You\re offline</span>. <span id="connection-info-users">??</span> active users.';
  document.getElementsByTagName("body")[0].appendChild(div);

  socket = io(location.protocol + '//' + location.host);

  socket.on('connect', function() {
    document.getElementById("connection-info-network").textContent = "You're online"
  });

  socket.on('disconnect', function() {
    document.getElementById("connection-info-network").textContent = "You're offline"
  });

  socket.on('connection-info-update', function(info) {
    document.getElementById("connection-info-users").textContent = info.users;
  });

  socket.on('connection-player-id', function(info) {
    pid = info.pid;
  });

  socket.on('message', function(m) {
      alert(m);
  });

  socket.on('error', function(e){
      console.log("Error", e);
  })
});

/*

function emit_wrapper(event, data) {
    return new Promise((resolve, reject) => {
      if (!socket) return reject('No socket connection.');

      return socket.emit(event, data, (response) => {
        // Response is the optional callback that you can use with socket.io in every request. See 1 above.
        if (response.error) {
          console.error(response.error);
          return reject(response.error);
        }

        return resolve();
      });
    });
  }

  */