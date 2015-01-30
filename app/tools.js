/**
* @constructor
* @name Tools
*/
app.Tools = function Tools(canvas) {
  this.tools = {};
  this.tools.pencil = new app.Pencil(canvas);
  this.tools.pen = new app.Pen(canvas);
  app._events.add('socket:closed', this.remove.bind(this));
};

app.Tools.prototype.remove = function () {
  this.tools.pencil.element.remove();
  this.tools.pen.element.remove();
};
