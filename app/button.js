
app.Button = function Button() {
  this.element = null;
  this.createElement();
  this.element.addEventListener('click', function () {
    app._events.emit('seymour:click');
  }.bind(this), false);
};

app.Button.prototype.createElement = function () {
  this.element = doc.createElement('button');
  this.element.textContent = 'Seymour';
  this.element.style.position = 'absolute';
  this.element.style.top = '0';
  this.element.style.right = '0';
  this.element.style.zIndex = app._helpers.computeZedIndex() + 10;
  doc.documentElement.appendChild(this.element);
};
