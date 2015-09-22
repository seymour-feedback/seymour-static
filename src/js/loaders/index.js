'use strict';

var Container = require('../controllers/container'),
  Backbone = require('backbone');

module.exports = new Container({
  model: new Backbone.Model()
});

