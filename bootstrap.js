;(function (window) {
  'use strict';

  var doc = window.document;
  var button = doc.createElement('button');
  var container = doc.createElement('div');
  var script;
  var loaded = false;
  var body = doc.getElementsByTagName('body')[0];

  function loadScript(url ) {
    script = doc.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    container.id = 'smContainer';

    script.onload = function () {
      console.log('loaded');
    };

    body.appendChild(script);
    body.appendChild(container);
  }

  function removeScript () {
    body.removeChild(script);
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    body.removeChild(container);
  }

  button.style.position = 'absolute';
  button.style.right = '0';
  button.style.top = '0';
  button.style.zIndex = '2147483647';
  button.type = 'button';
  button.innerText = 'Feed me!';
  body.appendChild(button);

  button.addEventListener('click', function () {
    if (!loaded) {
      loadScript('http://localhost:3008/dist/app.js');
      loaded = true;
    } else {
      removeScript();
      loaded = false;
    }
  });

}(window));
