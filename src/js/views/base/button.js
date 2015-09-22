'use strict';

var Backbone = require('backbone'),
  _ = require('underscore');

module.exports = Backbone.View.extend({

  tagName: 'button',

  attributes: {
    type: 'button'
  },

  intialize: function () {},

  render: function () {
    return this.$el;
  }

});
