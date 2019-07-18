function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

function reloadTwits() {
    const twitList = document.getElementById('twits');
    if (!twitList) {
        return;
    }

    const request = new XMLHttpRequest();
    const sendAsynchronously = true
    request.open('GET', '/', sendAsynchronously);
    request.setRequestHeader('Accept', 'application/json');
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            const twits = JSON.parse(request.responseText);
            if (twits) {
                const twitList = document.getElementById('twits');
                twitList.innerHTML = '';

                for (const twit of twits) {
                    const twitListItem = document.createElement("li"); 
                    twitListItem.appendChild(document.createTextNode(twit.message));  
                    twitList.appendChild(twitListItem); 
                }
            }
        } else {
            handleLoadTwitsError('Server error. Trying to load twits in 5 seconds.')
        }
    };
    request.onerror = function() {
        handleLoadTwitsError('Connection failure. Trying to load twits in 5 seconds.')
    };
    request.send();
}

function handleLoadTwitsError(msg) {
    console.error(msg); setTimeout(reloadTwits, 5000);
}

function postTwit(event) {
    const request = new XMLHttpRequest();
    const sendAsynchronously = true
    request.open('POST', '/', sendAsynchronously);
    // request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            reloadTwits();
        } else {
            console.error('Server error. Failed to post the twit.')
        }
    };
    request.onerror = function() {
        console.error('Failed to connect to post the twit.')
    };

    const twitFormElements = event.target.elements;
    const twitTextArea = twitFormElements[0];
    const postBody = `${encodeURIComponent(twitTextArea.name)}=${encodeURIComponent(twitTextArea.value)}`;
    request.send(postBody);
    twitTextArea.value = '';

    event.preventDefault();
}

ready(function () {
    reloadTwits();

    const twitForm = document.getElementById('twitForm');
    twitForm.addEventListener('submit', postTwit);
  });
  