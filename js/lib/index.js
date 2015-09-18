'use strict';

var Backbone = require('backbone'),
  _$ = require('jquery'),
  ws = null,
  open = false;

var config = require('../config');
var protocol = location.protocol.replace(/^http/, 'ws');

Backbone.sync = function (method, model, options) {

  if (!ws) {
    ws = new window.WebSocket(protocol + config.SOCKET_HOST);
  }

  options = options || {};

  var json = model.toJSON();

  if (open) {
    ws.send(JSON.stringify({
      method: method,
      location: window.location.href,
      entity: json.entity,
      data: json.data
    }));
  }

  ws.onopen = function connectionOpen() {

    open = true;

    ws.send(JSON.stringify({
      method: method,
      location: window.location.href,
      entity: json.entity,
      data: json.data
    }));

  };

};

if (!window.$) {
  window.$ = _$;
}

Backbone.$ = _$;

module.exports = Backbone;
