'use strict';

var Backbone = require('backbone'),
  Pencil = require('../views/pencil-button'),
  Submit = require('../views/submit-button');

module.exports = Backbone.View.extend({

  tagName: 'div',

  id: 'tools',

  initialize: function () {
    this.pencil = new Pencil();
    this.submit = new Submit();
  },

  render: function () {
    this.$el.css({ position: 'absolute', top: '0', 'z-index': '2147483646', width: '100%' });
    this.$el.append(this.pencil.render());
    this.$el.append(this.submit.render());
    return this.$el;
  }

});
