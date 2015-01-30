'use strict';

var Backbone = require('backbone'),
  ColorPicker = require('./color-picker');

module.exports = Backbone.View.extend({

  events: {
    'click': 'initiateDrawing',
    'mouseover': 'openColorPicker'
  },

  tagName: 'button',

  initialize: function () {
    this.color = '#000';
    this.colorPicker = new ColorPicker();
    this.colorPicker.on('color:change', this.setColor, this);
  },

  render: function () {
    this.$el.text('Draw');
    return this.$el;
  },

  initiateDrawing: function () {
    if (this.$el.hasClass('active')) {
      this.trigger('pencil:stop');
      this.$el.removeClass('active');
    } else {
      this.trigger.call(this, 'pencil:start', { color: this.color });
      this.$el.addClass('active');
    }
  },

  setColor: function (color) {
    this.color = color;
    this.trigger.call(this, 'pencil:start', { color: this.color });
  },

  openColorPicker: function () {
    this.$el.after(this.colorPicker.render());
    this.colorPicker.$el.fadeIn();
  }

});
