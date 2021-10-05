///////////////////// START jQuery IDIOMS ////////////////////////
// The ubiquitous jQuery shortcut.
// Too good not to use!
function $(selector){
    return document.getElementById(selector)
}

// Implementation similar to jQuery
// Taken from https://codetonics.com/javascript/detect-document-ready/
function ready(callbackFunction){
    if(document.readyState != 'loading')
        callbackFunction(event)
    else
        document.addEventListener("DOMContentLoaded", callbackFunction)
}

// Taken from https://barker.codes/blog/how-to-empty-an-element-in-vanilla-js/
// Implementation modeled after that of jQuery
/**
 * Remove all child nodes from an element
 * @param {Object} element The element to empty
 */
 function empty (element) {

    // Get the element's children as an array
    var children = Array.prototype.slice.call(element.childNodes);
  
    // Remove each child node
    children.forEach(function (child) {
      element.removeChild(child);
    });
  
  }

///////////////////// END jQuery IDIOMS ///////////////////////

function poll_create_game(game, size, config){
    
    status_el = document.getElementById("amazons-create-game-status");
    status_el.textContent = "Loading";

    socket.emit('game-create', {"size": size, "config": config}, (data) =>{
        if(data.result && data.result === "success"){
            status_el.textContent = "Success, redirecting..."
            window.location.href = "/play/" + game + "?cid=" + data.cid;
        }
    })
}