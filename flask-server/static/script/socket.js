var socket;

// Socket Connectivity
$(document).ready(function() {
    socket = io('http://localhost:5000');

    socket.on('connect', function() {
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