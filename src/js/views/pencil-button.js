'use strict';

var ButtonView = require('./base/button'),
  ColorPicker = require('./color-picker'),
  SizePicker = require('./size-select'),
  _ = require('underscore');

module.exports = ButtonView.extend({

  events: {
    'mousedown button': 'toggleDrawing',
    'mouseover': 'showTools',
    'mouseout': 'hideTools'
  },

  template: '' +
    '<div id="pencil">' +
      '<button type="button">&#x270e</button>' +
    '</div>',

  initialize: function () {
    this.registerExtras();
  },

  render: function () {
    this.setElement(_.template(this.template)());
    this.$el.css({ display: 'inline-block' });
    this.addExtras();
    return this.$el;
  },

  registerExtras: function () {
    this.colorPicker = new ColorPicker();
    this.colorPicker.on('color:change', this.colorChange, this);
    this.sizePicker = new SizePicker();
    this.sizePicker.on('size:change', this.sizeChange, this);
  },

  addExtras: function () {
    this.$el.append(this.colorPicker.$el);
    this.$el.append(this.sizePicker.$el);
    this.setColor(this.colorPicker.selected());
    this.setSize(this.sizePicker.selected());
  },

  toggleDrawing: function (on) {
    if (on === true || !this.$el.hasClass('active')) {
      this.trigger('pencil:start', { color: this.color, width: this.size });
      this.$el.addClass('active');
    } else {
      this.trigger('pencil:stop');
      this.$el.removeClass('active');
    }
  },

  setColor: function (color) {
    if (this.color) {
      this.$el.removeClass(this.color.replace('#', '_'));
    }
    this.color = color;
    console.log(this.color);
    this.$el.addClass(this.color.replace('#', '_'));
  },

  setSize: function (size) {
    if (this.size) {
      this.$el.removeClass(this.size);
    }
    this.size = size;
    console.log(this.size);
    this.$el.addClass(this.size);
  },

  colorChange: function (color) {
    this.setColor(color);
    this.toggleDrawing(true);
  },

  sizeChange: function (size) {
    this.setSize(size);
    this.toggleDrawing(true);
  },

  showTools: function () {
    this.colorPicker.show();
    this.sizePicker.show();
  },

  hideTools: function () {
    this.colorPicker.hide();
    this.sizePicker.hide();
  }

});
