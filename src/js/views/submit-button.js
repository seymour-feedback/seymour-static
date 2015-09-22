'use strict';

var ButtonView = require('./base/button');

module.exports = ButtonView.extend({

  events: {
    'mousedown': 'submit'
  },

  render: function () {
    this.$el.text('Submit');
    return ButtonView.prototype.render.call(this);
  },

  submit: function () {
    this.trigger('submit');
  }

});
