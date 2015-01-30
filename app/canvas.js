
app.Canvas = function Canvas() {
  app._events.add('socket:open', this.create.bind(this));
  app._events.add('socket:closed', this.remove.bind(this));
};

app.Canvas.prototype.create = function () {
  this.element = doc.createElement('canvas');
  this.element.width = body.clientWidth;
  this.element.height = body.clientHeight;
  this.element.setAttribute('id', 'seymour.canvas');
  this.element.style.position = 'absolute';
  this.element.style.top = 0;
  this.element.style.left = 0;
  this.element.style.zIndex = app._helpers.computeZedIndex(app._button.element, -1);
  this.element.style.cursor = 'pointer';
  doc.getElementsByTagName('html')[0].appendChild(this.element);
  this.context = this.element.getContext('2d');
  this.tools = new app.Tools(this);
  this.addSaveButton();
};

app.Canvas.prototype.remove = function () {
  this.element.remove();
};

app.Canvas.prototype.addSaveButton = function () {
  var saveBtn = doc.createElement('button'),
    text = doc.createTextNode('Feed me'),
    style = saveBtn.style;

  saveBtn.appendChild(text);

  saveBtn.type = 'button';

  style.padding = '5px 10px';
  style.position = 'absolute';
  style.top = 0;
  style.left = '200px';
  style.zIndex = app._helpers.computeZedIndex(this.element);

  saveBtn.addEventListener('click', function () {
    this.save();
  }.bind(this), false);
  body.appendChild(saveBtn);
};

app.Canvas.prototype.captureDraw = function () {
  this.element.addEventListener('mousemove', this.findxy.bind(this), false);
  this.element.addEventListener('mousedown', this.findxy.bind(this), false);
  this.element.addEventListener('mouseup', this.findxy.bind(this), false);
  this.element.addEventListener('mouseout', this.findxy.bind(this), false);
};

app.Canvas.prototype.cancelDraw = function () {
  this.element.removeEventListener('mousemove', this.findxy.bind(this), false);
  this.element.removeEventListener('mousedown', this.findxy.bind(this), false);
  this.element.removeEventListener('mouseup', this.findxy.bind(this), false);
  this.element.removeEventListener('mouseout', this.findxy.bind(this), false);
};

app.Canvas.prototype.write = function () {

  var textContainer = doc.createElement('div');
  textContainer.style.padding = '10px';
  textContainer.style.border = '1px solid #000';
  var textarea = doc.createElement('textarea');
  textContainer.appendChild(textarea);

  textContainer.style.position = 'absolute';
  textContainer.style.zIndex = 999999;

  body.appendChild(textContainer);
  textarea.focus();

  // this.element.addEventListener('click', function (e) {
  //   textarea.style.left = e.x + 'px';
  //   textarea.style.top = e.y + 'px';
  //   body.appendChild(textarea);
  //   textarea.focus();
  // });

  this.element.addEventListener('mousedown', function (e) {
    this.element.addEventListener('mousemove', function (e) {
      textContainer.style.left = e.x + 'px';
      textContainer.style.top = e.y + 'px';
    }, false);
  }.bind(this), false);

  this.element.addEventListener('mouseup', function (e) {
    this.element.removeEventListener('mousemove');
  }.bind(this), false);

  // textarea.addEventListener('keyup', function (e) {
  //   this.context.fillStyle = '#000';
  //   this.context.font = 'normal 12px Arial';
  //   console.log(e.target)
  //   this.context.fillText(e.target.value, e.target.offsetLeft, e.target.offsetTop);
  // }.bind(this), false);

};

var prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false,
    flag = false,
    x = 'black',
    y = 1;

app.Canvas.prototype.save = function () {
  var data = this.element.toDataURL();
  app._events.emit('canvas:save', { method: 'create', entity: 'image', data: data });
};

app.Canvas.prototype.draw = function () {
  this.context.beginPath();
  this.context.moveTo(prevX, prevY);
  this.context.lineTo(currX, currY);
  this.context.strokeStyle = x;
  this.context.lineWidth = y;
  this.context.stroke();
  this.context.closePath();
};

app.Canvas.prototype.findxy = function (e) {

  var dir = e.type.replace('mouse', '');
  if (dir === 'down') {

    prevX = currX;
    prevY = currY;
    currX = e.clientX;
    currY = e.clientY;

    flag = true;
    dot_flag = true;
    if (dot_flag) {
      this.context.beginPath();
      this.context.fillStyle = x;
      this.context.fillRect(currX, currY, 2, 2);
      this.context.closePath();
      dot_flag = false;
    }
  }
  if (dir === 'up' || dir === 'out') {
    flag = false;
  }
  if (dir === 'move') {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.clientX;
      currY = e.clientY;
      this.draw();
    }
  }
};
