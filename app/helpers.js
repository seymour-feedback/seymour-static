app._helpers = {
  computeZedIndex: function (element, diff) {
    var zIndex = 0;
    diff = diff || 0;
    if (element) {
      zIndex = window.getComputedStyle(element).zIndex;
    } else {
      Array.prototype.forEach.call(doc.documentElement.children, function (el) {
        zIndex = window.getComputedStyle(el).zIndex;
        if (el.hasChild) {
          this.computeZedIndex(el);
        }
      }, this);
    }
    return zIndex === 'auto' ?  0 + diff: parseInt(zIndex, 10) + diff;
  }
};
