'use strict';

var Backbone = require('../lib'),
  _ = require('underscore');

module.exports = Backbone.View.extend({

  tagName: 'canvas',

  initialize: function (options) {
    this.context = this.el.getContext('2d');
    this.tools = options.tools;

    this.tools.pencil.on('pencil:start', this.captureDrawing, this);
    this.tools.pencil.on('pencil:stop', this.cancelDrawing, this);
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

  captureDrawing: function (options) {

    options = _.extend({
      prevX: 0,
      currX: 0,
      prevY: 0,
      currY: 0,
      dotFlag: false,
      flag: false,
      color:  '#000',
      width: 1
    }, options);

    this.findCursor = this.cursorPosition.bind(this, options);

    this.$el.on('mousemove', this.findCursor);
    this.$el.on('mousedown', this.findCursor);
    this.$el.on('mouseup', this.findCursor);
    this.$el.on('mouseout', this.findCursor);
  },

  cancelDrawing: function () {
    this.$el.off('mousemove', this.findCursor);
    this.$el.off('mousedown', this.findCursor);
    this.$el.off('mouseup', this.findCursor);
    this.$el.off('mouseout', this.findCursor);
  },

  draw: function (options) {
    this.context.beginPath();
    this.context.moveTo(options.prevX, options.prevY);
    this.context.lineTo(options.currX, options.currY);
    this.context.strokeStyle = options.color;
    this.context.lineWidth = options.width;
    this.context.stroke();
    this.context.closePath();
  },

  cursorPosition: function (options, event) {

    var dir = event.type.replace('mouse', '');

    if (dir === 'down') {
      options.prevX = options.currX;
      options.prevY = options.currY;
      options.currX = event.clientX;
      options.currY = event.clientY;

      options.flag = true;

      options.dotFlag = true;

      if (options.dotFlag) {
        this.context.beginPath();
        this.context.fillStyle = options.color;
        this.context.fillRect(options.currX, options.currY, 2, 2);
        this.context.closePath();
        options.dotFlag = false;
      }
    }
    if (dir === 'up' || dir === 'out') {
      options.flag = false;
    }
    if (dir === 'move') {
      if (options.flag) {
        options.prevX = options.currX;
        options.prevY = options.currY;
        options.currX = event.clientX;
        options.currY = event.clientY;
        this.draw(options);
      }
    }
  }

});

