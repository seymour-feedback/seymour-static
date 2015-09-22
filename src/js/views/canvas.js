'use strict';

var Backbone = require('../lib'),
  _ = require('underscore');

module.exports = Backbone.View.extend({

  tagName: 'canvas',

  initialize: function (options) {
    this.context = this.el.getContext('2d');
    this.tools = options.tools;
    this.cursorPosition = this.cursorPosition.bind(this);
    this.tools.pencil.on('pencil:start', this.captureDrawing, this);
    this.tools.pencil.on('pencil:stop', this.cancelDrawing, this);
    this.tools.submit.on('submit', this.save, this);
  },

  render: function () {
    this.$el.css({ position: 'absolute', top: 0, left: 0 });
    this.el.width = $('body').width();
    this.el.height = window.document.documentElement.clientHeight;
    return this.$el;
  },

  remove: function () {
    Backbone.View.prototype.remove.apply(this, arguments);
  },

  save: function () {
    var data = this.el.toDataURL();
    this.model.save({ entity: 'image', data: data });
  },

  captureDrawing: function (options) {
    this.$el.css({ cursor: 'pointer' });

    this.options = _.extend({
      prevX: 0,
      currX: 0,
      prevY: 0,
      currY: 0,
      flag: false,
      color:  '#000',
      width: 1
    }, options);

    this.$el.on('mousemove',  this.cursorPosition);
    this.$el.on('mousedown',  this.cursorPosition);
    this.$el.on('mouseup',  this.cursorPosition);
    this.$el.on('mouseout',  this.cursorPosition);
  },

  cancelDrawing: function () {
    this.$el.css({ cursor: 'default' });
    this.$el.off('mousemove',  this.cursorPosition);
    this.$el.off('mousedown',  this.cursorPosition);
    this.$el.off('mouseup',  this.cursorPosition);
    this.$el.off('mouseout',  this.cursorPosition);
  },

  draw: function () {
    this.context.beginPath();
    this.context.moveTo(this.options.prevX, this.options.prevY);
    this.context.lineTo(this.options.currX, this.options.currY);
    this.context.strokeStyle = this.options.color;
    this.context.lineWidth = this.options.width;
    this.context.stroke();
    this.context.closePath();
  },

  cursorPosition: function (event) {

    var dir = event.type.replace('mouse', '');

    if (dir === 'down') {
      this.options.prevX = this.options.currX;
      this.options.prevY = this.options.currY;
      this.options.currX = event.clientX;
      this.options.currY = event.clientY;
      this.options.flag = true;
      this.context.beginPath();
      this.context.fillStyle = this.options.color;
      this.context.fillRect(this.options.currX, this.options.currY, 2, 2);
      this.context.closePath();
    }
    if (dir === 'up' || dir === 'out') {
      this.options.flag = false;
    }
    if (dir === 'move' && this.options.flag) {
      this.options.prevX = this.options.currX;
      this.options.prevY = this.options.currY;
      this.options.currX = event.clientX;
      this.options.currY = event.clientY;
      this.draw(this.options);
    }
  }

});

