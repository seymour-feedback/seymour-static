/**
  * @constructor
  * @name Pencil
  */
app.Pencil = function Pencil(canvas) {
  console.log('YEYEYEYEYE')
  this.canvas = canvas;
  this.element = null;
  this.create();
  this.listen();
  this.drawing = false;
};

app.Pencil.prototype.create = function () {
  this.element = doc.createElement('button');
  this.element.textContent = 'Pencil';
  this.element.style.position = 'absolute';
  this.element.style.zIndex = app._helpers.computeZedIndex(app._canvas.element, +1);
  this.element.style.top = '0';
  this.element.style.right = '70px';
  doc.documentElement.appendChild(this.element);
};

app.Pencil.prototype.listen = function () {
  this.element.addEventListener('click', function () {
    if (!this.drawing) {
      this.canvas.captureDraw();
      this.drawing = true;
    } else {
      this.canvas.cancelDraw();
      this.drawing = false;
    }
  }.bind(this), false);
};
