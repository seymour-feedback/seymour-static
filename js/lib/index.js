'use strict';

var Backbone = require('backbone'),
  $ = require('jquery'),
  ws = null,
  open = false,
  models = {};

Backbone.sync = function (method, model, options) {
  if (!ws) {
    ws = new window.WebSocket(model.url);
  }

  options = options || {};

  if (!models[model.entity]) {
    models[model.entity] = model;
  }

  if (open) {
    ws.send(JSON.stringify({
      method: method,
      entity: model.entity,
      origin: options.origin,
      id:     options.id || model.id
    }));
  }

  ws.onopen = function connectionOpen() {

    open = true;

    ws.onmessage = function (message) {

      var data = JSON.parse(message.data);
      console.log(data);
      var model = models[data.entity];

      data = model.parse(data);
      if (data.method !== 'delete') {
        model.add(data.res, { merge: true });
      }
    };

    ws.send(JSON.stringify({
      method: method,
      entity: model.entity,
      origin: options.origin
    }));

  };

};

if (!window.$) {
  window.$ = $;
}

Backbone.$ = $;

module.exports = Backbone;
