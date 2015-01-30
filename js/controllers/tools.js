'use strict';

var Backbone = require('backbone'),
  Pencil = require('../views/pencil');

module.exports = Backbone.View.extend({

  tagName: 'div',

  initialize: function () {
    this.pencil = new Pencil();
    this.render();
  },

  render: function () {
    this.$el.css({ position: 'absolute', top: '0', 'z-index': '2147483647' });
    this.$el.append(this.pencil.render());
    return this.$el;
  }

});
