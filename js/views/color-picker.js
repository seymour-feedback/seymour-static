'use strict';

var Backbone = require('backbone');

module.exports = Backbone.View.extend({

  events: {
    'change': 'colorChange'
  },

  tagName: 'input',

  attributes: {
    type: 'color',
    value: '#ff0000'
  },

  render: function () {
    return this.$el;
  },

  colorChange: function (e) {
    this.trigger('color:change', e.target.value);
  }

});
