'use strict';

var SelectView = require('./base/select'),
  _ = require('underscore');

module.exports = SelectView.extend({

  template: '' +
    '<select>' +
      '<option selected value="1">S</option>' +
      '<option value="2">M</option>' +
      '<option value="3">L</option>' +
      '<option value="4">XL</option>' +
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
    if (this.width) {
      this.$el.removeClass(this.width);
    }
    this.width = e.target.value;
    this.$el.addClass(e.target.value);
    this.trigger('size:change', e.target.value);
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
