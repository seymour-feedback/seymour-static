/**
  * @constructor
  * @name Pen
  */

app.Pen = function Pen(canvas) {
  this.canvas = canvas;
  this.element = null;
  this.create();
  this.listen();
  this.writing = false;
};

app.Pen.prototype.create = function () {
  this.element = doc.createElement('button');
  this.element.textContent = 'Pen';
  this.element.style.position = 'absolute';
  this.element.style.zIndex = app._helpers.computeZedIndex(app._canvas.element, +1);
  this.element.style.top = '0';
  this.element.style.right = '125px';
  doc.documentElement.appendChild(this.element);
};

app.Pen.prototype.listen = function () {
  this.element.addEventListener('click', function () {
    if (!this.writing) {
      this.canvas.write();
      this.writing = true;
    } else {
      this.canvas.cancelWrite();
      this.writing = false;
    }
  }.bind(this), false);
};
