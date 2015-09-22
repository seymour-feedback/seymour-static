'use strict';

var Backbone = require('backbone'),
  _ = require('underscore');

module.exports = Backbone.View.extend({

  template: '' +
    '<select>' +
      '<option selected value="#000000">Black</option>' +
      '<option value="#ff0000">Red</option>' +
      '<option value="#0000ff">Blue</option>' +
      '<option value="#ffffff">White</option>' +
    '</select>',

  events: {
    'change': 'select'
  },

  initialize: function () {
    this.render();
    this.hide();
  },

  render: function () {
    return this.setElement(_.template(this.template)());
  },

  select: function (e) {
    if (this.color) {
      this.$el.removeClass(this.color.replace('#', '_'));
    }
    this.color = e.target.value;
    this.$el.addClass(e.target.value.replace('#', '_'));
    this.trigger('color:change', e.target.value);
  },

  selected: function () {
    return this.el[this.el.selectedIndex].value;
  },

  hide: function () {
    this.$el.hide();
  },

  show: function () {
    this.$el.show();
  }

});
