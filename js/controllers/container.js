'use strict';

var Backbone = require('backbone'),
  Canvas = require('../views/canvas'),
  Tools = require('./tools');

module.exports = Backbone.View.extend({

  initialize: function () {
    this.tools = new Tools();
    this.canvas = new Canvas({ tools: this.tools });
    this.render();
  },

  render: function () {
    this.setElement('#smContainer');
    this.$el.append(this.canvas.render());
    this.$el.append(this.tools.render());
    $('body').append(this.el);
  }

});
